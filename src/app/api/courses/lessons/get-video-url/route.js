import { getLessonVideoURL } from "@/src/libs/courses/lessonsController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  const { lessonID, courseID, enrollmentID } = await req.json();
  if (!lessonID || !courseID || !enrollmentID) {
    return Response.json({
      success: false,
      message: "Missing lessonID, courseID, or enrollmentID",
    }, { status: 400 });
  }

  return withAuth(async (session) => {
    try {
      const result = await getLessonVideoURL({
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
