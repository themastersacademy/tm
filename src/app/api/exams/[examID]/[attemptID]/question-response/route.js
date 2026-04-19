import { questionResponse } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { attemptID } = await params;
  if (!attemptID) {
    return Response.json(
      { success: false, message: "Attempt ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      if (!body || !body.questionID) {
        return Response.json(
          { success: false, message: "Invalid request body" },
          { status: 400 }
        );
      }
      const { questionID, selectedOptions, blankAnswers, timeSpentMs } = body;
      const result = await questionResponse(
        attemptID,
        questionID,
        selectedOptions,
        blankAnswers,
        timeSpentMs,
        session.id
      );
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
