import { getGoalSubjectList } from "@/src/libs/goal/goalController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  const { goalID } = await req.json();
  if (!goalID) {
    return Response.json({
      success: false,
      message: "Goal ID is required",
    });
  }
  return withAuth(async (session) => {
    try {
      const goalSubjectList = await getGoalSubjectList(goalID);
      return Response.json(goalSubjectList);
    } catch (error) {
      return handleError(error);
    }
  });
}
