import { getTransaction } from "@/src/libs/transaction/transactionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const transactionID = body?.transactionID;
      if (!transactionID) {
        return Response.json(
          { success: false, message: "Missing transactionID" },
          { status: 400 }
        );
      }
      const transaction = await getTransaction({
        transactionID,
        userID: session.id,
      });
      return Response.json({ success: true, data: transaction });
    } catch (error) {
      console.error("Error in /api/transaction:", error?.message);
      return handleError(error);
    }
  });
}
