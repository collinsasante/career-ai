// ─────────────────────────────────────────────
// PathWise Agent — Tool Runner
//
// Orchestrates the full agent pipeline:
//  1. Detect intent from the user message
//  2. Run the relevant tools (in parallel where possible)
//  3. Build the AgentContext from tool results
//  4. Return the context so the route can build the prompt
//
// Nothing here calls Claude — the route.ts does that.
// This keeps the runner testable and decoupled.
// ─────────────────────────────────────────────

import { detectIntent } from "./intent";
import { buildSystemPrompt } from "./system-prompt";
import { getStudentProfile } from "./tools/get-student-profile";
import { getTopCareerMatches } from "./tools/get-top-career-matches";
import { getCareerDetails } from "./tools/get-career-details";
import { getRoadmap } from "./tools/get-roadmap";
import { getSkillGapAnalysis } from "./tools/get-skill-gap-analysis";
import { compareCareers } from "./tools/compare-careers";
import { explainRecommendation } from "./tools/explain-recommendation";
import type { AgentContext, ToolName, ChatApiMessage } from "./types";

// ── Parallel task runner ──────────────────────
// Runs all tool fetches in parallel where they are independent.
// Profile is always fetched — it's the base context for all other tools.

async function runTools(
  userId: string,
  tools: ToolName[],
  params: AgentContext["intent"]["params"]
): Promise<Omit<AgentContext, "userMessage" | "intent" | "contextBlock">> {
  const needs = (tool: ToolName) => tools.includes(tool);

  // Profile is always loaded (included by detectIntent)
  const profilePromise = getStudentProfile(userId);

  // These can run in parallel once we have profile data
  const [profileResult, matchesResult, detailsResult, roadmapResult] =
    await Promise.all([
      profilePromise,
      needs("getTopCareerMatches")
        ? getTopCareerMatches(userId, params.limit ?? 5)
        : Promise.resolve(null),
      needs("getCareerDetails") && params.careerId
        ? getCareerDetails(params.careerId)
        : Promise.resolve(null),
      needs("getRoadmap") && params.careerId
        ? getRoadmap(params.careerId)
        : Promise.resolve(null),
    ]);

  // Tools that depend on profile being loaded (skill gap, compare, explain)
  const profile = profileResult.data ?? null;

  const [gapResult, comparisonResult, explanationResult] = await Promise.all([
    needs("getSkillGapAnalysis") && params.careerId
      ? getSkillGapAnalysis(userId, params.careerId)
      : Promise.resolve(null),
    needs("compareCareers") && params.careerIds && params.careerIds.length >= 2
      ? compareCareers(userId, params.careerIds)
      : Promise.resolve(null),
    needs("explainRecommendation") && params.careerId
      ? explainRecommendation(userId, params.careerId)
      : Promise.resolve(null),
  ]);

  return {
    userId,
    profile,
    topMatches: matchesResult?.data ?? null,
    careerDetails: detailsResult?.data ?? null,
    roadmap: roadmapResult?.data ?? null,
    skillGap: gapResult?.data ?? null,
    comparison: comparisonResult?.data ?? null,
    explanation: explanationResult?.data ?? null,
  };
}

// ── Main runner export ────────────────────────

export interface RunnerOutput {
  systemPrompt: string;
  context: AgentContext;
}

/**
 * Run the full agent pipeline for a given user message.
 *
 * @param userId    - The authenticated user's ID
 * @param message   - The latest user message
 * @param _history  - Conversation history (available for future multi-turn tools)
 */
export async function runAgent(
  userId: string,
  message: string,
  _history: ChatApiMessage[] = []
): Promise<RunnerOutput> {
  // 1. Detect intent
  const intent = detectIntent(message);

  // 2. Run tools
  const toolData = await runTools(userId, intent.tools, intent.params);

  // 3. Assemble full context object
  const ctx: AgentContext = {
    ...toolData,
    userMessage: message,
    intent,
    contextBlock: "", // filled after prompt build
  };

  // 4. Build system prompt (uses ctx to format all tool results)
  const systemPrompt = buildSystemPrompt(ctx);
  ctx.contextBlock = systemPrompt; // stored for debugging if needed

  return { systemPrompt, context: ctx };
}
