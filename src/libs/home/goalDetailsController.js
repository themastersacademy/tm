import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = `${process.env.AWS_DB_NAME}master`;

export async function getGoalDetails(goalID) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      pKey: `GOAL#${goalID}`,
      sKey: `GOALS`,
    },
  };

  try {
    const { Item } = await dynamoDB.send(new GetCommand(params));

    if (!Item) {
      return {
        success: false,
        message: "Goal not found",
        data: null,
      };
    }

    // Optionally strip out DynamoDB keys if you don’t want to expose them
    const { pKey, sKey, ...goal } = Item;

    return {
      success: true,
      message: "Goal details fetched successfully",
      data: goal,
    };
  } catch (error) {
    console.error("Error fetching goal details:", error);
    throw new Error(error.message);
  }
}

export async function getGoalContent({ blogID, goalID }) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      pKey: `BLOG#${blogID}`,
      sKey: `BLOGS@${goalID}`,
    },
  };

  try {
    // 1. Issue the GetCommand
    const { Item } = await dynamoDB.send(new GetCommand(params));

    // 2. Handle not-found
    if (!Item) {
      return { success: false, message: "Content not found", data: null };
    }

    // 3. Return the fetched item
    return {
      success: true,
      message: "Content fetched successfully",
      data: {
        id: Item.blogID,
        goalID: Item.goalID,
        title: Item.title,
        description: Item.description,
        createdAt: Item.createdAt,
        updatedAt: Item.updatedAt,
      },
    };
  } catch (err) {
    console.error("Error fetching goal content:", err);
    return {
      success: false,
      message: "Internal server error",
      data: null,
    };
  }
}
