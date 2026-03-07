// api/checkout/course-enroll/order-status/route.js
import { getOrderStatus } from "@/src/utils/razorpay";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req) {
  return withAuth(async (session) => {
    try {
      const url = new URL(req.url);
      const orderId = url.searchParams.get("orderId");

      if (!orderId) {
        return Response.json(
          { success: false, message: "Missing orderId parameter" },
          { status: 400 }
        );
      }

      const order = await getOrderStatus(orderId);
      return Response.json(
        {
          success: true,
          data: {
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  });
}