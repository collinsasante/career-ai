// ─────────────────────────────────────────────
// Tool: getTopCareerMatches
//
// Returns the top career matches for a user.
// Prefers previously stored AI recommendations
// so we don't call Claude on every message.
// Falls back to generating fresh ones if needed.
// ─────────────────────────────────────────────

import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import { generateAIRecommendations } from "@/lib/agent/recommend";
import { getStoredRecommendations } from "@/lib/agent/store";
import type { ToolResult, CareerMatchData } from "../types";
import { getStudentProfile } from "./get-student-profile";
import type { ProfileInput } from "@/lib/agent/recommend";

function profileToInput(p: ReturnType<typeof Object.create>): ProfileInput {
  return {
    program: p.program,
    level: p.academicLevel,
    interests: p.interests,
    skills: p.skills,
    weakAreas: p.weakAreas,
    workStyle: p.workStyle,
    learningMode: p.learningMode,
    availabilityPerWeek: p.availabilityPerWeek,
    careerGoals: p.careerGoals,
    industries: p.industries,
  };
}

export async function getTopCareerMatches(
  userId: string,
  limit = 5
): Promise<ToolResult<CareerMatchData[]>> {
  try {
    // 1. Check if we have fresh stored recommendations from onboarding
    const stored = getStoredRecommendations(userId);

    let aiRecs = stored?.recommendations ?? null;

    // 2. If not stored, load profile and generate now
    if (!aiRecs) {
      const profileResult = await getStudentProfile(userId);
      if (!profileResult.success || !profileResult.data) {
        return {
          success: false,
          error: profileResult.error ?? "Could not load profile to generate recommendations.",
          source: "computed",
        };
      }
      aiRecs = await generateAIRecommendations(profileToInput(profileResult.data), 8);
    }

    // 3. Enrich with career library data (salary, demand, time_to_ready)
    const data: CareerMatchData[] = aiRecs
      .slice(0, limit)
      .map((r) => {
        const career = CAREERS_DATA.find((c) => c.id === r.career_id);
        return {
          careerId: r.career_id,
          title: r.career_title,
          category: career?.category ?? "other",
          score: r.match_score,
          matchingSkills: r.matching_skills,
          skillGaps: r.skill_gaps,
          reasons: r.match_reasons,
          demandLevel: career?.job_demand ?? "moderate",
          salaryMin: career?.avg_salary_min ?? 0,
          salaryMax: career?.avg_salary_max ?? 0,
          timeToReady: career?.time_to_ready ?? "Unknown",
        };
      });

    return { success: true, data, source: "computed" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to generate career matches.",
      source: "computed",
    };
  }
}
