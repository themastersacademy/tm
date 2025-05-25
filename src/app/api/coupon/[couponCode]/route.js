import { fetchCouponByCode } from "@/src/libs/coupon/couponController";

export async function GET(req, { params }) {
  const { couponCode } = await params;
  const result = await fetchCouponByCode(couponCode);
  if (!result.success) {
    return Response.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  }
  return Response.json(
    { success: true, message: result.message, data: result.data },
    { status: 200 }
  );
}
