import { NextResponse } from "next/server";
import { getActiveAnnouncements } from "@/src/libs/homepage/homePageController";

export async function GET() {
  try {
    const result = await getActiveAnnouncements();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
