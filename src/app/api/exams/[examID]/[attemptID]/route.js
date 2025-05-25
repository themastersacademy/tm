import { getExamAttemptByID } from "@/src/libs/exams/examController";

export async function GET(req, { params }) {
  const { examID, attemptID } = await params;
  if (!examID || !attemptID) {
    return Response.json({
      success: false,
      message: "Exam ID and attempt ID are required",
    });
  }

  try {
    const response = await getExamAttemptByID(attemptID);

    return Response.json(response);
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
