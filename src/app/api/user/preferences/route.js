import { withAuth, handleError } from "@/src/utils/sessionHandler";
import {
  updateUserProfile,
  getFullUserByID,
} from "@/src/libs/user/userProfile";

export async function GET() {
  return withAuth(async (session) => {
    try {
      const user = await getFullUserByID(session.id);

      return Response.json({
        success: true,
        data: user?.preferences || {
          emailNotifications: true,
          courseUpdates: true,
          examReminders: true,
          marketingEmails: false,
        },
      });
    } catch (error) {
      return handleError(error);
    }
  });
}

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const data = await req.json().catch(() => null);
      if (!data || typeof data !== "object") {
        return Response.json(
          { success: false, message: "Invalid preferences data" },
          { status: 400 }
        );
      }
      await updateUserProfile(session.id, { preferences: data });

      return Response.json({
        success: true,
        message: "Preferences updated",
      });
    } catch (error) {
      return handleError(error);
    }
  });
}
