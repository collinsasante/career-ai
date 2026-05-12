import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProfile } from "@/lib/airtable/client";
import { buildStageRecommendation } from "@/lib/recommendation/stage-engine";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  try {
    const profile = await getProfile(session.userId);
    if (!profile) {
      return NextResponse.json({ data: null, message: "No profile found." });
    }

    const recommendation = buildStageRecommendation(profile);
    return NextResponse.json({ data: recommendation });
  } catch (err) {
    console.error("[StageRecommendations GET]", err);
    return NextResponse.json({ error: "Failed to generate stage recommendations." }, { status: 500 });
  }
}
