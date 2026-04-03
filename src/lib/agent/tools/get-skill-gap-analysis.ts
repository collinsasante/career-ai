// ─────────────────────────────────────────────
// Tool: getSkillGapAnalysis
//
// Returns a factual skill gap between the user's
// current skills and a career's requirements.
// Uses stored AI recommendation data if available
// (Claude already computed the gaps) — otherwise
// does a direct string-match comparison.
// ─────────────────────────────────────────────

import type { ToolResult, SkillGapData } from "../types";
import { getStudentProfile } from "./get-student-profile";
import { resolveCareer } from "./get-career-details";
import { getStoredRecommendations } from "@/lib/agent/store";
import { computeSkillOverlap } from "@/lib/agent/recommend";
import { estimateGapTime } from "./helpers";

export async function getSkillGapAnalysis(
  userId: string,
  careerId: string
): Promise<ToolResult<SkillGapData>> {
  const career = resolveCareer(careerId);
  if (!career) {
    return {
      success: false,
      error: `Career "${careerId}" was not found in the PathWise library.`,
      source: "memory",
    };
  }

  const profileResult = await getStudentProfile(userId);
  if (!profileResult.success || !profileResult.data) {
    return {
      success: false,
      error: profileResult.error ?? "Could not load student profile.",
      source: "computed",
    };
  }

  // Check if Claude already computed the gap as part of recommendations
  const stored = getStoredRecommendations(userId);
  const aiRec = stored?.recommendations.find((r) => r.career_id === career.id);

  let matched: string[];
  let gaps: string[];
  let score: number;

  if (aiRec) {
    // Trust Claude's assessment
    matched = aiRec.matching_skills;
    gaps = aiRec.skill_gaps;
    score = aiRec.match_score;
  } else {
    // Fall back to direct skill string-matching
    const overlap = computeSkillOverlap(
      profileResult.data.skills,
      career.required_skills
    );
    matched = overlap.matched;
    gaps = overlap.gaps;
    // Derive a percentage from match ratio
    score =
      career.required_skills.length > 0
        ? Math.round((matched.length / career.required_skills.length) * 100)
        : 0;
  }

  const prioritySkills = gaps.slice(0, 5);

  return {
    success: true,
    data: {
      careerId: career.id,
      careerTitle: career.title,
      matchedSkills: matched,
      missingSkills: gaps,
      percentageFit: score,
      prioritySkills,
      timeEstimate: estimateGapTime(gaps.length),
    },
    source: aiRec ? "computed" : "memory",
  };
}
