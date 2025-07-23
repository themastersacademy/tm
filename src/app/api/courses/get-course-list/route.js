import { getCourseList } from "@/src/libs/home/goalDetailsController";

export async function POST(req) {
  const { goalID } = await req.json();
  try {
    const courseList = await getCourseList(goalID);
    return Response.json(courseList);
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
