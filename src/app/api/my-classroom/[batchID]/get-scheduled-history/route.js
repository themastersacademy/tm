import { getScheduledExamAttemptsByUserID } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { batchID } = await params;
  if (!batchID) {
    return Response.json(
      { success: false, message: "Batch ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async (session) => {
    try {
      const response = await getScheduledExamAttemptsByUserID(
        session.id,
        batchID
      );
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
