// ─────────────────────────────────────────────
// Tool: compareCareers
//
// Side-by-side comparison of 2–4 careers for the
// user. Pulls AI-generated scores from the store
// when available, otherwise computes skill overlap
// directly so the data is always factual.
// ─────────────────────────────────────────────

import type { ToolResult, CareerComparisonData, CareerComparisonEntry } from "../types";
import { getStudentProfile } from "./get-student-profile";
import { resolveCareer } from "./get-career-details";
import { getStoredRecommendations } from "@/lib/agent/store";
import { computeSkillOverlap } from "@/lib/agent/recommend";
import { formatSalaryRange, DEMAND_LABELS } from "./helpers";

export async function compareCareers(
  userId: string,
  careerIds: string[]
): Promise<ToolResult<CareerComparisonData>> {
  if (careerIds.length < 2) {
    return {
      success: false,
      error: "Please provide at least 2 career names or IDs to compare.",
      source: "computed",
    };
  }

  const resolvedCareers = careerIds
    .map((id) => resolveCareer(id))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  if (resolvedCareers.length < 2) {
    return {
      success: false,
      error: `Could not find enough matching careers in the PathWise library for: ${careerIds.join(", ")}.`,
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

  const stored = getStoredRecommendations(userId);
  const profileSkills = profileResult.data.skills;

  const entries: CareerComparisonEntry[] = resolvedCareers.map((career) => {
    // Prefer Claude's AI assessment from stored recommendations
    const aiRec = stored?.recommendations.find((r) => r.career_id === career.id);

    let matched: string[];
    let missing: string[];
    let score: number;

    if (aiRec) {
      matched = aiRec.matching_skills;
      missing = aiRec.skill_gaps;
      score = aiRec.match_score;
    } else {
      const overlap = computeSkillOverlap(profileSkills, career.required_skills);
      matched = overlap.matched;
      missing = overlap.gaps;
      score =
        career.required_skills.length > 0
          ? Math.round((matched.length / career.required_skills.length) * 100)
          : 0;
    }

    return {
      id: career.id,
      title: career.title,
      score,
      salaryMin: career.avg_salary_min,
      salaryMax: career.avg_salary_max,
      demandLevel: career.job_demand,
      matchedSkills: matched,
      missingSkills: missing,
      timeToReady: career.time_to_ready,
    };
  });

  // Sort best match first
  entries.sort((a, b) => b.score - a.score);
  const winner = entries[0];

  // Skills that appear in every compared career's requirements
  const allSkillSets = resolvedCareers.map((c) => c.required_skills);
  const commonSkills = allSkillSets[0].filter((skill) =>
    allSkillSets.every((set) =>
      set.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    )
  );

  const summary =
    `Based on your profile, **${winner.title}** is your strongest match at ${winner.score}% fit — ` +
    `${DEMAND_LABELS[winner.demandLevel] ?? winner.demandLevel} demand, ` +
    `${formatSalaryRange(winner.salaryMin, winner.salaryMax)} salary range, ` +
    `ready in ${winner.timeToReady}.` +
    (entries[1] ? ` ${entries[1].title} comes second at ${entries[1].score}%.` : "");

  return {
    success: true,
    data: {
      careers: entries,
      commonSkills,
      winner: winner.id,
      winnerTitle: winner.title,
      summary,
    },
    source: "computed",
  };
}
