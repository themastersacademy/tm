import { leaveBatch } from "@/src/libs/myClassroom/batchController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const batchID = body?.batchID;
      if (!batchID) {
        return Response.json(
          { success: false, message: "Batch ID is required" },
          { status: 400 }
        );
      }
      const result = await leaveBatch(session.id, batchID);
      if (result?.success) {
        return Response.json({ success: true, message: result.message });
      }
      return Response.json(
        { success: false, message: result?.message || "Failed to leave batch" },
        { status: 400 }
      );
    } catch (error) {
      return handleError(error);
    }
  });
}
