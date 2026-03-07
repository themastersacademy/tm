import { getTransaction } from "@/src/libs/transaction/transactionController";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req) {
  const session = await getSession();
  if (!session?.isAuthenticated || !session.id) {
    return session.unauthorized("Please log in to continue");
  }
  try {
    const { transactionID } = await req.json();

    if (!transactionID) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing transactionID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const transaction = await getTransaction({ transactionID, userID: session.id });

    return new Response(JSON.stringify({ success: true, data: transaction }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/transaction:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to fetch transaction",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
