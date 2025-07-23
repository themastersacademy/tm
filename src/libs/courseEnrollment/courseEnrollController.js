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
import { getValidProSubscription } from "@/src/libs/proSubscription/subscriptionController";

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
      videoProgress: {},
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
      videoProgress: item.videoProgress || {},
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
  //filter out duplicate courseIDs
  const uniqueCourseIDs = [...new Set(courseIDs)];
  const courses = await getCourseInBatch(uniqueCourseIDs, goalID);

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
        lessons, thumbnail, #language, subscription`
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

export async function verifyAndEnrollFreeCourse({ userID, courseID, goalID }) {
  if (!userID || !courseID || !goalID) {
    throw new Error("User ID, course ID, and goal ID are required");
  }

  const now = Date.now();
  const courseEnrollID = randomUUID();
  const oneYearFromNow = now + 365 * 24 * 60 * 60 * 1000;

  const user = await getFullUserByID(userID);
  if (!user) {
    throw new Error("User not found");
  }

  const courseResult = await getCourse({ courseID, goalID });
  if (!courseResult.success) {
    throw new Error(courseResult.message || "Course not found");
  }

  const courseDetails = courseResult.data;
  if (!courseDetails.subscription.isFree && !courseDetails.subscription.isPro) {
    throw new Error("Course is not accessible for free or pro users");
  }

  // Check if course requires pro subscription
  let proSubscriptionResult = null;
  if (courseDetails.subscription.isPro) {
    proSubscriptionResult = await getValidProSubscription(userID);
    if (
      !proSubscriptionResult.success ||
      proSubscriptionResult.data.length === 0
    ) {
      console.error(
        `User ${userID} does not have an active pro subscription for pro course ${courseID}`
      );
      throw new Error("Active pro subscription required for this course");
    }
  }

  const existingEnrollment = await getValidCourseEnrollment(userID, courseID);
  if (existingEnrollment.success && existingEnrollment.data.length > 0) {
    throw new Error("Course already enrolled");
  }

  // Determine expiration based on pro subscription
  let expiresAt = oneYearFromNow;
  if (courseDetails.subscription.isPro) {
    proSubscriptionResult =
      proSubscriptionResult || (await getValidProSubscription(userID));
    if (
      proSubscriptionResult.success &&
      proSubscriptionResult.data.length > 0
    ) {
      expiresAt = Math.min(
        ...proSubscriptionResult.data.map((sub) => sub.expiresAt)
      );
    }
  }

  const pKey = `COURSE_ENROLLMENT#${courseEnrollID}`;
  const sKey = `COURSE_ENROLLMENTS`;
  const gsi1pKey = `COURSE_ENROLLMENT#${userID}`;
  const gsi1sKey = "COURSE_ENROLLMENTS";

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
      status: "active",
      transactionID: null,
      priceBreakdown: {
        totalPrice: 0,
      },
      plan: null,
      couponDetails: null,
      billingInfo: null,
      expiresAt: expiresAt,
      createdAt: now,
      updatedAt: now,
      videoProgress: {},
    },
    ConditionExpression: "attribute_not_exists(pKey)",
  };
  console.log("Enrolling free course with params:", courseEnrollParams);

  try {
    await dynamoDB.send(new PutCommand(courseEnrollParams));
    console.log(
      `Free course enrollment successful for courseID: ${courseID}, userID: ${userID}`
    );
  } catch (error) {
    console.error("Error enrolling free course:", error);
    throw new Error("Failed to enroll free course");
  }

  return {
    success: true,
    data: {
      courseEnrollID,
      transactionID: null,
      priceDetails: { totalPrice: 0 },
      order: null,
    },
    message: "Free course enrolled successfully",
  };
}
