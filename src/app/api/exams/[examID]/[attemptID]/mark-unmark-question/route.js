import { toggleBookmark } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req, { params }) {
  const { attemptID } = await params;
  return withAuth(async (session) => {
    try {
      const { questionID, bookmarked } = await req.json();
      const result = await toggleBookmark(attemptID, questionID, bookmarked, session.id);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
