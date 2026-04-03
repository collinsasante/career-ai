// ─────────────────────────────────────────────
// PathWise — Resend email sender
// ─────────────────────────────────────────────

import { Resend } from "resend";

// Update FROM_ADDRESS once you've verified a domain in Resend.
// Until then, use the Resend sandbox address for testing.
const FROM_ADDRESS = process.env.RESEND_FROM ?? "PathWise <onboarding@resend.dev>";

interface SendOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
