import { getLessonFileURL } from "@/src/libs/courses/lessonsController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";
export async function POST(req) {
  const { lessonID, courseID, enrollmentID } = await req.json();
  if (!lessonID || !courseID) {
    return Response.json({
      success: false,
      message: "Missing lessonID or courseID",
    });
  }
  return withAuth(async (session) => {
    try {
      const result = await getLessonFileURL({
        lessonID,
        courseID,
        enrollmentID,
        userID: session.user.id,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
