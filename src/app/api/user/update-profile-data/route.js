import { NextResponse } from "next/server";
import { updateUserProfile } from "@/src/libs/user/userProfile";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const { name, email, phoneNumber, gender } = await req.json();
      const userID = session.user.id;
      if (!userID) {
        return NextResponse.json(
          { success: false, message: "User ID is required" },
          { status: 400 }
        );
      }
      const userProfileData = await updateUserProfile(userID, {
        name,
        email,
        phoneNumber,
        gender,
      });
      return NextResponse.json(
        {
          success: true,
          message: "User profile data updated successfully",
          data: userProfileData,
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }, req);
}
