import { updateBatchRollNo } from "@/src/libs/myClassroom/batchController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { batchID, rollNo } = body || {};
      if (!batchID || !rollNo) {
        return Response.json(
          { success: false, message: "Batch ID and Roll No are required" },
          { status: 400 }
        );
      }
      const result = await updateBatchRollNo(session.id, batchID, rollNo);
      return Response.json(result);
    } catch (error) {
      console.error("Error updating roll number:", error);
      return handleError(error);
    }
  });
}
