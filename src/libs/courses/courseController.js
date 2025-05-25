import { dynamoDB } from "@/src/utils/awsAgent";
import { QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const TableName = `${process.env.AWS_DB_NAME}master`;

//Get Course by ID and Goal ID
export async function getCourse({ goalID, courseID }) {
  const params = {
    TableName,
    Key: {
      pKey: `COURSE#${courseID}`,
      sKey: `COURSES@${goalID}`,
    },
    ProjectionExpression:
      "pKey, title, description, #duration, lessons, thumbnail, #language, lessonIDs, subscription, createdAt, updatedAt",
    ExpressionAttributeNames: {
      "#duration": "duration",
      "#language": "language",
    },
  };

  try {
    const command = new GetCommand(params);
    const response = await dynamoDB.send(command);
    const course = response.Item;
    return {
      success: true,
      message: "Course fetched successfully",
      data: course,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching courses",
      error: error.message,
    };
  }
}
