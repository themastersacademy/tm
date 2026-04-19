import { userProfileSetup } from "@/src/libs/user/userProfile";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { name, phoneNumber, gender } = body || {};
      const result = await userProfileSetup({
        userID: session.id,
        name,
        phoneNumber,
        gender,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
