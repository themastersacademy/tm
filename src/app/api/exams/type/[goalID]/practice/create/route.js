import { createPracticeExam } from "@/src/libs/exams/practiceExamController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { goalID } = await params;
  const { subjectID, difficultyLevel } = await req.json();
  return withAuth(async (session) => {
    if (session.user.accountType !== "PRO") {
      return Response.json({
        message: "Upgrade to PRO",
      });
    }
    try {
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
