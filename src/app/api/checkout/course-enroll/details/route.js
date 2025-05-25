// [project]/src/app/api/checkout/course-enroll/details/route.js
import { dynamoDB } from "@/src/utils/awsAgent";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { getSession } from "@/src/utils/serverSession";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const transactionID = url.searchParams.get("transactionID");
    const userID = url.searchParams.get("userID");

    if (!transactionID || !userID) {
      return Response.json(
        { success: false, message: "Missing transactionID or userID" },
        { status: 400 }
      );
    }

    // Authenticate the user
    const session = await getSession();
    if (!session?.isAuthenticated || session.id !== userID) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch transaction details
    const transactionParams = {
      TableName: USER_TABLE,
      Key: {
        pKey: `TRANSACTION#${transactionID}`,
        sKey: `TRANSACTIONS@${userID}`,
      },
    };
    const transactionResult = await dynamoDB.send(new GetCommand(transactionParams));
    if (!transactionResult.Item) {
      return Response.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    const transaction = transactionResult.Item;

    // Fetch course enrollment details
    const courseEnrollParams = {
      TableName: USER_TABLE,
      Key: {
        pKey: transaction.documentID,
        sKey: "COURSE_ENROLLMENTS",
      },
    };
    const courseEnrollResult = await dynamoDB.send(new GetCommand(courseEnrollParams));
    if (!courseEnrollResult.Item) {
      return Response.json(
        { success: false, message: "Course enrollment not found" },
        { status: 404 }
      );
    }

    const courseEnrollment = courseEnrollResult.Item;

    // Prepare course details with fallback
    let courseDetails = {
      id: courseEnrollment.courseID,
      title: "Unknown Course", // Fallback title
      subscription: {
        plans: [courseEnrollment.plan], // Use the plan from course enrollment
      },
    };

    // Attempt to fetch course details
    try {
      const courseParams = {
        TableName: USER_TABLE,
        Key: {
          pKey: `COURSE#${courseEnrollment.courseID}`,
          sKey: "COURSES",
        },
      };
      const courseResult = await dynamoDB.send(new GetCommand(courseParams));
      if (courseResult.Item) {
        courseDetails.title = courseResult.Item.title || "Unknown Course";
        // Optionally include other course fields if needed
      }
    } catch (error) {
      console.warn(`Course not found for courseID: ${courseEnrollment.courseID}`, error);
    }

    return Response.json(
      {
        success: true,
        data: {
          courseDetails,
          billingInfo: courseEnrollment.billingInfo,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Course Enrollment Details API Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch course enrollment details",
      },
      { status: 500 }
    );
  }
}