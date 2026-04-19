import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  UpdateCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import {
  razorpay,
  createOrder,
  verifyPaymentWithSignature,
  getOrderStatus,
} from "@/src/utils/razorpay";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;
const USER_TABLE_INDEX = "GSI1-index";
const MASTER_TABLE = `${process.env.AWS_DB_NAME}master`;

export async function createTransaction({
  userID,
  document,
  amount,
  userMeta,
  itemName,
}) {
  if (!userID || !document || typeof amount !== "number" || isNaN(amount) || amount <= 0 || !userMeta) {
    throw new Error("createTransaction: missing or invalid parameters (amount must be a positive number)");
  }
  const now = Date.now();
  const transactionID = randomUUID();

  const notes = {};
  if (itemName) {
    notes.itemName = itemName;
  }
  const order = await createOrder(amount, userID, notes);

  await dynamoDB.send(
    new PutCommand({
      TableName: USER_TABLE,
      Item: {
        pKey: `TRANSACTION#${transactionID}`,
        sKey: `TRANSACTIONS@${userID}`,
        "GSI1-pKey": `TRANSACTION#${order.id}`,
        "GSI1-sKey": "TRANSACTIONS",
        document,
        userMeta,
        amount,
        order,
        paymentDetails: null,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      ConditionExpression: "attribute_not_exists(pKey)",
    })
  );

  const transaction = await getTransaction({ transactionID, userID });
  return transaction;
}

export async function verifyPayment({
  userID,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!userID || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("verifyPayment: missing parameters");
  }

  const transaction = await getTransaction({ razorpayOrderId });
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  if (transaction.sKey !== `TRANSACTIONS@${userID}`) {
    throw new Error("Unauthorized: Transaction does not belong to user");
  }

  // Idempotency: if already completed, return success without re-processing
  if (transaction.status === "completed") {
    return {
      success: true,
      message: "Payment already verified",
      status: "completed",
    };
  }

  const payment = await verifyPaymentWithSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  let transactionStatus = "pending";
  if (payment.status === "captured") {
    transactionStatus = "completed";
  } else if (payment.status === "failed" || payment.status === "refunded") {
    transactionStatus = "failed";
  }

  const now = Date.now();
  const updateTransactionParams = {
    TableName: USER_TABLE,
    Key: {
      pKey: transaction.pKey,
      sKey: transaction.sKey,
    },
    // Only transition from pending — prevents double-processing if a
    // concurrent verify/status-check already completed the transaction.
    ConditionExpression: "#status = :pendingStatus",
    UpdateExpression:
      "set paymentDetails = :paymentDetails, #status = :status, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":paymentDetails": {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        method: payment.method,
        status: payment.status,
        captured: payment.status === "captured",
        amount: payment.amount,
        currency: payment.currency,
        createdAt: payment.created_at,
      },
      ":status": transactionStatus,
      ":updatedAt": now,
      ":pendingStatus": "pending",
    },
  };

  try {
    await dynamoDB.send(new UpdateCommand(updateTransactionParams));
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      // Another concurrent request already finalized this transaction —
      // treat as success to avoid double side effects (already done below).
      return {
        success: true,
        message: "Payment already verified",
        status: "completed",
      };
    }
    throw err;
  }

  if (payment.status === "captured") {
    const document = transaction.document;
    const documentDetails = await getDocument(document.pKey, document.sKey);
    const expiresAt = calculateExpiresAt(
      documentDetails.plan.duration,
      documentDetails.plan.type,
      now
    );

    const updateCourseEnrollParams = {
      TableName: USER_TABLE,
      Key: {
        pKey: document.pKey,
        sKey: document.sKey,
      },
      UpdateExpression:
        "set #status = :status, expiresAt = :expiresAt, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "active",
        ":expiresAt": expiresAt,
        ":updatedAt": now,
      },
    };
    await dynamoDB.send(new UpdateCommand(updateCourseEnrollParams));

    // Update Coupon Analytics
    if (documentDetails.couponDetails && documentDetails.couponDetails.id) {
      const couponId = documentDetails.couponDetails.id;
      const discountAmount =
        documentDetails.priceBreakdown?.couponDiscount || 0;
      const salesAmount = documentDetails.priceBreakdown?.totalPrice || 0;

      const updateCouponParams = {
        TableName: MASTER_TABLE,
        Key: {
          pKey: `COUPON#${couponId}`,
          sKey: "COUPONS",
        },
        UpdateExpression:
          "SET redemptionCount = if_not_exists(redemptionCount, :zero) + :inc, totalDiscountGiven = if_not_exists(totalDiscountGiven, :zero) + :discount, totalSalesWithCoupon = if_not_exists(totalSalesWithCoupon, :zero) + :sales",
        ExpressionAttributeValues: {
          ":inc": 1,
          ":discount": discountAmount,
          ":sales": salesAmount,
          ":zero": 0,
        },
      };

      try {
        await dynamoDB.send(new UpdateCommand(updateCouponParams));
      } catch (e) {
        console.error("Failed to update coupon analytics:", e);
        // Don't throw, as payment verification is successful
      }
    }
  }

  return {
    success: true,
    message: "Payment verified",
    status: transactionStatus,
  };
}

