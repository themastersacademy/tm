import { verifyOTP } from "@/src/libs/auth/auth";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/src/utils/rateLimit";

export async function POST(request) {
  // Rate limit: 5 OTP attempts per minute per IP
  const ip = getClientIP(request);
  const { allowed, retryAfterMs } = checkRateLimit(`verify-otp:${ip}`, 5, 60000);
  if (!allowed) return rateLimitResponse(retryAfterMs);

  const body = await request.json().catch(() => null);
  const { email, otp } = body || {};
  if (!email || !otp) {
    return Response.json(
      { success: false, message: "Email and OTP are required" },
      { status: 400 }
    );
  }
  try {
    const result = await verifyOTP({ email, otp });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
