"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Check, Sparkles, BookOpen,
  GraduationCap, Wrench, Award, Briefcase, ArrowRight,
  TrendingUp, BadgeCheck, Rocket, MapPin, Star,
  Brain, Target, Zap, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EducationStage } from "@/lib/types";

// ─── Local types ──────────────────────────────────────────────────────────────

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

const STEPS = [
  "welcome", "education", "interests", "subjects",
  "personality", "aspirations", "environment", "analysis", "results",
] as const;

const TOTAL_VISIBLE_STEPS = 7; // steps 1–7 (education → environment)

const EDUCATION_OPTIONS = [
  { value: "jhs_student",         label: "JHS Student",         desc: "Junior High School",              emoji: "📚", grad: "from-sky-500 to-blue-600" },
  { value: "shs_student",         label: "SHS Student",         desc: "Senior High School",              emoji: "🎓", grad: "from-emerald-500 to-teal-600" },
  { value: "tvet_student",        label: "TVET Student",        desc: "Technical & Vocational Training", emoji: "🔧", grad: "from-orange-500 to-amber-600" },
  { value: "university_student",  label: "University Student",  desc: "Degree Programme",                emoji: "🏛️", grad: "from-violet-500 to-purple-600" },
  { value: "graduate",            label: "Graduate",            desc: "Completed Tertiary Education",    emoji: "🏆", grad: "from-rose-500 to-pink-600" },
] as const;

const INTERESTS = [
  { id: "technology",  label: "Technology",  emoji: "💻", bg: "bg-blue-50   dark:bg-blue-950/40  border-blue-200   dark:border-blue-800",   sel: "border-blue-500   bg-blue-100   dark:bg-blue-900/60"  },
  { id: "healthcare",  label: "Healthcare",  emoji: "🏥", bg: "bg-red-50    dark:bg-red-950/40   border-red-200    dark:border-red-800",    sel: "border-red-500    bg-red-100    dark:bg-red-900/60"   },
  { id: "business",    label: "Business",    emoji: "💼", bg: "bg-amber-50  dark:bg-amber-950/40 border-amber-200  dark:border-amber-800",  sel: "border-amber-500  bg-amber-100  dark:bg-amber-900/60" },
  { id: "agriculture", label: "Agriculture", emoji: "🌱", bg: "bg-green-50  dark:bg-green-950/40 border-green-200  dark:border-green-800",  sel: "border-green-500  bg-green-100  dark:bg-green-900/60" },
  { id: "engineering", label: "Engineering", emoji: "⚙️", bg: "bg-slate-50  dark:bg-slate-800/40 border-slate-200  dark:border-slate-700",  sel: "border-slate-500  bg-slate-100  dark:bg-slate-800/80" },
  { id: "arts",        label: "Arts",        emoji: "🎨", bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800", sel: "border-purple-500 bg-purple-100 dark:bg-purple-900/60"},
  { id: "finance",     label: "Finance",     emoji: "📊", bg: "bg-teal-50   dark:bg-teal-950/40  border-teal-200   dark:border-teal-800",   sel: "border-teal-500   bg-teal-100   dark:bg-teal-900/60"  },
  { id: "music",       label: "Music",       emoji: "🎵", bg: "bg-pink-50   dark:bg-pink-950/40  border-pink-200   dark:border-pink-800",   sel: "border-pink-500   bg-pink-100   dark:bg-pink-900/60"  },
  { id: "sports",      label: "Sports",      emoji: "⚽", bg: "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800", sel: "border-orange-500 bg-orange-100 dark:bg-orange-900/60"},
  { id: "teaching",    label: "Teaching",    emoji: "📖", bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800", sel: "border-indigo-500 bg-indigo-100 dark:bg-indigo-900/60"},
] as const;

const SUBJECTS = [
  "Mathematics", "Science", "ICT", "English", "Social Studies",
  "Biology", "Chemistry", "Physics", "Economics", "Literature",
  "Geography", "History", "Business Studies", "Agricultural Science", "Technical Drawing",
];

const PERSONALITY_QUESTIONS = [
  { id: "problemSolving", emoji: "🧩", q: "How much do you enjoy solving complex problems?",  lo: "Not really",     hi: "Absolutely love it" },
  { id: "teamwork",       emoji: "🤝", q: "Do you prefer working in a team over going solo?",  lo: "Prefer solo",     hi: "Love teamwork" },
  { id: "leadership",     emoji: "🎯", q: "Do you enjoy taking charge and leading others?",    lo: "Prefer to follow",hi: "Born leader" },
  { id: "practical",      emoji: "🔨", q: "Do you prefer hands-on work over theory?",         lo: "Love theory",     hi: "Hands-on always" },
  { id: "creativity",     emoji: "✨", q: "How important is creativity in your ideal career?", lo: "Not important",   hi: "Essential" },
];

const ENVIRONMENTS = [
  { id: "remote",       label: "Remote / Online",    emoji: "🏠", desc: "Work from anywhere" },
  { id: "office",       label: "Office-Based",        emoji: "🏢", desc: "Corporate setting" },
  { id: "outdoor",      label: "Outdoor / Field",     emoji: "🌿", desc: "Nature & open spaces" },
  { id: "flexible",     label: "Flexible",            emoji: "⚡", desc: "Mix of environments" },
  { id: "team",         label: "Team Environment",    emoji: "👥", desc: "Always collaborative" },
  { id: "independent",  label: "Independent",         emoji: "🎯", desc: "Own your schedule" },
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
  { label: "Processing your interests & subjects",       icon: "🎯" },
  { label: "Mapping Ghana career opportunities",         icon: "🌍" },
  { label: "Analysing education pathway fit",            icon: "🏛️" },
  { label: "Calculating skills alignment",               icon: "⚡" },
  { label: "Generating personalised roadmap",            icon: "🗺️" },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 72 : -72, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 340, damping: 30 } },
  exit:   (dir: number) => ({ x: dir > 0 ? -72 : 72, opacity: 0, scale: 0.97, transition: { duration: 0.18 } }),
};

