import { getTransaction } from "@/src/libs/transaction/transactionController";
import { getSession } from "@/src/utils/serverSession";

export async function GET(req) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated || !session.id) {
      return session.unauthorized("Please log in to continue");
    }

    const url = new URL(req.url);
    const transactionID = url.searchParams.get("transactionID");

    if (!transactionID) {
      return Response.json(
        { success: false, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    const transaction = await getTransaction({ transactionID, userID: session.id });
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
