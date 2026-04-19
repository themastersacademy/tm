import { getAllLessons } from "@/src/libs/courses/lessonsController";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const courseID = body?.courseID;
    if (!courseID) {
      return Response.json(
        { success: false, message: "Missing courseID" },
        { status: 400 }
      );
    }
    const lessons = await getAllLessons({ courseID });
    return Response.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return Response.json(
      { success: false, message: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
