import { submitExam } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(request, { params }) {
  const { attemptID } = await params;
  if (!attemptID) {
    return Response.json(
      { success: false, message: "Attempt ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async (session) => {
    try {
      const body = await request.json().catch(() => ({}));
      const endedBy = body?.endedBy || "USER";
      const result = await submitExam(attemptID, endedBy, session.id);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
