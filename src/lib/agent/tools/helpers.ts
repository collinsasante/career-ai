// ─────────────────────────────────────────────
// Shared helpers for agent tools
// ─────────────────────────────────────────────

/**
 * Format a salary range as a human-readable string.
 * e.g. 70000, 140000 → "$70k–$140k"
 */
export function formatSalaryRange(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
  return `${fmt(min)}–${fmt(max)}`;
}

/**
 * Map a job_demand value to a human-readable label.
 */
export const DEMAND_LABELS: Record<string, string> = {
  very_high: "Very High",
  high: "High",
  moderate: "Moderate",
  low: "Low",
};

/**
 * Estimate time to close a skill gap based on the number of missing skills.
 */
export function estimateGapTime(missingCount: number): string {
  if (missingCount <= 2) return "1–2 months";
  if (missingCount <= 4) return "2–4 months";
  if (missingCount <= 7) return "4–8 months";
  if (missingCount <= 10) return "8–14 months";
  return "12–24 months";
}
