import { getAllGroupExamsByGroupID } from "@/src/libs/exams/examTypeController";

export async function GET(req, { params }) {
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
    console.log("error", error);
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
