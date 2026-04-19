import { updateUserPassword } from "@/src/libs/auth/auth";
import validatePassword from "@/src/utils/passwordValidator";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/src/utils/rateLimit";

export async function POST(request) {
  // Rate limit: 5 attempts per 5 minutes per IP
  const ip = getClientIP(request);
  const { allowed, retryAfterMs } = checkRateLimit(`update-password:${ip}`, 5, 300000);
  if (!allowed) return rateLimitResponse(retryAfterMs);
  const body = await request.json().catch(() => null);
  const { password, token } = body || {};
  if (!password || !token) {
    return Response.json(
      { success: false, message: "Password and token are required" },
      { status: 400 }
    );
  }

  // Server-side password validation
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) {
    return Response.json(
      { success: false, message: passwordCheck.error },
      { status: 400 }
    );
  }

  try {
    const result = await updateUserPassword({ password, token });
    return Response.json(result);
  } catch (error) {
    const message = error.message || "Password update failed. Please try again.";
    return Response.json(
      { success: false, message },
      { status: 400 }
    );
  }
}
