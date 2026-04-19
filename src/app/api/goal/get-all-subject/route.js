import { getGoalSubjectList } from "@/src/libs/goal/goalController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async () => {
    try {
      const body = await req.json().catch(() => null);
      const goalID = body?.goalID;
      if (!goalID) {
        return Response.json(
          { success: false, message: "Goal ID is required" },
          { status: 400 }
        );
      }
      const goalSubjectList = await getGoalSubjectList(goalID);
      return Response.json(goalSubjectList);
    } catch (error) {
      return handleError(error);
    }
  });
}