// ─── Helper: map form → API payload ──────────────────────────────────────────

function buildPayload(form: FormState, name: string) {
  const workPrefs: string[] = [];
  if ((form.personality.problemSolving ?? 0) >= 3) workPrefs.push("analytical");
  if ((form.personality.teamwork       ?? 0) >= 3) workPrefs.push("people");
  if ((form.personality.creativity     ?? 0) >= 3) workPrefs.push("creative");
  if ((form.personality.practical      ?? 0) >= 3) workPrefs.push("physical");
  if ((form.personality.leadership     ?? 0) >= 3) workPrefs.push("business");
  form.interests.forEach((i) => { if (["technology", "business"].includes(i) && !workPrefs.includes("technology")) workPrefs.push("technology"); });

  const workStyle =
    form.environment.includes("remote")      ? "remote"   :
    form.environment.includes("office")      ? "office"   :
    form.environment.includes("team")        ? "hybrid"   : "flexible";

  const experienceLevel =
    ["working_professional", "career_switcher"].includes(form.education) ? "professional" :
    ["graduate", "university_student", "polytechnic_student"].includes(form.education) ? "focused" : "explorer";

  return {
    name,
    education_stage:       form.education,
    experience_level:      experienceLevel,
    interests:             form.interests,
    skills:                form.subjects,
    weak_areas:            [] as string[],
    work_preferences:      [...new Set(workPrefs)],
    preferred_work_style:  workStyle,
    learning_mode:         "self_paced",
    availability:          "part_time",
    career_goals:          form.aspiration ? [form.aspiration] : [],
    industries_of_interest: form.interests,
    current_program:       "",
    preferred_next_step:   "",
  };
}

// ─── Shared UI components ─────────────────────────────────────────────────────

function GradientBtn({ children, onClick, disabled, className }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick} disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white text-sm",
        "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25",
        "hover:from-indigo-700 hover:to-violet-700 transition-all",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (TOTAL_VISIBLE_STEPS - 1)) * 100;
  return (
    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      />
    </div>
  );
}

// ─── Step 0: Welcome ─────────────────────────────────────────────────────────

