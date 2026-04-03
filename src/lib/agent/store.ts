// ─────────────────────────────────────────────
// PathWise — Recommendation Store
//
// Pure data store — NO AI/Anthropic imports here.
// This file is imported by server components (dashboard)
// so it must only contain plain data operations.
//
// AI generation happens exclusively in:
//   src/app/api/recommendations/route.ts  (Edge API)
// ─────────────────────────────────────────────

import type { AIRecommendation, ProfileInput } from "./recommend";

export interface StoredRecommendations {
  userId: string;
  recommendations: AIRecommendation[];
  profile: ProfileInput;
  generatedAt: string;
  source: "ml" | "claude";
}

// Module-level store — persists across requests in the same process.
// In production replace with a D1 read/write.
const store = new Map<string, StoredRecommendations>();

export function saveRecommendations(
  userId: string,
  profile: ProfileInput,
  recommendations: AIRecommendation[],
  source: "ml" | "claude" = "ml"
): void {
  store.set(userId, {
    userId,
    recommendations,
    profile,
    generatedAt: new Date().toISOString(),
    source,
  });
}

export function getStoredRecommendations(
  userId: string
): StoredRecommendations | null {
  return store.get(userId) ?? null;
}
