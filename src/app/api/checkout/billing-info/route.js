import {
  addBillingInfo,
  getBillingInfo,
  deleteBillingInfo,
  updateBillingInfo,
} from "@/src/libs/checkout/billingInfoController";
import { getSession } from "@/src/utils/serverSession";

// Shared auth wrapper
async function withAuth(handler) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return session.unauthorized("Please log in to continue");
  }
  return handler(session);
}

// Consistent error handler
function handleError(error) {
  console.error("BillingInfo API Error:", error);
  return Response.json({
    success: false,
    message: error.message || "An unexpected error occurred",
  });
}

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const { billingInfo } = await req.json();
      const result = await addBillingInfo({ billingInfo, userID: session.id });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}

export async function GET() {
  return withAuth(async (session) => {
    try {
      const result = await getBillingInfo({ userID: session.id });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}

export async function DELETE(req) {
  return withAuth(async (session) => {
    try {
      const { billingInfoID } = await req.json();
      const result = await deleteBillingInfo({
        userID: session.id,
        billingInfoID,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}

export async function PUT(req) {
  return withAuth(async (session) => {
    try {
      const { billingInfoID, billingInfo } = await req.json();
      const result = await updateBillingInfo({
        userID: session.id,
        billingInfoID,
        billingInfo,
      });
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
