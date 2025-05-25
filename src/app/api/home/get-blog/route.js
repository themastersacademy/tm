import { getGoalContent } from "@/src/libs/home/goalDetailsController";

export async function POST(req) {
  const { goalID, blogID } = await req.json();

  if (!goalID || !blogID) {
    return Response.json({
      success: false,
      message: "Missing required fields",
      data: null,
    });
  }

  try {
    const result = await getGoalContent({ goalID, blogID });

    return Response.json(result);
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
      data: null,
    });
  }
}
