import { getSession } from "@/src/utils/serverSession";

export async function withAuth(handler) {
  const session = await getSession();
  if (!session?.isAuthenticated) {
    return Response.json(
      { success: false, message: "Please log in to continue" },
      { status: 401 }
    );
  }
  try {
    return await handler(session);
  } catch (error) {
    return handleError(error);
  }
}

// Known business-logic error messages → proper HTTP status. These are NOT
// system errors; they're expected user-state rejections (exam not yet
// started, attempt already completed, etc). Mapping them to 4xx prevents
// log-spam at `error` level which otherwise fires monitoring alarms and
// drowns out real bugs.
const BUSINESS_ERROR_MAP = [
  // Exam attempt lifecycle
  { match: /attempt not found|exam attempt not found/i, status: 404, code: "ATTEMPT_NOT_FOUND" },
  { match: /already completed|exam attempt already completed/i, status: 409, code: "ATTEMPT_COMPLETED" },
  { match: /exam time has expired|exam attempt expired/i, status: 410, code: "ATTEMPT_EXPIRED" },
  // Exam scheduling window
  { match: /exam not started yet|not yet started/i, status: 425, code: "EXAM_NOT_STARTED" },
  { match: /exam ended|exam has ended/i, status: 410, code: "EXAM_ENDED" },
  // Auth / ownership
  { match: /not authorized|forbidden/i, status: 403, code: "FORBIDDEN" },
  // Validation
  { match: /required|invalid input|invalid request/i, status: 400, code: "BAD_REQUEST" },
];

function classifyError(error) {
  const msg = error?.message || "";
  for (const rule of BUSINESS_ERROR_MAP) {
    if (rule.match.test(msg)) {
      return { status: rule.status, code: rule.code, isBusiness: true };
    }
  }
  const rawStatus = Number(error?.statusCode || error?.status);
  if (Number.isFinite(rawStatus) && rawStatus >= 400 && rawStatus < 600) {
    return { status: rawStatus, code: "EXPLICIT", isBusiness: rawStatus < 500 };
  }
  return { status: 500, code: "INTERNAL_ERROR", isBusiness: false };
}

export function handleError(error) {
  const { status, code, isBusiness } = classifyError(error);
  // Business rejections: warn-level, no stack. Real errors: full error log.
  if (isBusiness) {
    console.warn(`API ${status} ${code}: ${error?.message || ""}`);
  } else {
    console.error("API Error:", error);
  }
  return Response.json(
    {
      success: false,
      code,
      message: error?.message || "An unexpected error occurred",
    },
    { status }
  );
}
