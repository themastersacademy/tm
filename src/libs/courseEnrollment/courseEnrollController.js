import { dynamoDB } from "@/src/utils/awsAgent";
import {
  PutCommand,
  QueryCommand,
  GetCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { fetchCouponByCode } from "@/src/libs/coupon/couponController";
import { getCourse } from "@/src/libs/courses/courseController";
import { calculatePriceBreakdownWithCoupon } from "@/src/utils/pricing";
import { createTransaction } from "@/src/libs/transaction/transactionController";
import { randomUUID } from "crypto";
import { getFullUserByID } from "@/src/libs/user/userProfile";

const USER_TABLE = `${process.env.AWS_DB_NAME}users`;
const USER_TABLE_INDEX = "GSI1-index";
const MASTER_TABLE = `${process.env.AWS_DB_NAME}master`;

export async function enrollInCourse({
  userID,
  courseID,
  goalID,
  couponCode,
  subscriptionPlanIndex,
  billingInfoIndex,
}) {
  const now = Date.now();
  const courseEnrollID = randomUUID();

  let couponDetails = null;

  const user = await getFullUserByID(userID);
  console.log("user", user);
  if (!user) {
    throw new Error("User not found");
  }

  const billingInfo = user.billingInfo;
  if (!billingInfo[billingInfoIndex]) {
    throw new Error("Billing info not found");
  }

  if (couponCode) {
    const couponResult = await fetchCouponByCode(couponCode);
    if (!couponResult.success) {
      throw new Error(couponResult.message || "Coupon not found");
    }
    couponDetails = couponResult.data;
  }

  const courseResult = await getCourse({ courseID, goalID });
  if (!courseResult.success) {
    throw new Error(courseResult.message || "Course not found");
  }

  const courseDetails = courseResult.data;
  const subscriptionPlan = courseDetails.subscription;
  const plan = subscriptionPlan.plans[subscriptionPlanIndex];

  const priceBreakdown = calculatePriceBreakdownWithCoupon(
    plan.priceWithTax,
    plan.discountInPercent,
    18,
    couponDetails
  );

  const pKey = `COURSE_ENROLLMENT#${courseEnrollID}`;
  const sKey = `COURSE_ENROLLMENTS`;
  const gsi1pKey = `COURSE_ENROLLMENT#${userID}`;
  const gsi1sKey = "COURSE_ENROLLMENTS";

  const transaction = await createTransaction({
    userID,
    userMeta: {
      email: user.email,
      id: user.id,
      name: user.name,
      billingInfo: billingInfo[billingInfoIndex],
    },
    document: {
      type: "COURSE_ENROLLMENT",
      id: courseEnrollID,
      sKey: sKey,
      pKey: pKey,
    },
    amount: priceBreakdown.totalPrice,
  });

  const courseEnrollParams = {
    TableName: USER_TABLE,
    Item: {
      pKey,
      sKey,
      "GSI1-pKey": gsi1pKey,
      "GSI1-sKey": gsi1sKey,
      courseID,
      goalID,
      userID,
      status: "inactive", //active, inactive, cancelled
      transactionID: transaction.pKey.split("#")[1],
      priceBreakdown,
      plan,
      couponDetails,
      billingInfo: billingInfo[billingInfoIndex],
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
    },
    // optionally guard against accidental overwrite:
    ConditionExpression: "attribute_not_exists(pKey)",
  };

  await dynamoDB.send(new PutCommand(courseEnrollParams));

  return {
    success: true,
    data: {
      courseEnrollID,
      transactionID: transaction.pKey.split("#")[1],
      priceDetails: priceBreakdown,
      order: transaction.order,
    },
  };
}

export async function getValidCourseEnrollment(userID, courseID) {
  const courseEnrollParams = {
    TableName: USER_TABLE,
    IndexName: USER_TABLE_INDEX,
    KeyConditionExpression: "#gsi1pk = :pKey AND #gsi1sk = :sKey",
    // filter for active and not expired and courseID
    FilterExpression:
      "#status = :status AND #expiresAt > :now AND #courseID = :courseID",
    ExpressionAttributeNames: {
      "#gsi1pk": "GSI1-pKey",
      "#gsi1sk": "GSI1-sKey",
      "#status": "status",
      "#expiresAt": "expiresAt",
      "#courseID": "courseID",
    },
    ExpressionAttributeValues: {
      ":pKey": `COURSE_ENROLLMENT#${userID}`,
      ":sKey": "COURSE_ENROLLMENTS",
      ":status": "active",
      ":now": Date.now(),
      ":courseID": courseID,
    },
  };

  const result = await dynamoDB.send(new QueryCommand(courseEnrollParams));
  const courseEnrollments = result.Items;

  if (courseEnrollments.length === 0) {
    return {
      success: false,
      message: "No active course enrollment found",
    };
  }

  return {
    success: true,
    data: courseEnrollments.map((item) => ({
      id: item.pKey.split("#")[1],
      status: item.status,
      expiresAt: item.expiresAt,
      courseID: item.courseID,
      goalID: item.goalID,
    })),
  };
}

export async function verifyCourseEnrollment(enrollmentID) {
  if (!enrollmentID) return false;

  try {
    const { Item } = await dynamoDB.send(
      new GetCommand({
        TableName: USER_TABLE,
        Key: {
          pKey: `COURSE_ENROLLMENT#${enrollmentID}`,
          sKey: `COURSE_ENROLLMENTS`,
        },
        ExpressionAttributeNames: {
          "#status": "status",
          "#expiresAt": "expiresAt",
        },
        ProjectionExpression: "#status, #expiresAt", // only fetch what we need
      })
    );

    // must exist, be active, and not yet expired
    return Boolean(
      Item &&
        Item.status?.toUpperCase() === "ACTIVE" &&
        typeof Item.expiresAt === "number" &&
        Item.expiresAt > Date.now()
    );
  } catch (err) {
    console.error("verifyCourseEnrollment error:", err);
    return false;
  }
}

export async function getAllEnrolledCourses(userID, goalID) {
  const courseEnrollParams = {
    TableName: USER_TABLE,
    IndexName: USER_TABLE_INDEX,
    KeyConditionExpression: "#gsi1pk = :pKey AND #gsi1sk = :sKey",
    FilterExpression:
      "#goalID = :goalID AND #status = :status AND #expiresAt > :now",
    ExpressionAttributeNames: {
      "#gsi1pk": "GSI1-pKey",
      "#gsi1sk": "GSI1-sKey",
      "#goalID": "goalID",
      "#status": "status",
      "#expiresAt": "expiresAt",
    },
    ExpressionAttributeValues: {
      ":pKey": `COURSE_ENROLLMENT#${userID}`,
      ":sKey": `COURSE_ENROLLMENTS`,
      ":goalID": goalID,
      ":status": "active",
      ":now": Date.now(),
    },
  };

  const result = await dynamoDB.send(new QueryCommand(courseEnrollParams));
  const courseEnrollments = result.Items;
  const courseIDs = courseEnrollments.map((item) => item.courseID);
  const courses = await getCourseInBatch(courseIDs, goalID);

  return {
    success: true,
    data: courses,
  };
}

async function getCourseInBatch(courseIDs, goalID) {
  if (!Array.isArray(courseIDs) || courseIDs.length === 0) {
    return [];
  }

  const requestItems = {
    [MASTER_TABLE]: {
      Keys: courseIDs.map((courseID) => ({
        pKey: `COURSE#${courseID}`,
        sKey: `COURSES@${goalID}`,
      })),
      ExpressionAttributeNames: {
        "#duration": "duration",
        "#language": "language",
      },
      ProjectionExpression: `
        pKey, title, #duration,
        lessons, thumbnail, #language`
        .trim()
        .replace(/\s+/g, " "),
    },
  };

  const { Responses = {} } = await dynamoDB.send(
    new BatchGetCommand({ RequestItems: requestItems })
  );

  const items = Responses[MASTER_TABLE] || [];
  return items.map((item) => ({
    id: item.pKey.split("#", 2)[1],
    title: item.title,
    duration: item.duration,
    lessons: item.lessons,
    thumbnail: item.thumbnail,
    language: item.language,
  }));
}
