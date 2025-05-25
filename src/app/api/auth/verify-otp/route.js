import { verifyOTP } from "@/src/libs/auth/auth";

export async function POST(request) {
  const { email, otp } = await request.json();
  if (!email || !otp) {
    return Response.json(
      { success: false, error: "Email and OTP are required" },
      { status: 400 }
    );
  }
  try {
    const result = await verifyOTP({ email, otp });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
