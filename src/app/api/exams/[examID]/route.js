import {
  getExamByID,
  getPreviousAttempt,
} from "@/src/libs/exams/examController";
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
      const response = await getExamByID(examID);

      // Guard: getExamByID may return { success: false } when exam not found
      if (!response?.success || !response?.data) {
        return Response.json(response, { status: 404 });
      }

      // Check for active attempt — optional, never fail the whole request
      try {
        const previousAttempt = await getPreviousAttempt(session.id, examID);
        if (previousAttempt) {
          if (previousAttempt.status === "IN_PROGRESS") {
            response.data.activeAttempt = previousAttempt;
          } else if (previousAttempt.status === "COMPLETED") {
            response.data.completedAttempt = previousAttempt;
          }
        }
      } catch (err) {
        console.error("Error fetching previous attempt:", err?.message);
      }

      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
