import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  UpdateCommand,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { createOrder, verifyPaymentWithSignature } from "@/src/utils/razorpay";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;
const USER_TABLE_INDEX = "GSI1-index";

export async function createTransaction({ userID, document, amount, userMeta }) {
  if (!userID || !document || typeof amount !== "number" || !userMeta) {
    throw new Error("createTransaction: missing or invalid parameters");
  }
  const now = Date.now();
  const transactionID = randomUUID();

  // 1) Create the Razorpay order
  const order = await createOrder(amount, userID);

  // 2) Persist the transaction record in DynamoDB
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
        order, // embed the entire order object
        paymentDetails: null, // will be updated later
        createdAt: now,
        updatedAt: now,
      },
      // optionally guard against accidental overwrite:
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

  // Fetch transaction by Razorpay order ID
  const transaction = await getTransaction({ razorpayOrderId });
  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Verify payment signature with Razorpay

  const payment = await verifyPaymentWithSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  const now = Date.now();
  // Update transaction with payment details and status
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
      ConsistentRead: true, // Ensure strongly consistent read
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

// Helper function to fetch plan duration from course enrollment
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

// Helper function to calculate expiresAt based on plan duration
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
