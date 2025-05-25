import { getExamAttemptsResult } from "@/src/libs/exams/attemptController";

export async function GET(req, { params }) {
  const { examID, attemptID } = await params;
  try {
    const result = await getExamAttemptsResult(attemptID);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
