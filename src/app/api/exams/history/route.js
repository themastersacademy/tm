import { getExamAttemptsByUserID } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const goalID = searchParams.get("goalID");
  return withAuth(async (session) => {
    try {
      const response = await getExamAttemptsByUserID(session.id, goalID);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
