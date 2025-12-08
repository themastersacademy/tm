import { withAuth, handleError } from "@/src/utils/sessionHandler";
import {
  updateUserProfile,
  getFullUserByID,
} from "@/src/libs/user/userProfile";

export async function GET(req) {
  return withAuth(async (session) => {
    try {
      const userID = session.user.id;
      const user = await getFullUserByID(userID);

      return Response.json({
        success: true,
        data: user.preferences || {
          emailNotifications: true,
          courseUpdates: true,
          examReminders: true,
          marketingEmails: false,
        },
      });
    } catch (error) {
      return handleError(error);
    }
  }, req);
}

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const userID = session.user.id;
      const data = await req.json();

      // We need to update user preferences.
      // updateUserProfile in userProfile.js currently only updates specific fields.
      // We should update it or create a new function.
      // For now, let's assume we'll update userProfile.js to handle 'preferences'.

      await updateUserProfile(userID, { preferences: data });

      return Response.json({
        success: true,
        message: "Preferences updated",
      });
    } catch (error) {
      return handleError(error);
    }
  }, req);
}
