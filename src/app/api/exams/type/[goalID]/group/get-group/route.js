import { getGroupExamByID } from "@/src/libs/exams/examTypeController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { goalID } = await params;
  if (!goalID) {
    return Response.json(
      { success: false, message: "Goal ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async () => {
    try {
      const body = await req.json().catch(() => null);
      const groupID = body?.groupID;
      if (!groupID) {
        return Response.json(
          { success: false, message: "Group ID is required" },
          { status: 400 }
        );
      }
      const response = await getGroupExamByID(groupID, goalID);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}
