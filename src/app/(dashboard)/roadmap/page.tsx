import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getRecommendations } from "@/lib/airtable/client";

export default async function RoadmapsIndexPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let recommendations: { careerId: string; careerTitle: string; matchScore: number }[] = [];

  try {
    const recs = await getRecommendations(session.userId);
    recommendations = recs.map((r) => ({
      careerId:    r.careerId,
      careerTitle: r.careerTitle,
      matchScore:  r.matchScore,
    }));
  } catch {
    // Airtable unavailable — show empty state
  }

  return (
    <div className="pb-8 pt-2 lg:pt-0 mt-4 lg:mt-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">My Learning Roadmaps</h1>
        <p className="text-sm text-slate-500">
          Personalised step-by-step learning plans for each of your matched careers,
          built around your existing skills and the gaps you need to close.
        </p>
      </div>

      {recommendations.length === 0 ? (
        /* No recommendations yet */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-brand-600" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">No roadmaps yet</p>
          <p className="text-xs text-slate-400 mb-6 max-w-xs">
            Complete onboarding to get AI career matches — each match comes with a personalised roadmap.
          </p>
          <Link href="/onboarding">
            <Button rightIcon={<ArrowRight size={14} />}>Build My Profile</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => {
            const career = CAREERS_DATA.find((c) => c.id === rec.careerId);
            return (
              <Link
                key={rec.careerId}
                href={`/roadmap/${rec.careerId}`}
                className="group bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-brand-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                      {rec.careerTitle}
                    </p>
                    {i === 0 && (
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded-md flex-shrink-0">
                        Top Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {career?.category ?? ""}
                    {career ? ` · ${career.time_to_ready}` : ""}
                    {" · "}
                    <span className="text-brand-600 font-medium">{rec.matchScore}% match</span>
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
