"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MultiSelectChips } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "@/lib/types";

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
  "HTML/CSS", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP",
  "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "FastAPI", "Django", "Laravel",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Firebase", "Supabase", "Redis",
  "Git", "Docker", "Kubernetes", "Linux", "Bash / Shell", "Terraform", "CI/CD",
  "AWS", "Azure", "Google Cloud",
  "Swift", "Kotlin", "React Native", "Flutter",
  "Figma", "Adobe XD", "Photoshop", "Illustrator", "After Effects", "Premiere Pro",
  "Excel / Spreadsheets", "Power BI", "Tableau", "R", "MATLAB",
  "Machine Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Data Analysis", "Statistics",
  "Project Management", "Agile / Scrum", "Product Roadmaps", "JIRA",
  "Public Speaking", "Writing & Copywriting", "Technical Writing", "Research",
  "Team Leadership", "Negotiation", "Customer Service", "Sales",
  "SEO", "Google Analytics", "Social Media Management", "Email Marketing", "PPC Advertising",
  "Financial Modelling", "Accounting", "Budgeting", "Bookkeeping",
  "Video Editing", "Photography", "3D Modelling", "Animation",
  "Networking", "Penetration Testing", "SIEM", "Risk Assessment",
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

const steps = [
  { number: 1, title: "About You",   description: "A quick introduction" },
  { number: 2, title: "Interests",   description: "What excites you?" },
  { number: 3, title: "Skills",      description: "What you know" },
  { number: 4, title: "Preferences", description: "How you like to work" },
  { number: 5, title: "Goals",       description: "Where you want to go" },
];

const defaultData: OnboardingData = {
  name:                   "",
  interests:              [],
  skills:                 [],
  weak_areas:             [],
  preferred_work_style:   "hybrid",
  learning_mode:          "self_paced",
  availability:           "part_time",
  career_goals:           [],
  industries_of_interest: [],
};

// ─────────────────────────────────────────────
// Generic tag autocomplete input
// Reused for interests, skills, and weak areas
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

      {/* Chips */}
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

      {/* Input */}
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
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [goalInput, setGoalInput] = useState("");

  const update = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const canProceed = () => {
    switch (step) {
      case 1: return data.name.trim().length > 0;
      case 2: return data.interests.length >= 2;
      case 3: return data.skills.length >= 2;
      case 4: return true;
      case 5: return data.industries_of_interest.length >= 1;
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
        {/* Left — step indicators */}
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

        {/* Right — form */}
        <div className="flex-1 flex flex-col items-center px-4 py-10">
          <div className="w-full max-w-xl">

            {/* Step 1 — About You */}
            {step === 1 && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* Step 2 — Interests */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">What excites you?</h1>
                  <p className="text-slate-500 text-sm">
                    These drive your career matches — add anything that genuinely interests you.
                  </p>
                </div>
                <TagInput
                  label="Areas of interest"
                  hint="Add at least 2"
                  placeholder="Type an interest, e.g. Machine Learning, Marketing…"
                  suggestions={INTEREST_SUGGESTIONS}
                  selected={data.interests}
                  onChange={(vals) => update({ interests: vals })}
                  chipColor="brand"
                />
              </div>
            )}

            {/* Step 3 — Skills */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">What do you know?</h1>
                  <p className="text-slate-500 text-sm">
                    Be honest — skills you&apos;re still learning count too. This helps us find realistic matches.
                  </p>
                </div>
                <TagInput
                  label="Skills you currently have"
                  hint="Include both technical and soft skills — add at least 2"
                  placeholder="Type a skill, e.g. Python, Project Management…"
                  suggestions={SKILL_SUGGESTIONS}
                  selected={data.skills}
                  onChange={(vals) => update({ skills: vals })}
                  chipColor="emerald"
                />
                <TagInput
                  label="Areas you feel less confident in"
                  hint="Knowing your gaps helps us build a better roadmap"
                  placeholder="Type a skill gap, e.g. Public Speaking, Docker…"
                  suggestions={SKILL_SUGGESTIONS}
                  selected={data.weak_areas}
                  onChange={(vals) => update({ weak_areas: vals })}
                  chipColor="amber"
                />
              </div>
            )}

            {/* Step 4 — Preferences */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">How do you like to work?</h1>
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

            {/* Step 5 — Goals */}
            {step === 5 && (
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
                  <div className="flex gap-2">
                    <input
                      className="input-base flex-1"
                      placeholder="e.g. Start my own business, work at a tech company…"
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

            {/* Navigation */}
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
