import { verifyPayment } from "@/src/libs/transaction/transactionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        body || {};

      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return Response.json(
          { success: false, message: "Missing required parameters" },
          { status: 400 }
        );
      }

      const result = await verifyPayment({
        userID: session.id,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      return Response.json(result);
    } catch (error) {
      console.error("Verify Payment API Error:", error);
      return handleError(error);
    }
  });
}
