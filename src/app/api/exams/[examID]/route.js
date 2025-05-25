import { getExamByID } from "@/src/libs/exams/examController";
import { getSession } from "@/src/utils/serverSession";

export async function GET(req, { params }) {
  const { examID } = await params;
  const session = await getSession();
  console.log("session", session);
  if (!examID) {
    return Response.json(
      {
        success: false,
        message: "Exam ID is required",
      },
      { status: 400 }
    );
  }
  try {
    const response = await getExamByID(examID);
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
