import { submitExam } from "@/src/libs/exams/attemptController";

export async function POST(request, { params }) {
  const { attemptID } = await params;
  const { endedBy } = await request.json();

  try {
    const result = await submitExam(attemptID, endedBy);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
