import { dynamoDB } from "../../utils/awsAgent";
import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Get homepage settings (featured goals)
export async function getHomePageSettings() {
  const params = {
    TableName: `${process.env.AWS_DB_NAME}master`,
    Key: {
      pKey: "HOMEPAGE",
      sKey: "SETTINGS",
    },
  };

  try {
    const response = await dynamoDB.send(new GetCommand(params));

    if (!response.Item) {
      return {
        success: true,
        data: {
          featuredGoalIDs: [],
        },
      };
    }

    return {
      success: true,
      data: {
        featuredGoalIDs: response.Item.featuredGoalIDs || [],
      },
    };
  } catch (err) {
    console.error("DynamoDB Error:", err);
    throw new Error("Internal server error");
  }
}

// Get active announcements (for user app)
export async function getActiveAnnouncements() {
  const params = {
    TableName: `${process.env.AWS_DB_NAME}master`,
    FilterExpression: "begins_with(pKey, :prefix) AND isActive = :active",
    ExpressionAttributeValues: {
      ":prefix": "ANNOUNCEMENT#",
      ":active": true,
    },
  };

  try {
    const response = await dynamoDB.send(new ScanCommand(params));

    const announcements = (response.Items || []).map((item) => ({
      announcementID: item.pKey.split("#")[1],
      title: item.title,
      message: item.message,
      type: item.type,
      createdAt: item.createdAt,
    }));

    // Sort by createdAt descending
    announcements.sort((a, b) => b.createdAt - a.createdAt);

    return {
      success: true,
      data: announcements,
    };
  } catch (err) {
    console.error("DynamoDB Error:", err);
    throw new Error("Internal server error");
  }
}
