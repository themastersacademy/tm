import { updateUserPassword } from "@/src/libs/auth/auth";

export async function POST(request) {
  const { password, token } = await request.json();
  if (!password || !token) {
    return Response.json(
      { success: false, error: "Password and token are required" },
      { status: 400 }
    );
  }
  try {
    const result = await updateUserPassword({ password, token });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
