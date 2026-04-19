import { forgotPassword } from "@/src/libs/auth/auth";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/src/utils/rateLimit";

export async function POST(request) {
  // Rate limit: 3 forgot-password attempts per 5 minutes per IP
  const ip = getClientIP(request);
  const { allowed, retryAfterMs } = checkRateLimit(`forgot-password:${ip}`, 3, 300000);
  if (!allowed) return rateLimitResponse(retryAfterMs);

  const body = await request.json().catch(() => null);
  const { email } = body || {};
  if (!email) {
    return Response.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }
  try {
    const result = await forgotPassword({ email });
    return Response.json(result);
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json(
      { success: false, message: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
