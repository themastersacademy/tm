import { getAllLessons } from "@/src/libs/courses/lessonsController";

export async function POST(req, res) {
  const { courseID } = await req.json();
  if (!courseID) {
    return Response.json({ success: false, message: "Missing courseID" });
  }
  try {
    const lessons = await getAllLessons({ courseID });
    return Response.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return Response.json({
      success: false,
      message: "Failed to fetch lessons",
    });
  }
}
