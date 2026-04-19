import { withAuth, handleError } from "@/src/utils/sessionHandler";
import { changePassword } from "@/src/libs/auth/auth";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { oldPassword, newPassword } = body || {};

      if (!oldPassword) {
        return Response.json(
          { success: false, message: "Current password is required" },
          { status: 400 }
        );
      }
      const { default: validatePasswordFn } = await import("@/src/utils/passwordValidator");
      if (!newPassword) {
        return Response.json(
          { success: false, message: "New password is required" },
          { status: 400 }
        );
      }
      const passwordCheck = validatePasswordFn(newPassword);
      if (!passwordCheck.isValid) {
        return Response.json(
          { success: false, message: passwordCheck.error },
          { status: 400 }
        );
      }

      await changePassword({ userID: session.id, oldPassword, newPassword });

      return Response.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      return handleError(error);
    }
  });
}
