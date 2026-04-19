import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const TableName = `${process.env.AWS_DB_NAME}master`;

// Get Course by ID and Goal ID
export async function getCourse({ goalID, courseID }) {
  if (!courseID || !goalID) {
    return {
      success: false,
      message: "Course ID and Goal ID are required",
    };
  }

  const params = {
    TableName,
    Key: {
      pKey: `COURSE#${courseID}`,
      sKey: `COURSES@${goalID}`,
    },
    // Note: GetCommand does NOT support FilterExpression — applying isLive
    // in a filter here was a silent no-op. We filter manually after the read.
    ProjectionExpression:
      "pKey, title, description, #duration, lessons, thumbnail, #language, lessonIDs, sections, subscription, isLive, createdAt, updatedAt",
    ExpressionAttributeNames: {
      "#duration": "duration",
      "#language": "language",
    },
  };

  try {
    const response = await dynamoDB.send(new GetCommand(params));
    const course = response.Item;

    if (!course || course.isLive === false) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    return {
      success: true,
      message: "Course fetched successfully",
      data: course,
    };
  } catch (error) {
    console.error("getCourse error:", error);
    return {
      success: false,
      message: "Error fetching course",
    };
  }
}
