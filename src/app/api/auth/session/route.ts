// ─────────────────────────────────────────────
// POST /api/auth/session
//
// Receives a Firebase ID token from the client,
// verifies it server-side using Google's JWKS,
// and sets a secure httpOnly session cookie.
//
// This is the only server-side auth endpoint needed —
// all actual auth happens in Firebase on the client.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase/verify-token";
import { createSession } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/resend";
import { welcomeEmail } from "@/lib/email/templates";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, isNewUser } = body as { idToken: string; isNewUser?: boolean };

    if (!idToken) {
      return NextResponse.json(
        { error: "Firebase ID token is required." },
        { status: 400 }
      );
    }

    const firebaseUser = await verifyFirebaseToken(idToken).catch((err) => {
      console.error("[Session] Token verification failed:", err);
      return null;
    });

    if (!firebaseUser) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }

    // Create our own session JWT (keeps middleware + getSession() unchanged)
    const sessionToken = await createSession({
      userId: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.name,
    });

    const response = NextResponse.json(
      {
        message: "Session created.",
        userId: firebaseUser.uid,
        name: firebaseUser.name,
      },
      { status: 200 }
    );

    response.cookies.set("pathwise_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Send welcome email for new registrations (fire-and-forget)
    if (isNewUser && firebaseUser.email) {
      const { subject, html } = welcomeEmail(firebaseUser.name);
      sendEmail({ to: firebaseUser.email, subject, html }).catch(() => {});
    }

    return response;
  } catch (err) {
    console.error("[Session] Error:", err);
    return NextResponse.json(
      { error: "Failed to create session. Please try again." },
      { status: 500 }
    );
  }
}
