import { getAllMockExamByGoalID } from "@/src/libs/exams/examTypeController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req, { params }) {
  const { goalID } = await params;
  if (!goalID) {
    return Response.json(
      { success: false, message: "Goal ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async () => {
    try {
      const response = await getAllMockExamByGoalID(goalID);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
