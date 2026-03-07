const rateLimitMap = new Map();

const CLEANUP_INTERVAL = 60 * 1000; // Clean up every minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * In-memory rate limiter for serverless functions.
 * Note: This works per-instance. For production at scale,
 * consider using Redis or DynamoDB-based rate limiting.
 *
 * @param {string} key - Unique key (e.g., IP + endpoint)
 * @param {number} maxRequests - Max requests allowed in the window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, retryAfterMs: number }}
 */
export function checkRateLimit(key, maxRequests = 5, windowMs = 60000) {
  cleanup();
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

/**
 * Helper to extract client IP from request headers.
 */
export function getClientIP(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Rate limit response helper.
 */
export function rateLimitResponse(retryAfterMs) {
  return Response.json(
    { success: false, message: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
      },
    }
  );
}
