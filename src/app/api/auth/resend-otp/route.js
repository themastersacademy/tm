import { resendOTP } from "@/src/libs/auth/auth";

export async function POST(request) {
  const { email } = await request.json();
  try {
    const result = await resendOTP({ email });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
