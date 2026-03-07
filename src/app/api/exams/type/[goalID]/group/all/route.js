import { getAllGroupExamsByGoalID } from "@/src/libs/exams/examTypeController";
import { getSession } from "@/src/utils/serverSession";

export async function GET(req, { params }) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  const { goalID } = await params;
  if (!goalID) {
    return Response.json(
      {
        success: false,
        message: "Goal ID is required",
      },
      { status: 400 }
    );
  }
  try {
    const response = await getAllGroupExamsByGoalID(goalID);
    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
