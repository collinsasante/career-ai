// Auth is handled client-side via Firebase SDK.
// Session creation happens at /api/auth/session.
import { NextResponse } from "next/server";


export async function POST() {
  return NextResponse.json(
    { error: "Use Firebase client SDK for authentication." },
    { status: 410 }
  );
}
