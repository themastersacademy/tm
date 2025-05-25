import { getGoalList } from "@/src/libs/goal/goalController";

export async function GET(req) {
  try {
    const { success, message, data } = await getGoalList();
    return Response.json({ success, message, data }, { status: 200 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
