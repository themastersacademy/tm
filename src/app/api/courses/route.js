import { getCourse } from "@/src/libs/courses/courseController";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }

  const { goalID, courseID } = await req.json();
  if (!goalID && !courseID) {
    return Response.json(
      {
        success: false,
        message: "Missing goalID or courseID",
      },
      { status: 400 }
    );
  }
  try {
    const response = await getCourse({ goalID, courseID });
    return Response.json(response);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}
