import { verifyAndEnrollFreeCourse } from "@/src/libs/courseEnrollment/courseEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const { courseID, goalID } = await req.json();

      if (!courseID || !goalID) {
        return Response.json(
          {
            success: false,
            message: "Course ID and goal ID are required",
          },
          { status: 400 }
        );
      }

      const result = await verifyAndEnrollFreeCourse({
        userID: session.user.id,
        courseID,
        goalID,
      });
      return Response.json(result, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  });
}
