// ─────────────────────────────────────────────
// POST /api/auth/forgot-password
//
// Uses the Firebase Identity Toolkit REST API with
// returnOobLink:true to get the reset URL without
// Firebase sending its own email, then delivers a
// branded email via Resend.
//
// Requires FIREBASE_WEB_API_KEY (same as NEXT_PUBLIC_FIREBASE_API_KEY)
// Always returns 200 to prevent email enumeration.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import { passwordResetEmail } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  let email = "";

  try {
    const body = await request.json();
    email = (body.email ?? "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) throw new Error("Firebase API key not configured.");

    // Use returnOobLink:true — Firebase returns the link without sending its own email.
    // This requires the Firebase project to have "Disable email sending" OFF in Auth settings,
    // but since we pass returnOobLink the email is suppressed on Firebase's side.
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email,
          returnOobLink: true,
        }),
      }
    );

    const data = await res.json().catch(() => ({})) as {
      oobLink?: string;
      email?: string;
      error?: { message?: string };
    };

    if (!res.ok) {
      const code = data.error?.message ?? "";
      if (code === "EMAIL_NOT_FOUND" || code === "USER_NOT_FOUND") {
        // Silently swallow — don't reveal account existence
        return NextResponse.json({ ok: true });
      }
      throw new Error(`Firebase REST error: ${code}`);
    }

    const resetLink = data.oobLink;
    if (!resetLink) throw new Error("No oobLink returned by Firebase.");

    const { subject, html } = passwordResetEmail("there", resetLink);
    await sendEmail({ to: email, subject, html });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ForgotPassword]", msg);
    // Always return 200 — never leak errors to the client
  }

  return NextResponse.json({ ok: true });
}
