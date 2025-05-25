import { seededShuffle } from "@/src/utils/seededShuffle";
import { getExamAttemptsByUserID } from "@/src/libs/exams/attemptController";
import { getSession } from "@/src/utils/serverSession";

// Shared auth wrapper
async function withAuth(handler) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  return handler(session);
}

// Consistent error handler
function handleError(error) {
  console.error("Exam History API Error:", error);
  return Response.json({
    success: false,
    message: error.message || "An unexpected error occurred",
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const goalID = searchParams.get("goalID");
  return withAuth(async (session) => {
    try {
      const response = await getExamAttemptsByUserID(session.id, goalID);
      return Response.json(response);
    } catch (error) {
      return handleError(error);
    }
  });
}

// export async function POST(req) {
//   const { seed, array } = await req.json();
//   const shuffledArray = seededShuffle(array, seed);
//   return Response.json({ shuffledArray });
// }
