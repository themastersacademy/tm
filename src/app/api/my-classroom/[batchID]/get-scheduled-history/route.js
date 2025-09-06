import { getScheduledExamAttemptsByUserID } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { batchID } = await params;
  return withAuth(async (session) => {
    try {
      const response = await getScheduledExamAttemptsByUserID(
        session.user.id,
        batchID
      );
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
