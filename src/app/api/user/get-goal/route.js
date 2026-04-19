import { getAllGoalEnrollments } from "@/src/libs/goalEnrollment/goalEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET() {
  return withAuth(async (session) => {
    try {
      const goals = await getAllGoalEnrollments({ userID: session.id });
      return Response.json(goals);
    } catch (error) {
      return handleError(error);
    }
  });
}
