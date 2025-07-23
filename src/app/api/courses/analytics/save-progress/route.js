import { saveLessonProgress } from "@/src/libs/courseAnalytics/courseAnalyticsController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(request) {
  return withAuth(async (session) => {
    try {
      const { courseID, lessonProgress } = await request.json();

      if (!courseID || !lessonProgress) {
        return Response.json(
          {
            success: false,
            message: "Missing required fields",
          },
          { status: 400 }
        );
      }

      const result = await saveLessonProgress({
        userID: session.id,
        courseID,
        lessonProgress,
      });

      return Response.json(result, {
        status: result.success ? 200 : 500,
      });
    } catch (error) {
      return handleError(error);
    }
  });
}
