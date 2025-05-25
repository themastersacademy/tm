import { getAllGoalEnrollments } from "@/src/libs/goalEnrollment/goalEnrollController";
import { getSession } from "@/src/utils/serverSession";

export async function GET(req) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  const userID = session.id;
  try {
    const goals = await getAllGoalEnrollments({userID});
    return Response.json(goals);
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
