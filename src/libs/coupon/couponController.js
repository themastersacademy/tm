import { dynamoDB } from "@/src/utils/awsAgent";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const TableName = `${process.env.AWS_DB_NAME}master`;

export async function fetchCouponByCode(code) {
  if (!code) {
    return { success: false, message: "Coupon code is required" };
  }

  const now = Date.now();
  const params = {
    TableName,
    FilterExpression:
      "sKey = :sk AND #code = :code AND isActive = :active AND startDate <= :now AND endDate >= :now",
    ExpressionAttributeNames: {
      "#code": "code",
    },
    ExpressionAttributeValues: {
      ":sk": "COUPONS",
      ":code": code,
      ":active": true,
      ":now": now,
    },
  };

  try {
    const { Items } = await dynamoDB.send(new ScanCommand(params));
    if (!Items || Items.length === 0) {
      return { success: false, message: "Invalid or expired coupon" };
    }

    // You may have multiple with the same code—pick the first
    const c = Items[0];
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
        // totalRedemptions: Number(c.totalRedemptions),
        // totalRedemptionsPerUser: Number(c.totalRedemptionsPerUser),
        // startDate: c.startDate,
        // endDate: c.endDate,
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
