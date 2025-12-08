import { getAllGroupExamsByGroupID } from "@/src/libs/exams/examTypeController";
import { getSession } from "@/src/utils/serverSession";

export async function GET(req, { params }) {
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
  if (!goalID) {
    return Response.json(
      {
        success: false,
        message: "Group ID is required",
      },
      { status: 400 }
    );
  }
  try {
    const response = await getAllGroupExamsByGroupID(goalID);
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
