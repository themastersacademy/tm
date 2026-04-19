import { getValidCourseEnrollment } from "@/src/libs/courseEnrollment/courseEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const courseID = body?.courseID;
      if (!courseID) {
        return Response.json(
          { success: false, message: "Course ID is required" },
          { status: 400 }
        );
      }
      const courseEnrollment = await getValidCourseEnrollment(
        session.id,
        courseID
      );
      return Response.json(courseEnrollment);
    } catch (error) {
      return handleError(error);
    }
  });
}
