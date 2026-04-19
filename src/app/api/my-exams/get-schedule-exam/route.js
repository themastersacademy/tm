import { getScheduledExamsByStudentID } from "@/src/libs/exams/examController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET() {
  return withAuth(async (session) => {
    try {
      const response = await getScheduledExamsByStudentID(session.id);
      return Response.json(response);
    } catch (error) {
      console.error("Direct exam fetch error:", error);
      return handleError(error);
    }
  });
}
