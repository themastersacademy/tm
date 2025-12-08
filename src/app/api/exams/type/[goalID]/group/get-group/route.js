import { getGroupExamByID } from "@/src/libs/exams/examTypeController";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req, { params }) {
  const session = await getSession();
  if (!session) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  const { goalID } = await params;
  const { groupID } = await req.json();
  if (!goalID || !groupID) {
    return Response.json(
      {
        success: false,
        message: "Group ID and Goal ID are required",
      },
      { status: 400 }
    );
  }
  try {
    const response = await getGroupExamByID(groupID, goalID);
    return Response.json(response);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
