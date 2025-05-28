import { getExamAttemptByID } from "@/src/libs/exams/examController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { examID, attemptID } = await params;
  if (!examID || !attemptID) {
    return Response.json({
      success: false,
      message: "Exam ID and attempt ID are required",
    });
  }
  return withAuth(async (session) => {
    try {
      const response = await getExamAttemptByID(attemptID, session.id);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
