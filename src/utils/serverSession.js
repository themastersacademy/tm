"server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth";
import { cookies } from "next/headers";

export async function getSession() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const dev = cookieStore.get("DEV")?.value;

  // Enhanced return object with more authentication status details
  return {
    user: session?.user || null,
    id: session?.user?.id || (dev ? cookieStore.get("id")?.value : null),
    email:
      session?.user?.email || (dev ? cookieStore.get("email")?.value : null),
    isAuthenticated: !!session || !!dev,
    authMethod: dev ? "development" : "production",

    // New method to handle unauthorized responses
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
