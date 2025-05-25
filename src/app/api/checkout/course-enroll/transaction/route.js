import { getTransaction } from "@/src/libs/transaction/transactionController";

export async function POST(req) {
  try {
    const { transactionID, userID } = await req.json();
    console.log("Received request to /api/transaction:", {
      transactionID,
      userID,
    });

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
    console.log("Transaction fetched from DynamoDB:", transaction);

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
