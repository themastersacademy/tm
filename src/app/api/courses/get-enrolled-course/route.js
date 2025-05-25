import { getAllEnrolledCourses } from "@/src/libs/courseEnrollment/courseEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(request) {
  const { goalID } = await request.json();
  if (!goalID) {
    return Response.json({ error: "Goal ID is required" }, { status: 400 });
  }
  return withAuth(async (session) => {
    try {
      const result = await getAllEnrolledCourses(session.id, goalID);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
