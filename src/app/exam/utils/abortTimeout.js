// Browser-compat timeout signal. Equivalent to AbortSignal.timeout(ms) but
// works on browsers that predate that API (Chrome <103, Safari <15.4).
// Returns a signal that aborts after `ms` milliseconds, or `undefined` on
// extremely old browsers without AbortController (fetch will run without
// a client-side timeout — better than crashing the exam page).
export function abortTimeout(ms) {
  try {
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
      return AbortSignal.timeout(ms);
    }
    if (typeof AbortController === "undefined") return undefined;
    const controller = new AbortController();
    setTimeout(() => {
      try {
        // Some old browsers don't support DOMException; fall back to a
        // plain Error so abort() never throws.
        if (typeof DOMException !== "undefined") {
          controller.abort(new DOMException("Timeout", "TimeoutError"));
        } else {
          controller.abort();
        }
      } catch {
        try { controller.abort(); } catch {}
      }
    }, ms);
    return controller.signal;
  } catch {
    return undefined;
  }
}
