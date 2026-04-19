import { createProSubscription } from "@/src/libs/proSubscription/subscriptionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const { couponCode, subscriptionPlanID, billingInfoIndex } = body || {};

      if (
        subscriptionPlanID === undefined ||
        subscriptionPlanID === null ||
        billingInfoIndex === undefined ||
        billingInfoIndex === null
      ) {
        return Response.json(
          { success: false, message: "Missing required parameters" },
          { status: 400 }
        );
      }

      const result = await createProSubscription({
        userID: session.id,
        subscriptionPlanID,
        couponCode,
        billingInfoIndex,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
