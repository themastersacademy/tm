import { getSession } from "@/src/utils/serverSession";
import { leaveBatch } from "@/src/libs/myClassroom/batchController";

export async function POST(req) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    return session.unauthorized();
  }
  if (!session.id) {
    return Response.json(
      {
        success: false,
        message: "User ID not found in session",
      },
      { status: 401 }
    );
  }

  const { batchID } = await req.json();
  if (!batchID) {
    return Response.json(
      {
        success: false,
        message: "Batch ID is required",
      },
      { status: 400 }
    );
  }

  const result = await leaveBatch(session.id, batchID);

  if (result.success) {
    return Response.json({ success: true, message: result.message });
  } else {
    return Response.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  }
}
