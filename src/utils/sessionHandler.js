import { getSession } from "@/src/utils/serverSession";

export async function withAuth(handler) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  return handler(session);
}

// Consistent error handler
export function handleError(error) {
  console.error("CourseEnroll API Error:", error);
  return Response.json({
    success: false,
    message: error.message || "An unexpected error occurred",
  });
}
