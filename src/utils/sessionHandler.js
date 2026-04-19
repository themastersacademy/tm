import { getSession } from "@/src/utils/serverSession";

export async function withAuth(handler) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return Response.json(
      { success: false, message: "Please log in to continue" },
      { status: 401 }
    );
  }
  try {
    return await handler(session);
  } catch (error) {
    return handleError(error);
  }
}

export function handleError(error) {
  console.error("API Error:", error);
  const rawStatus = Number(error?.statusCode || error?.status);
  const status = Number.isFinite(rawStatus) && rawStatus >= 400 ? rawStatus : 500;
  return Response.json(
    {
      success: false,
      message: error?.message || "An unexpected error occurred",
    },
    { status }
  );
}
