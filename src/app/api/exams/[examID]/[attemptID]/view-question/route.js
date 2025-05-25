import { viewQuestion } from "@/src/libs/exams/attemptController";

export async function POST(req, { params }) {
  const { questionID } = await req.json();
  const { examID, attemptID } = await params;
  try {
    const result = await viewQuestion(attemptID, questionID);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
