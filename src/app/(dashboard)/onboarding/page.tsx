"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X,
  Compass, Target, TrendingUp,
  Monitor, Users, Palette, BarChart2, Hammer, Briefcase,
  Code2, Heart, Wrench, Cpu, MessageSquare, Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MultiSelectChips } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { OnboardingData, ExperienceLevel, WorkPreference } from "@/lib/types";

// ─────────────────────────────────────────────
// Suggestion lists
// ─────────────────────────────────────────────
const INTEREST_SUGGESTIONS = [
  "Artificial Intelligence", "Machine Learning", "Data Analysis", "Data Science",
  "Web Development", "Mobile Development", "Cloud Computing", "Cybersecurity",
  "DevOps & Automation", "Software Engineering", "Game Development",
  "UI/UX Design", "Graphic Design", "Product Design", "Brand Identity",
  "Product Management", "Project Management", "Business Strategy",
  "Entrepreneurship", "Finance & Investing", "Accounting", "Economics",
  "Marketing", "Digital Marketing", "Content Creation", "Social Media",
  "Healthcare & Medicine", "Mental Health", "Biotech", "Pharmaceuticals",
  "Education & Teaching", "E-Learning", "Research & Science",
  "Law & Legal Tech", "Policy & Government", "Non-profit & Social Impact",
  "Engineering", "Robotics", "Electronics", "Architecture",
  "Photography", "Video Production", "Animation", "Music & Audio",
  "Writing & Journalism", "Publishing", "Translation & Languages",
  "E-commerce", "Supply Chain", "Logistics", "Operations",
  "HR & People", "Coaching & Mentoring", "Consulting",
  "Real Estate", "Construction", "Agriculture & Food Tech",
  "Environment & Sustainability", "Energy & Renewables",
];

const SKILL_SUGGESTIONS = [
  "Public Speaking", "Written Communication", "Active Listening", "Storytelling",
  "Negotiation", "Conflict Resolution", "Persuasion", "Presentation Skills",
  "Team Leadership", "People Management", "Mentoring", "Collaboration",
  "Decision Making", "Critical Thinking", "Problem Solving", "Time Management",
  "Project Management", "Budgeting", "Financial Analysis", "Accounting",
  "Business Development", "Sales", "Customer Service", "Market Research",
  "Strategic Planning", "Stakeholder Management", "Contract Negotiation",
  "Social Media Management", "Content Writing", "Copywriting", "SEO",
  "Brand Strategy", "Email Marketing", "Photography", "Video Editing",
  "Graphic Design", "Illustration", "UI/UX Design",
  "Data Analysis", "Research", "Report Writing", "Statistics",
  "Excel / Spreadsheets", "Survey Design", "Literature Review",
  "Patient Care", "First Aid", "Clinical Assessment", "Health Education",
  "Counselling", "Mental Health Support", "Nutrition & Dietetics",
  "Teaching", "Curriculum Design", "Training & Facilitation", "Tutoring",
  "Coaching", "E-Learning Development",
  "Legal Research", "Contract Drafting", "Compliance & Regulation", "Case Management",
  "Carpentry", "Electrical Work", "Plumbing", "Welding",
  "Vehicle Maintenance", "Construction Planning", "Health & Safety",
  "Python", "JavaScript", "SQL", "Excel / Spreadsheets", "Data Visualisation",
  "Web Development", "Cybersecurity", "IT Support", "Network Administration",
  "Laboratory Skills", "Field Research", "Environmental Assessment",
  "GIS & Mapping", "Scientific Writing",
];

const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare",
  "Education", "E-commerce & Retail", "Media & Entertainment",
  "Government & Public Sector", "Consulting", "Manufacturing",
  "Telecommunications", "Startups", "Non-profit",
  "Research & Academia", "Defence & Security",
  "Energy & Renewables", "Agriculture", "Real Estate",
  "Legal & Law", "Logistics & Supply Chain",
];

// ─────────────────────────────────────────────
// Activity discovery cards (Step 3)
// ─────────────────────────────────────────────
interface ActivityCard {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  seeds: string[];
}

