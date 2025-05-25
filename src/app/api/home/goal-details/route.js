import { getGoalDetails } from "@/src/libs/home/goalDetailsController";

export async function POST(req) {
  const { goalID } = await req.json();
  try {
    const goalDetails = await getGoalDetails(goalID);
    return Response.json(goalDetails);
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
