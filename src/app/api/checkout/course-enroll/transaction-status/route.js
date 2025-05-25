import { getTransaction } from "@/src/libs/transaction/transactionController";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const transactionID = url.searchParams.get("transactionID");
    const userID = url.searchParams.get("userID");

    if (!transactionID || !userID) {
      return Response.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const transaction = await getTransaction({ transactionID, userID });
    if (!transaction) {
      return Response.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: {
          transactionID: transaction.pKey.split("#")[1],
          status: transaction.status,
          amount: transaction.amount,
          course: {
            title: transaction.documentType === "COURSE_ENROLLMENTS" ? "Course Title" : "Unknown", // Replace with actual course title if available
          },
          razorpayPaymentId: transaction.paymentDetails?.razorpayPaymentId || null,
          updatedAt: transaction.updatedAt,
          paymentDetails: transaction.paymentDetails || {},
          order: {
            id: transaction.order?.id || null,
          }
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Transaction Status API Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch transaction status",
      },
      { status: 500 }
    );
  }
}