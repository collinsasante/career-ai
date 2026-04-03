// ─────────────────────────────────────────────
// PathWise Agent — Intent Detection
//
// Deterministic, regex-based intent routing.
// No LLM call needed — cheap, fast, predictable.
//
// How it works:
//  1. Test the user message against pattern groups
//  2. Extract entity params (career names, IDs)
//  3. Return a list of tools to run and their params
// ─────────────────────────────────────────────

import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import type { DetectedIntent, ToolName } from "./types";

// ── Regex patterns per intent ─────────────────
const PATTERNS: Record<string, RegExp[]> = {
  getTopCareerMatches: [
    /what (career|job|path|field|profession|role)/i,
    /best (career|job|path|role) for me/i,
    /which career (suit|fit|match)/i,
    /career (recommendation|match|suggestion)/i,
    /what (should|can) i (do|become|pursue|study)/i,
    /top (career|job|path)/i,
    /right (career|path|field) for me/i,
    /career (for me|options|ideas)/i,
    /am i (suited|cut out) for/i,
    /don'?t know what (to do|career to)/i,
  ],

  getCareerDetails: [
    /tell me about (.+)/i,
    /what (is|does) .+ (do|involve|mean)/i,
    /how much (does|do) .+ (earn|make|pay)/i,
    /salary (for|of|in) .+/i,
    /what (are|is) the? (job|career|role|profession) (of|for|in) .+/i,
    /describe .+ (career|role|job|profession)/i,
    /what (can|do) .+ (do|work on|work as)/i,
    /what is .+ like/i,
    /interested in .+ (career|job|field|profession)/i,
  ],

  getRoadmap: [
    /how (do i|can i|to) become/i,
    /how (do i|can i|to) (get into|enter|break into|start in|start a career in)/i,
    /roadmap (for|to)/i,
    /learning path (for|to|in)/i,
    /what (should i|to|do i) (learn|study) (for|to become|to get into)/i,
    /steps (to become|to get into|for becoming)/i,
    /how long (does it take|to become|to get into)/i,
    /where (do i|should i) start (in|with|for)/i,
    /get started (in|with|as)/i,
    /plan (to become|for becoming|for .+)/i,
    /path (to become|to get into|to be)/i,
  ],

  getSkillGapAnalysis: [
    /skill.?gap/i,
    /what skills (am i missing|do i need|do i lack|are missing)/i,
    /missing (skills|qualifications|experience)/i,
    /what (do i need|skills|qualifications) (for|to become)/i,
    /how (ready|prepared|qualified|close) am i/i,
    /how far (am i|to go) (from|for|to)/i,
    /am i (ready|qualified|prepared|good enough) for/i,
    /skills (needed|required|for|to become)/i,
    /what (should|do) i (build|work on|develop) for/i,
  ],

  compareCareers: [
    /compare/i,
    /\bvs\.?\b|\bversus\b/i,
    /which (is better|should i choose|is best|would suit|fits me better)/i,
    /difference between .+ and .+/i,
    /between .+ and .+/i,
    /(better|worse) (for me|choice|option|fit)/i,
    /or .+ (career|field|profession|role|path)/i,
  ],

  explainRecommendation: [
    /why (was|is|am i|did you) .+ (recommended|suggested|matched)/i,
    /why (do you|did you) recommend/i,
    /explain (my|the) (match|recommendation|score|result)/i,
    /what makes me (a |good )?(match|fit|suitable) for/i,
    /why .+ (match|score|recommendation)/i,
    /how (did|does) .+ score/i,
    /reason (for|behind) (my|the) recommendation/i,
  ],
};

// ── Career name extractor ─────────────────────
// Scans the message for any career title from the library.

function extractCareerIds(message: string): string[] {
  const lower = message.toLowerCase();
  const found: string[] = [];

  for (const career of CAREERS_DATA) {
    const titleLower = career.title.toLowerCase();
    // Match on full title or first meaningful word (e.g. "lawyer" matches "Lawyer/Solicitor")
    const firstWord = titleLower.split(/[\s/]/)[0];
    if (
      lower.includes(titleLower) ||
      (firstWord.length > 4 && lower.includes(firstWord))
    ) {
      if (!found.includes(career.id)) {
        found.push(career.id);
      }
    }
  }

  return found;
}

// ── Intent scorer ─────────────────────────────
// Returns a score for how many patterns matched an intent.

function scoreIntent(message: string, intentKey: string): number {
  const patterns = PATTERNS[intentKey] ?? [];
  return patterns.filter((p) => p.test(message)).length;
}

// ── Main intent detection function ───────────

export function detectIntent(message: string): DetectedIntent {
  const tools: ToolName[] = [];
  const careerIds = extractCareerIds(message);

  // Score every intent
  const scores: Record<string, number> = {};
  for (const key of Object.keys(PATTERNS)) {
    scores[key] = scoreIntent(message, key);
  }

  const topIntent = Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  // ── Resolution logic ──────────────────────

  // Always useful as base context — run silently
  tools.push("getStudentProfile");

  if (scores.compareCareers > 0 && careerIds.length >= 2) {
    // Compare careers: need at least 2 identified careers
    tools.push("compareCareers");
    return { tools, params: { careerIds } };
  }

  if (scores.getSkillGapAnalysis > 0 && careerIds.length > 0) {
    tools.push("getSkillGapAnalysis");
    return { tools, params: { careerId: careerIds[0], careerIds } };
  }

  if (scores.explainRecommendation > 0 && careerIds.length > 0) {
    tools.push("explainRecommendation");
    return { tools, params: { careerId: careerIds[0] } };
  }

  if (scores.getRoadmap > 0 && careerIds.length > 0) {
    tools.push("getRoadmap");
    // Also load career details for context
    tools.push("getCareerDetails");
    return { tools, params: { careerId: careerIds[0] } };
  }

  if (scores.getCareerDetails > 0 && careerIds.length > 0) {
    tools.push("getCareerDetails");
    return { tools, params: { careerId: careerIds[0] } };
  }

  if (scores.getTopCareerMatches > 0) {
    tools.push("getTopCareerMatches");
    return { tools, params: { limit: 5 } };
  }

  // If a career is mentioned but no specific intent — fetch details
  if (careerIds.length > 0) {
    tools.push("getCareerDetails");
    return { tools, params: { careerId: careerIds[0] } };
  }

  // Fallback: nothing specific detected — preload matches so Claude can reference them
  if (!topIntent || scores[topIntent] === 0) {
    tools.push("getTopCareerMatches");
    return { tools, params: { limit: 3 } };
  }

  return { tools, params: {} };
}
