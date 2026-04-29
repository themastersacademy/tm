import { resendOTP } from "@/src/libs/auth/auth";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/src/utils/rateLimit";

export async function POST(request) {
  // Rate limit: 3 resend attempts per 2 minutes per IP
  const ip = getClientIP(request);
  const { allowed, retryAfterMs } = checkRateLimit(`resend-otp:${ip}`, 3, 120000);
  if (!allowed) return rateLimitResponse(retryAfterMs);

  const body = await request.json().catch(() => null);
  const { email: rawEmail } = body || {};
  const email = rawEmail?.trim().toLowerCase();
  if (!email) {
    return Response.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }
  try {
    const result = await resendOTP({ email });
    return Response.json(result);
  } catch (error) {
    console.error("Resend OTP error:", error);
    return Response.json(
      { success: false, message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
