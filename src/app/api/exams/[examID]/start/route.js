import { startExam } from "@/src/libs/exams/examController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { examID } = await params;
  if (!examID) {
    return Response.json({
      success: false,
      message: "Exam ID is required",
    });
  }
  return withAuth(async (session) => {
    const userID = session.user.id;
    try {
      const response = await startExam({ userID, examID });
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