const ACTIVITY_CARDS: ActivityCard[] = [
  {
    id: "creative",
    icon: <Palette size={16} className="text-rose-600" />,
    label: "Creative & design",
    description: "Art, design, writing, visual storytelling",
    seeds: ["UI/UX Design", "Graphic Design", "Content Creation", "Photography", "Animation", "Brand Identity"],
  },
  {
    id: "technical",
    icon: <Code2 size={16} className="text-blue-600" />,
    label: "Technical problem solving",
    description: "Code, systems, logic, engineering puzzles",
    seeds: ["Software Engineering", "Web Development", "Cybersecurity", "DevOps & Automation"],
  },
  {
    id: "helping",
    icon: <Heart size={16} className="text-pink-600" />,
    label: "Helping people",
    description: "Healthcare, teaching, counselling, support",
    seeds: ["Healthcare & Medicine", "Education & Teaching", "Mental Health", "Coaching & Mentoring"],
  },
  {
    id: "analytical",
    icon: <BarChart2 size={16} className="text-amber-600" />,
    label: "Analysis & research",
    description: "Data, finance, law, evidence-based thinking",
    seeds: ["Data Analysis", "Finance & Investing", "Research & Science", "Economics", "Law & Legal Tech"],
  },
  {
    id: "physical",
    icon: <Wrench size={16} className="text-orange-600" />,
    label: "Hands-on building",
    description: "Engineering, construction, practical trades",
    seeds: ["Engineering", "Robotics", "Electronics", "Architecture"],
  },
  {
    id: "business",
    icon: <Briefcase size={16} className="text-violet-600" />,
    label: "Business & leadership",
    description: "Managing, growing, and organising teams",
    seeds: ["Entrepreneurship", "Business Strategy", "Product Management", "Project Management"],
  },
  {
    id: "technology",
    icon: <Cpu size={16} className="text-sky-600" />,
    label: "Technology & AI",
    description: "Software, AI, cloud, and digital innovation",
    seeds: ["Artificial Intelligence", "Machine Learning", "Cloud Computing", "Data Science"],
  },
  {
    id: "communication",
    icon: <MessageSquare size={16} className="text-teal-600" />,
    label: "Communication & media",
    description: "Marketing, journalism, social, storytelling",
    seeds: ["Digital Marketing", "Writing & Journalism", "Social Media", "Content Creation"],
  },
  {
    id: "science",
    icon: <Leaf size={16} className="text-emerald-600" />,
    label: "Science & environment",
    description: "Biology, sustainability, research, discovery",
    seeds: ["Research & Science", "Biotech", "Environment & Sustainability", "Agriculture & Food Tech"],
  },
];

// ─────────────────────────────────────────────
// Step definitions
// ─────────────────────────────────────────────
const steps = [
  { number: 1, title: "About You",      description: "Who you are" },
  { number: 2, title: "Work Type",      description: "What appeals to you" },
  { number: 3, title: "Interests",      description: "What excites you?" },
  { number: 4, title: "Skills",         description: "What you know" },
  { number: 5, title: "Preferences",    description: "How you like to work" },
  { number: 6, title: "Goals",          description: "Where you want to go" },
];

// ─────────────────────────────────────────────
// Experience level options
// ─────────────────────────────────────────────
const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  icon: React.ReactNode;
  label: string;
  description: string;
}[] = [
  {
    value: "explorer",
    icon: <Compass size={22} className="text-brand-600" />,
    label: "I'm exploring",
    description: "I'm not sure what I want to do yet — help me discover careers that suit me.",
  },
  {
    value: "focused",
    icon: <Target size={22} className="text-emerald-600" />,
    label: "I have some ideas",
    description: "I have a sense of what I'm interested in and want to find the right career path.",
  },
  {
    value: "professional",
    icon: <TrendingUp size={22} className="text-violet-600" />,
    label: "I'm already working",
    description: "I'm in a career and want to level up, pivot, or plan my next step.",
  },
];

// ─────────────────────────────────────────────
// Work preference options
// ─────────────────────────────────────────────
const WORK_PREFERENCE_OPTIONS: {
  value: WorkPreference;
  icon: React.ReactNode;
  label: string;
  description: string;
  examples: string;
}[] = [
  {
    value: "technology",
    icon: <Monitor size={20} className="text-blue-600" />,
    label: "Technology & Computing",
    description: "Building, coding, and working with software and data",
    examples: "Software development, data science, cybersecurity",
  },
  {
    value: "people",
    icon: <Users size={20} className="text-emerald-600" />,
    label: "People & Relationships",
    description: "Helping, teaching, leading, and supporting others",
    examples: "Healthcare, education, HR, counselling",
  },
  {
    value: "creative",
    icon: <Palette size={20} className="text-rose-600" />,
    label: "Creative & Artistic",
    description: "Designing, writing, producing, and making things",
    examples: "Graphic design, video production, content writing",
  },
  {
    value: "analytical",
    icon: <BarChart2 size={20} className="text-amber-600" />,
    label: "Analysis & Problem Solving",
    description: "Research, strategy, data, and structured thinking",
    examples: "Finance, consulting, law, data analysis",
  },
  {
    value: "physical",
    icon: <Hammer size={20} className="text-orange-600" />,
    label: "Physical & Practical",
    description: "Building, fixing, and working with your hands",
    examples: "Engineering, construction, trades",
  },
  {
    value: "business",
    icon: <Briefcase size={20} className="text-violet-600" />,
    label: "Business & Enterprise",
    description: "Selling, managing, and growing organisations",
    examples: "Sales, project management, entrepreneurship",
  },
];

