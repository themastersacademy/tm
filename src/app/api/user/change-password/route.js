import { withAuth, handleError } from "@/src/utils/sessionHandler";
import { changePassword } from "@/src/libs/auth/auth";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const userID = session.user.id;
      const { oldPassword, newPassword } = await req.json();

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
