"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Animated counter hook
function useCounter(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

// Mock UI preview showing career recommendations
function DashboardPreview() {
  const careers = [
    { title: "Frontend Developer", score: 87, color: "#10b981", tags: ["React", "TypeScript"] },
    { title: "UI/UX Designer", score: 72, color: "#3b82f6", tags: ["Figma", "Research"] },
    { title: "Data Analyst", score: 65, color: "#f59e0b", tags: ["SQL", "Python"] },
  ];

  return (
    <div className="relative">
      {/* Main card */}
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-card-lg overflow-hidden"
        style={{
          animation: "heroCard 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both",
        }}
      >
        {/* Traffic lights */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-medium text-slate-400">Your Career Matches</span>
          <div className="w-16" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Based on your profile</p>
              <h3 className="text-sm font-semibold text-slate-800 mt-0.5">Top Recommendations</h3>
            </div>
            <span className="text-xs text-brand-600 font-medium">View all →</span>
          </div>

          {careers.map((career, i) => (
            <div
              key={career.title}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              style={{
                animation: `heroRow 0.5s ease ${0.6 + i * 0.12}s both`,
              }}
            >
              {/* Score ring */}
              <div className="relative w-11 h-11 flex-shrink-0">
                <svg viewBox="0 0 44 44" className="-rotate-90 w-full h-full">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                  <circle
                    cx="22" cy="22" r="18"
                    fill="none"
                    stroke={career.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    strokeDashoffset={`${2 * Math.PI * 18 * (1 - career.score / 100)}`}
                    style={{ animation: `ringDraw 1s ease ${0.8 + i * 0.15}s both` }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xs font-bold text-slate-700">
                  {career.score}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{career.title}</p>
                <div className="flex gap-1.5 mt-1">
                  {career.tags.map((tag) => (
                    <span key={tag} className="text-2xs px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-slate-300">
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer strip */}
        <div className="px-5 py-3 bg-brand-600 flex items-center justify-between">
          <span className="text-xs text-white/80">Roadmap ready for each career</span>
          <span className="text-xs font-semibold text-white">View Roadmap →</span>
        </div>
      </div>

      {/* Floating stat card */}
      <div
        className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-card-md border border-slate-100 px-4 py-3 flex items-center gap-3"
        style={{ animation: "floatUp 0.6s ease 1s both" }}
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 size={16} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-800">Skills Identified</p>
          <p className="text-2xs text-slate-500">6 matched · 4 to develop</p>
        </div>
      </div>

      {/* Floating match card */}
      <div
        className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card-md border border-slate-100 px-4 py-3"
        style={{ animation: "floatDown 0.6s ease 0.9s both" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-2xs font-bold text-brand-700">87</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">Excellent Match</p>
            <p className="text-2xs text-slate-500">Frontend Dev</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats strip with animated counters
function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const students = useCounter(2400, 2000, started);
  const careers = useCounter(30, 1400, started);
  const fields = useCounter(12, 1200, started);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.unobserve(el); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-10 md:gap-16 mt-16 md:mt-20 pt-10 border-t border-slate-100">
      {[
        { value: students, suffix: "+", label: "Students guided" },
        { value: careers, suffix: "+", label: "Career paths" },
        { value: fields, suffix: "", label: "Industries covered" },
      ].map(({ value, suffix, label }) => (
        <div key={label} className="text-center">
          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {value.toLocaleString()}{suffix}
          </p>
          <p className="text-sm text-slate-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}

const trustPoints = [
  "Personalised to your skills & interests",
  "Structured learning roadmaps included",
  "Covers every industry — not just tech",
];

interface HeroProps {
  session?: { name: string } | null;
}

export function Hero({ session }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-20 md:pt-8 md:pb-28">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-slate opacity-60 pointer-events-none" />

      {/* Gradient accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgb(238 242 255 / 0.8) 0%, transparent 70%)",
        }}
      />

      {/* Floating blobs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
          animation: "blobFloat 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)",
          animation: "blobFloat 10s ease-in-out 2s infinite reverse",
        }}
      />

      <div className="container-page relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="max-w-xl">
            {/* Badge pill */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 mb-8"
              style={{ animation: "fadeDown 0.5s ease 0.1s both" }}
            >
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xs">★</span>
                ))}
              </span>
              <span className="text-xs font-medium text-brand-700">
                Trusted by 2,400+ students
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-slate-900 leading-[1.12] tracking-tight mb-6"
              style={{ animation: "fadeUp 0.6s ease 0.2s both" }}
            >
              Discover the Career{" "}
              <span className="relative inline-block">
                <span className="text-gradient">Path Built</span>
              </span>{" "}
              for You
            </h1>

            {/* Sub-headline */}
            <p
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg"
              style={{ animation: "fadeUp 0.6s ease 0.35s both" }}
            >
              PathWise analyses your skills, interests, and goals to recommend
              the right career paths — then gives you a step-by-step learning
              roadmap to get there.
            </p>

            {/* Trust points */}
            <ul
              className="space-y-2.5 mb-10"
              style={{ animation: "fadeUp 0.6s ease 0.45s both" }}
            >
              {trustPoints.map((point, i) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-sm text-slate-600"
                  style={{ animation: `fadeUp 0.5s ease ${0.5 + i * 0.08}s both` }}
                >
                  <CheckCircle2 size={16} className="text-brand-600 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3"
              style={{ animation: "fadeUp 0.6s ease 0.65s both" }}
            >
              {session ? (
                <Link href="/dashboard">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight size={16} />}
                    className="shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-shadow"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button
                      variant="primary"
                      size="lg"
                      rightIcon={<ArrowRight size={16} />}
                      className="shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-shadow"
                    >
                      Start for Free
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="outline" size="lg">
                      See How It Works
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Sub-note */}
            {!session && (
              <p
                className="mt-5 text-xs text-slate-400"
                style={{ animation: "fadeUp 0.6s ease 0.75s both" }}
              >
                No credit card required · Free to start · Results in minutes
              </p>
            )}
          </div>

          {/* Right — preview */}
          <div className="relative lg:pl-8">
            <DashboardPreview />
          </div>
        </div>

        {/* Stats strip */}
        <StatsStrip />

        {/* University logos */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest mb-7">
            Used by students from leading universities
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
            {["University of Toronto", "UCL", "NUS", "TU Delft", "NYU", "BITS Pilani"].map(
              (uni) => (
                <span
                  key={uni}
                  className="text-sm font-semibold text-slate-600 whitespace-nowrap"
                >
                  {uni}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
