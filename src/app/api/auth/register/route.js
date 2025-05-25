import { createUser } from "@/src/libs/auth/auth";

export async function POST(req) {
  const { email, password } = await req.json();
  try {
    const user = await createUser({ email, password });
    return Response.json(user);
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
