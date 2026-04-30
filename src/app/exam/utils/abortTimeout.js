// Browser-compat timeout signal. Equivalent to AbortSignal.timeout(ms) but
// works on browsers that predate that API (Chrome <103, Safari <15.4).
// Returns a signal that aborts after `ms` milliseconds.
export function abortTimeout(ms) {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), ms);
  return controller.signal;
}
