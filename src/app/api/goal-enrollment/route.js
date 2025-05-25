import { getGoalEnrollment } from "@/src/libs/goalEnrollment/goalEnrollController";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  const { goalID } = await req.json();
  try {
    const response = await getGoalEnrollment({ userID: session.id, goalID });
    return Response.json(response);
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
