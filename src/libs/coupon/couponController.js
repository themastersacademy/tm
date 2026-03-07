import { dynamoDB } from "@/src/utils/awsAgent";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const TableName = `${process.env.AWS_DB_NAME}master`;

export async function fetchCouponByCode(code) {
  if (!code) {
    return { success: false, message: "Coupon code is required" };
  }

  const now = Date.now();
  const params = {
    TableName,
    IndexName: "masterTableIndex",
    KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
    ExpressionAttributeNames: {
      "#gsi1pk": "GSI1-pKey",
      "#gsi1sk": "GSI1-sKey",
    },
    ExpressionAttributeValues: {
      ":gsi1pk": `COUPON#${code}`,
      ":gsi1sk": "COUPONs",
    },
  };

  try {
    const { Items } = await dynamoDB.send(new QueryCommand(params));

    // Filter active and within date range in-memory
    const validCoupons = (Items || []).filter(
      (c) => c.isActive === true && c.startDate <= now && c.endDate >= now
    );

    if (validCoupons.length === 0) {
      return { success: false, message: "Invalid or expired coupon" };
    }

    const c = validCoupons[0];
    return {
      success: true,
      data: {
        id: c.pKey.split("#")[1],
        code: c.code,
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        maxDiscountPrice: c.maxDiscountPrice
          ? Number(c.maxDiscountPrice)
          : undefined,
        minOrderAmount: c.minOrderAmount,
        couponClass: c.couponClass,
        applicableCourses: c.applicableCourses || [],
        applicableGoals: c.applicableGoals || [],
      },
    };
  } catch (err) {
    console.error("Error fetching coupon:", err);
    return { success: false, message: "Could not fetch coupon" };
  }
}