export async function getTransaction({
  transactionID,
  userID,
  razorpayOrderId,
}) {
  if (!transactionID && !userID && !razorpayOrderId) {
    throw new Error("getTransaction: missing parameters");
  }

  if (transactionID && userID) {
    const params = {
      TableName: USER_TABLE,
      Key: {
        pKey: `TRANSACTION#${transactionID}`,
        sKey: `TRANSACTIONS@${userID}`,
      },
      ConsistentRead: true,
    };

    const transactionResult = await dynamoDB.send(new GetCommand(params));
    if (!transactionResult.Item) {
      throw new Error("Transaction not found");
    }
    return transactionResult.Item;
  } else if (razorpayOrderId) {
    const params = {
      TableName: USER_TABLE,
      IndexName: USER_TABLE_INDEX,
      KeyConditionExpression: "#gsi1pKey = :gsi1pKey AND #gsi1sKey = :gsi1sKey",
      ExpressionAttributeNames: {
        "#gsi1pKey": "GSI1-pKey",
        "#gsi1sKey": "GSI1-sKey",
      },
      ExpressionAttributeValues: {
        ":gsi1pKey": `TRANSACTION#${razorpayOrderId}`,
        ":gsi1sKey": "TRANSACTIONS",
      },
    };

    const queryResult = await dynamoDB.send(new QueryCommand(params));
    if (!queryResult.Items || queryResult.Items.length === 0) {
      throw new Error("Transaction not found");
    }
    return queryResult.Items[0];
  }

  throw new Error("Invalid parameters for getTransaction");
}

export async function cancelTransaction({
  transactionID,
  razorpayOrderId,
  userID,
}) {
  if (!transactionID || !razorpayOrderId || !userID) {
    throw new Error("cancelTransaction: missing parameters");
  }

  const transaction = await getTransaction({ razorpayOrderId });
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  if (`TRANSACTION#${transactionID}` !== transaction.pKey) {
    throw new Error("Transaction ID and order ID do not match");
  }

  if (transaction.sKey !== `TRANSACTIONS@${userID}`) {
    throw new Error("Unauthorized: Transaction does not belong to user");
  }

  if (transaction.status === "completed") {
    throw new Error("Cannot cancel a completed transaction");
  }

  const now = Date.now();
  const updateParams = {
    TableName: USER_TABLE,
    Key: {
      pKey: transaction.pKey,
      sKey: transaction.sKey,
    },
    UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    // Only cancel if still pending — never cancel a completed payment.
    ConditionExpression: "#status = :pendingStatus",
    ExpressionAttributeValues: {
      ":status": "cancelled",
      ":updatedAt": now,
      ":pendingStatus": "pending",
    },
  };

  try {
    await dynamoDB.send(new UpdateCommand(updateParams));
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      throw new Error("Cannot cancel — transaction is no longer pending");
    }
    throw err;
  }

  return {
    success: true,
    message: "Transaction cancelled successfully",
  };
}

