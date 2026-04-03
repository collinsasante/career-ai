import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  TrendingUp,
  Star,
  Clock,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchScoreRing } from "@/components/ui/progress";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import { CareerIcon } from "@/components/ui/career-icon";
import { formatSalary, getMatchLabel } from "@/lib/utils";
import { getRecommendations } from "@/lib/airtable/client";
import { getStoredRecommendations } from "@/lib/agent/store";
import { RegenerateButton } from "@/components/app/regenerate-button";
import { RecommendationFeedback } from "@/components/app/recommendation-feedback";

// ─────────────────────────────────────────────
// Demand badge colours
// ─────────────────────────────────────────────
const demandColour: Record<string, string> = {
  very_high: "text-emerald-600",
  high: "text-blue-600",
  moderate: "text-amber-600",
  low: "text-slate-400",
};

const demandLabel: Record<string, string> = {
  very_high: "Very High Demand",
  high: "High Demand",
  moderate: "Moderate Demand",
  low: "Low Demand",
};

// ─────────────────────────────────────────────
// Empty state — shown before recommendations exist
// ─────────────────────────────────────────────
function NoRecommendations({ name }: { name: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-5">
        <Sparkles size={28} className="text-brand-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Welcome, {name.split(" ")[0]}
      </h2>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
        Complete your profile so PathWise can generate personalised AI career
        recommendations for you.
      </p>
      <Link href="/onboarding">
        <Button rightIcon={<ArrowRight size={15} />}>
          Build My Profile
        </Button>
      </Link>
      <p className="text-xs text-slate-400 mt-3">Your answers shape everything you see</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // 1. Try Airtable (persistent across restarts)
  let recommendations: {
    career_id: string;
    career_title: string;
    match_score: number;
    match_reasons: string[];
    matching_skills: string[];
    skill_gaps: string[];
  }[] = [];

  try {
    const airtableRecs = await getRecommendations(session.userId);
    recommendations = airtableRecs.map((r) => ({
      career_id:       r.careerId,
      career_title:    r.careerTitle,
      match_score:     r.matchScore,
      match_reasons:   r.matchReasons,
      matching_skills: r.matchingSkills,
      skill_gaps:      r.skillGaps,
    }));
  } catch {
    // 2. Fall back to in-memory store (same-process session)
    const stored = getStoredRecommendations(session.userId);
    recommendations = stored?.recommendations ?? [];
  }

  // No recommendations yet → show onboarding CTA
  if (recommendations.length === 0) {
    return <NoRecommendations name={session.name} />;
  }

  const profile = null; // profile stats come from recs now

  // Top recommendation
  const topRec = recommendations[0];
  const topCareer = CAREERS_DATA.find((c) => c.id === topRec.career_id);

  return (
    <div className="space-y-8 pb-8 pt-2 lg:pt-0 mt-4 lg:mt-0">

      {/* ── Welcome header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good day, {session.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {recommendations.length} AI-matched careers ·{" "}
            {recommendations[0]?.matching_skills?.length ?? 0} skills logged
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RegenerateButton />
          <Link href="/chat">
            <Button variant="outline" size="sm" rightIcon={<MessageCircle size={14} />}>
              Ask AI Advisor
            </Button>
          </Link>
          <Link href="/careers">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
              Explore careers
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "AI Matches",
            value: recommendations.length,
            icon: Sparkles,
            color: "text-brand-600",
            bg: "bg-brand-50",
          },
          {
            label: "Skills Logged",
            value: recommendations[0]?.matching_skills?.length ?? 0,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Top Match Score",
            value: `${topRec.match_score}%`,
            icon: Star,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Fields Covered",
            value: new Set(recommendations.map((r) =>
              CAREERS_DATA.find((c) => c.id === r.career_id)?.category
            )).size,
            icon: BookOpen,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main — AI Recommendations ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Your AI Career Matches
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Matched to your skills and interests
              </p>
            </div>
            <Link href="/careers" className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const career = CAREERS_DATA.find((c) => c.id === rec.career_id);
              const matchInfo = getMatchLabel(rec.match_score);

              return (
                <Link key={rec.career_id} href={`/careers/${rec.career_id}`}>
                  <Card hover padding="md" className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                        <CareerIcon careerId={rec.career_id} size={16} className="text-brand-600" />
                      </div>
                      <MatchScoreRing score={rec.match_score} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {rec.career_title}
                          </h3>
                          <span className={`text-xs font-medium ${matchInfo.color}`}>
                            {matchInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {i === 0 && <Badge variant="brand" size="sm">Top Match</Badge>}
                          {career && (
                            <span className={`text-xs font-medium ${demandColour[career.job_demand] ?? "text-slate-400"}`}>
                              {demandLabel[career.job_demand] ?? ""}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* AI reasons */}
                      {rec.match_reasons[0] && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {rec.match_reasons[0]}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {/* Matched skills */}
                        {rec.matching_skills.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-400">Have:</span>
                            {rec.matching_skills.slice(0, 2).map((s) => (
                              <span key={s} className="text-2xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                                {s}
                              </span>
                            ))}
                            {rec.matching_skills.length > 2 && (
                              <span className="text-2xs text-slate-400">+{rec.matching_skills.length - 2}</span>
                            )}
                          </div>
                        )}

                        {/* Skill gaps */}
                        {rec.skill_gaps.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-400">Build:</span>
                            {rec.skill_gaps.slice(0, 2).map((g) => (
                              <span key={g} className="text-2xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                                {g}
                              </span>
                            ))}
                            {rec.skill_gaps.length > 2 && (
                              <span className="text-2xs text-slate-400">+{rec.skill_gaps.length - 2} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Salary + time + feedback */}
                      <div className="flex items-center justify-between mt-2 gap-2">
                        {career && (
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-400">
                              {formatSalary(career.avg_salary_min, career.avg_salary_max)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Clock size={10} />
                              {career.time_to_ready}
                            </span>
                          </div>
                        )}
                        <RecommendationFeedback careerId={rec.career_id} />
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* AI Advisor CTA */}
          <Card padding="md" className="bg-gradient-to-br from-brand-600 to-brand-700 border-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white">AI Career Advisor</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Ask about skill gaps, career paths, interview prep, or anything career-related.
            </p>
            <Link href="/chat">
              <Button
                size="sm"
                fullWidth
                className="bg-white text-brand-700 hover:bg-slate-100 !text-brand-700"
              >
                Start a conversation
              </Button>
            </Link>
          </Card>

          {/* Top match overview */}
          {topCareer && (
            <Card padding="md" className="bg-brand-50 border-brand-100">
              <h3 className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
                Top Match Overview
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Career</span>
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-[60%] text-right">
                    {topCareer.title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">AI Score</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {topRec.match_score}% match
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Avg. Salary</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {formatSalary(topCareer.avg_salary_min, topCareer.avg_salary_max)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Job Demand</span>
                  <span className={`text-xs font-semibold ${demandColour[topCareer.job_demand] ?? "text-slate-600"}`}>
                    {demandLabel[topCareer.job_demand] ?? topCareer.job_demand}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Time to Ready</span>
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Clock size={11} />
                    {topCareer.time_to_ready}
                  </span>
                </div>
              </div>
              <Link href={`/careers/${topCareer.id}`} className="block mt-4">
                <Button variant="primary" fullWidth size="sm">
                  View Full Details
                </Button>
              </Link>
            </Card>
          )}

          {/* AI reasons for top match */}
          {topRec.match_reasons.length > 0 && (
            <Card padding="md">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Why {topRec.career_title}?
              </h3>
              <ul className="space-y-2">
                {topRec.match_reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-2xs">
                      {i + 1}
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link href="/chat">
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                    Ask why in the AI Advisor
                    <ChevronRight size={11} />
                  </button>
                </Link>
              </div>
            </Card>
          )}

          {/* Roadmap link */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Learning Roadmaps</h3>
              <BookOpen size={16} className="text-slate-300" />
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Step-by-step learning plans are available for every career match.
            </p>
            <Link href="/roadmap">
              <Button variant="outline" fullWidth size="sm" rightIcon={<ArrowRight size={14} />}>
                View My Roadmaps
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
