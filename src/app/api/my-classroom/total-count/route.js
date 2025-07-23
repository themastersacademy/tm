import { getTotalClassroomJoins } from "@/src/libs/myClassroom/batchController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req) {
  return withAuth(async (session) => {
    try {
      const userID = session.user.id;
      const result = await getTotalClassroomJoins(userID);
      return Response.json(result, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  });
}

