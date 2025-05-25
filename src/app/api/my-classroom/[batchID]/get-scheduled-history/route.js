import { getScheduledExamAttemptsByUserID } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { batchID } = await params;
  return withAuth(async (session) => {
    try {
      const response = await getScheduledExamAttemptsByUserID("5d1cf8de-b8f8-4b09-9dac-3c5fddddd659", batchID);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
