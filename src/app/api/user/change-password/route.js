import { withAuth, handleError } from "@/src/utils/sessionHandler";
import { changePassword } from "@/src/libs/auth/auth";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const userID = session.user.id;
      const { oldPassword, newPassword } = await req.json();

      if (!newPassword || newPassword.length < 6) {
        return Response.json(
          {
            success: false,
            message: "Password must be at least 6 characters long",
          },
          { status: 400 }
        );
      }

      await changePassword({ userID, oldPassword, newPassword });

      return Response.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      return handleError(error);
    }
  }, req);
}
