// ─────────────────────────────────────────────
// Tool: getStudentProfile
// Fetches the user's profile from Airtable.
// Falls back to a demo profile in local dev.
// ─────────────────────────────────────────────

import { getProfile } from "@/lib/airtable/client";
import type { ToolResult, StudentProfileData } from "../types";

const DEMO_PROFILE: StudentProfileData = {
  userId:             "demo",
  interests:          ["technology", "problem solving", "data", "product design"],
  skills:             ["JavaScript", "Python", "SQL", "HTML/CSS", "React"],
  weakAreas:          ["machine learning", "system design", "cloud infrastructure"],
  workStyle:          "hybrid",
  learningMode:       "self_paced",
  availabilityPerWeek:"part_time",
  careerGoals:        ["build software products", "work at a tech company"],
  industries:         ["technology", "fintech", "startups"],
};

export async function getStudentProfile(
  userId: string
): Promise<ToolResult<StudentProfileData>> {
  if (userId === "demo") {
    return { success: true, data: { ...DEMO_PROFILE }, source: "memory" };
  }

  try {
    const profile = await getProfile(userId);

    if (!profile) {
      return {
        success: false,
        error: "Profile not found. The user may not have completed onboarding yet.",
        source: "database",
      };
    }

    return {
      success: true,
      source: "database",
      data: {
        userId:             profile.userId,
        interests:          profile.interests,
        skills:             profile.skills,
        weakAreas:          profile.weakAreas,
        workStyle:          profile.workStyle,
        learningMode:       profile.learningMode,
        availabilityPerWeek:profile.availability,
        careerGoals:        profile.careerGoals,
        industries:         profile.industries,
      },
    };
  } catch {
    // Airtable not reachable (missing env vars in local dev)
    return {
      success: true,
      data: { ...DEMO_PROFILE, userId },
      source: "memory",
      error: "Using demo profile — Airtable unavailable in this environment.",
    };
  }
}
