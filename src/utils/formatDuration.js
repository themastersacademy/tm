/**
 * Converts a duration in minutes to a human-readable string.
 * e.g. 90 → "1h 30m", 60 → "1 Hour", 45 → "45 min", 0 → "0m"
 *
 * @param {number} minutes - Duration stored in the DB (in minutes)
 * @returns {string}
 */
export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h === 1 ? "1 Hour" : `${h} Hours`}`;
  return `${h}h ${m}m`;
}
