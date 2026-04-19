import { createPracticeExam } from "@/src/libs/exams/practiceExamController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { goalID } = await params;
  if (!goalID) {
    return Response.json(
      { success: false, message: "Goal ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      if (!body) {
        return Response.json(
          { success: false, message: "Invalid request body" },
          { status: 400 }
        );
      }
      const { subjectID, difficultyLevel } = body;
      if (!subjectID || !difficultyLevel) {
        return Response.json(
          {
            success: false,
            message: "Subject ID and difficulty level are required",
          },
          { status: 400 }
        );
      }
      if (session.user?.accountType !== "PRO") {
        return Response.json(
          { success: false, message: "Upgrade to PRO" },
          { status: 403 }
        );
      }
      const result = await createPracticeExam({
        userID: session.id,
        goalID,
        subjectID,
        difficultyLevel,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
