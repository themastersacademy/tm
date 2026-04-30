import { createUser } from "@/src/libs/auth/auth";
import validatePassword from "@/src/utils/passwordValidator";
import { checkRateLimit, getClientIP, rateLimitResponse } from "@/src/utils/rateLimit";
import { normalizeEmail } from "@/src/utils/email";

export async function POST(req) {
  // Rate limit: 5 registrations per minute per IP
  const ip = getClientIP(req);
  const { allowed, retryAfterMs } = checkRateLimit(`register:${ip}`, 5, 60000);
  if (!allowed) return rateLimitResponse(retryAfterMs);

  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
  const email = normalizeEmail(body.email);
  const { password } = body;

  // Server-side email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { success: false, message: "A valid email address is required" },
      { status: 400 }
    );
  }

  // Server-side password validation
  if (!password) {
    return Response.json(
      { success: false, message: "Password is required" },
      { status: 400 }
    );
  }
  const passwordCheck = validatePassword(password);
  if (!passwordCheck.isValid) {
    return Response.json(
      { success: false, message: passwordCheck.error },
      { status: 400 }
    );
  }

  try {
    const user = await createUser({ email, password });
    return Response.json(user);
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
