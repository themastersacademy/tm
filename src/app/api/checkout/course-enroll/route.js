import { enrollInCourse } from "@/src/libs/courseEnrollment/courseEnrollController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const {
        courseID,
        goalID,
        couponCode,
        subscriptionPlanIndex,
        billingInfoIndex,
      } = await req.json();

      if (
        !courseID ||
        !goalID ||
        subscriptionPlanIndex === undefined ||
        subscriptionPlanIndex === null ||
        billingInfoIndex === undefined ||
        billingInfoIndex === null
      ) {
        return Response.json(
          { error: "Missing required parameters" },
          { status: 400 }
        );
      }

      const result = await enrollInCourse({
        userID: session.id,
        courseID,
        goalID,
        couponCode,
        subscriptionPlanIndex,
        billingInfoIndex,
      });

      return Response.json(result, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  });
}
