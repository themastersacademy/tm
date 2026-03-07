import { questionResponse } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { examID, attemptID } = await params;
  return withAuth(async (session) => {
    try {
      const { questionID, selectedOptions, blankAnswers, timeSpentMs } =
        await req.json();
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
