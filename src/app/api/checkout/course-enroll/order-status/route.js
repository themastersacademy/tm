// api/checkout/course-enroll/order-status/route.js
import { getOrderStatus } from "@/src/utils/razorpay";

export async function GET(req) {
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
    console.error("Order Status API Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch order status",
      },
      { status: 500 }
    );
  }
}