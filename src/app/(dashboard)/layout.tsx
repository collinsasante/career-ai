import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AppSidebar } from "@/components/app/sidebar";
import { EmailVerificationBanner } from "@/components/app/email-verification-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
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
