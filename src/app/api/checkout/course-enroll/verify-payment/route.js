import { verifyPayment } from "@/src/libs/transaction/transactionController";

export async function POST(req) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await req.json();
    console.log("razorpayOrderId", razorpayOrderId);
    console.log("razorpayPaymentId", razorpayPaymentId);
    console.log("razorpaySignature", razorpaySignature);

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
