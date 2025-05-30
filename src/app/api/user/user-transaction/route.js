import { getUserTransactions } from "@/src/libs/transaction/transactionController";
import { withAuth } from "@/src/utils/sessionHandler";

export async function GET(req) {
  return withAuth(async (session) => {
    try {
      const userID = session.id;
      if (!userID) {
        return Response.json(
          { success: false, message: "User ID not found in session" },
          { status: 401 }
        );
      }

      const result = await getUserTransactions({ userID });
      return Response.json(result, { status: 200 });
    } catch (error) {
      console.error("API Error:", error);
      return Response.json(
        {
          success: false,
          message: `Failed to fetch transactions: ${error.message}`,
        },
        { status: 500 }
      );
    }
  });
}
