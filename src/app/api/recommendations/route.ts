// ─────────────────────────────────────────────
// POST /api/recommendations
//   Primary predictor: scikit-learn Python ML API
//   Fallback: Claude AI (if ML API is unavailable)
//   Persists results to Airtable + in-memory store
//
// GET /api/recommendations
//   Reads from Airtable first, falls back to in-memory
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getStoredRecommendations, saveRecommendations as saveToMemory } from "@/lib/agent/store";
import { generateMLRecommendations } from "@/lib/agent/ml-recommend";
import { generateAIRecommendations } from "@/lib/agent/recommend";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import { sanitiseStringArray, sanitiseString, sanitiseEnum } from "@/lib/sanitise";

const WORK_STYLES    = ["remote", "hybrid", "office", "flexible"] as const;
const LEARN_MODES    = ["self_paced", "structured", "bootcamp", "university", "mentorship"] as const;
const AVAILABILITIES = ["full_time", "part_time", "evenings", "weekends", "limited"] as const;
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import {
  getRecommendations as getFromAirtable,
  saveRecommendations as saveToAirtable,
} from "@/lib/airtable/client";
import type { ProfileInput } from "@/lib/agent/recommend";


// ── GET — return stored recommendations ───────

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  // Try Airtable first, fall back to in-memory store
  try {
    const airtableRecs = await getFromAirtable(session.userId);

    if (airtableRecs.length > 0) {
      const enriched = airtableRecs.map((r) => {
        const career = CAREERS_DATA.find((c) => c.id === r.careerId);
        return {
          career_id:       r.careerId,
          career_title:    r.careerTitle,
          match_score:     r.matchScore,
          match_reasons:   r.matchReasons,
          matching_skills: r.matchingSkills,
          skill_gaps:      r.skillGaps,
          demand:          career?.job_demand    ?? "moderate",
          salary_min:      career?.avg_salary_min ?? 0,
          salary_max:      career?.avg_salary_max ?? 0,
          time_to_ready:   career?.time_to_ready  ?? "Unknown",
          category:        career?.category       ?? "other",
          source:          r.source,
        };
      });
      return NextResponse.json({ data: enriched, generatedAt: airtableRecs[0].generatedAt, source: airtableRecs[0].source });
    }
  } catch (err) {
    console.warn("[Recommendations GET] Airtable unavailable, falling back to memory:", err);
  }

  // In-memory fallback
  const stored = getStoredRecommendations(session.userId);
  if (!stored) {
    return NextResponse.json({ data: [], generatedAt: null });
  }

  const enriched = stored.recommendations.map((r) => {
    const career = CAREERS_DATA.find((c) => c.id === r.career_id);
    return {
      career_id:       r.career_id,
      career_title:    r.career_title,
      match_score:     r.match_score,
      match_reasons:   r.match_reasons,
      matching_skills: r.matching_skills,
      skill_gaps:      r.skill_gaps,
      demand:          career?.job_demand    ?? "moderate",
      salary_min:      career?.avg_salary_min ?? 0,
      salary_max:      career?.avg_salary_max ?? 0,
      time_to_ready:   career?.time_to_ready  ?? "Unknown",
      category:        career?.category       ?? "other",
      source:          stored.source ?? "ml",
    };
  });

  return NextResponse.json({ data: enriched, generatedAt: stored.generatedAt, source: stored.source });
}

// ── POST — generate recommendations ────────────

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  // Rate limit
  const rl = checkRateLimit(session.userId, LIMITS.recommendations.limit, LIMITS.recommendations.windowMs);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${rl.resetInSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  let body: { profile: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body?.profile;
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "profile is required." }, { status: 400 });
  }

  // Sanitise all incoming profile fields
  const profile: ProfileInput = {
    interests:           sanitiseStringArray(raw.interests),
    skills:              sanitiseStringArray(raw.skills),
    weakAreas:           sanitiseStringArray(raw.weakAreas ?? raw.weak_areas),
    workStyle:           sanitiseEnum(raw.workStyle ?? raw.preferred_work_style, WORK_STYLES, "hybrid"),
    learningMode:        sanitiseEnum(raw.learningMode ?? raw.learning_mode, LEARN_MODES, "self_paced"),
    availabilityPerWeek: sanitiseEnum(raw.availabilityPerWeek ?? raw.availability, AVAILABILITIES, "part_time"),
    careerGoals:         sanitiseStringArray(raw.careerGoals ?? raw.career_goals),
    industries:          sanitiseStringArray(raw.industries ?? raw.industries_of_interest),
  };

  let recommendations = null;
  let source: "ml" | "claude" = "ml";

  // 1. Try scikit-learn ML API
  try {
    recommendations = await generateMLRecommendations(profile, 8);
  } catch (err) {
    console.warn("[Recommendations] ML API error:", err);
  }

  // 2. Fall back to Claude
  if (!recommendations || recommendations.length === 0) {
    source = "claude";
    try {
      recommendations = await generateAIRecommendations(profile, 8);
    } catch (err) {
      console.error("[Recommendations] Claude fallback failed:", err);
      return NextResponse.json(
        { error: "Could not generate recommendations. Ensure the ML API is running or ANTHROPIC_API_KEY is set." },
        { status: 500 }
      );
    }
  }

  // 3. Persist to Airtable
  try {
    await saveToAirtable(
      session.userId,
      recommendations.map((r) => ({
        careerId:       r.career_id,
        careerTitle:    r.career_title,
        matchScore:     r.match_score,
        matchReasons:   r.match_reasons,
        matchingSkills: r.matching_skills,
        skillGaps:      r.skill_gaps,
        source,
        generatedAt:    new Date().toISOString(),
      })),
      source
    );
  } catch (err) {
    console.warn("[Recommendations] Airtable save failed (continuing with in-memory):", err);
  }

  // 4. Always save to in-memory store (for same-request agent tool access)
  saveToMemory(session.userId, profile, recommendations, source);

  const enriched = recommendations.map((r) => {
    const career = CAREERS_DATA.find((c) => c.id === r.career_id);
    return {
      career_id:       r.career_id,
      career_title:    r.career_title,
      match_score:     r.match_score,
      match_reasons:   r.match_reasons,
      matching_skills: r.matching_skills,
      skill_gaps:      r.skill_gaps,
      demand:          career?.job_demand    ?? "moderate",
      salary_min:      career?.avg_salary_min ?? 0,
      salary_max:      career?.avg_salary_max ?? 0,
      time_to_ready:   career?.time_to_ready  ?? "Unknown",
      category:        career?.category       ?? "other",
      source,
    };
  });

  return NextResponse.json({
    message: `Recommendations generated (${source === "ml" ? "ML model" : "Claude AI"}).`,
    data: enriched,
    source,
  });
}
