import { getGoalContent } from "@/src/libs/home/goalDetailsController";
import { handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const { goalID, blogID } = body || {};
    if (!goalID || !blogID) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
          data: null,
        },
        { status: 400 }
      );
    }
    const result = await getGoalContent({ goalID, blogID });
    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}
