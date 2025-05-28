import { dynamoDB } from "@/src/utils/awsAgent";
import { QueryCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getFullUserByID } from "@/src/libs/user/userProfile";
import { randomUUID } from "crypto";
import { fetchCouponByCode } from "@/src/libs/coupon/couponController";
import { calculatePriceBreakdownWithCoupon } from "@/src/utils/pricing";
import { createTransaction } from "@/src/libs/transaction/transactionController";

const MASTER_TABLE = `${process.env.AWS_DB_NAME}master`;
const MASTER_INDEX = "masterTableIndex";
const USER_TABLE = `${process.env.AWS_DB_NAME}users`;
const USER_TABLE_INDEX = "GSI1-index";

export async function getAllSubscriptionPlans() {
  const params = {
    TableName: MASTER_TABLE,
    IndexName: MASTER_INDEX,
    KeyConditionExpression: "#gsi1pk = :pk AND #gsi1sk = :sk",
    ExpressionAttributeNames: {
      "#gsi1pk": "GSI1-pKey",
      "#gsi1sk": "GSI1-sKey",
    },
    ExpressionAttributeValues: {
      ":pk": "SUBSCRIPTION_PLAN",
      ":sk": "SUBSCRIPTION_PLAN",
    },
  };

  try {
    const data = await dynamoDB.send(new QueryCommand(params));
    const plans = data.Items.map((item) => ({
      ...item,
      id: item.pKey.split("#")[1],
      pKey: undefined,
      sKey: undefined,
      "GSI1-pKey": undefined,
      "GSI1-sKey": undefined,
    }));
    return {
      success: true,
      data: plans,
    };
  } catch (error) {
    throw error;
  }
}

export async function createProSubscription({
  userID,
  subscriptionPlanID,
  couponCode,
  billingInfoIndex,
}) {
  const user = await getFullUserByID(userID);
  if (!user) {
    throw new Error("User not found");
  }
  const proSubscriptionID = randomUUID();
  let couponDetails = null;

  const userMeta = {
    id: user.id,
    email: user.email,
    name: user.name,
    billingInfo: user.billingInfo[billingInfoIndex],
  };

  if (couponCode) {
    const couponResult = await fetchCouponByCode(couponCode);
    if (!couponResult.success) {
      throw new Error(couponResult.message || "Coupon not found");
    }
    couponDetails = couponResult.data;
  }

  const subscriptionPlan = await getSubscriptionPlanByID({
    subscriptionPlanID,
  });
  if (!subscriptionPlan.success) {
    throw new Error(subscriptionPlan.message || "Subscription plan not found");
  }
  const plan = subscriptionPlan.data;

  const priceBreakdown = calculatePriceBreakdownWithCoupon(
    plan.priceWithTax,
    plan.discountInPercent,
    18,
    couponDetails
  );

  const pKey = `PRO_SUBSCRIPTION#${proSubscriptionID}`;
  const sKey = `PRO_SUBSCRIPTIONS`;
  const gsi1pKey = `PRO_SUBSCRIPTION#${userID}`;
  const gsi1sKey = "PRO_SUBSCRIPTIONS";
  const now = Date.now();

  const transaction = await createTransaction({
    userID,
    userMeta,
    document: {
      type: "PRO_SUBSCRIPTION",
      id: proSubscriptionID,
      sKey,
      pKey,
    },
    amount: priceBreakdown.totalPrice,
  });

  console.log(transaction);

  const params = {
    TableName: USER_TABLE,
    Item: {
      pKey,
      sKey,
      "GSI1-pKey": gsi1pKey,
      "GSI1-sKey": gsi1sKey,
      status: "inactive",
      plan,
      billingInfo: user.billingInfo[billingInfoIndex],
      transactionID: transaction.pKey.split("#")[1],
      couponDetails,
      subscriptionSource: "USER_SUBSCRIPTION",
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
    },
    // optionally guard against accidental overwrite:
    ConditionExpression: "attribute_not_exists(pKey)",
  };

  await dynamoDB.send(new PutCommand(params));

  return {
    success: true,
    data: {
      proSubscriptionID,
      transactionID: transaction.pKey.split("#")[1],
      priceDetails: priceBreakdown,
      order: transaction.order,
    },
  };
}

export async function getValidProSubscription(userID) {
  const proSubscriptionParams = {
    TableName: USER_TABLE,
    IndexName: USER_TABLE_INDEX,
    KeyConditionExpression: "#gsi1pk = :pKey AND #gsi1sk = :sKey",
    // filter for active and not expired and subscriptionSource
    FilterExpression:
      "#status = :status AND #expiresAt > :now AND #subscriptionSource = :subscriptionSource",
    ExpressionAttributeNames: {
      "#gsi1pk": "GSI1-pKey",
      "#gsi1sk": "GSI1-sKey",
      "#status": "status",
      "#expiresAt": "expiresAt",
      "#subscriptionSource": "subscriptionSource",
    },
    ExpressionAttributeValues: {
      ":pKey": `PRO_SUBSCRIPTION#${userID}`,
      ":sKey": "PRO_SUBSCRIPTIONS",
      ":status": "active",
      ":now": Date.now(),
      ":subscriptionSource": "USER_SUBSCRIPTION",
    },
  };

  const result = await dynamoDB.send(new QueryCommand(proSubscriptionParams));
  const proSubscriptions = result.Items;

  if (proSubscriptions.length === 0) {
    return {
      success: false,
      message: "No active pro subscription found",
    };
  }

  return {
    success: true,
    data: proSubscriptions.map((item) => ({
      id: item.pKey.split("#")[1],
      status: item.status,
      expiresAt: item.expiresAt,
      subscriptionSource: item.subscriptionSource,
    })),
  };
}

export async function getSubscriptionPlanByID({ subscriptionPlanID }) {
  const params = {
    TableName: MASTER_TABLE,
    Key: {
      pKey: `SUBSCRIPTION_PLAN#${subscriptionPlanID}`,
      sKey: "SUBSCRIPTION_PLAN",
    },
  };
  try {
    const data = await dynamoDB.send(new GetCommand(params));
    return {
      success: true,
      data: data.Item,
    };
  } catch (error) {
    throw error;
  }
}
