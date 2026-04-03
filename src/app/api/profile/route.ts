import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProfile, upsertProfile } from "@/lib/airtable/client";
import { sanitiseString, sanitiseStringArray, sanitiseEnum } from "@/lib/sanitise";

const WORK_STYLES   = ["remote", "hybrid", "office", "flexible"] as const;
const LEARN_MODES   = ["self_paced", "structured", "bootcamp", "university", "mentorship"] as const;
const AVAILABILITIES = ["full_time", "part_time", "evenings", "weekends", "limited"] as const;

export const runtime = "edge";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  try {
    const profile = await getProfile(session.userId);
    if (!profile) {
      return NextResponse.json({ data: null });
    }
    return NextResponse.json({ data: profile });
  } catch (err) {
    console.error("[Profile GET]", err);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    await upsertProfile({
      userId:       session.userId,
      name:         sanitiseString(body.name ?? session.name ?? "", 100),
      email:        session.email ?? "",
      interests:    sanitiseStringArray(body.interests),
      skills:       sanitiseStringArray(body.skills),
      weakAreas:    sanitiseStringArray(body.weak_areas ?? body.weakAreas),
      workStyle:    sanitiseEnum(body.preferred_work_style ?? body.workStyle, WORK_STYLES, "hybrid"),
      learningMode: sanitiseEnum(body.learning_mode ?? body.learningMode, LEARN_MODES, "self_paced"),
      availability: sanitiseEnum(body.availability, AVAILABILITIES, "part_time"),
      careerGoals:  sanitiseStringArray(body.career_goals ?? body.careerGoals),
      industries:   sanitiseStringArray(body.industries_of_interest ?? body.industries),
    });

    return NextResponse.json({ message: "Profile saved." }, { status: 200 });
  } catch (err) {
    console.error("[Profile POST]", err);
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }
}
