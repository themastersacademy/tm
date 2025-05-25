import { questionResponse } from "@/src/libs/exams/attemptController";

export async function POST(req, { params }) {
  const { examID, attemptID } = await params;
  const { questionID, selectedOptions, blankAnswers, timeSpentMs } =
    await req.json();
  try {
    const result = await questionResponse(
      attemptID,
      questionID,
      selectedOptions,
      blankAnswers,
      timeSpentMs
    );
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
