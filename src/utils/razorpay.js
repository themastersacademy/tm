import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(amount, receipt, notes = {}) {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("createOrder: amount must be a positive number");
  }
  if (!receipt) {
    throw new Error("createOrder: receipt is required");
  }
  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
    notes,
  };
  return razorpay.orders.create(options);
}

export async function verifyPaymentWithSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured");
  }
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("Missing signature verification parameters");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  // Timing-safe comparison: prevents timing attacks on HMAC verification.
  // Buffer lengths must match or timingSafeEqual throws — reject upfront.
  const generatedBuf = Buffer.from(generatedSignature, "hex");
  let providedBuf;
  try {
    providedBuf = Buffer.from(razorpaySignature, "hex");
  } catch {
    throw new Error("Invalid signature");
  }

  if (
    generatedBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(generatedBuf, providedBuf)
  ) {
    throw new Error("Invalid signature");
  }

  const payment = await razorpay.payments.fetch(razorpayPaymentId);
  return {
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency,
    created_at: payment.created_at,
    method: payment.method,
    captured: payment.captured,
  };
}

export async function getOrderStatus(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  try {
    const order = await razorpay.orders.fetch(orderId);
    return {
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error) {
    console.error("Error fetching order status:", error);
    throw new Error("Failed to fetch order status");
  }
}
