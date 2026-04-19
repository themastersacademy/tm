import { getScheduledExamByBatch } from "@/src/libs/exams/examController";
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
      const response = await getScheduledExamByBatch(session.id, batchID);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
