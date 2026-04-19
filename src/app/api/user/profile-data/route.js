import { getFullUserByID } from "@/src/libs/user/userProfile";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET() {
  return withAuth(async (session) => {
    try {
      const userProfileData = await getFullUserByID(session.id);
      if (!userProfileData) {
        return Response.json(
          { success: false, message: "User profile data not found" },
          { status: 404 }
        );
      }

      return Response.json({
        success: true,
        data: userProfileData,
      });
    } catch (error) {
      return handleError(error);
    }
  });
}
