import { updateBatchRollNo } from "@/src/libs/myClassroom/batchController";
import { getSession } from "@/src/utils/serverSession";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { batchID, rollNo } = await req.json();

    if (!batchID || !rollNo) {
      return NextResponse.json(
        { success: false, message: "Batch ID and Roll No are required" },
        { status: 400 }
      );
    }

    const result = await updateBatchRollNo(session.user.id, batchID, rollNo);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating roll number:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
