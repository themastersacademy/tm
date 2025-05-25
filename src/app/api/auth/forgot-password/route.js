import { forgotPassword } from "@/src/libs/auth/auth";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) {
    return Response.json(
      { success: false, error: "Email is required" },
      { status: 400 }
    );
  }
  try {
    const result = await forgotPassword({ email });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
