// Single source of truth for email normalization across the user app.
// DB invariant: every `email`, `GSI1-pKey`, `GSI1-sKey` value for a user row
// must equal `normalizeEmail(input)`. Use this helper at every entry point
// (API routes, NextAuth providers) before lookup, comparison, or write.
export function normalizeEmail(input) {
  return typeof input === "string" ? input.trim().toLowerCase() : "";
}
