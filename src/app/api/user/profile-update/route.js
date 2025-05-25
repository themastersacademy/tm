import { userProfileSetup } from "@/src/libs/user/userProfile";
import { getSession } from "@/src/utils/serverSession";

export async function POST(req) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  const { name, phoneNumber, gender } = await req.json();
  console.log("session", session);
  try {
    const result = await userProfileSetup({
      userID: session.id,
      name,
      phoneNumber,
      gender,
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
