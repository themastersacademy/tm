import { getValidProSubscription } from "@/src/libs/proSubscription/subscriptionController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";
import { NextResponse } from "next/server";

export async function GET(req) {
  return withAuth(async (session) => {
    try {
      const proSubscription = await getValidProSubscription(session.id);
      return NextResponse.json(proSubscription);
    } catch (error) {
      return handleError(error);
    }
  });
}
