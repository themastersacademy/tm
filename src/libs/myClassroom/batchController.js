import { dynamoDB } from "@/src/utils/awsAgent";
import {
  QueryCommand,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const MASTER_TABLE = `${process.env.AWS_DB_NAME}master`;
const MASTER_INDEX_TABLE = "masterTableIndex";
const USER_TABLE = `${process.env.AWS_DB_NAME}users`;

export async function enrollStudent(userID, batchCode, rollNo) {
  const now = Date.now();

  // 1) Look up the batch by code via your GSI
  const batchResponse = await dynamoDB.send(
    new QueryCommand({
      TableName: MASTER_TABLE,
      IndexName: MASTER_INDEX_TABLE,
      KeyConditionExpression: "#gsi1pk = :pk",
      FilterExpression: "batchCode = :batchCode",
      ExpressionAttributeNames: { "#gsi1pk": "GSI1-pKey" },
      ExpressionAttributeValues: {
        ":pk": "BATCHES",
        ":batchCode": batchCode,
      },
    })
  );

  const batch = batchResponse.Items?.[0];
  if (!batch) {
    return { success: false, message: "Batch not found" };
  }
  if ((batch.enrolledStudentCount || 0) >= batch.capacity) {
    return { success: false, message: "Batch is full" };
  }

  // 2) Fetch the user
  const { Item: user } = await dynamoDB.send(
    new GetCommand({
      TableName: USER_TABLE,
      Key: {
        pKey: `USER#${userID}`,
        sKey: `USER#${userID}`,
      },
    })
  );
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const batchID = batch.pKey.split("#")[1];

  // 3) Build and run a transaction
  const transactItems = [
    {
      Put: {
        TableName: MASTER_TABLE,
        Item: {
          pKey: `STUDENT_BATCH#${userID}`,
          sKey: `STUDENT_BATCH@${batchID}`,
          "GSI1-pKey": "STUDENT_BATCHES",
          "GSI1-sKey": `STUDENT_BATCH@${batchID}`,
          userID,
          batchID,
          studentMeta: {
            name: user.name,
            email: user.email,
          },
          batchMeta: {
            title: batch.title,
            instituteID: batch.instituteID,
            instituteMeta: batch.instituteMeta,
          },
          rollNo: rollNo || null,
          joinedAt: now,
        },
        ConditionExpression: "attribute_not_exists(pKey)",
      },
    },
    {
      Update: {
        TableName: MASTER_TABLE,
        Key: {
          pKey: `BATCH#${batchID}`,
          sKey: "BATCHES",
        },
        UpdateExpression: "ADD enrolledStudentCount :inc",
        ExpressionAttributeValues: {
          ":inc": 1,
        },
      },
    },
  ];

  await dynamoDB.send(
    new TransactWriteCommand({ TransactItems: transactItems })
  );

  return {
    success: true,
    message: "Batch enrolled successfully",
  };
}

export async function getUserBatches(userID) {
  const batchResponse = await dynamoDB.send(
    new QueryCommand({
      TableName: MASTER_TABLE,
      IndexName: MASTER_INDEX_TABLE,
      KeyConditionExpression: "#gsi1pk = :pk",
      FilterExpression: "userID = :userID",
      ExpressionAttributeNames: { "#gsi1pk": "GSI1-pKey" },
      ExpressionAttributeValues: {
        ":pk": "STUDENT_BATCHES",
        ":userID": userID,
      },
    })
  );
  return {
    success: true,
    message: "Batch fetched successfully",
    data: batchResponse.Items.map((item) => ({
      ...item,
      pKey: undefined,
      sKey: undefined,
      "GSI1-pKey": undefined,
      "GSI1-sKey": undefined,
    })),
  };
}

export async function getStudentEnrolledBatch(userID, batchID) {
  const batchResponse = await dynamoDB.send(
    new GetCommand({
      TableName: MASTER_TABLE,
      Key: {
        pKey: `STUDENT_BATCH#${userID}`,
        sKey: `STUDENT_BATCH@${batchID}`,
      },
    })
  );
  return {
    success: true,
    message: "Batch fetched successfully",
    data: {
      ...batchResponse.Item,
      pKey: undefined,
      sKey: undefined,
      "GSI1-pKey": undefined,
      "GSI1-sKey": undefined,
    },
  };
}

export async function getTotalClassroomJoins(userID) {
  const response = await dynamoDB.send(
    new QueryCommand({
      TableName: MASTER_TABLE,
      IndexName: MASTER_INDEX_TABLE,
      KeyConditionExpression: "#gsi1pk = :pk",
      FilterExpression: "userID = :userID",
      ExpressionAttributeNames: { "#gsi1pk": "GSI1-pKey" },
      ExpressionAttributeValues: {
        ":pk": "STUDENT_BATCHES",
        ":userID": userID,
      },
      Select: "COUNT",
    })
  );

  return {
    success: true,
    message: "Total classroom joins for user fetched successfully",
    data: {
      count: response.Count || 0,
    },
  };
}
