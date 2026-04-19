import { fetchCouponByCode } from "@/src/libs/coupon/couponController";
import { handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  try {
    const { couponCode } = await params;
    if (!couponCode) {
      return Response.json(
        { success: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }
    const result = await fetchCouponByCode(couponCode);
    if (!result?.success) {
      return Response.json(
        { success: false, message: result?.message || "Invalid coupon" },
        { status: 400 }
      );
    }
    return Response.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return handleError(error);
  }
}
