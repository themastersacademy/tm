import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

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

export async function getCourseList(goalID) {
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

    return {
      success: true,
      message: "Course list fetched successfully",
      data: Item.coursesList || [],
    };
  } catch (error) {
    console.error("Error fetching course list:", error);
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

export async function getLiveCourses(goalID) {
  try {
    // Query via GSI — courses already have GSI1-pKey = "COURSES", GSI1-sKey = "COURSES@<goalID>"
    const items = [];
    let lastKey;
    do {
      const response = await dynamoDB.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "masterTableIndex",
          KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
          ExpressionAttributeNames: {
            "#gsi1pk": "GSI1-pKey",
            "#gsi1sk": "GSI1-sKey",
          },
          ExpressionAttributeValues: {
            ":gsi1pk": "COURSES",
            ":gsi1sk": `COURSES@${goalID}`,
          },
          ...(lastKey && { ExclusiveStartKey: lastKey }),
        })
      );
      items.push(...(response.Items || []));
      lastKey = response.LastEvaluatedKey;
    } while (lastKey);

    // Filter live courses in-memory
    const liveItems = items.filter((item) => item.isLive === true);

    if (liveItems.length === 0) {
      return {
        success: true,
        message: "No live courses found",
        data: [],
      };
    }

    const courses = liveItems.map(({ pKey, sKey, ...course }) => ({
      id: pKey.split("#")[1],
      ...course,
    }));

    return {
      success: true,
      message: "Live courses fetched successfully",
      data: courses,
    };
  } catch (error) {
    console.error("Error fetching live courses:", error);
    throw new Error("Internal server error");
  }
}
