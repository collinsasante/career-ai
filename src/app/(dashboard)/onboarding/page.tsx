"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Check, Sparkles, BookOpen,
  GraduationCap, Wrench, Award, Briefcase, ArrowRight,
  TrendingUp, Rocket, Star, Zap, BadgeCheck,
  Monitor, Heart, Leaf, Palette, Music, Trophy,
  Home, Building2, Globe, Users, User, BarChart2,
  Cpu, Brain, MessageSquare, Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EducationStage } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  education: EducationStage | "";
  interests: string[];
  subjects: string[];
  personality: Record<string, number>;
  aspiration: string;
  environment: string[];
}

interface CareerResult {
  careerId: string;
  careerTitle: string;
  matchScore: number;
  matchReasons: string[];
}

interface StageResult {
  type: string;
  headline: string;
  subheadline: string;
  nextStepMessage: string;
}

interface ResultsData {
  careers: CareerResult[];
  stage: StageResult | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_VISIBLE_STEPS = 7;

const EDUCATION_OPTIONS = [
  { value: "jhs_student",        label: "JHS Student",        desc: "Junior High School",              icon: BookOpen },
  { value: "shs_student",        label: "SHS Student",        desc: "Senior High School",              icon: GraduationCap },
  { value: "tvet_student",       label: "TVET Student",       desc: "Technical & Vocational Training", icon: Wrench },
  { value: "university_student", label: "University Student", desc: "Degree Programme",                icon: Building2 },
  { value: "graduate",           label: "Graduate",           desc: "Completed Tertiary Education",    icon: Award },
] as const;

const INTERESTS = [
  { id: "technology",  label: "Technology",    icon: Monitor },
  { id: "healthcare",  label: "Healthcare",    icon: Heart },
  { id: "business",    label: "Business",      icon: Briefcase },
  { id: "agriculture", label: "Agriculture",   icon: Leaf },
  { id: "engineering", label: "Engineering",   icon: Cpu },
  { id: "arts",        label: "Arts & Design", icon: Palette },
  { id: "finance",     label: "Finance",       icon: BarChart2 },
  { id: "music",       label: "Music",         icon: Music },
  { id: "sports",      label: "Sports",        icon: Trophy },
  { id: "teaching",    label: "Education",     icon: BookOpen },
] as const;

const SUBJECTS = [
  "Mathematics", "Science", "ICT", "English", "Social Studies",
  "Biology", "Chemistry", "Physics", "Economics", "Literature",
  "Geography", "History", "Business Studies", "Agricultural Science", "Technical Drawing",
];

const PERSONALITY_QUESTIONS = [
  { id: "problemSolving", q: "I enjoy solving complex, analytical problems.",   lo: "Disagree",     hi: "Strongly agree" },
  { id: "teamwork",       q: "I prefer working in a team over going solo.",      lo: "Prefer solo",  hi: "Love teamwork" },
  { id: "leadership",     q: "I naturally take charge and lead others.",         lo: "Not at all",   hi: "Absolutely" },
  { id: "practical",      q: "I prefer hands-on practical work over theory.",    lo: "Love theory",  hi: "Hands-on" },
  { id: "creativity",     q: "Creativity is essential in my ideal career.",      lo: "Not key",      hi: "Essential" },
];

const ENVIRONMENTS = [
  { id: "remote",      label: "Remote / Online",  icon: Home,      desc: "Work from anywhere" },
  { id: "office",      label: "Office-Based",      icon: Building2, desc: "Corporate setting" },
  { id: "outdoor",     label: "Outdoor / Field",   icon: Globe,     desc: "Open spaces" },
  { id: "flexible",    label: "Flexible",          icon: Zap,       desc: "Mix of settings" },
  { id: "team",        label: "Team Environment",  icon: Users,     desc: "Collaborative" },
  { id: "independent", label: "Independent",       icon: User,      desc: "Own your schedule" },
];

const CAREER_SUGGESTIONS: Record<string, string[]> = {
  technology:  ["Software Engineer", "Data Scientist", "Cybersecurity Analyst", "UX Designer", "AI Engineer"],
  healthcare:  ["Medical Doctor", "Nurse", "Pharmacist", "Public Health Officer", "Dentist"],
  business:    ["Entrepreneur", "Marketing Manager", "Business Analyst", "Operations Manager", "HR Manager"],
  agriculture: ["Agronomist", "Agricultural Engineer", "Food Scientist", "Farm Manager", "Crop Researcher"],
  engineering: ["Civil Engineer", "Electrical Engineer", "Mechanical Engineer", "Petroleum Engineer", "Structural Engineer"],
  arts:        ["Graphic Designer", "Architect", "Fashion Designer", "Filmmaker", "Illustrator"],
  finance:     ["Financial Analyst", "Accountant", "Investment Banker", "Actuary", "Auditor"],
  music:       ["Recording Artist", "Music Producer", "Music Teacher", "Sound Engineer", "Composer"],
  sports:      ["Sports Coach", "Physiotherapist", "Sports Manager", "Athletic Trainer", "Sports Journalist"],
  teaching:    ["Teacher", "Educational Psychologist", "Academic Researcher", "Curriculum Developer", "School Counsellor"],
};

const ANALYSIS_ITEMS = [
  { label: "Processing your interests & subjects" },
  { label: "Mapping Ghana career opportunities" },
  { label: "Analysing education pathway fit" },
  { label: "Calculating skills alignment" },
  { label: "Generating personalised roadmap" },
];

// ─── Animation ────────────────────────────────────────────────────────────────

const fade = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.26 } },
  exit:   (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.18 } }),
};

