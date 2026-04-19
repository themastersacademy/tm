import { verifyAndEnrollFreeCourse } from "@/src/libs/courseEnrollment/courseEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { courseID, goalID } = body || {};

      if (!courseID || !goalID) {
        return Response.json(
          { success: false, message: "Course ID and goal ID are required" },
          { status: 400 }
        );
      }

      const result = await verifyAndEnrollFreeCourse({
        userID: session.id,
        courseID,
        goalID,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
