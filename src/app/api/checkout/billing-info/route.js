import {
  addBillingInfo,
  getBillingInfo,
  deleteBillingInfo,
  updateBillingInfo,
} from "@/src/libs/checkout/billingInfoController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(req) {
  return withAuth(async (session) => {
    try {
      const body = await req.json().catch(() => null);
      const billingInfo = body?.billingInfo;
      if (!billingInfo) {
        return Response.json(
          { success: false, message: "Billing info is required" },
          { status: 400 }
        );
      }
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
      const body = await req.json().catch(() => null);
      const billingInfoID = body?.billingInfoID;
      if (!billingInfoID) {
        return Response.json(
          { success: false, message: "Billing info ID is required" },
          { status: 400 }
        );
      }
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
      const body = await req.json().catch(() => null);
      const { billingInfoID, billingInfo } = body || {};
      if (!billingInfoID || !billingInfo) {
        return Response.json(
          {
            success: false,
            message: "Billing info ID and data are required",
          },
          { status: 400 }
        );
      }
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
