import { submitExam } from "@/src/libs/exams/attemptController";
import { withAuth, handleError } from "@/src/utils/sessionHandler";

export async function POST(request, { params }) {
  const { attemptID } = await params;
  if (!attemptID) {
    return Response.json(
      { success: false, message: "Attempt ID is required" },
      { status: 400 }
    );
  }
  return withAuth(async (session) => {
    try {
      const body = await request.json().catch(() => ({}));
      const endedBy = body?.endedBy || "USER";
      // Sanitize the client-supplied audit object: keep only known numeric
      // counters and the failed-question UUID list. Defends against a
      // malicious client trying to balloon the attempt row past DynamoDB's
      // 400KB item limit.
      const raw = body?.clientSessionStats || {};
      const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
      const arr = Array.isArray(raw.failedQuestionIDs)
        ? raw.failedQuestionIDs
            .filter((s) => typeof s === "string" && s.length < 64)
            .slice(0, 100)
        : [];
      const clientSessionStats = {
        totalRetryAttempts: num(raw.totalRetryAttempts),
        totalNetworkDrops: num(raw.totalNetworkDrops),
        totalOfflineMs: num(raw.totalOfflineMs),
        sessionDurationMs: num(raw.sessionDurationMs),
        finalPendingCount: num(raw.finalPendingCount),
        failedQuestionIDs: arr,
        recordedAt: Date.now(),
      };
      const result = await submitExam(attemptID, endedBy, session.id, clientSessionStats);
      return Response.json(result);
    } catch (error) {
      return handleError(error);
    }
  });
}
