import { updateViolationCount } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { attemptID } = await params;
  if (!attemptID) {
    return Response.json(
      { success: false, message: "Attempt ID is required" },
      { status: 400 }
    );
  }

  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const count = body?.count;

      if (typeof count !== "number" || !Number.isFinite(count) || count < 0) {
        return Response.json(
          {
            success: false,
            message: "Count is required and must be a non-negative number",
          },
          { status: 400 }
        );
      }

      await updateViolationCount(attemptID, count, session.id);

      return Response.json({
        success: true,
        message: "Violation reported",
      });
    } catch (error) {
      return handleError(error);
    }
  });
}
