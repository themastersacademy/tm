import { getAllEnrolledCourses } from "@/src/libs/courseEnrollment/courseEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(request) {
  return withAuth(async (session) => {
    try {
      const body = await request.json().catch(() => null);
      const goalID = body?.goalID;
      if (!goalID) {
        return Response.json(
          { success: false, message: "Goal ID is required" },
          { status: 400 }
        );
      }
      const result = await getAllEnrolledCourses(session.id, goalID);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
