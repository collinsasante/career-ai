// ─────────────────────────────────────────────
// Simple sliding-window rate limiter
//
// Works per-edge-instance (not globally distributed).
// Good enough for a beta product — upgrade to
// Upstash Redis when scaling horizontally.
// ─────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to avoid unbounded growth
let lastCleanup = Date.now();
function maybeCleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > windowMs) store.delete(key);
  }
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Check if a key is within its rate limit.
 *
 * @param key         - Unique identifier (e.g. userId or IP)
 * @param limit       - Max requests allowed per window
 * @param windowMs    - Window size in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  maybeCleanup(windowMs);

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // Start a fresh window
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= limit) {
    const resetInSeconds = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetInSeconds: Math.ceil((windowMs - (now - entry.windowStart)) / 1000),
  };
}

// Pre-configured limiters for common use cases
export const LIMITS = {
  chat:            { limit: 30,  windowMs: 60_000 },   // 30 messages/min
  recommendations: { limit: 5,   windowMs: 60_000 },   // 5 regen/min
  roadmap:         { limit: 10,  windowMs: 60_000 },   // 10 generations/min
} as const;
