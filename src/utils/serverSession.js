"server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth";

export async function getSession() {
  const session = await getServerSession(authOptions);

  return {
    user: session?.user || null,
    id: session?.user?.id || null,
    email: session?.user?.email || null,
    isAuthenticated: Boolean(session?.user?.id),
    authMethod: "nextauth",
    unauthorized(message = "Unauthorized") {
      return Response.json(
        {
          success: false,
          message: message,
        },
        { status: 401 }
      );
    },
  };
}
