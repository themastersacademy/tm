import { getAllSubscriptionPlans } from "@/src/libs/proSubscription/subscriptionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function GET(request) {
  return withAuth(async (session) => {
    try {
      const plans = await getAllSubscriptionPlans();
      return Response.json(plans);
    } catch (error) {
      return handleError(error);
    }
  });
}
