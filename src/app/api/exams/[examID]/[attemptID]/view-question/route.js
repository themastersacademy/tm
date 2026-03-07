import { viewQuestion } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { examID, attemptID } = await params;
  return withAuth(async (session) => {
    try {
      const { questionID } = await req.json();
      const result = await viewQuestion(attemptID, questionID, session.id);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
