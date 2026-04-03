import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — PathWise",
  description: "How PathWise collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-10"
        >
          <ArrowLeft size={15} />
          Back to PathWise
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated: 1 April 2025</p>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-8">

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">1. What This Policy Covers</h2>
            <p className="text-slate-600">
              This Privacy Policy explains how PathWise collects, uses, stores, and protects the
              personal information you provide when using our career-guidance platform. It applies to
              all users of PathWise, including the website, web app, and any associated services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">2. Information We Collect</h2>
            <p className="text-slate-600 font-medium mb-2">Information you provide directly:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Name and email address (account registration)</li>
              <li>Career profile data: skills, interests, work style, learning preferences, goals</li>
              <li>Messages sent to the AI Career Advisor</li>
              <li>Roadmap progress you record</li>
            </ul>
            <p className="text-slate-600 font-medium mt-4 mb-2">Information collected automatically:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Basic usage data (pages visited, features used) via anonymous analytics</li>
              <li>Error and performance data via Sentry (no personally identifiable information in stack traces)</li>
              <li>Session authentication tokens (stored in a secure, httpOnly cookie)</li>
            </ul>
            <p className="text-slate-600 mt-3">
              We do not collect payment information. PathWise does not currently have a paid tier.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>To generate career recommendations, roadmaps, and advisor responses personalised to your profile</li>
              <li>To save your progress and restore it across sessions and devices</li>
              <li>To send a one-time email verification when you register with email and password</li>
              <li>To monitor and fix errors and performance issues in the platform</li>
              <li>To improve recommendation quality over time (using anonymised, aggregated data only)</li>
            </ul>
            <p className="text-slate-600 mt-3">
              We do not use your data for advertising, and we do not sell or rent it to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">4. How Your Data Is Stored</h2>
            <p className="text-slate-600">
              Your profile and recommendation data is stored in Airtable, a cloud database provider.
              Authentication is handled by Firebase (Google). Both services are SOC 2 compliant.
              Data is stored in the United States unless otherwise specified by these providers.
            </p>
            <p className="text-slate-600 mt-3">
              AI advisor conversations are sent to Anthropic's API to generate responses. Anthropic's
              data handling is governed by their{" "}
              <a
                href="https://www.anthropic.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                Privacy Policy
              </a>
              . We do not store raw conversation messages beyond your current session.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">5. Data Retention</h2>
            <p className="text-slate-600">
              We retain your profile and recommendation data for as long as your account is active.
              If you delete your account, your personal data is permanently removed within 30 days.
              Anonymised, aggregated insights derived from your data (e.g. overall career popularity
              trends) may be retained indefinitely.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">6. Your Rights</h2>
            <p className="text-slate-600">You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Object to or restrict how we process your data</li>
              <li>Export your profile data in a machine-readable format</li>
            </ul>
            <p className="text-slate-600 mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:hello@pathwise.app" className="text-brand-600 hover:underline">
                hello@pathwise.app
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">7. Cookies</h2>
            <p className="text-slate-600">
              PathWise uses a single secure, httpOnly session cookie to keep you logged in. We do not
              use third-party advertising cookies or tracking pixels. If we introduce analytics
              cookies in the future, we will update this policy and request your consent.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">8. Children's Privacy</h2>
            <p className="text-slate-600">
              PathWise is not directed at children under 13. We do not knowingly collect personal
              information from anyone under 13. If we become aware that a child under 13 has provided
              us with personal information, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">9. Changes to This Policy</h2>
            <p className="text-slate-600">
              We may update this policy as PathWise evolves. When we make material changes, we will
              update the "Last updated" date above and, where appropriate, notify you by email.
              Continued use of PathWise after changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-slate-800 mb-3">10. Contact</h2>
            <p className="text-slate-600">
              Questions or concerns about your privacy? Email us at{" "}
              <a href="mailto:hello@pathwise.app" className="text-brand-600 hover:underline">
                hello@pathwise.app
              </a>
              .
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400">
            <Link href="/terms" className="hover:text-slate-600 underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
