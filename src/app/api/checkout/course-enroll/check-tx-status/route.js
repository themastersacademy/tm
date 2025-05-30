import { checkAndUpdateTransactionStatus } from "@/src/libs/transaction/transactionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const { transactionID, razorpayOrderId } = await req.json();

      if (!transactionID || !razorpayOrderId) {
        return Response.json(
          { success: false, message: "Missing required parameters" },
          { status: 400 }
        );
      }

      const result = await checkAndUpdateTransactionStatus({
        transactionID,
        razorpayOrderId,
        userID: session.id,
      });

      return Response.json(result, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  });
}
