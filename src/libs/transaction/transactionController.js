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
  createOrder,
  verifyPaymentWithSignature,
  getOrderStatus,
} from "@/src/utils/razorpay";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;
const USER_TABLE_INDEX = "GSI1-index";

export async function createTransaction({
  userID,
  document,
  amount,
  userMeta,
}) {
  if (!userID || !document || typeof amount !== "number" || !userMeta) {
    throw new Error("createTransaction: missing or invalid parameters");
  }
  const now = Date.now();
  const transactionID = randomUUID();

  const order = await createOrder(amount, userID);

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
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("verifyPayment: missing parameters");
  }

  const transaction = await getTransaction({ razorpayOrderId });
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const payment = await verifyPaymentWithSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  const now = Date.now();
  const updateTransactionParams = {
    TableName: USER_TABLE,
    Key: {
      pKey: transaction.pKey,
      sKey: transaction.sKey,
    },
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
      ":status": "completed",
      ":updatedAt": now,
    },
  };

  await dynamoDB.send(new UpdateCommand(updateTransactionParams));

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
  }

  return {
    success: true,
    message: "Payment verified",
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
    ExpressionAttributeValues: {
      ":status": "cancelled",
      ":updatedAt": now,
    },
    ConditionExpression: "#status <> :completedStatus",
    ExpressionAttributeValues: {
      ":status": "cancelled",
      ":updatedAt": now,
      ":completedStatus": "completed",
    },
  };

  await dynamoDB.send(new UpdateCommand(updateParams));

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

  // Update transaction status in DynamoDB if changed
  if (transaction.status !== newStatus) {
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
      ExpressionAttributeValues: {
        ":status": newStatus,
        ":updatedAt": now,
      },
    };

    await dynamoDB.send(new UpdateCommand(updateParams));
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
    const result = await dynamoDB.send(new ScanCommand(params));
    // Filter valid transactions server-side
    const validTransactions = (result.Items || []).filter((item) => {
      if (!item.status) {
        console.warn("Transaction missing status:", item);
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
