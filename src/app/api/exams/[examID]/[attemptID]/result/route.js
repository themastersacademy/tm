import { getExamAttemptsResult } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { examID, attemptID } = await params;
  return withAuth(async (session) => {
    try {
      const result = await getExamAttemptsResult(attemptID, session.id);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
