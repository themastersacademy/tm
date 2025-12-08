import { withAuth, handleError } from "@/src/utils/sessionHandler";
import { getUserGoalStats } from "@/src/libs/home/statsController";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const { goalID } = await req.json();
      const userID = session.user.id;

      if (!goalID) {
        return Response.json({
          success: false,
          message: "Goal ID is required",
        });
      }

      const stats = await getUserGoalStats(userID, goalID);

      return Response.json(stats);
    } catch (error) {
      return handleError(error);
    }
  }, req);
}
