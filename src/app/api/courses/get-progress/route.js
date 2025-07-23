import { getLessonProgress } from "@/src/libs/courseAnalytics/courseAnalyticsController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(request) {
  return withAuth(async (session) => {
    try {
      const { courseID } = await request.json();
      if (!courseID) {
        return Response.json(
          {
            success: false,
            message: "Missing courseID",
          },
          { status: 400 }
        );
      }

      const result = await getLessonProgress({
        userID: session.id,
        courseID,
      });

      return Response.json(result, {
        status: result.success ? 200 : 500,
      });
    } catch (error) {
      return handleError(error);
    }
  });
}