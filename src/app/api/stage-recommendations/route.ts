import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProfile } from "@/lib/airtable/client";
import { buildStageRecommendation } from "@/lib/recommendation/stage-engine";
import type { EducationStage } from "@/lib/types";

const VALID_STAGES: EducationStage[] = [
  "jhs_student", "shs_student", "tvet_student", "polytechnic_student",
  "university_student", "graduate", "working_professional", "career_switcher",
];

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  // The onboarding passes ?stage= directly so we don't rely on the Airtable
  // round-trip (the column may not exist yet and gets stripped by the write loop).
  const stageParam = request.nextUrl.searchParams.get("stage") as EducationStage | null;
  const overrideStage = stageParam && VALID_STAGES.includes(stageParam) ? stageParam : null;

  try {
    const profile = await getProfile(session.userId);
    if (!profile) {
      return NextResponse.json({ data: null, message: "No profile found." });
    }

    const effectiveProfile = overrideStage
      ? { ...profile, educationStage: overrideStage }
      : profile;

    const recommendation = buildStageRecommendation(effectiveProfile);
    return NextResponse.json({ data: recommendation });
  } catch (err) {
    console.error("[StageRecommendations GET]", err);
    return NextResponse.json({ error: "Failed to generate stage recommendations." }, { status: 500 });
  }
}
