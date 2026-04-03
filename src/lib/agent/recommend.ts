// ─────────────────────────────────────────────
// PathWise — AI Recommendation Engine
//
// Replaces the old algorithmic scoring engine.
// Claude analyses a student profile against the
// full career library and returns ranked matches
// with genuine, reasoned assessments.
// ─────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

// ── Types ─────────────────────────────────────

export interface ProfileInput {
  program?: string;
  level?: string;
  interests: string[];
  skills: string[];
  weakAreas: string[];
  favoriteSubjects?: string[];
  workStyle: string;
  learningMode: string;
  availabilityPerWeek: string | number;
  careerGoals: string[];
  industries: string[];
}

export interface AIRecommendation {
  career_id: string;
  career_title: string;
  match_score: number;
  match_reasons: string[];
  matching_skills: string[];
  skill_gaps: string[];
}

// ── Prompt builders ───────────────────────────

function buildCareerList() {
  return CAREERS_DATA.map((c) => ({
    id: c.id,
    title: c.title,
    field: c.category,
    required_skills: c.required_skills,
    demand: c.job_demand,
    industries: c.industries,
    work_styles: c.work_styles,
    possible_roles: c.possible_roles,
  }));
}

function buildPrompt(profile: ProfileInput): string {
  const careerList = JSON.stringify(buildCareerList(), null, 2);

  return `You are a career guidance AI for PathWise.

Analyse the student profile below and return the top 8 most suitable careers from the provided career list.

Your analysis must be GROUNDED in the actual data:
- Cross-reference the student's skills with each career's required_skills
- Consider their interests, goals, and preferred industries
- Account for their work style preferences
- Be honest — a poor match should have a lower score even if the student is interested

Return ONLY a valid JSON array. No markdown, no explanation, no code fences. Just the raw array.

Each object must have exactly:
{
  "career_id": string,           // the career's id field
  "career_title": string,        // the career's title field
  "match_score": number,         // 0-100, your genuine assessment of fit
  "match_reasons": string[],     // exactly 2-3 specific, personalised reasons
  "matching_skills": string[],   // skills from profile that match required_skills
  "skill_gaps": string[]         // required_skills the student does NOT have yet
}

STUDENT PROFILE:
${JSON.stringify(profile, null, 2)}

AVAILABLE CAREERS:
${careerList}`;
}

// ── JSON extraction ───────────────────────────
// Claude may occasionally wrap with text — strip it safely.

function extractJSON(raw: string): AIRecommendation[] {
  const trimmed = raw.trim();

  // Try direct parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // Find the first [ ... ] block
    const start = trimmed.indexOf("[");
    const end = trimmed.lastIndexOf("]");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Could not extract valid JSON from response.");
  }
}

// ── Main export ───────────────────────────────

/**
 * Generate AI-powered career recommendations for a student profile.
 * Uses Claude to reason about fit — not arbitrary keyword weights.
 *
 * @param profile  The student's profile data
 * @param topN     How many recommendations to return (default: 8)
 */
export async function generateAIRecommendations(
  profile: ProfileInput,
  topN = 8
): Promise<AIRecommendation[]> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    system:
      "You are a precise career recommendation engine. You return only valid JSON arrays. Never add markdown or explanatory text around the JSON.",
    messages: [{ role: "user", content: buildPrompt(profile) }],
  });

  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "";

  const recommendations = extractJSON(rawText);

  // Sort by score descending and cap at topN
  return recommendations
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, topN);
}

// ── Skill analysis helper ─────────────────────
// Used by agent tools to get factual skill overlap
// without algorithmic scoring. Claude reasons about
// the data, not arbitrary weights.

export function computeSkillOverlap(
  profileSkills: string[],
  careerRequiredSkills: string[]
): { matched: string[]; gaps: string[] } {
  const lowerProfile = profileSkills.map((s) => s.toLowerCase());

  const matched = careerRequiredSkills.filter((req) => {
    const lowerReq = req.toLowerCase();
    return lowerProfile.some(
      (ps) => ps.includes(lowerReq) || lowerReq.includes(ps)
    );
  });

  const gaps = careerRequiredSkills.filter((req) => !matched.includes(req));

  return { matched, gaps };
}
