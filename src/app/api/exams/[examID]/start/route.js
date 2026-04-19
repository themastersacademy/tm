import { startExam } from "@/src/libs/exams/examController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { examID } = await params;
  if (!examID) {
    return Response.json(
      { success: false, message: "Exam ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async (session) => {
    try {
      const response = await startExam({ userID: session.id, examID });
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
