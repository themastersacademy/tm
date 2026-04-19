import { getGoalDetails } from "@/src/libs/home/goalDetailsController";
import { handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const goalID = body?.goalID;
    if (!goalID) {
      return Response.json(
        { success: false, message: "Goal ID is required" },
        { status: 400 }
      );
    }
    const goalDetails = await getGoalDetails(goalID);
    return Response.json(goalDetails);
  } catch (error) {
    return handleError(error);
  }
}
