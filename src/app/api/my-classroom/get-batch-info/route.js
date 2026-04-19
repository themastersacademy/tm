import { getBatchByCode } from "@/src/libs/myClassroom/batchController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async () => {
    try {
      const body = await req.json().catch(() => null);
      const batchCode = body?.batchCode;
      if (!batchCode) {
        return Response.json(
          { success: false, message: "Batch code is required" },
          { status: 400 }
        );
      }
      const response = await getBatchByCode(batchCode);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