export async function checkAndUpdateTransactionStatus({
  transactionID,
  razorpayOrderId,
  userID,
}) {
  if (!transactionID || !razorpayOrderId || !userID) {
    throw new Error("checkAndUpdateTransactionStatus: missing parameters");
  }

  const transaction = await getTransaction({ razorpayOrderId });
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  if (`TRANSACTION#${transactionID}` !== transaction.pKey) {
    throw new Error("Transaction ID and order ID do not match");
  }

  if (transaction.sKey !== `TRANSACTIONS@${userID}`) {
    throw new Error("Unauthorized: Transaction does not belong to user");
  }

  if (
    transaction.status === "completed" ||
    transaction.status === "cancelled"
  ) {
    return {
      success: true,
      message: `Transaction already in ${transaction.status} state`,
      status: transaction.status,
    };
  }

  const now = Date.now();
  const timeoutThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const isExpired = now - transaction.createdAt > timeoutThreshold;

  // Check Razorpay order status
  const order = await getOrderStatus(razorpayOrderId);
  let newStatus = "pending";

  if (isExpired) {
    newStatus = "cancelled"; // Cancel if order is expired
  } else if (order.status === "created" || order.status === "attempted") {
    newStatus = "pending"; // Keep pending if order is still open
  } else if (order.status === "paid") {
    // If order is paid, check payment status
    try {
      const payments = await razorpay.orders.fetchPayments(razorpayOrderId);
      if (payments.items && payments.items.length > 0) {
        const latestPayment = payments.items[0]; // Get the latest payment
        if (latestPayment.status === "captured") {
          newStatus = "completed";
        } else if (
          latestPayment.status === "failed" ||
          latestPayment.status === "refunded"
        ) {
          newStatus = "failed";
        } else {
          newStatus = "pending"; // Other statuses like "authorized" remain pending
        }
      } else {
        newStatus = "pending"; // No payments yet
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
      newStatus = "pending"; // Default to pending if payment check fails
    }
  } else {
    newStatus = "cancelled"; // Any other order status (e.g., expired)
  }

  // Update transaction status in DynamoDB if changed — but only if it's
  // still pending, so we don't overwrite a completion from verifyPayment
  // that raced with this status check.
  if (transaction.status !== newStatus) {
    const updateParams = {
      TableName: USER_TABLE,
      Key: {
        pKey: transaction.pKey,
        sKey: transaction.sKey,
      },
      ConditionExpression: "#status = :currentStatus",
      UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": newStatus,
        ":updatedAt": now,
        ":currentStatus": transaction.status,
      },
    };

    try {
      await dynamoDB.send(new UpdateCommand(updateParams));
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        // Transaction was updated concurrently — re-read and return its
        // current state so the caller doesn't act on stale data.
        const fresh = await getTransaction({ razorpayOrderId });
        return {
          success: true,
          message: `Transaction status is ${fresh.status}`,
          status: fresh.status,
        };
      }
      throw err;
    }
  }

  return {
    success: true,
    message: `Transaction status updated to ${newStatus}`,
    status: newStatus,
  };
}

export async function getUserTransactions({ userID }) {
  if (!userID) {
    throw new Error("User ID is required");
  }

  const params = {
    TableName: USER_TABLE,
    FilterExpression: "#sKey = :sKey AND begins_with(#pKey, :pKeyPrefix)",
    ExpressionAttributeNames: {
      "#pKey": "pKey",
      "#sKey": "sKey",
    },
    ExpressionAttributeValues: {
      ":pKeyPrefix": "TRANSACTION#",
      ":sKey": `TRANSACTIONS@${userID}`,
    },
  };

  try {
    let allItems = [];
    let lastEvaluatedKey = undefined;

    do {
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }

      const result = await dynamoDB.send(new ScanCommand(params));
      if (result.Items) {
        allItems = [...allItems, ...result.Items];
      }
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    // Filter valid transactions server-side
    const validTransactions = allItems.filter((item) => {
      if (!item.status) {
        // console.warn("Transaction missing status:", item);
        return false;
      }
      return [
        "pending",
        "completed",
        "failed",
        "cancelled",
        "refunded",
      ].includes(item.status);
    });

    return {
      success: true,
      data: validTransactions,
      message:
        validTransactions.length > 0
          ? "Transactions retrieved successfully"
          : "No transactions found",
    };
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}

async function getDocument(pKey, sKey) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      pKey: pKey,
      sKey: sKey,
    },
  };
  const result = await dynamoDB.send(new GetCommand(params));
  if (!result.Item) {
    throw new Error("Course enrollment not found");
  }
  return result.Item;
}

function calculateExpiresAt(duration, type, now) {
  const date = new Date(now);
  if (type === "MONTHLY") {
    const months = parseInt(duration);
    date.setMonth(date.getMonth() + months);
  }
  if (type === "YEARLY") {
    const years = parseInt(duration);
    date.setFullYear(date.getFullYear() + years);
  }
  return date.getTime();
}
