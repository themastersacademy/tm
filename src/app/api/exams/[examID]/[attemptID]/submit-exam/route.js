import { submitExam } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(request, { params }) {
  const { attemptID } = await params;
  return withAuth(async (session) => {
    try {
      const { endedBy } = await request.json();
      const result = await submitExam(attemptID, endedBy, session.id);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
