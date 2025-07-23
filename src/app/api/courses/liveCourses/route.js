import { getLiveCourses } from "@/src/libs/home/goalDetailsController";

export async function POST(request) {
  try {
    const { goalID } = await request.json();

    if (!goalID) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "goalID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await getLiveCourses(goalID);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
