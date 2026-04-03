// ─────────────────────────────────────────────
// Input sanitisation utilities
// Used on all API routes that accept user-provided strings.
// ─────────────────────────────────────────────

const MAX_STRING_LEN   = 200;   // single text field
const MAX_ARRAY_ITEMS  = 30;    // max tags in any list field
const MAX_ITEM_LEN     = 100;   // each array item

/** Strip HTML/script tags and control characters from a string. */
function stripDangerous(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")                   // strip HTML tags
    .replace(/javascript:/gi, "")              // strip JS protocol
    .replace(/on\w+\s*=/gi, "")               // strip event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")  // strip control chars
    .trim();
}

/** Sanitise a single string field. */
export function sanitiseString(value: unknown, maxLen = MAX_STRING_LEN): string {
  if (typeof value !== "string") return "";
  return stripDangerous(value).slice(0, maxLen);
}

/** Sanitise an array of strings (tag lists, interests, skills, etc.). */
export function sanitiseStringArray(
  value: unknown,
  maxItems = MAX_ARRAY_ITEMS,
  maxItemLen = MAX_ITEM_LEN
): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, maxItems)
    .map((item) => stripDangerous(item).slice(0, maxItemLen))
    .filter((item) => item.length > 0);
}

/** Allowed values for enum-like fields. Falls back to default if value not in list. */
export function sanitiseEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  if (typeof value !== "string") return fallback;
  const clean = value.trim().toLowerCase();
  return (allowed as readonly string[]).includes(clean) ? (clean as T) : fallback;
}
