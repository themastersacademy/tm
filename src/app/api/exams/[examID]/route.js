import {
  getExamByID,
  getPreviousAttempt,
} from "@/src/libs/exams/examController";
import { getSession } from "@/src/utils/serverSession";

export async function GET(req, { params }) {
  const { examID } = await params;
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

    // Check for active attempt
    try {
      const previousAttempt = await getPreviousAttempt(session.id, examID);
      if (previousAttempt && previousAttempt.status === "IN_PROGRESS") {
        response.data.activeAttempt = previousAttempt;
      }
    } catch (err) {
      console.error("Error fetching previous attempt:", err);
      // Don't fail the whole request if this optional check fails
    }

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