function WelcomeStep({ onStart, onExplore }: { onStart: () => void; onExplore: () => void }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-blue-950">
      {/* Animated background blobs */}
      {[
        "top-[-10%] left-[-10%] w-[500px] h-[500px] from-indigo-600/30 to-violet-600/30 animate-blob",
        "top-[60%]  right-[-5%] w-[400px] h-[400px] from-violet-600/25 to-pink-600/25 animate-blob animation-delay-2000",
        "top-[30%]  left-[40%]  w-[350px] h-[350px] from-blue-600/20   to-cyan-600/20  animate-blob animation-delay-4000",
      ].map((cls, i) => (
        <div key={i} className={cn("absolute rounded-full bg-gradient-to-br blur-3xl pointer-events-none", cls)} />
      ))}

      {/* Ghana accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-green-600" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
        {/* Logo mark */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40"
        >
          <Rocket size={28} className="text-white" />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <span className="text-xs font-semibold tracking-widest text-indigo-300 uppercase mb-3 block">PathWise AI</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            Discover your best<br />
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              education & career
            </span><br />
            path in Ghana
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
            Answer a few questions and our AI will recommend the perfect SHS programme,
            university course, and career path built around who you are.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <GradientBtn onClick={onStart} className="flex-1 py-4 text-base">
            Get Started <ArrowRight size={16} />
          </GradientBtn>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onExplore}
            className="flex-1 py-4 rounded-2xl font-semibold text-white/80 border border-white/20 hover:bg-white/10 transition-all text-base"
          >
            Explore Careers
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="mt-6 text-xs text-slate-500"
        >
          Takes about 3 minutes · Free forever · No CV needed
        </motion.p>
      </div>

      <style>{`
        @keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.95)} }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

// ─── Step 1: Education Level ──────────────────────────────────────────────────

function EducationStep({ value, onChange }: { value: string; onChange: (v: EducationStage) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Where are you right now?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Select your current education level</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EDUCATION_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => onChange(opt.value as EducationStage)}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                selected
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-lg shadow-indigo-500/15"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700",
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gradient-to-br", opt.grad, "shadow-md")}>
                {opt.emoji}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{opt.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{opt.desc}</p>
              </div>
              {selected && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center"
                >
                  <Check size={12} className="text-white" />
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
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">What excites you?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Choose at least 2 areas that interest you most</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {INTERESTS.map((item) => {
          const on = selected.includes(item.id);
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
                on ? item.sel : item.bg,
              )}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className={cn("text-xs font-semibold", on ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                {item.label}
              </span>
              <AnimatePresence>
                {on && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"
                  >
                    <Check size={10} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-center text-xs text-indigo-500 dark:text-indigo-400 font-medium">
          {selected.length} selected
        </p>
      )}
    </div>
  );
}

// ─── Step 3: Favourite Subjects ───────────────────────────────────────────────

function SubjectsStep({ selected, onToggle }: { selected: string[]; onToggle: (s: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Your favourite subjects?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Tap all that apply — helps us align recommendations</p>
      </div>

      <div className="flex flex-wrap gap-2.5 justify-center">
        {SUBJECTS.map((sub) => {
          const on = selected.includes(sub);
          return (
            <motion.button
              key={sub}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(sub)}
              className={cn(
                "px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all",
                on
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md shadow-indigo-400/30"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400",
              )}
            >
              {on && <Check size={12} className="inline mr-1.5 -mt-0.5" />}
              {sub}
            </motion.button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-center text-xs text-indigo-500 dark:text-indigo-400 font-medium">
          {selected.length} subject{selected.length !== 1 ? "s" : ""} selected
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
  const allDone = answered === PERSONALITY_QUESTIONS.length;

  const LABELS = ["Not at all", "Not really", "Sometimes", "Mostly yes", "Absolutely!"];
  const COLORS = ["bg-red-500", "bg-orange-400", "bg-amber-400", "bg-teal-500", "bg-indigo-500"];

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">How do you work best?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Rate each statement honestly</p>
      </div>

      <div className="space-y-3">
        {PERSONALITY_QUESTIONS.map((q) => {
          const val = answers[q.id] ?? 0;
          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl mt-0.5">{q.emoji}</span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{q.q}</p>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <motion.button
                    key={n}
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => onChange(q.id, n)}
                    title={LABELS[n - 1]}
                    className={cn(
                      "flex-1 h-8 rounded-xl text-xs font-bold transition-all border-2",
                      val === n
                        ? cn(COLORS[n - 1], "text-white border-transparent shadow-md")
                        : "bg-slate-100 dark:bg-slate-700 border-transparent text-slate-500 dark:text-slate-400 hover:border-indigo-400",
                    )}
                  >
                    {n}
                  </motion.button>
                ))}
              </div>
              {val > 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 text-right">{LABELS[val - 1]}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>{answered}/{PERSONALITY_QUESTIONS.length} answered</span>
        {allDone && <span className="text-indigo-500 font-medium flex items-center gap-1"><BadgeCheck size={13} /> All done!</span>}
      </div>
    </div>
  );
}

// ─── Step 5: Career Aspirations ───────────────────────────────────────────────

function AspirationsStep({
  value,
  interests,
  onChange,
}: {
  value: string;
  interests: string[];
  onChange: (v: string) => void;
}) {
  const suggestions = [...new Set(interests.flatMap((i) => CAREER_SUGGESTIONS[i] ?? []))].slice(0, 8);

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Your dream career?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Type it in — or pick from AI suggestions below</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Brain size={18} className="text-indigo-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Software Engineer, Medical Doctor…"
          className={cn(
            "w-full pl-11 pr-4 py-4 rounded-2xl border-2 text-sm font-medium",
            "bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
            "border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500",
            "outline-none transition-all placeholder:text-slate-400",
          )}
        />
      </div>

      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles size={13} className="text-indigo-500" />
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">AI SUGGESTIONS BASED ON YOUR INTERESTS</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <motion.button
                key={sug}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => onChange(sug)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-medium border-2 transition-all",
                  value === sug
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-400/25"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400",
                )}
              >
                {sug}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-3.5 border border-indigo-100 dark:border-indigo-900">
        <MessageSquare size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
          Not sure? That&apos;s okay — skip this and our AI will suggest careers based on your interests and personality.
        </p>
      </div>
    </div>
  );
}

// ─── Step 6: Work Environment ─────────────────────────────────────────────────

function EnvironmentStep({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Where do you work best?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">Select all environments that suit you</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ENVIRONMENTS.map((env) => {
          const on = selected.includes(env.id);
          return (
            <motion.button
              key={env.id}
              whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => onToggle(env.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center",
                on
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-md shadow-indigo-500/15"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-700",
              )}
            >
              <span className="text-3xl">{env.emoji}</span>
              <span className={cn("text-xs font-semibold", on ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{env.label}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 leading-tight">{env.desc}</span>
              <AnimatePresence>
                {on && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"
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

// ─── Step 7: AI Analysis ──────────────────────────────────────────────────────

function AnalysisStep({ form, onDone }: { form: FormState; onDone: (data: ResultsData) => void }) {
  const [items, setItems] = useState<number[]>([]); // which analysis items are complete
  const [error, setError] = useState("");
  const called = useRef(false);

  const run = useCallback(async () => {
    if (called.current) return;
    called.current = true;
    try {
      const payload = buildPayload(form, "User");
      // Animate progress items in parallel with API calls
      const animateItems = async () => {
        for (let i = 0; i < ANALYSIS_ITEMS.length; i++) {
          await new Promise<void>((r) => setTimeout(r, 650 + i * 400));
          setItems((prev) => [...prev, i]);
        }
      };
      const apiCalls = async () => {
        await fetch("/api/profile", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const recRes = await fetch("/api/recommendations", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: payload }),
        });
        const stageRes = await fetch("/api/stage-recommendations");
        const recJson = await recRes.json().catch(() => ({ data: [] }));
        const stageJson = await stageRes.json().catch(() => ({ data: null }));
        return { careers: (recJson.data ?? []).slice(0, 4), stage: stageJson.data ?? null };
      };
      const [resultsData] = await Promise.all([
        apiCalls(),
        animateItems(),
        new Promise<void>((r) => setTimeout(r, 3500)), // min display time
      ]);
      onDone(resultsData);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }, [form, onDone]);

  useEffect(() => { run(); }, [run]);

  const completed = items.length;
  const pct = Math.round((completed / ANALYSIS_ITEMS.length) * 100);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 overflow-hidden">
      {/* Glowing orb */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-3xl pointer-events-none"
      />

      {/* Rotating ring */}
      <div className="relative mb-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-28 h-28 rounded-full border-4 border-dashed border-indigo-500/40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50"
          >
            <Sparkles size={28} className="text-white" />
          </motion.div>
        </div>
        {/* Percentage */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <motion.span
            key={pct}
            initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-xl font-bold text-white"
          >
            {pct}%
          </motion.span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 mt-4">
        <h2 className="text-xl font-bold text-white text-center mb-1">Analysing your profile</h2>
        <p className="text-slate-400 text-center text-sm mb-8">Building your personalised career roadmap…</p>

        <div className="space-y-3">
          {ANALYSIS_ITEMS.map((item, i) => {
            const done = items.includes(i);
            const current = i === completed;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: i <= completed ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  done
                    ? "bg-indigo-500/15 border-indigo-500/30"
                    : current
                      ? "bg-white/5 border-white/15"
                      : "bg-white/3 border-white/8",
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0",
                  done ? "bg-indigo-500" : "bg-white/10",
                )}>
                  {done ? <Check size={14} className="text-white" /> : <span>{item.icon}</span>}
                </div>
                <span className={cn("text-sm", done ? "text-indigo-300" : "text-slate-400")}>{item.label}</span>
                {current && !done && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}

// ─── Step 8: Results ──────────────────────────────────────────────────────────

function ResultsStep({ results, form, onDashboard }: {
  results: ResultsData;
  form: FormState;
  onDashboard: () => void;
}) {
  const edu = EDUCATION_OPTIONS.find((e) => e.value === form.education);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-indigo-200" />
            <span className="text-xs font-bold tracking-widest text-indigo-200 uppercase">AI Analysis Complete</span>
          </div>
          <h2 className="text-2xl font-extrabold mb-1">Your results are ready! 🎉</h2>
          {results.stage && (
            <p className="text-indigo-100 text-sm leading-relaxed">{results.stage.headline}</p>
          )}
        </div>
      </motion.div>

      {/* Stage recommendation */}
      {results.stage && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Target size={15} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Recommended Pathway</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{results.stage.subheadline}</p>
          {results.stage.nextStepMessage && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{results.stage.nextStepMessage}</p>
          )}
        </motion.div>
      )}

      {/* Career matches */}
      {results.careers.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <TrendingUp size={13} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Top Career Matches</span>
          </div>
          <div className="space-y-2.5">
            {results.careers.map((career, i) => (
              <motion.div
                key={career.careerId}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{career.careerTitle}</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-2.5 py-1 rounded-full">
                    {career.matchScore}% match
                  </span>
                </div>
                {/* Match bar */}
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${career.matchScore}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  />
                </div>
                {career.matchReasons?.[0] && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{career.matchReasons[0]}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Education stage summary */}
      {edu && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
        >
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl", edu.grad)}>
            {edu.emoji}
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your profile</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{edu.label} · {form.interests.slice(0, 2).join(", ")}{form.interests.length > 2 ? ` +${form.interests.length - 2}` : ""}</p>
          </div>
          <Star size={14} className="ml-auto text-amber-400 fill-amber-400 flex-shrink-0" />
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        className="space-y-2.5"
      >
        <GradientBtn onClick={onDashboard} className="w-full py-4 text-base">
          <Zap size={16} />
          Go to My Dashboard
          <ArrowRight size={16} />
        </GradientBtn>
        <p className="text-center text-xs text-slate-400">
          Full roadmaps, skill gap analysis, and AI chat await you inside
        </p>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) { const saved = JSON.parse(raw); setForm(saved.form ?? defaultForm); setStep(saved.step ?? 0); }
    } catch { /* ignore */ }
  }, []);

  // Save draft
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
      case 2: return form.interests.length >= 2;
      case 3: return form.subjects.length >= 1;
      case 4: return PERSONALITY_QUESTIONS.every((q) => (form.personality[q.id] ?? 0) > 0);
      case 5: return true; // aspirations optional
      case 6: return form.environment.length >= 1;
      default: return true;
    }
  };

  // Full-screen steps (no shell)
  if (step === 0) {
    return (
      <WelcomeStep
        onStart={() => go(1)}
        onExplore={() => router.push("/careers")}
      />
    );
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 dark:from-slate-950 dark:via-indigo-950/20 dark:to-violet-950/20 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key="results" custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
              <ResultsStep
                results={results}
                form={form}
                onDashboard={() => { localStorage.removeItem(DRAFT_KEY); router.push("/dashboard"); }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Steps 1–6: standard shell with progress bar
  const stepContent: Record<number, React.ReactNode> = {
    1: <EducationStep value={form.education} onChange={(v) => update({ education: v })} />,
    2: <InterestsStep selected={form.interests} onToggle={(id) => update({ interests: form.interests.includes(id) ? form.interests.filter((x) => x !== id) : [...form.interests, id] })} />,
    3: <SubjectsStep  selected={form.subjects}  onToggle={(s)  => update({ subjects:  form.subjects.includes(s)   ? form.subjects.filter((x) => x !== s)   : [...form.subjects, s]  })} />,
    4: <PersonalityStep answers={form.personality} onChange={(id, val) => update({ personality: { ...form.personality, [id]: val } })} />,
    5: <AspirationsStep value={form.aspiration} interests={form.interests} onChange={(v) => update({ aspiration: v })} />,
    6: <EnvironmentStep selected={form.environment} onToggle={(id) => update({ environment: form.environment.includes(id) ? form.environment.filter((x) => x !== id) : [...form.environment, id] })} />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/40 dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/30">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <Rocket size={12} className="text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">PathWise</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Step {step} of {TOTAL_VISIBLE_STEPS}</span>
          </div>
          <ProgressBar step={step} />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800/60 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => go(-1)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <ChevronLeft size={16} /> Back
            </motion.button>
          )}
          <GradientBtn
            onClick={() => go(1)}
            disabled={!canProceed()}
            className="flex-1 py-3"
          >
            {step === 6 ? (
              <><Sparkles size={15} /> Analyse My Profile</>
            ) : (
              <>Continue <ChevronRight size={15} /></>
            )}
          </GradientBtn>
        </div>
      </div>
    </div>
  );
}
