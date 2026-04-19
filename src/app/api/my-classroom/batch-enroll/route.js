import { enrollStudent } from "@/src/libs/myClassroom/batchController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { batchCode, rollNo, tag } = body || {};
      if (!batchCode) {
        return Response.json(
          { success: false, message: "Batch code is required" },
          { status: 400 }
        );
      }
      const response = await enrollStudent(
        session.id,
        batchCode,
        rollNo,
        tag
      );
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
