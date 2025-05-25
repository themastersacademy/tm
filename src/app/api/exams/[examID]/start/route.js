import { getSession } from "@/src/utils/serverSession";
import { startExam } from "@/src/libs/exams/examController";

export async function GET(req, { params }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return Response.json({
      success: false,
      message: "Please log in to continue",
    });
  }
  const { examID } = await params;
  const userID = session.user.id;
  if (!examID || !userID) {
    return Response.json({
      success: false,
      message: "Exam ID and user ID are required",
    });
  }
  try {
    const response = await startExam({ userID, examID });
    return Response.json(response);
  } catch (error) {
    console.error("startExam error:", error);
    return Response.json({
      success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
