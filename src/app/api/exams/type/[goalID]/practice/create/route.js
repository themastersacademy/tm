import { createPracticeExam } from "@/src/libs/exams/practiceExamController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { goalID } = await params;
  const { subjectID, difficultyLevel } = await req.json();
  return withAuth(async (session) => {
    console.log(subjectID, difficultyLevel, session);
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
