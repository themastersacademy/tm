import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;

export async function saveLessonProgress({ userID, courseID, lessonProgress }) {
  if (!userID || !courseID) {
    return { success: false, message: "Missing userID or courseID" };
  }
  if (!lessonProgress || typeof lessonProgress !== "object") {
    return { success: false, message: "Invalid progress data" };
  }

  const now = Date.now();
  const pKey = `COURSE_ANALYTICS#${courseID}#${userID}`;
  const sKey = userID;

  try {
    // Single atomic upsert: sets LessonProgress every time, but only
    // initializes GSI keys / courseID / userID / createdAt on first write.
    // Eliminates the check-then-write race present in the previous version.
    await dynamoDB.send(
      new UpdateCommand({
        TableName: USER_TABLE,
        Key: { pKey, sKey },
        UpdateExpression: `
          SET LessonProgress = :progressData,
              updatedAt = :now,
              createdAt = if_not_exists(createdAt, :now),
              courseID = if_not_exists(courseID, :courseID),
              userID = if_not_exists(userID, :userID),
              #g1pk = if_not_exists(#g1pk, :g1pk),
              #g1sk = if_not_exists(#g1sk, :g1sk)
        `,
        ExpressionAttributeNames: {
          "#g1pk": "GSI1-pKey",
          "#g1sk": "GSI1-sKey",
        },
        ExpressionAttributeValues: {
          ":progressData": lessonProgress,
          ":now": now,
          ":courseID": courseID,
          ":userID": userID,
          ":g1pk": "COURSE_ANALYTICS",
          ":g1sk": `COURSE_ANALYTICS#${userID}`,
        },
      })
    );

    return {
      success: true,
      message: "Lesson progress saved successfully",
    };
  } catch (error) {
    console.error("Error saving lesson progress:", error);
    return {
      success: false,
      message: "Failed to save lesson progress",
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
