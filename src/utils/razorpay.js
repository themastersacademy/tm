import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(amount, receipt, notes = {}) {
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt,
    notes,
  };
  const order = await razorpay.orders.create(options);
  return order;
}

export async function verifyPaymentWithSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature === razorpaySignature) {
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    return {
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      created_at: payment.created_at,
      method: payment.method, //  "card", "upi", "netbanking"
      captured: payment.captured,
    };
  } else {
    throw new Error("Invalid signature");
  }
}

export async function getOrderStatus(orderId) {
  try {
    const order = await razorpay.orders.fetch(orderId);
    return {
      status: order.status, // e.g., "created", "attempted", "paid"
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error) {
    console.error("Error fetching order status:", error);
    throw new Error("Failed to fetch order status");
  }
}
