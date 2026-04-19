import { getCourse } from "@/src/libs/courses/courseController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async () => {
    try {
      const body = await req.json().catch(() => null);
      const { goalID, courseID } = body || {};
      if (!goalID && !courseID) {
        return Response.json(
          { success: false, message: "Missing goalID or courseID" },
          { status: 400 }
        );
      }
      const response = await getCourse({ goalID, courseID });
      return Response.json(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return handleError(error);
    }
  });
}
