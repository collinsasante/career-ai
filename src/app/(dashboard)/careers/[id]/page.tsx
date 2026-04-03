import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  TrendingUp,
  Star,
  BookOpen,
  Wrench,
  Users,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MatchScoreRing } from "@/components/ui/progress";
import {
  CAREERS_DATA,
} from "@/lib/recommendation/careers-data";
import { CareerIcon } from "@/components/ui/career-icon";
import { formatSalary, getJobDemandLabel, getMatchLabel } from "@/lib/utils";
import { getSession } from "@/lib/auth/session";
import { getRecommendations } from "@/lib/airtable/client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const career = CAREERS_DATA.find((c) => c.id === id);
  if (!career) return {};
  return {
    title: `${career.title} - Career Path`,
    description: career.description,
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { id } = await params;
  const career = CAREERS_DATA.find((c) => c.id === id);
  if (!career) notFound();

  const demand = getJobDemandLabel(career.job_demand);

  // Compute a simple phase overview from the career's required skills
  // (not hardcoded — derived from live career data)
  const skills = career.required_skills;
  const chunk  = Math.ceil(skills.length / 4);
  const roadmapPreview = [
    { id: "p1", phaseNumber: 1, title: "Foundations",         durationWeeks: 4,  skillsCovered: skills.slice(0, chunk) },
    { id: "p2", phaseNumber: 2, title: "Core Skills",         durationWeeks: 6,  skillsCovered: skills.slice(chunk, chunk * 2) },
    { id: "p3", phaseNumber: 3, title: "Advanced Practice",   durationWeeks: 6,  skillsCovered: skills.slice(chunk * 2, chunk * 3) },
    { id: "p4", phaseNumber: 4, title: "Portfolio & Job Prep", durationWeeks: 4, skillsCovered: skills.slice(chunk * 3) },
  ].filter((p) => p.skillsCovered.length > 0);
  const totalPreviewWeeks = roadmapPreview.reduce((a, p) => a + p.durationWeeks, 0);

  // Fetch real recommendation data for this career
  let matchScore: number | null = null;
  let matchReasons: string[] = [];
  let matchingSkills: string[] = [];
  let skillGaps: string[] = [];

  try {
    const session = await getSession();
    if (session) {
      const recs = await getRecommendations(session.userId);
      const rec = recs.find((r) => r.careerId === career.id);
      if (rec) {
        matchScore = rec.matchScore;
        matchReasons = rec.matchReasons;
        matchingSkills = rec.matchingSkills;
        skillGaps = rec.skillGaps;
      }
    }
  } catch {
    // No recommendation data available
  }

  const matchInfo = matchScore !== null ? getMatchLabel(matchScore) : null;

  // Skills the user doesn't have yet (from career required skills, excluding matching)
  const skillsToLearn = matchScore !== null
    ? career.required_skills.filter(
        (s) => !matchingSkills.some((m) => m.toLowerCase() === s.toLowerCase())
      )
    : career.required_skills;

  return (
    <div className="pb-12 pt-2 lg:pt-0 mt-4 lg:mt-0">
      <Link
        href="/careers"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        Back to Career Library
      </Link>

      {/* Hero section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <CareerIcon careerId={career.id} size={18} className="text-brand-600" />
              </div>
              <Badge variant="brand">{career.category}</Badge>
              <Badge
                variant={
                  career.job_demand === "very_high" || career.job_demand === "high"
                    ? "emerald"
                    : "amber"
                }
                dot
              >
                {demand.label}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {career.title}
            </h1>

            <p className="text-slate-500 leading-relaxed mb-6">
              {career.overview}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-3.5">
                <p className="text-xs text-slate-400 font-medium mb-1">Average Salary</p>
                <p className="text-base font-bold text-slate-900">
                  {formatSalary(career.avg_salary_min, career.avg_salary_max)}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5">
                <p className="text-xs text-slate-400 font-medium mb-1">Time to Job-Ready</p>
                <p className="text-base font-bold text-slate-900 flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" />
                  {career.time_to_ready}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3.5">
                <p className="text-xs text-slate-400 font-medium mb-1">Job Market Demand</p>
                <p className={`text-base font-bold flex items-center gap-1 ${demand.color}`}>
                  <TrendingUp size={14} />
                  {career.job_demand.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Match score + actions */}
          <div className="flex flex-col items-center gap-4 md:min-w-44">
            {matchScore !== null && matchInfo ? (
              <div className="bg-slate-50 rounded-2xl p-6 text-center w-full">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Your Match Score
                </p>
                <MatchScoreRing score={matchScore} size="lg" className="mx-auto mb-2" />
                <p className={`text-sm font-semibold mt-2 ${matchInfo.color}`}>
                  {matchInfo.label}
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 text-center w-full">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Match Score
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Complete onboarding to see your match
                </p>
              </div>
            )}
            <Link href={`/roadmap/${career.id}`} className="w-full">
              <Button fullWidth rightIcon={<BookOpen size={15} />}>
                View Roadmap
              </Button>
            </Link>
            <Button fullWidth variant="outline" leftIcon={<Star size={15} />}>
              Save Career
            </Button>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Why it matches — only shown if real data exists */}
          {matchReasons.length > 0 && (
            <Card padding="md">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-brand-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Why This Path Fits You
                </h2>
              </div>
              <ul className="space-y-3">
                {matchReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                    <p className="text-sm text-slate-600 leading-relaxed">{reason}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Skills analysis */}
          <Card padding="md">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Skills Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">
                  Skills You Have
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchingSkills.length > 0 ? (
                    matchingSkills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">Complete your profile to see matched skills</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">
                  Skills to Develop
                </p>
                <div className="flex flex-wrap gap-2">
                  {(skillGaps.length > 0 ? skillGaps : skillsToLearn).slice(0, 6).map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Tools */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Wrench size={16} className="text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Tools & Technologies</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {career.tools.map((tool) => (
                <span key={tool} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
                  {tool}
                </span>
              ))}
            </div>
          </Card>

          {/* Roadmap preview */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-brand-600" />
                <h2 className="text-base font-semibold text-slate-900">Learning Roadmap Overview</h2>
              </div>
              <span className="text-xs text-slate-500">{totalPreviewWeeks} weeks total</span>
            </div>

            <div className="space-y-3 mb-5">
              {roadmapPreview.map((phase) => (
                <div key={phase.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-brand-700">{phase.phaseNumber}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{phase.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {phase.durationWeeks} weeks · {phase.skillsCovered.slice(0, 3).join(", ")}
                      {phase.skillsCovered.length > 3 && "..."}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href={`/roadmap/${career.id}`}>
              <Button fullWidth variant="primary" rightIcon={<ChevronRight size={15} />}>
                View My Personalised Roadmap
              </Button>
            </Link>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={16} className="text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900">Job Roles in This Path</h2>
            </div>
            <div className="space-y-2">
              {career.possible_roles.map((role) => (
                <div key={role} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{role}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900">Industries Hiring</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {career.industries.map((ind) => (
                <Badge key={ind} variant="default">{ind}</Badge>
              ))}
            </div>
          </Card>

          <Card padding="md" className="bg-brand-50 border-brand-100">
            <h2 className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
              Work Arrangements
            </h2>
            <div className="flex flex-wrap gap-2">
              {career.work_styles.map((style) => (
                <Badge key={style} variant="brand">
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
