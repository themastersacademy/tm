import { createProSubscription } from "@/src/libs/proSubscription/subscriptionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const { couponCode, subscriptionPlanID, billingInfoIndex } =
        await req.json();

      if (
        subscriptionPlanID === undefined ||
        subscriptionPlanID === null ||
        billingInfoIndex === undefined ||
        billingInfoIndex === null
      ) {
        return Response.json(
          { error: "Missing required parameters" },
          { status: 400 }
        );
      }

      const result = await createProSubscription({
        userID: session.id,
        subscriptionPlanID,
        couponCode,
        billingInfoIndex,
      });
      console.log(result)

      return Response.json(result, { status: 200 });
    } catch (error) {
      console.log(error);
      
      return handleError(error);
    }
  });
}
