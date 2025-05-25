import { getScheduledExamByBatch } from "@/src/libs/exams/examController";
import { getSession } from "@/src/utils/serverSession";

// Shared auth wrapper
async function withAuth(handler) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  return handler(session);
}

// Consistent error handler
function handleError(error) {
  console.error("Exam History API Error:", error);
  return Response.json({
    success: false,
    message: error.message || "An unexpected error occurred",
  });
}

export async function GET(req, { params }) {
  const { batchID } = await params;
  return withAuth(async (session) => {
    try {
      const response = await getScheduledExamByBatch(session.user.id, batchID);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
