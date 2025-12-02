import { verifyPayment } from "@/src/libs/transaction/transactionController";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req) {
  const session = await getSession();
  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
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
