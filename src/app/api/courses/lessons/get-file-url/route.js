import { getLessonFileURL } from "@/src/libs/courses/lessonsController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { lessonID, courseID, enrollmentID } = body || {};
      if (!lessonID || !courseID) {
        return Response.json(
          { success: false, message: "Missing lessonID or courseID" },
          { status: 400 }
        );
      }
      const result = await getLessonFileURL({
        lessonID,
        courseID,
        enrollmentID,
        userID: session.id,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
