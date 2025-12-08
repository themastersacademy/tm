import { updateViolationCount } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { attemptID } = await params;

  return withAuth(async () => {
    try {
      const body = await req.json();
      const { count } = body;

      if (typeof count !== "number") {
        return Response.json({
          success: false,
          message: "Count is required and must be a number",
        });
      }

      await updateViolationCount(attemptID, count);

      return Response.json({
        success: true,
        message: "Violation reported",
      });
    } catch (error) {
      return handleError(error);
    }
  });
}
