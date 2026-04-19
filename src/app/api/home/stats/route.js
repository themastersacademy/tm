import { withAuth, handleError } from "@/src/utils/sessionHandler";
import { getUserGoalStats } from "@/src/libs/home/statsController";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const goalID = body?.goalID;
      if (!goalID) {
        return Response.json(
          { success: false, message: "Goal ID is required" },
          { status: 400 }
        );
      }
      const stats = await getUserGoalStats(session.id, goalID);
      return Response.json(stats);
    } catch (error) {
      return handleError(error);
    }
  });
}
