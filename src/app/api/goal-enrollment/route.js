import { getGoalEnrollment } from "@/src/libs/goalEnrollment/goalEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

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
      const response = await getGoalEnrollment({ userID: session.id, goalID });
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
