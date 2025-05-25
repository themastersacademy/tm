import { getValidCourseEnrollment } from "@/src/libs/courseEnrollment/courseEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  const { courseID } = await req.json();
  if (!courseID) {
    return Response.json({
      success: false,
      message: "Course ID is required",
    });
  }
  return withAuth(async (session) => {
    try {
      const courseEnrollment = await getValidCourseEnrollment(
        session.user.id,
        courseID
      );
      return Response.json(courseEnrollment);
    } catch (error) {
      return handleError(error);
    }
  });
}
