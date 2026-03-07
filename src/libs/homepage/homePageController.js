import { dynamoDB } from "../../utils/awsAgent";
import { GetCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

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
  const TABLE = `${process.env.AWS_DB_NAME}master`;

  try {
    // Query via GSI + merge with legacy
    const gsiItems = [];
    let lastKey;

    do {
      const response = await dynamoDB.send(
        new QueryCommand({
          TableName: TABLE,
          IndexName: "masterTableIndex",
          KeyConditionExpression: "#gsi1pk = :gsi1pk",
          ExpressionAttributeNames: {
            "#gsi1pk": "GSI1-pKey",
          },
          ExpressionAttributeValues: {
            ":gsi1pk": "ANNOUNCEMENTS",
          },
          ...(lastKey && { ExclusiveStartKey: lastKey }),
        })
      );
      gsiItems.push(...(response.Items || []));
      lastKey = response.LastEvaluatedKey;
    } while (lastKey);

    const foundKeys = new Set(gsiItems.map((item) => item.pKey));
    let legacyLastKey;
    do {
      const response = await dynamoDB.send(
        new ScanCommand({
          TableName: TABLE,
          FilterExpression: "begins_with(pKey, :prefix)",
          ExpressionAttributeValues: {
            ":prefix": "ANNOUNCEMENT#",
          },
          ...(legacyLastKey && { ExclusiveStartKey: legacyLastKey }),
        })
      );
      for (const item of response.Items || []) {
        if (!foundKeys.has(item.pKey)) {
          gsiItems.push(item);
        }
      }
      legacyLastKey = response.LastEvaluatedKey;
    } while (legacyLastKey);

    // Filter active in-memory
    const activeItems = gsiItems.filter((item) => item.isActive === true);

    const announcements = activeItems.map((item) => ({
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
