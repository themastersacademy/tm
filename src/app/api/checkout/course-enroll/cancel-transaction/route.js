import { cancelTransaction } from "@/src/libs/transaction/transactionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { transactionID, razorpayOrderId } = body || {};

      if (!transactionID || !razorpayOrderId) {
        return Response.json(
          { success: false, message: "Missing required parameters" },
          { status: 400 }
        );
      }

      const result = await cancelTransaction({
        transactionID,
        razorpayOrderId,
        userID: session.id,
      });

      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
