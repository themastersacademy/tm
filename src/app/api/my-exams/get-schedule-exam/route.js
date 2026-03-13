import { getScheduledExamsByStudentID } from "@/src/libs/exams/examController";
import { getSession } from "@/src/utils/serverSession";

export async function GET() {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }

  try {
    const response = await getScheduledExamsByStudentID(session.user.id);
    return Response.json(response);
  } catch (error) {
    console.error("Direct exam fetch error:", error);
    return Response.json(
      { success: false, message: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
