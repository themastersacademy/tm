import { dynamoDB } from "@/src/utils/awsAgent";
import { PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;

export async function saveLessonProgress({ userID, courseID, lessonProgress }) {
  const now = Date.now();
  const pKey = `COURSE_ANALYTICS#${courseID}#${userID}`;
  const sKey = userID;
  const gsi1pKey = `COURSE_ANALYTICS`;
  const gsi1sKey = `COURSE_ANALYTICS#${userID}`;

  try {
    // Check if analytics record exists
    const existingRecord = await dynamoDB.send(
      new GetCommand({
        TableName: USER_TABLE,
        Key: { pKey, sKey },
      })
    );

    if (existingRecord.Item) {
      // Update existing record
      await dynamoDB.send(
        new UpdateCommand({
          TableName: USER_TABLE,
          Key: { pKey, sKey },
          UpdateExpression:
            "SET LessonProgress = :progressData, updatedAt = :now",
          ExpressionAttributeValues: {
            ":progressData": lessonProgress,
            ":now": now,
          },
        })
      );
    } else {
      // Create new record
      await dynamoDB.send(
        new PutCommand({
          TableName: USER_TABLE,
          Item: {
            pKey,
            sKey,
            "GSI1-pKey": gsi1pKey,
            "GSI1-sKey": gsi1sKey,
            courseID,
            userID,
            LessonProgress: lessonProgress,
            createdAt: now,
            updatedAt: now,
          },
          ConditionExpression: "attribute_not_exists(pKey)",
        })
      );
    }

    return {
      success: true,
      message: "Lesson progress saved successfully",
    };
  } catch (error) {
    console.error("Error saving lesson progress:", error);
    return {
      success: false,
      message: "Failed to save lesson progress",
      error: error.message,
    };
  }
}

export async function getLessonProgress({ userID, courseID }) {
  try {
    const result = await dynamoDB.send(
      new GetCommand({
        TableName: USER_TABLE,
        Key: {
          pKey: `COURSE_ANALYTICS#${courseID}#${userID}`,
          sKey: userID,
        },
        ProjectionExpression: "LessonProgress",
      })
    );

    return {
      success: true,
      data: result.Item?.LessonProgress || {},
    };
  } catch (error) {
    console.error("Error fetching lesson progress:", error);
    return {
      success: false,
      message: "Failed to fetch lesson progress",
      error: error.message,
    };
  }
}
