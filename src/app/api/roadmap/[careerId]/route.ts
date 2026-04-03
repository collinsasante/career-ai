// ─────────────────────────────────────────────
// GET  /api/roadmap/[careerId]
//   Returns a personalised roadmap for the authenticated user.
//   Checks Airtable cache first; generates via Claude if not found.
//   Also returns the user's progress (completed step IDs).
//
// POST /api/roadmap/[careerId]
//   Updates the user's progress for this career roadmap.
//   Body: { completedSteps: string[] }
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getRecommendations } from "@/lib/airtable/client";
import {
  getRoadmap,
  saveRoadmap,
  getProgress,
  saveProgress,
} from "@/lib/airtable/client";
import { generatePersonalizedRoadmap } from "@/lib/agent/roadmap-generator";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";


// ── GET ──────────────────────────────────────

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ careerId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { careerId } = await params;

  const career = CAREERS_DATA.find((c) => c.id === careerId);
  if (!career) {
    return NextResponse.json({ error: "Career not found." }, { status: 404 });
  }

  // 1. Fetch progress (always from Airtable)
  let completedSteps: string[] = [];
  try {
    completedSteps = await getProgress(session.userId, careerId);
  } catch {
    // non-fatal — user just has no progress yet
  }

  // 2. Check cache
  try {
    const cached = await getRoadmap(session.userId, careerId);
    if (cached) {
      return NextResponse.json({ data: { roadmap: cached, completedSteps } });
    }
  } catch {
    // cache miss or Airtable unavailable — continue to generation
  }

  // 3. Generate personalised roadmap via ML model
  //    Pull the user's matching skills and skill gaps from recommendations
  let matchingSkills: string[] = [];
  let skillGaps: string[] = [];
  let learningMode = "self_paced";
  let availability = "part_time";

  try {
    const recs = await getRecommendations(session.userId);
    const rec = recs.find((r) => r.careerId === careerId);
    if (rec) {
      matchingSkills = rec.matchingSkills;
      skillGaps      = rec.skillGaps;
    }
    // Profile data for personalisation hints
    const { getProfile } = await import("@/lib/airtable/client");
    const profile = await getProfile(session.userId);
    if (profile) {
      learningMode = profile.learningMode ?? "self_paced";
      availability = profile.availability ?? "part_time";
    }
  } catch {
    // proceed with defaults — roadmap will be less personalised but still valid
  }

  try {
    // 25-second timeout — edge functions cut off at 30s
    const timeoutMs = 25_000;
    const roadmap = await Promise.race([
      generatePersonalizedRoadmap({
        careerId,
        careerTitle:   career.title,
        matchingSkills,
        skillGaps,
        learningMode,
        availability,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeoutMs)
      ),
    ]);

    // Cache in Airtable (fire-and-forget — don't block response)
    saveRoadmap(session.userId, careerId, roadmap).catch(() => {});

    return NextResponse.json({ data: { roadmap, completedSteps } });
  } catch (err) {
    const isTimeout = err instanceof Error && err.message === "timeout";
    console.error("[Roadmap] Generation failed:", err);
    return NextResponse.json(
      {
        error: isTimeout
          ? "Roadmap generation timed out. Please try again."
          : "Could not generate roadmap. Make sure your ANTHROPIC_API_KEY is configured.",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}

// ── POST ─────────────────────────────────────

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ careerId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const { careerId } = await params;

  let body: { completedSteps?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const completedSteps = body?.completedSteps;
  if (!Array.isArray(completedSteps)) {
    return NextResponse.json({ error: "completedSteps must be an array." }, { status: 400 });
  }

  try {
    await saveProgress(session.userId, careerId, completedSteps);
    return NextResponse.json({ success: true, completedSteps });
  } catch (err) {
    console.error("[Roadmap Progress] Save failed:", err);
    return NextResponse.json({ error: "Failed to save progress." }, { status: 500 });
  }
}
