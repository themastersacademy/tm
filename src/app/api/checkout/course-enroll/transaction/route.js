import { getTransaction } from "@/src/libs/transaction/transactionController";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req) {
  const session = await getSession();
  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Unauthorized",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const { transactionID, userID } = await req.json();

    if (!transactionID || !userID) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing transactionID or userID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const transaction = await getTransaction({ transactionID, userID });

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