// ─── buildPayload ─────────────────────────────────────────────────────────────

function buildPayload(form: FormState, name: string) {
  const workPrefs: string[] = [];
  if ((form.personality.problemSolving ?? 0) >= 3) workPrefs.push("analytical");
  if ((form.personality.teamwork       ?? 0) >= 3) workPrefs.push("people");
  if ((form.personality.creativity     ?? 0) >= 3) workPrefs.push("creative");
  if ((form.personality.practical      ?? 0) >= 3) workPrefs.push("physical");
  if ((form.personality.leadership     ?? 0) >= 3) workPrefs.push("business");
  form.interests.forEach((i) => {
    if (["technology", "business"].includes(i) && !workPrefs.includes("technology"))
      workPrefs.push("technology");
  });

  const workStyle =
    form.environment.includes("remote") ? "remote" :
    form.environment.includes("office") ? "office" :
    form.environment.includes("team")   ? "hybrid" : "flexible";

  const experienceLevel =
    ["working_professional", "career_switcher"].includes(form.education) ? "professional" :
    ["graduate", "university_student", "polytechnic_student"].includes(form.education) ? "focused" : "explorer";

  return {
    name,
    education_stage:        form.education,
    experience_level:       experienceLevel,
    interests:              form.interests,
    skills:                 form.subjects,
    weak_areas:             [] as string[],
    work_preferences:       [...new Set(workPrefs)],
    preferred_work_style:   workStyle,
    learning_mode:          "self_paced",
    availability:           "part_time",
    career_goals:           form.aspiration ? [form.aspiration] : [],
    industries_of_interest: form.interests,
    current_program:        "",
    preferred_next_step:    "",
  };
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function PrimaryBtn({ children, onClick, disabled, className }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors",
        "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done   = n < current;
        const active = n === current;
        return (
          <div key={i} className="flex items-center">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              done   ? "bg-indigo-600 text-white"
              : active ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
              : "bg-slate-100 text-slate-400",
            )}>
              {done ? <Check size={12} /> : n}
            </div>
            {i < total - 1 && (
              <div className={cn(
                "w-5 h-0.5 transition-all duration-300",
                n < current ? "bg-indigo-600" : "bg-slate-200",
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────────────────────

function WelcomeStep({ onStart, onExplore }: { onStart: () => void; onExplore: () => void }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Ghana accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-amber-400 to-green-500" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Logo pill */}
          <div className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <div className="w-5 h-5 rounded-md bg-indigo-500 flex items-center justify-center">
              <Rocket size={11} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white/70 tracking-wide">PathWise AI</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-5">
            Find your perfect<br />
            <span className="text-indigo-400">career path</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed max-w-md mx-auto mb-10">
            Answer 7 quick questions and our AI will map the best education programme,
            university course, and career path tailored for you in Ghana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <PrimaryBtn onClick={onStart} className="w-full sm:w-auto px-10 py-3.5 text-base rounded-xl">
              Begin Setup <ArrowRight size={16} />
            </PrimaryBtn>
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-semibold text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all text-base"
            >
              Explore Careers
            </button>
          </div>

          <p className="text-sm text-slate-600">3 minutes · Free · No CV required</p>
        </motion.div>
      </div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="relative z-10 border-t border-white/5 px-8 py-6"
      >
        <div className="max-w-sm mx-auto grid grid-cols-3 gap-4">
          {[
            { value: "10,000+", label: "Students guided" },
            { value: "200+",    label: "Careers mapped" },
            { value: "8",       label: "Education stages" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step 1: Education ────────────────────────────────────────────────────────

function EducationStep({ value, onChange }: { value: string; onChange: (v: EducationStage) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Where are you right now?</h2>
        <p className="text-slate-500 mt-1.5 text-sm">Select your current education level to personalise your results.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EDUCATION_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.value}
              whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
              onClick={() => onChange(opt.value as EducationStage)}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200",
                selected
                  ? "border-indigo-500 bg-indigo-50/70 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                selected ? "bg-indigo-100" : "bg-slate-100",
              )}>
                <Icon size={20} className={selected ? "text-indigo-600" : "text-slate-500"} />
              </div>
              <div className="min-w-0">
                <p className={cn("font-semibold text-sm", selected ? "text-indigo-900" : "text-slate-900")}>
                  {opt.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </div>
              {selected && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"
                >
                  <Check size={11} className="text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Interests ────────────────────────────────────────────────────────

function InterestsStep({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">What excites you?</h2>
        <p className="text-slate-500 mt-1.5 text-sm">Select at least one area that interests you most.</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {INTERESTS.map((item) => {
          const on = selected.includes(item.id);
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(item.id)}
              className={cn(
                "relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200",
                on
                  ? "border-indigo-500 bg-indigo-50/70 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                on ? "bg-indigo-100" : "bg-slate-100",
              )}>
                <Icon size={17} className={on ? "text-indigo-600" : "text-slate-500"} />
              </div>
              <span className={cn("text-sm font-medium leading-tight", on ? "text-indigo-900" : "text-slate-700")}>
                {item.label}
              </span>
              <AnimatePresence>
                {on && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center"
                  >
                    <Check size={9} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-sm text-indigo-600 font-medium">
          {selected.length} {selected.length === 1 ? "area" : "areas"} selected
        </p>
      )}
    </div>
  );
}

// ─── Step 3: Subjects ─────────────────────────────────────────────────────────

function SubjectsStep({ selected, onToggle }: { selected: string[]; onToggle: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Your favourite subjects?</h2>
        <p className="text-slate-500 mt-1.5 text-sm">Select all that apply — helps us align recommendations to your strengths.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((sub) => {
          const on = selected.includes(sub);
          return (
            <motion.button
              key={sub}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(sub)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all",
                on
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300",
              )}
            >
              {on && <Check size={12} className="inline mr-1.5 -mt-0.5" />}
              {sub}
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-sm text-indigo-600 font-medium">
          {selected.length} {selected.length === 1 ? "subject" : "subjects"} selected
        </p>
      )}
    </div>
  );
}

// ─── Step 4: Personality ──────────────────────────────────────────────────────

function PersonalityStep({
  answers,
  onChange,
}: {
  answers: Record<string, number>;
  onChange: (id: string, val: number) => void;
}) {
  const answered = PERSONALITY_QUESTIONS.filter((q) => (answers[q.id] ?? 0) > 0).length;
  const LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
  const COLORS = [
    "bg-red-500 border-red-500",
    "bg-orange-400 border-orange-400",
    "bg-amber-400 border-amber-400",
    "bg-teal-500 border-teal-500",
    "bg-indigo-600 border-indigo-600",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">How do you work best?</h2>
        <p className="text-slate-500 mt-1.5 text-sm">Rate each statement from 1 (strongly disagree) to 5 (strongly agree).</p>
      </div>

      <div className="space-y-3">
        {PERSONALITY_QUESTIONS.map((q, qi) => {
          const val = answers[q.id] ?? 0;
          return (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {qi + 1}
                </span>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.q}</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <motion.button
                    key={n}
                    whileHover={{ y: -1 }} whileTap={{ scale: 0.92 }}
                    onClick={() => onChange(q.id, n)}
                    className={cn(
                      "flex-1 h-10 rounded-lg text-sm font-semibold border-2 transition-all",
                      val === n
                        ? cn(COLORS[n - 1], "text-white shadow-sm")
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300",
                    )}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
              {val > 0 && (
                <p className="text-xs text-slate-400 mt-2">
                  {q.lo} → <span className="text-slate-600 font-medium">{LABELS[val - 1]}</span> → {q.hi}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{answered} of {PERSONALITY_QUESTIONS.length} answered</span>
        {answered === PERSONALITY_QUESTIONS.length && (
          <span className="text-indigo-600 font-semibold flex items-center gap-1">
            <BadgeCheck size={15} /> All done
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Step 5: Aspirations ──────────────────────────────────────────────────────

function AspirationsStep({
  value,
  interests,
  onChange,
}: {
  value: string; interests: string[]; onChange: (v: string) => void;
}) {
  const suggestions = [...new Set(interests.flatMap((i) => CAREER_SUGGESTIONS[i] ?? []))].slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Your dream career?</h2>
        <p className="text-slate-500 mt-1.5 text-sm">Type it in, or choose from AI suggestions based on your interests.</p>
      </div>

      <div className="relative">
        <Brain size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Software Engineer, Medical Doctor…"
          className={cn(
            "w-full pl-11 pr-4 py-3.5 rounded-xl border-2 outline-none text-sm font-medium transition-all",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "border-slate-200 focus:border-indigo-500",
          )}
        />
      </div>

      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles size={12} className="text-indigo-500" />
            Suggestions based on your interests
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <motion.button
                key={sug}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => onChange(sug)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium border-2 transition-all",
                  value === sug
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300",
                )}
              >
                {sug}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5 border border-slate-200">
        <MessageSquare size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Not sure? Skip this — our AI will suggest careers based on your interests and personality profile.
        </p>
      </div>
    </div>
  );
}

// ─── Step 6: Environment ──────────────────────────────────────────────────────

function EnvironmentStep({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Where do you work best?</h2>
        <p className="text-slate-500 mt-1.5 text-sm">Choose all environments that suit your working style.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ENVIRONMENTS.map((env) => {
          const on = selected.includes(env.id);
          const Icon = env.icon;
          return (
            <motion.button
              key={env.id}
              whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(env.id)}
              className={cn(
                "relative flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200",
                on
                  ? "border-indigo-500 bg-indigo-50/70 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                on ? "bg-indigo-100" : "bg-slate-100",
              )}>
                <Icon size={18} className={on ? "text-indigo-600" : "text-slate-500"} />
              </div>
              <div>
                <p className={cn("text-sm font-semibold leading-tight", on ? "text-indigo-900" : "text-slate-800")}>
                  {env.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{env.desc}</p>
              </div>
              <AnimatePresence>
                {on && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"
                  >
                    <Check size={10} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 7: Analysis ─────────────────────────────────────────────────────────

function AnalysisStep({ form, onDone }: { form: FormState; onDone: (data: ResultsData) => void }) {
  const [completed, setCompleted] = useState<number[]>([]);
  const [error, setError] = useState("");
  const called = useRef(false);

  const run = useCallback(async () => {
    if (called.current) return;
    called.current = true;
    try {
      const payload = buildPayload(form, "User");

      const animateItems = async () => {
        for (let i = 0; i < ANALYSIS_ITEMS.length; i++) {
          await new Promise<void>((r) => setTimeout(r, 700 + i * 380));
          setCompleted((p) => [...p, i]);
        }
      };

      const apiCalls = async () => {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const [recRes, stageRes] = await Promise.all([
          fetch("/api/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile: payload }),
          }),
          fetch("/api/stage-recommendations"),
        ]);
        const recJson   = await recRes.json().catch(() => ({ data: [] }));
        const stageJson = await stageRes.json().catch(() => ({ data: null }));
        return { careers: (recJson.data ?? []).slice(0, 4), stage: stageJson.data ?? null };
      };

      const [resultsData] = await Promise.all([
        apiCalls(),
        animateItems(),
        new Promise<void>((r) => setTimeout(r, 3500)),
      ]);
      onDone(resultsData);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }, [form, onDone]);

  useEffect(() => { run(); }, [run]);

  const pct = Math.round((completed.length / ANALYSIS_ITEMS.length) * 100);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-[440px] h-[440px] rounded-full bg-indigo-600/15 blur-[100px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-sm">
        {/* Spinner */}
        <div className="relative w-24 h-24 mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500"
          />
          <div className="absolute inset-2 rounded-full bg-indigo-600/15 flex items-center justify-center">
            <Sparkles size={26} className="text-indigo-400" />
          </div>
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <motion.span
              key={pct}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-base font-bold text-white"
            >
              {pct}%
            </motion.span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-1.5">Analysing your profile</h2>
        <p className="text-slate-400 text-sm mb-10">Building your personalised career roadmap…</p>

        <div className="w-full space-y-2.5">
          {ANALYSIS_ITEMS.map((item, i) => {
            const done    = completed.includes(i);
            const current = i === completed.length;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: i <= completed.length ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                  done    ? "bg-indigo-500/10 border-indigo-500/20"
                  : current ? "bg-white/5 border-white/8"
                  : "border-transparent",
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                  done ? "bg-indigo-500" : "bg-white/8",
                )}>
                  {done
                    ? <Check size={13} className="text-white" />
                    : <span className="text-xs text-slate-500 font-semibold">{i + 1}</span>
                  }
                </div>
                <span className={cn("text-sm text-left", done ? "text-indigo-300" : "text-slate-500")}>
                  {item.label}
                </span>
                {current && !done && (
                  <motion.div
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {error && <p className="mt-6 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
}

// ─── Step 8: Results ──────────────────────────────────────────────────────────

function ResultsStep({ results, form, onDashboard }: {
  results: ResultsData; form: FormState; onDashboard: () => void;
}) {
  const edu    = EDUCATION_OPTIONS.find((e) => e.value === form.education);
  const EduIcon = edu?.icon ?? BookOpen;

  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-indigo-600 p-6 text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-indigo-200" />
            <span className="text-xs font-bold tracking-widest text-indigo-200 uppercase">
              AI Analysis Complete
            </span>
          </div>
          <h2 className="text-2xl font-extrabold">Your results are ready!</h2>
          {results.stage && (
            <p className="text-indigo-100 text-sm mt-1.5 leading-relaxed">{results.stage.headline}</p>
          )}
        </div>
      </motion.div>

      {/* Pathway */}
      {results.stage && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Target size={15} className="text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Recommended Pathway
            </span>
          </div>
          <p className="font-semibold text-slate-900 text-sm leading-snug">{results.stage.subheadline}</p>
          {results.stage.nextStepMessage && (
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{results.stage.nextStepMessage}</p>
          )}
        </motion.div>
      )}

      {/* Career matches */}
      {results.careers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <TrendingUp size={13} className="text-indigo-600" />
            </div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Career Matches</span>
          </div>
          <div className="space-y-2.5">
            {results.careers.map((career, i) => (
              <motion.div
                key={career.careerId}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.07 }}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">{career.careerTitle}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex-shrink-0">
                    {career.matchScore}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${career.matchScore}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
                {career.matchReasons?.[0] && (
                  <p className="text-xs text-slate-500 mt-1.5">{career.matchReasons[0]}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Profile summary */}
      {edu && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <EduIcon size={18} className="text-indigo-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400">Your profile</p>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {edu.label}
              {form.interests.length > 0 && ` · ${form.interests.slice(0, 2).join(", ")}${form.interests.length > 2 ? ` +${form.interests.length - 2}` : ""}`}
            </p>
          </div>
          <Star size={14} className="ml-auto text-amber-400 fill-amber-400 flex-shrink-0" />
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      >
        <PrimaryBtn onClick={onDashboard} className="w-full py-4 text-base">
          <Zap size={16} /> Go to My Dashboard <ArrowRight size={16} />
        </PrimaryBtn>
        <p className="text-center text-xs text-slate-400 mt-2.5">
          Full roadmaps, skill gap analysis, and AI advisor await you
        </p>
      </motion.div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const DRAFT_KEY = "pathwise-onboarding-v2";

const defaultForm: FormState = {
  education:   "",
  interests:   [],
  subjects:    [],
  personality: {},
  aspiration:  "",
  environment: [],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [dir,  setDir]        = useState(1);
  const [form, setForm]       = useState<FormState>(defaultForm);
  const [results, setResults] = useState<ResultsData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setForm(s.form ?? defaultForm);
        setStep(s.step ?? 0);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (step > 0 && step < 7) {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step })); } catch { /* ignore */ }
    }
  }, [form, step]);

  const update = useCallback((patch: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...patch }));
  }, []);

  const go = useCallback((n: number) => {
    setDir(n > 0 ? 1 : -1);
    setStep((s) => s + n);
  }, []);

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return form.education !== "";
      case 2: return form.interests.length >= 1;
      case 3: return form.subjects.length >= 1;
      case 4: return PERSONALITY_QUESTIONS.every((q) => (form.personality[q.id] ?? 0) > 0);
      case 5: return true;
      case 6: return form.environment.length >= 1;
      default: return true;
    }
  };

  // Full-screen steps bypass the shell
  if (step === 0) {
    return <WelcomeStep onStart={() => go(1)} onExplore={() => router.push("/careers")} />;
  }

  if (step === 7) {
    return (
      <AnalysisStep
        form={form}
        onDone={(data) => {
          setResults(data);
          localStorage.removeItem(DRAFT_KEY);
          go(1);
        }}
      />
    );
  }

  if (step === 8 && results) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key="results" custom={dir} variants={fade} initial="enter" animate="center" exit="exit">
              <ResultsStep
                results={results}
                form={form}
                onDashboard={() => {
                  localStorage.removeItem(DRAFT_KEY);
                  router.push("/dashboard");
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const stepContent: Record<number, React.ReactNode> = {
    1: (
      <EducationStep
        value={form.education}
        onChange={(v) => update({ education: v })}
      />
    ),
    2: (
      <InterestsStep
        selected={form.interests}
        onToggle={(id) =>
          update({
            interests: form.interests.includes(id)
              ? form.interests.filter((x) => x !== id)
              : [...form.interests, id],
          })
        }
      />
    ),
    3: (
      <SubjectsStep
        selected={form.subjects}
        onToggle={(s) =>
          update({
            subjects: form.subjects.includes(s)
              ? form.subjects.filter((x) => x !== s)
              : [...form.subjects, s],
          })
        }
      />
    ),
    4: (
      <PersonalityStep
        answers={form.personality}
        onChange={(id, val) => update({ personality: { ...form.personality, [id]: val } })}
      />
    ),
    5: (
      <AspirationsStep
        value={form.aspiration}
        interests={form.interests}
        onChange={(v) => update({ aspiration: v })}
      />
    ),
    6: (
      <EnvironmentStep
        selected={form.environment}
        onToggle={(id) =>
          update({
            environment: form.environment.includes(id)
              ? form.environment.filter((x) => x !== id)
              : [...form.environment, id],
          })
        }
      />
    ),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3.5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Rocket size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800">PathWise</span>
          </div>

          {/* Step dots */}
          <StepDots current={step} total={TOTAL_VISIBLE_STEPS} />

          {/* Step counter */}
          <span className="text-xs text-slate-400 w-10 text-right flex-shrink-0">
            {step}/{TOTAL_VISIBLE_STEPS}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-8 pb-36">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={fade}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => go(-1)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={16} /> Back
            </motion.button>
          )}
          <PrimaryBtn
            onClick={() => go(1)}
            disabled={!canProceed()}
            className="flex-1 py-3"
          >
            {step === 6 ? (
              <><Sparkles size={15} /> Analyse My Profile</>
            ) : (
              <>Continue <ChevronRight size={16} /></>
            )}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}
