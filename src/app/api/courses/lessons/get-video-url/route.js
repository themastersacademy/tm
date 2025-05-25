import { getLessonVideoURL } from "@/src/libs/courses/lessonsController";

export async function POST(req, res) {
  const { lessonID, courseID, enrollmentID } = await req.json();
  if (!lessonID || !courseID) {
    return Response.json({
      success: false,
      message: "Missing lessonID or courseID",
    });
  }
  try {
    const result = await getLessonVideoURL({ lessonID, courseID, enrollmentID });
    return Response.json(result);
  } catch (error) {
    console.error("Error fetching preview video URL:", error);
    return Response.json({
      success: false,
      message: "Failed to fetch preview video URL",
    });
  }
}
