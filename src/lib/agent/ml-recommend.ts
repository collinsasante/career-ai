/**
 * PathWise — ML Recommendation Bridge
 * =====================================
 * Calls the Python scikit-learn API and maps its output to the
 * CareerRecommendation format used throughout the app.
 *
 * The Python API is the authoritative predictor.
 * Claude is used ONLY to explain results in the chat advisor.
 */

import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import type { AIRecommendation, ProfileInput } from "@/lib/agent/recommend";

type CareerRecommendation = AIRecommendation;

const ML_API_URL = process.env.ML_API_URL ?? "http://localhost:8000";

interface MLPrediction {
  career: string;
  score: number;
  reasoning: string[];
}

interface MLResponse {
  top_predictions: MLPrediction[];
}

/**
 * Map a ProfileInput to the flat object the Python API expects.
 * The ML API uses camelCase field names matching the original profile schema.
 */
function profileToMLInput(profile: ProfileInput): Record<string, unknown> {
  return {
    interests:           profile.interests ?? [],
    skills:              profile.skills ?? [],
    weakAreas:           profile.weakAreas ?? [],
    workStyle:           profile.workStyle ?? "hybrid",
    learningMode:        profile.learningMode ?? "self_paced",
    availabilityPerWeek: profile.availabilityPerWeek ?? "part_time",
    careerGoals:         profile.careerGoals ?? [],
    industries:          profile.industries ?? [],
  };
}

/**
 * Find a career in CAREERS_DATA by its title.
 * Tries exact match first, then case-insensitive, then partial.
 */
function findCareerByTitle(title: string) {
  const lower = title.toLowerCase();
  return (
    CAREERS_DATA.find((c) => c.title.toLowerCase() === lower) ??
    CAREERS_DATA.find((c) => c.title.toLowerCase().includes(lower)) ??
    CAREERS_DATA.find((c) => lower.includes(c.title.toLowerCase()))
  );
}

/**
 * Compute which of the student's skills appear in the career's required skills,
 * and which required skills are missing.
 */
function computeSkillOverlapForCareer(
  careerTitle: string,
  profileSkills: string[]
): { matching: string[]; gaps: string[] } {
  const career = findCareerByTitle(careerTitle);
  if (!career) return { matching: [], gaps: [] };

  const required: string[] = (career as unknown as Record<string, unknown>).required_skills as string[] ?? [];
  const profileLower = profileSkills.map((s) => s.toLowerCase());

  const matching = required.filter((r) =>
    profileLower.some((p) => p.includes(r.toLowerCase()) || r.toLowerCase().includes(p))
  );
  const gaps = required.filter(
    (r) => !profileLower.some((p) => p.includes(r.toLowerCase()) || r.toLowerCase().includes(p))
  ).slice(0, 5);

  return { matching, gaps };
}

/**
 * Call the Python ML API and return recommendations in CareerRecommendation format.
 * Returns null if the ML API is unreachable (caller should fall back to Claude).
 */
export async function generateMLRecommendations(
  profile: ProfileInput,
  topN = 8
): Promise<CareerRecommendation[] | null> {
  const input = profileToMLInput(profile);

  let response: Response;
  try {
    response = await fetch(`${ML_API_URL}/predict?top_n=${topN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(8000), // 8s timeout
    });
  } catch {
    console.warn("[ML] Python API unreachable — falling back to Claude.");
    return null;
  }

  if (!response.ok) {
    console.warn(`[ML] Python API returned ${response.status} — falling back to Claude.`);
    return null;
  }

  const data: MLResponse = await response.json();
  const profileSkills = profile.skills ?? [];

  const recommendations: CareerRecommendation[] = data.top_predictions
    .map((pred) => {
      const career = findCareerByTitle(pred.career);
      if (!career) return null;

      const { matching, gaps } = computeSkillOverlapForCareer(pred.career, profileSkills);

      // Convert ML score (0–1) to percentage (0–100)
      const matchScore = Math.round(pred.score * 100);

      return {
        career_id:       career.id,
        career_title:    career.title,
        match_score:     matchScore,
        match_reasons:   pred.reasoning,  // ML feature-importance reasoning
        matching_skills: matching,
        skill_gaps:      gaps,
      } satisfies CareerRecommendation;
    })
    .filter((r): r is CareerRecommendation => r !== null);

  return recommendations.length > 0 ? recommendations : null;
}
