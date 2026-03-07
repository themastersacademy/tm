import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export async function getGoalList() {
  const TABLE = `${process.env.AWS_DB_NAME}master`;

  try {
    // Step 1: Query via GSI
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
            ":gsi1pk": "GOALS",
          },
          ...(lastKey && { ExclusiveStartKey: lastKey }),
        })
      );
      gsiItems.push(...(response.Items || []));
      lastKey = response.LastEvaluatedKey;
    } while (lastKey);

    // Step 2: Merge with legacy scan fallback
    const foundKeys = new Set(gsiItems.map((item) => item.pKey));
    let legacyLastKey;
    do {
      const response = await dynamoDB.send(
        new ScanCommand({
          TableName: TABLE,
          FilterExpression: "sKey = :sKey",
          ExpressionAttributeValues: {
            ":sKey": "GOALS",
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

    // Filter live goals in-memory
    const liveGoals = gsiItems.filter((item) => item.isLive === true);

    return {
      success: true,
      message: "Goal list fetched successfully",
      data: liveGoals.map((item) => ({
        id: item.pKey.split("#")[1],
        title: item.title,
        icon: item.icon,
        tagline: item.tagline || "",
        description: item.description || "",
        coursesCount: item.coursesList?.length || 0,
        subjectsCount: item.subjectList?.length || 0,
        blogsCount: item.blogList?.length || 0,
        updatedAt: item.updatedAt,
      })),
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function getGoalSubjectList(goalID) {
  const params = {
    TableName: `${process.env.AWS_DB_NAME}master`,
    Key: {
      sKey: "GOALS",
      pKey: `GOAL#${goalID}`,
    },
  };
  const command = new GetCommand(params);
  try {
    const result = await dynamoDB.send(command);
    if (!result.Item) {
      return {
        success: false,
        message: "Goal not found",
      };
    }
    if (result.Item.subjectList.length === 0) {
      return {
        success: false,
        message: "No subjects found",
      };
    }
    const subjectList = result.Item.subjectList;
    return {
      success: true,
      message: "Goal subject list fetched successfully",
      data: subjectList,
    };
  } catch (error) {
    throw new Error(error);
  }
}
