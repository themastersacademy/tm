import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { validateBasicBillingInfo } from "@/src/utils/validateBasicBillingInfo";
import { randomUUID } from "crypto";

const TABLE = `${process.env.AWS_DB_NAME}users`;

/**
 * Append a new billing info entry to the user's billingInfo list.
 */
export async function addBillingInfo({ billingInfo, userID }) {
  if (!billingInfo || !userID) {
    throw new Error("Missing billingInfo or userID");
  }

  // Validate shape
  validateBasicBillingInfo(billingInfo);

  const billingInfoWithId = {
    id: randomUUID(),
    ...billingInfo,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const now = Date.now();
  const params = {
    TableName: TABLE,
    Key: { pKey: `USER#${userID}`, sKey: `USER#${userID}` },
    UpdateExpression:
      "SET billingInfo = list_append(if_not_exists(billingInfo, :empty), :new), updatedAt = :u",
    ExpressionAttributeValues: {
      ":empty": [],
      ":new": [billingInfoWithId],
      ":u": now,
    },
    ReturnValues: "UPDATED_NEW",
  };

  await dynamoDB.send(new UpdateCommand(params));
  return { success: true, message: "Billing info added successfully" };
}

/**
 * Retrieve the user's billingInfo array.
 */
export async function getBillingInfo({ userID }) {
  if (!userID) {
    throw new Error("Missing userID");
  }

  const params = {
    TableName: TABLE,
    Key: { pKey: `USER#${userID}`, sKey: `USER#${userID}` },
    ProjectionExpression: "billingInfo",
  };

  const { Item } = await dynamoDB.send(new GetCommand(params));
  return Item?.billingInfo || [];
}

/**
 * Remove a billing info entry by ID.
 */
export async function deleteBillingInfo({ userID, billingInfoID }) {
  if (!userID || !billingInfoID) {
    throw new Error("Missing userID or billingInfoID");
  }

  const list = await getBillingInfo({ userID });
  const updatedList = list.filter((info) => info.id !== billingInfoID);
  const now = Date.now();

  const params = {
    TableName: TABLE,
    Key: { pKey: `USER#${userID}`, sKey: `USER#${userID}` },
    UpdateExpression: "SET billingInfo = :list, updatedAt = :u",
    ExpressionAttributeValues: {
      ":list": updatedList,
      ":u": now,
    },
    ReturnValues: "UPDATED_NEW",
  };

  await dynamoDB.send(new UpdateCommand(params));
  return { success: true, message: "Billing info deleted successfully" };
}

/**
 * Update an existing billing info entry by ID.
 */
export async function updateBillingInfo({
  userID,
  billingInfoID,
  billingInfo,
}) {
  if (!userID || !billingInfoID || !billingInfo) {
    throw new Error("Missing userID, billingInfoID, or billingInfo");
  }

  // Validate shape of new billingInfo
  validateBasicBillingInfo(billingInfo);

  const billingInfoWithId = {
    id: billingInfoID,
    ...billingInfo,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const list = await getBillingInfo({ userID });
  const updatedList = list.map((info) =>
    info.id === billingInfoID ? billingInfoWithId : info
  );
  const now = Date.now();

  const params = {
    TableName: TABLE,
    Key: { pKey: `USER#${userID}`, sKey: `USER#${userID}` },
    UpdateExpression: "SET billingInfo = :list, updatedAt = :u",
    ExpressionAttributeValues: {
      ":list": updatedList,
      ":u": now,
    },
    ReturnValues: "UPDATED_NEW",
  };

  await dynamoDB.send(new UpdateCommand(params));
  return { success: true, message: "Billing info updated successfully" };
}