// ─────────────────────────────────────────────
// Generic tag autocomplete input
// ─────────────────────────────────────────────
interface TagInputProps {
  label: string;
  hint?: string;
  placeholder: string;
  suggestions: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  chipColor?: "brand" | "emerald" | "amber";
}

function TagInput({
  label,
  hint,
  placeholder,
  suggestions,
  selected,
  onChange,
  chipColor = "brand",
}: TagInputProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();

  const filtered = trimmed.length === 0
    ? []
    : suggestions
        .filter((s) => s.toLowerCase().includes(trimmed.toLowerCase()) && !selected.includes(s))
        .slice(0, 8);

  const showCustom =
    trimmed.length > 1 &&
    !suggestions.some((s) => s.toLowerCase() === trimmed.toLowerCase()) &&
    !selected.includes(trimmed);

  const add = useCallback((val: string) => {
    const clean = val.trim();
    if (clean && !selected.includes(clean)) {
      onChange([...selected, clean]);
    }
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }, [selected, onChange]);

  const remove = (val: string) => onChange(selected.filter((s) => s !== val));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const chipStyles = {
    brand:   "bg-brand-50 text-brand-700 hover:text-brand-700",
    emerald: "bg-emerald-50 text-emerald-700 hover:text-emerald-700",
    amber:   "bg-amber-50 text-amber-700 hover:text-amber-700",
  };
  const removeStyles = {
    brand:   "text-brand-400 hover:text-brand-700",
    emerald: "text-emerald-400 hover:text-emerald-700",
    amber:   "text-amber-400 hover:text-amber-700",
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-medium ${chipStyles[chipColor]}`}
            >
              {s}
              <button type="button" onClick={() => remove(s)} className={removeStyles[chipColor]}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="input-base"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => trimmed && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (filtered.length > 0) add(filtered[0]);
              else if (showCustom) add(trimmed);
            }
            if (e.key === "Escape") setOpen(false);
          }}
        />

        {open && (filtered.length > 0 || showCustom) && (
          <div
            ref={listRef}
            className="absolute z-30 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
          >
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(s); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                {s}
              </button>
            ))}
            {showCustom && (
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(trimmed); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 border-t border-slate-100 transition-colors"
              >
                Add &ldquo;<span className="font-medium text-slate-700">{trimmed}</span>&rdquo;
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400">Type to search, or add your own.</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
const defaultData: OnboardingData = {
  name:                   "",
  experience_level:       "explorer",
  work_preferences:       [],
  interests:              [],
  skills:                 [],
  weak_areas:             [],
  preferred_work_style:   "hybrid",
  learning_mode:          "self_paced",
  availability:           "part_time",
  career_goals:           [],
  industries_of_interest: [],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [discoveryPicks, setDiscoveryPicks] = useState<Set<string>>(new Set());

  const update = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const toggleActivity = (card: ActivityCard) => {
    const isPicked = discoveryPicks.has(card.id);
    const next = new Set(discoveryPicks);
    if (isPicked) {
      next.delete(card.id);
      update({ interests: data.interests.filter((i) => !card.seeds.includes(i)) });
    } else {
      next.add(card.id);
      const toAdd = card.seeds.filter((s) => !data.interests.includes(s));
      update({ interests: [...data.interests, ...toAdd] });
    }
    setDiscoveryPicks(next);
  };

  const toggleWorkPref = (val: WorkPreference) => {
    const current = data.work_preferences;
    if (current.includes(val)) {
      update({ work_preferences: current.filter((v) => v !== val) });
    } else {
      update({ work_preferences: [...current, val] });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.name.trim().length > 0;
      case 2: return data.work_preferences.length >= 1;
      case 3: return data.interests.length >= 1;
      case 4: return data.skills.length >= 1;
      case 5: return true;
      case 6: return data.industries_of_interest.length >= 1;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: data }),
      });
      router.push("/dashboard");
    } catch {
      setLoading(false);
    }
  };

  const addGoal = () => {
    const trimmed = goalInput.trim();
    if (trimmed && !data.career_goals.includes(trimmed)) {
      update({ career_goals: [...data.career_goals, trimmed] });
    }
    setGoalInput("");
  };

  const removeGoal = (goal: string) =>
    update({ career_goals: data.career_goals.filter((g) => g !== goal) });

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div
          className="h-1 bg-brand-600 transition-all duration-500"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
        <div className="container-page h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 6L11.5 7.5V10.5L9 12L6.5 10.5V7.5L9 6Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-900">PathWise</span>
          </div>
          <span className="text-sm text-slate-500">Step {step} of {steps.length}</span>
        </div>
      </div>

      <div className="flex-1 flex mt-14">
        {/* Left sidebar — step indicators */}
        <div className="hidden lg:flex w-72 flex-col px-8 py-12 border-r border-slate-100 bg-white">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Profile Setup</h2>
            <p className="text-sm text-slate-500">
              Complete your profile to get personalised career recommendations.
            </p>
          </div>
          <div className="space-y-3">
            {steps.map((s) => {
              const done   = s.number < step;
              const active = s.number === step;
              return (
                <div
                  key={s.number}
                  className={cn("flex items-center gap-3 p-3 rounded-xl transition-colors", active ? "bg-brand-50" : "")}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold transition-all",
                    done ? "bg-emerald-500 text-white" : active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {done ? <CheckCircle2 size={16} /> : s.number}
                  </div>
                  <div>
                    <p className={cn("text-sm font-semibold", active ? "text-brand-700" : done ? "text-slate-700" : "text-slate-400")}>
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-400">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — form content */}
        <div className="flex-1 flex flex-col items-center px-4 py-10">
          <div className="w-full max-w-xl">

            {/* ── Step 1 — About You ── */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">Tell us about yourself</h1>
                  <p className="text-slate-500 text-sm">
                    PathWise works for everyone — students, graduates, professionals, and career changers.
                  </p>
                </div>

                <Input
                  label="Full name"
                  placeholder="Your name"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value })}
                  required
                />

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Where are you right now?</label>
                    <p className="text-xs text-slate-400 mt-0.5">This shapes how PathWise guides you.</p>
                  </div>
                  <div className="space-y-3">
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update({ experience_level: opt.value })}
                        className={cn(
                          "w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150",
                          data.experience_level === opt.value
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {opt.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{opt.description}</p>
                        </div>
                        {data.experience_level === opt.value && (
                          <CheckCircle2 size={18} className="text-brand-600 flex-shrink-0 ml-auto mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2 — Work Type ── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">What type of work appeals to you?</h1>
                  <p className="text-slate-500 text-sm">
                    Select everything that resonates — you can choose multiple. This helps us match you to the right career sectors.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WORK_PREFERENCE_OPTIONS.map((opt) => {
                    const selected = data.work_preferences.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleWorkPref(opt.value)}
                        className={cn(
                          "flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all duration-150",
                          selected
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                            {opt.icon}
                          </div>
                          {selected && <CheckCircle2 size={16} className="text-brand-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                          <p className="text-xs text-slate-400 mt-1 italic">{opt.examples}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {data.work_preferences.length === 0 && (
                  <p className="text-xs text-amber-600 font-medium">Select at least one to continue.</p>
                )}
              </div>
            )}

            {/* ── Step 3 — Interests ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">What do you enjoy doing?</h1>
                  <p className="text-slate-500 text-sm">
                    Start by picking the activities that feel most like you — PathWise will use these to map you to real careers. Then refine below.
                  </p>
                </div>

                {/* Activity discovery cards */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Quick discovery — select everything that resonates
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ACTIVITY_CARDS.map((card) => {
                      const picked = discoveryPicks.has(card.id);
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => toggleActivity(card)}
                          className={cn(
                            "flex flex-col gap-1.5 p-3 rounded-xl border-2 text-left transition-all duration-150",
                            picked
                              ? "border-brand-500 bg-brand-50"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              {card.icon}
                            </div>
                            {picked && <CheckCircle2 size={13} className="text-brand-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs font-semibold text-slate-800 leading-tight">{card.label}</p>
                          <p className="text-xs text-slate-400 leading-tight">{card.description}</p>
                        </button>
                      );
                    })}
                  </div>
                  {discoveryPicks.size > 0 && (
                    <p className="text-xs text-brand-600 font-medium mt-2">
                      {data.interests.length} interests added from your selections — review and add more below.
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <TagInput
                    label="Your interests"
                    hint="Add at least 1 — the more specific, the better your matches"
                    placeholder="Type an interest, e.g. Healthcare, Marketing, Engineering…"
                    suggestions={INTEREST_SUGGESTIONS}
                    selected={data.interests}
                    onChange={(vals) => update({ interests: vals })}
                    chipColor="brand"
                  />
                </div>
              </div>
            )}

            {/* ── Step 4 — Skills ── */}
            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">What do you know?</h1>
                  <p className="text-slate-500 text-sm">
                    Be honest — skills you&apos;re still learning count too. This helps us find realistic matches and build your roadmap.
                  </p>
                </div>
                <TagInput
                  label="Skills you currently have"
                  hint="Include both technical and soft skills — add at least 1"
                  placeholder="Type a skill, e.g. Public Speaking, Project Management…"
                  suggestions={SKILL_SUGGESTIONS}
                  selected={data.skills}
                  onChange={(vals) => update({ skills: vals })}
                  chipColor="emerald"
                />
                <TagInput
                  label="Areas you feel less confident in"
                  hint="Knowing your gaps helps us build a better roadmap"
                  placeholder="Type a skill gap, e.g. Public Speaking, Data Analysis…"
                  suggestions={SKILL_SUGGESTIONS}
                  selected={data.weak_areas}
                  onChange={(vals) => update({ weak_areas: vals })}
                  chipColor="amber"
                />
              </div>
            )}

            {/* ── Step 5 — Preferences ── */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">How do you like to work and learn?</h1>
                  <p className="text-slate-500 text-sm">
                    Your preferences shape the careers and learning paths we suggest.
                  </p>
                </div>
                <Select
                  label="Preferred work style"
                  value={data.preferred_work_style}
                  onChange={(e) => update({ preferred_work_style: e.target.value as OnboardingData["preferred_work_style"] })}
                  options={[
                    { value: "remote",   label: "Remote — work from anywhere" },
                    { value: "hybrid",   label: "Hybrid — mix of remote and in-office" },
                    { value: "office",   label: "In-office — prefer a physical workplace" },
                    { value: "flexible", label: "Flexible — no strong preference" },
                  ]}
                />
                <Select
                  label="Preferred learning mode"
                  value={data.learning_mode}
                  onChange={(e) => update({ learning_mode: e.target.value as OnboardingData["learning_mode"] })}
                  options={[
                    { value: "self_paced",  label: "Self-paced — I learn at my own speed" },
                    { value: "structured",  label: "Structured — I follow a clear curriculum" },
                    { value: "bootcamp",    label: "Bootcamp-style — intensive, fast-paced" },
                    { value: "university",  label: "University / formal courses" },
                    { value: "mentorship",  label: "Mentorship — learning from practitioners" },
                  ]}
                />
                <Select
                  label="Time available for learning"
                  value={data.availability}
                  onChange={(e) => update({ availability: e.target.value as OnboardingData["availability"] })}
                  options={[
                    { value: "full_time", label: "Full-time — 30+ hours/week" },
                    { value: "part_time", label: "Part-time — 10–20 hours/week" },
                    { value: "evenings",  label: "Evenings only — a few hours/weekday" },
                    { value: "weekends",  label: "Weekends only" },
                    { value: "limited",   label: "Very limited — less than 5 hours/week" },
                  ]}
                />
              </div>
            )}

            {/* ── Step 6 — Goals ── */}
            {step === 6 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">Where do you want to go?</h1>
                  <p className="text-slate-500 text-sm">
                    Share your aspirations and the industries that interest you most.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Career goals <span className="text-slate-400 font-normal">(optional)</span>
                  </span>
                  <p className="text-xs text-slate-400">
                    What outcome do you want? e.g. &quot;Start my own business&quot;, &quot;Become a nurse&quot;, &quot;Work remotely for a tech company&quot;.
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="input-base flex-1"
                      placeholder="Type a goal and press Add…"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
                    />
                    <Button variant="outline" onClick={addGoal} size="md">Add</Button>
                  </div>
                  {data.career_goals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {data.career_goals.map((goal) => (
                        <span key={goal} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium">
                          {goal}
                          <button onClick={() => removeGoal(goal)} className="text-brand-400 hover:text-brand-700 ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <MultiSelectChips
                  label="Industries you're interested in"
                  options={INDUSTRIES}
                  selected={data.industries_of_interest}
                  onChange={(vals) => update({ industries_of_interest: vals })}
                  maxSelections={6}
                  hint="Pick at least 1 industry"
                />
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                leftIcon={<ArrowLeft size={16} />}
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
              >
                Back
              </Button>
              {step < steps.length ? (
                <Button rightIcon={<ArrowRight size={16} />} onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
                  Continue
                </Button>
              ) : (
                <Button
                  rightIcon={<Sparkles size={16} />}
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={!canProceed()}
                  className="shadow-md shadow-brand-600/20"
                >
                  {loading ? "Generating…" : "Generate My Recommendations"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
