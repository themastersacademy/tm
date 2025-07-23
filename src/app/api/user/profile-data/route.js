import { getFullUserByID } from "@/src/libs/user/userProfile";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(req) {
  return withAuth(async (session) => {
    try {
      const userID = session.user.id;
      if (!userID) {
        return Response.json(
          { success: false, message: "User ID is required" },
          { status: 400 }
        );
      }

      const userProfileData = await getFullUserByID(userID);
      if (!userProfileData) {
        return Response.json(
          { success: false, message: "User profile data not found" },
          { status: 404 }
        );
      }

      return Response.json(
        {
          success: true,
          data: userProfileData,
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }, req);
}
