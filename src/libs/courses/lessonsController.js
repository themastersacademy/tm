import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import generateBunnyVideoURL from "@/src/utils/generateBunnyVideoURL";
import getFileURL from "@/src/utils/getFileURL";
import { verifyCourseEnrollment } from "@/src/libs/courseEnrollment/courseEnrollController";

export async function getAllLessons({ courseID }) {
  if (!courseID) {
    return { success: false, message: "Missing courseID" };
  }

  const TABLE = `${process.env.AWS_DB_NAME}master`;

  try {
    // 1. Fetch the course record (by partition key only)
    const courseResp = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "pKey = :pk",
        ExpressionAttributeValues: {
          ":pk": `COURSE#${courseID}`,
        },
        Limit: 1,
      })
    );
    const course = courseResp.Items?.[0];
    if (!course) {
      return { success: false, message: "Course not found" };
    }

    // 2. Extract the ordered lesson IDs array
    const orderedIds = Array.isArray(course.lessonIDs) ? course.lessonIDs : [];

    // 3. Scan for all lessons belonging to this course, only linked ones
    const lessonsResp = await dynamoDB.send(
      new ScanCommand({
        TableName: TABLE,
        FilterExpression: "sKey = :sk AND isLinked = :linked",
        ExpressionAttributeValues: {
          ":sk": `LESSONS@${courseID}`,
          ":linked": true,
        },
      })
    );
    const lessons = lessonsResp.Items || [];

    // 4. Sort by the index in the course.lessonIDs array
    const sorted = lessons.sort((a, b) => {
      const idA = a.pKey.split("#")[1];
      const idB = b.pKey.split("#")[1];
      return orderedIds.indexOf(idA) - orderedIds.indexOf(idB);
    });

    // 5. Map to the desired response shape
    const data = sorted.map((item) => ({
      id: item.pKey.split("#")[1],
      title: item.title,
      type: item.type,
      isPreview: item.isPreview,
    }));

    return {
      success: true,
      message: "Lessons fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw new Error("Failed to get lessons");
  }
}

export async function getLessonVideoURL({ lessonID, courseID, enrollmentID }) {
  if (!lessonID || !courseID) {
    return { success: false, message: "Missing lessonID or courseID" };
  }

  const TABLE = `${process.env.AWS_DB_NAME}master`;
  const RESOURCE_TABLE = `${process.env.AWS_DB_NAME}content`;

  try {
    // 1. Fetch the lesson record (by partition key only)
    const lessonResp = await dynamoDB.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "pKey = :pk AND sKey = :sk",
        ExpressionAttributeValues: {
          ":pk": `LESSON#${lessonID}`,
          ":sk": `LESSONS@${courseID}`,
        },
        Limit: 1,
      })
    );
    const lesson = lessonResp.Items?.[0];
    if (!lesson) {
      return { success: false, message: "Lesson not found" };
    }

    if (!lesson.isPreview && !enrollmentID) {
      return {
        success: false,
        message: "Lesson is not a preview",
      };
    }

    const isEnrolled = await verifyCourseEnrollment(enrollmentID);
    // if (!isEnrolled) {
    //   return { success: false, message: "User is not enrolled in this course" };
    // }

    if (!lesson.isPreview && !isEnrolled) {
      return {
        success: false,
        message: "Lesson is not a preview and user is not enrolled",
      };
    }

    if (lesson.type !== "VIDEO") {
      return {
        success: false,
        message: "Lesson is not a video",
      };
    }

    const resourceResp = await dynamoDB.send(
      new QueryCommand({
        TableName: RESOURCE_TABLE,
        KeyConditionExpression: "pKey = :pk",
        ExpressionAttributeValues: {
          ":pk": `RESOURCE#${lesson.resourceID}`,
        },
        Limit: 1,
      })
    );
    const resource = resourceResp.Items?.[0];
    console.log(resource);
    if (!resource) {
      return { success: false, message: "Resource not found" };
    }

    const videoURL = generateBunnyVideoURL(resource.videoID);

    return {
      success: true,
      message: "video URL fetched successfully",
      data: videoURL,
    };
  } catch (error) {
    console.error("Error fetching preview video URL:", error);
    throw new Error("Failed to get preview video URL");
  }
}

export async function getLessonFileURL({ lessonID, courseID, enrollmentID }) {
  if (!lessonID || !courseID) {
    return {
      success: false,
      message: "Missing lessonID or courseID or enrollmentID",
    };
  }

  const TABLE = `${process.env.AWS_DB_NAME}master`;
  const RESOURCE_TABLE = `${process.env.AWS_DB_NAME}content`;

  try {
    // 1. Fetch the lesson record (by partition key only)
    const lessonResp = await dynamoDB.send(
      new GetCommand({
        TableName: TABLE,
        Key: {
          pKey: `LESSON#${lessonID}`,
          sKey: `LESSONS@${courseID}`,
        },
      })
    );

    const lesson = lessonResp.Item;
    if (!lesson) {
      return { success: false, message: "Lesson not found" };
    }

    if (!lesson.isPreview && !enrollmentID) {
      return {
        success: false,
        message: "Lesson is not a preview",
      };
    }

    const isEnrolled = await verifyCourseEnrollment(enrollmentID);
    // if (!isEnrolled) {
    //   return { success: false, message: "User is not enrolled in this course" };
    // }

    if (!lesson.isPreview && !isEnrolled) {
      return {
        success: false,
        message: "Lesson is not a preview and user is not enrolled",
      };
    }

    if (lesson.type !== "FILE") {
      return {
        success: false,
        message: "Lesson is not a file",
      };
    }

    const resourceResp = await dynamoDB.send(
      new QueryCommand({
        TableName: RESOURCE_TABLE,
        KeyConditionExpression: "pKey = :pk",
        ExpressionAttributeValues: {
          ":pk": `RESOURCE#${lesson.resourceID}`,
        },
        Limit: 1,
      })
    );
    const resource = resourceResp.Items?.[0];
    if (!resource) {
      return { success: false, message: "Resource not found" };
    }

    const fileURL = await getFileURL({ path: resource.path });

    return {
      success: true,
      message: "Preview file URL fetched successfully",
      data: fileURL,
    };
  } catch (error) {
    console.error("Error fetching preview file URL:", error);
    throw new Error("Failed to get preview file URL");
  }
}
