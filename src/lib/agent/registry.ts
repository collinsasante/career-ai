// ─────────────────────────────────────────────
// PathWise Agent — Tool Registry
//
// Maps each ToolName to its handler function.
// The runner uses this registry to execute tools
// without needing to import them individually.
// ─────────────────────────────────────────────

import type { ToolName, ToolResult } from "./types";
import { getStudentProfile } from "./tools/get-student-profile";
import { getTopCareerMatches } from "./tools/get-top-career-matches";
import { getCareerDetails } from "./tools/get-career-details";
import { getRoadmap } from "./tools/get-roadmap";
import { getSkillGapAnalysis } from "./tools/get-skill-gap-analysis";
import { compareCareers } from "./tools/compare-careers";
import { explainRecommendation } from "./tools/explain-recommendation";

// A single callable type that all tool handlers conform to
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToolHandler = (...args: any[]) => Promise<ToolResult<unknown>>;

export const TOOL_REGISTRY: Record<ToolName, ToolHandler> = {
  getStudentProfile: (userId: string) => getStudentProfile(userId),

  getTopCareerMatches: (userId: string, limit?: number) =>
    getTopCareerMatches(userId, limit),

  getCareerDetails: (careerId: string) => getCareerDetails(careerId),

  getRoadmap: (careerId: string) => getRoadmap(careerId),

  getSkillGapAnalysis: (userId: string, careerId: string) =>
    getSkillGapAnalysis(userId, careerId),

  compareCareers: (userId: string, careerIds: string[]) =>
    compareCareers(userId, careerIds),

  explainRecommendation: (userId: string, careerId: string) =>
    explainRecommendation(userId, careerId),
};
