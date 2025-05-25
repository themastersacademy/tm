import { toggleBookmark } from "@/src/libs/exams/attemptController";

export async function POST(req, { params }) {
  const { questionID, bookmarked } = await req.json();
  const { attemptID } = await params;
  try {
    const result = await toggleBookmark(attemptID, questionID, bookmarked);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
