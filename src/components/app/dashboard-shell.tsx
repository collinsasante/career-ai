"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./sidebar";
import { EmailVerificationBanner } from "./email-verification-banner";
import type { AuthSession } from "@/lib/types";

export function DashboardShell({
  session,
  children,
}: {
  session: AuthSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Onboarding is a full-screen standalone flow — skip the shell entirely
  if (pathname === "/onboarding") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      <EmailVerificationBanner />
      <div className="flex flex-1 min-h-0">
        <AppSidebar session={session} />
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
