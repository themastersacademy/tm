import { getUserBatches } from "@/src/libs/myClassroom/batchController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET() {
  return withAuth(async (session) => {
    try {
      const response = await getUserBatches(session.id);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
