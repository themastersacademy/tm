import { verifyPayment } from "@/src/libs/transaction/transactionController";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req) {
  const session = await getSession();
  if (!session?.isAuthenticated || !session.id) {
    return session.unauthorized("Please log in to continue");
  }
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();

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

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error("Verify Payment API Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Payment verification failed",
      },
      { status: 400 }
    );
  }
}
