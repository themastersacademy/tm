import { getTotalClassroomJoins } from "@/src/libs/myClassroom/batchController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET() {
  return withAuth(async (session) => {
    try {
      const result = await getTotalClassroomJoins(session.id);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
