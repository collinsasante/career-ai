// ─────────────────────────────────────────────
// PathWise — Email Templates
// Pure HTML strings — no external dep needed.
// ─────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://pathwise.mr-asanteeprog.workers.dev";

// ── Shared layout wrapper ──────────────────────
function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PathWise</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#4f46e5;border-radius:12px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <img src="${BASE_URL}/logo-white.png" width="18" height="18" alt="PathWise" style="display:block;margin:9px auto;" onerror="this.style.display='none'" />
                  </td>
                  <td style="padding-left:10px;font-size:16px;font-weight:600;color:#0f172a;vertical-align:middle;">PathWise</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:36px 36px 32px;">
                  ${content}
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} PathWise · You're receiving this because you have an account with us.
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">
                <a href="${BASE_URL}" style="color:#4f46e5;text-decoration:none;">pathwise.app</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Welcome email ──────────────────────────────
export function welcomeEmail(name: string): { subject: string; html: string } {
  const firstName = name.split(" ")[0] || name;

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Welcome to PathWise, ${firstName} 👋</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      We're glad you're here. PathWise helps you discover the right career path
      based on your skills, interests, and goals — with personalised roadmaps to
      get you there.
    </p>

    <!-- Steps -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ["1", "Complete your profile", "Tell us about your interests, skills, and goals so we can personalise your recommendations."],
        ["2", "Explore career matches", "See which careers fit you best, with a match score and detailed breakdown."],
        ["3", "Start your roadmap", "Get a step-by-step learning plan tailored to your current level and availability."],
      ].map(([num, title, desc]) => `
      <tr>
        <td style="padding:10px 0;vertical-align:top;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:32px;height:32px;background:#eef2ff;border-radius:50%;text-align:center;vertical-align:middle;font-size:13px;font-weight:700;color:#4f46e5;flex-shrink:0;">${num}</td>
              <td style="padding-left:12px;vertical-align:top;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0f172a;">${title}</p>
                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">${desc}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`).join("")}
    </table>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background:#4f46e5;border-radius:10px;">
          <a href="${BASE_URL}/dashboard" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
            Go to your dashboard →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
      Need help? Just reply to this email — we read every message.
    </p>
  `;

  return {
    subject: `Welcome to PathWise, ${firstName}!`,
    html: layout(content),
  };
}

// ── Password reset email ───────────────────────
export function passwordResetEmail(name: string, resetLink: string): { subject: string; html: string } {
  const firstName = name.split(" ")[0] || name;

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">Reset your password</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Hi ${firstName}, we received a request to reset the password for your PathWise account.
      Click the button below to choose a new one.
    </p>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#4f46e5;border-radius:10px;">
          <a href="${resetLink}" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
            Reset my password →
          </a>
        </td>
      </tr>
    </table>

    <!-- Expiry notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#fef9ec;border-radius:10px;border:1px solid #fde68a;">
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#92400e;">
          ⏱ This link expires in <strong>1 hour</strong>. If it expires, you can request a new one from the sign-in page.
        </td>
      </tr>
    </table>

    <!-- Fallback link -->
    <p style="margin:0 0 6px;font-size:13px;color:#64748b;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="margin:0 0 20px;font-size:12px;word-break:break-all;">
      <a href="${resetLink}" style="color:#4f46e5;text-decoration:none;">${resetLink}</a>
    </p>

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
      If you didn't request a password reset, you can safely ignore this email — your account is not at risk.
    </p>
  `;

  return {
    subject: "Reset your PathWise password",
    html: layout(content),
  };
}
