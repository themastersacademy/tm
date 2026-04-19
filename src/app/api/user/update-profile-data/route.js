import { updateUserProfile } from "@/src/libs/user/userProfile";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { name, email, phoneNumber, gender } = body || {};
      const userProfileData = await updateUserProfile(session.id, {
        name,
        email,
        phoneNumber,
        gender,
      });
      return Response.json({
        success: true,
        message: "User profile data updated successfully",
        data: userProfileData,
      });
    } catch (error) {
      return handleError(error);
    }
  });
}
