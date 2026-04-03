"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { User, Zap, Settings, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getWorkStyleLabel } from "@/lib/utils";

const tabs = [
  { id: "overview",     label: "Overview",           icon: User },
  { id: "skills",       label: "Skills & Interests",  icon: Zap },
  { id: "preferences",  label: "Preferences",         icon: Settings },
];

// ─── Suggestion lists (same vocabulary as onboarding) ─────────────────────────

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

const INDUSTRY_SUGGESTIONS = [
  "Technology", "Finance & Banking", "Healthcare", "Education",
  "E-commerce & Retail", "Media & Entertainment", "Government & Public Sector",
  "Consulting", "Manufacturing", "Telecommunications", "Startups", "Non-profit",
  "Research & Academia", "Defence & Security", "Energy & Renewables",
  "Agriculture", "Real Estate", "Legal & Law", "Logistics & Supply Chain",
];

// ─── TagInput component ────────────────────────────────────────────────────────

interface TagInputProps {
  label: string;
  hint?: string;
  placeholder: string;
  suggestions: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  chipColor?: "brand" | "emerald" | "amber" | "violet";
}

function TagInput({
  label, hint, placeholder, suggestions, selected, onChange, chipColor = "brand",
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
    if (clean && !selected.includes(clean)) onChange([...selected, clean]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }, [selected, onChange]);

  const remove = (val: string) => onChange(selected.filter((s) => s !== val));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!inputRef.current?.contains(e.target as Node) && !listRef.current?.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const chipStyles: Record<string, string> = {
    brand:  "bg-brand-50 text-brand-700",
    emerald:"bg-emerald-50 text-emerald-700",
    amber:  "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };
  const removeStyles: Record<string, string> = {
    brand:  "text-brand-400 hover:text-brand-700",
    emerald:"text-emerald-400 hover:text-emerald-700",
    amber:  "text-amber-400 hover:text-amber-700",
    violet: "text-violet-400 hover:text-violet-700",
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
            <span key={s} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-medium ${chipStyles[chipColor]}`}>
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
          <div ref={listRef} className="absolute z-30 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            {filtered.map((s) => (
              <button key={s} type="button"
                onMouseDown={(e) => { e.preventDefault(); add(s); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
              >
                {s}
              </button>
            ))}
            {showCustom && (
              <button type="button"
                onMouseDown={(e) => { e.preventDefault(); add(trimmed); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                Add <span className="font-medium text-slate-700">"{trimmed}"</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile state ─────────────────────────────────────────────────────────────

interface ProfileState {
  name: string;
  email: string;
  interests: string[];
  skills: string[];
  weak_areas: string[];
  preferred_work_style: string;
  learning_mode: string;
  availability: string;
  industries_of_interest: string[];
  career_goals: string[];
}

const emptyProfile: ProfileState = {
  name: "", email: "", interests: [], skills: [], weak_areas: [],
  preferred_work_style: "hybrid", learning_mode: "self_paced",
  availability: "part_time", industries_of_interest: [], career_goals: [],
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<ProfileState>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setProfile({
            name:                   data.name ?? "",
            email:                  data.email ?? "",
            interests:              data.interests ?? [],
            skills:                 data.skills ?? [],
            weak_areas:             data.weakAreas ?? [],
            preferred_work_style:   data.workStyle ?? "hybrid",
            learning_mode:          data.learningMode ?? "self_paced",
            availability:           data.availability ?? "part_time",
            industries_of_interest: data.industries ?? [],
            career_goals:           data.careerGoals ?? [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:                   profile.name,
          interests:              profile.interests,
          skills:                 profile.skills,
          weak_areas:             profile.weak_areas,
          preferred_work_style:   profile.preferred_work_style,
          learning_mode:          profile.learning_mode,
          availability:           profile.availability,
          industries_of_interest: profile.industries_of_interest,
          career_goals:           profile.career_goals,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="w-6 h-6 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 pt-2 lg:pt-0 mt-4 lg:mt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Profile</h1>
          <p className="text-sm text-slate-500">Keep your profile up to date to improve your recommendations.</p>
        </div>
        <Button
          onClick={handleSave}
          loading={saving}
          leftIcon={saved ? <CheckCircle2 size={15} /> : undefined}
          variant={saved ? "secondary" : "primary"}
        >
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card padding="md" className="space-y-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">Basic Information</h2>
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                value={profile.email}
                disabled
                hint="Email cannot be changed after registration"
              />
            </Card>

            <Card padding="md">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">Career Goals</h2>
              <div className="flex flex-wrap gap-2">
                {profile.career_goals.map((goal) => (
                  <span key={goal} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium">
                    {goal}
                    <button
                      className="text-brand-400 hover:text-brand-700"
                      onClick={() => setProfile({ ...profile, career_goals: profile.career_goals.filter((g) => g !== goal) })}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {profile.career_goals.length === 0 && (
                  <p className="text-sm text-slate-400">No goals added yet.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card padding="md" className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-white">{initials}</span>
              </div>
              <p className="font-semibold text-slate-900">{profile.name}</p>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </Card>

            <Card padding="md">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Profile Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Skills",     value: profile.skills.length },
                  { label: "Interests",  value: profile.interests.length },
                  { label: "Industries", value: profile.industries_of_interest.length },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">{row.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Work Style</span>
                  <span className="text-sm font-semibold text-slate-900">{getWorkStyleLabel(profile.preferred_work_style)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Skills & Interests */}
      {activeTab === "skills" && (
        <div className="space-y-6 max-w-2xl">
          <Card padding="md">
            <TagInput
              label="Your interests"
              hint="Add topics you're passionate about"
              placeholder="Type to search interests..."
              suggestions={INTEREST_SUGGESTIONS}
              selected={profile.interests}
              onChange={(vals) => setProfile({ ...profile, interests: vals })}
              chipColor="brand"
            />
          </Card>
          <Card padding="md">
            <TagInput
              label="Your skills"
              hint="Add technical and soft skills you have"
              placeholder="Type to search skills..."
              suggestions={SKILL_SUGGESTIONS}
              selected={profile.skills}
              onChange={(vals) => setProfile({ ...profile, skills: vals })}
              chipColor="emerald"
            />
          </Card>
          <Card padding="md">
            <TagInput
              label="Areas to improve"
              hint="Skills or knowledge gaps you want to work on"
              placeholder="Type to search areas..."
              suggestions={[...INTEREST_SUGGESTIONS, ...SKILL_SUGGESTIONS]}
              selected={profile.weak_areas}
              onChange={(vals) => setProfile({ ...profile, weak_areas: vals })}
              chipColor="amber"
            />
          </Card>
        </div>
      )}

      {/* Preferences */}
      {activeTab === "preferences" && (
        <div className="max-w-lg space-y-4">
          <Card padding="md" className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">Work & Learning Preferences</h2>
            <Select
              label="Preferred work style"
              value={profile.preferred_work_style}
              onChange={(e) => setProfile({ ...profile, preferred_work_style: e.target.value })}
              options={[
                { value: "remote",   label: "Remote" },
                { value: "hybrid",   label: "Hybrid" },
                { value: "office",   label: "In-Office" },
                { value: "flexible", label: "Flexible" },
              ]}
            />
            <Select
              label="Learning mode"
              value={profile.learning_mode}
              onChange={(e) => setProfile({ ...profile, learning_mode: e.target.value })}
              options={[
                { value: "self_paced",  label: "Self-Paced" },
                { value: "structured",  label: "Structured Program" },
                { value: "bootcamp",    label: "Bootcamp Style" },
                { value: "university",  label: "University Courses" },
                { value: "mentorship",  label: "Mentorship-Based" },
              ]}
            />
            <Select
              label="Weekly availability"
              value={profile.availability}
              onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
              options={[
                { value: "full_time", label: "Full-Time (30+ hrs/week)" },
                { value: "part_time", label: "Part-Time (10-20 hrs/week)" },
                { value: "evenings",  label: "Evenings Only" },
                { value: "weekends",  label: "Weekends Only" },
                { value: "limited",   label: "Very Limited (<5 hrs/week)" },
              ]}
            />
          </Card>

          <Card padding="md">
            <TagInput
              label="Industry Interests"
              hint="Industries you'd like to work in"
              placeholder="Type to search industries..."
              suggestions={INDUSTRY_SUGGESTIONS}
              selected={profile.industries_of_interest}
              onChange={(vals) => setProfile({ ...profile, industries_of_interest: vals })}
              chipColor="violet"
            />
          </Card>
        </div>
      )}
    </div>
  );
}
