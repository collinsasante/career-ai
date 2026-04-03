import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { saveFeedback } from "@/lib/airtable/client";
import { sanitiseEnum, sanitiseString } from "@/lib/sanitise";

export const runtime = "edge";

const RATINGS = ["helpful", "not_helpful"] as const;

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const careerId = sanitiseString(body.careerId, 100);
  const rating   = sanitiseEnum(body.rating, RATINGS, "helpful");

  if (!careerId) {
    return NextResponse.json({ error: "careerId is required." }, { status: 400 });
  }

  try {
    await saveFeedback(session.userId, careerId, rating);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Feedback] Save failed:", err);
    return NextResponse.json({ error: "Failed to save feedback." }, { status: 500 });
  }
}
