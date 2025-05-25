import { getCourse } from "@/src/libs/courses/courseController";

export async function POST(req) {
  const { goalID, courseID } = await req.json();
  if (!goalID && !courseID) {
    return Response.json({
      success: false,
      message: "Missing goalID or courseID",
    });
  }
  try {
    const response = await getCourse({ goalID, courseID });
    return Response.json(response);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return Response.json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
}
