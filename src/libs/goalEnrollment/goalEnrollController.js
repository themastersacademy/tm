import { dynamoDB } from "@/src/utils/awsAgent";
import { PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export async function createGoalEnrollment({ userID, goalID }) {
  const TableName = `${process.env.AWS_DB_NAME}users`;
  const now = Date.now();

  const enrollmentItem = {
    pKey: `GOAL_ENROLLMENT#${userID}#${goalID}`, // Unique enrollment record key
    sKey: `GOAL_ENROLLMENT#${userID}`, // Partition key per user enrollment
    "GSI1-pKey": `GOAL_ENROLLMENTS`,
    "GSI1-sKey": `GOAL_ENROLLMENT#${userID}`,
    userID,
    goalID,
    status: "active", // Current enrollment status
    createdAt: now,
    updatedAt: now,
    // You can add additional metadata here (e.g., progress)
  };

  const command = new PutCommand({
    TableName,
    Item: enrollmentItem,
    ConditionExpression: "attribute_not_exists(pKey)", // Ensures duplicate enrollment is not allowed
  });

  // Check if the goal enrollment already exists
  const existingEnrollment = await getGoalEnrollment({ userID, goalID });
  if (existingEnrollment.data !== null) {
    return {
      success: false,
      message: "Goal enrollment already exists",
    };
  }

  try {
    const response = await dynamoDB.send(command);
    return {
      success: true,
      message: "Goal enrollment created successfully",
      data: response.Item,
    };
  } catch (error) {
    console.error("Error creating goal enrollment:", error.message);
    throw new Error("Failed to enroll in goal");
  }
}

export async function getGoalEnrollment({ userID, goalID }) {
  if (!userID || !goalID) {
    return { success: false, message: "Missing userID or goalID" };
  }

  const TableName = `${process.env.AWS_DB_NAME}users`;
  const key = {
    pKey: `GOAL_ENROLLMENT#${userID}#${goalID}`,
    sKey: `GOAL_ENROLLMENT#${userID}`,
  };

  try {
    const { Item } = await dynamoDB.send(
      new GetCommand({ TableName, Key: key })
    );
    if (!Item) {
      return {
        success: true,
        message: "No enrollment found",
        data: null,
      };
    }

    // strip out the internal keys
    const { pKey, sKey, ...data } = Item;
    return {
      success: true,
      message: "Goal enrollment retrieved successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching goal enrollment:", error);
    throw new Error("Failed to get goal enrollment");
  }
}

export async function getAllGoalEnrollments({ userID }) {
  if (!userID) {
    return { success: false, message: "Missing userID" };
  }

  const TableName = `${process.env.AWS_DB_NAME}users`;
  const IndexName = "GSI1-index";

  const params = {
    TableName,
    IndexName,
    KeyConditionExpression: "#gsi1pk = :pKey AND #gsi1sk = :sKey",
    FilterExpression: "#st = :active",
    ExpressionAttributeNames: {
      "#gsi1pk": "GSI1-pKey",
      "#gsi1sk": "GSI1-sKey",
      "#st": "status",
    },
    ExpressionAttributeValues: {
      ":pKey": "GOAL_ENROLLMENTS",
      ":sKey": `GOAL_ENROLLMENT#${userID}`,
      ":active": "active",
    },
    ProjectionExpression: "pKey, goalID, createdAt, #st, updatedAt",
  };

  try {
    const { Items = [] } = await dynamoDB.send(new QueryCommand(params));
    const data = Items.map((item) => {
      const id = item.pKey.split("#")[2];
      return {
        id,
        goalID: item.goalID,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    return {
      success: true,
      message: "Goal enrollments retrieved successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching goal enrollments:", error);
    throw new Error("Failed to get goal enrollments");
  }
}
