import {
  createGoalEnrollment,
  getAllGoalEnrollments,
} from "@/src/libs/goalEnrollment/goalEnrollController";
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
      const response = await createGoalEnrollment({
        userID: session.id,
        goalID,
      });
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}

export async function GET() {
  return withAuth(async (session) => {
    try {
      const response = await getAllGoalEnrollments({ userID: session.id });
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
