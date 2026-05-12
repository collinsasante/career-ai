// ─────────────────────────────────────────────
// Core domain types for PathWise
// ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  program: string;
  level: StudentLevel;
  experience_level?: ExperienceLevel;
  work_preferences?: WorkPreference[];
  interests: string[];
  skills: string[];
  weak_areas: string[];
  favorite_subjects: string[];
  career_goals: string[];
  preferred_work_style: WorkStyle;
  learning_mode: LearningMode;
  availability: Availability;
  industries_of_interest: string[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type StudentLevel =
  | "year_1"
  | "year_2"
  | "year_3"
  | "year_4"
  | "postgraduate"
  | "recent_graduate"
  | "professional";

export type WorkStyle = "remote" | "office" | "hybrid" | "flexible";

export type LearningMode =
  | "self_paced"
  | "structured"
  | "bootcamp"
  | "university"
  | "mentorship";

export type Availability =
  | "full_time"
  | "part_time"
  | "weekends"
  | "evenings"
  | "limited";

// ─────────────────────────────────────────────
// Career types
// ─────────────────────────────────────────────

export interface Career {
  id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  avg_salary_min: number;
  avg_salary_max: number;
  job_demand: JobDemand;
  required_skills: string[];
  tools: string[];
  industries: string[];
  work_styles: string[];
  possible_roles: string[];
  time_to_ready: string;
  icon: string;
  category: CareerCategory;
  created_at: string;
}

export type JobDemand = "low" | "moderate" | "high" | "very_high";

export type CareerCategory =
  | "software"
  | "data"
  | "design"
  | "security"
  | "management"
  | "infrastructure"
  | "ai"
  | "healthcare"
  | "law"
  | "business"
  | "education"
  | "engineering"
  | "creative"
  | "science"
  | "media"
  | "social"
  | "finance"
  | "legal"
  | "environment"
  | "construction"
  | "logistics"
  | "hospitality"
  | "agriculture"
  | "real-estate"
  | "sports"
  | "nonprofit"
  | "government"
  | "trades";

export type CareerSector =
  | "computing-technology"
  | "data-ai"
  | "engineering"
  | "health-sciences"
  | "business-management"
  | "arts-design-media"
  | "legal-compliance"
  | "education-social"
  | "trades-vocational"
  | "environment";

export const CATEGORY_TO_SECTOR: Record<CareerCategory, CareerSector> = {
  software:       "computing-technology",
  security:       "computing-technology",
  infrastructure: "computing-technology",
  data:           "data-ai",
  ai:             "data-ai",
  design:         "arts-design-media",
  creative:       "arts-design-media",
  media:          "arts-design-media",
  management:     "business-management",
  business:       "business-management",
  finance:        "business-management",
  logistics:      "business-management",
  hospitality:    "business-management",
  "real-estate":  "business-management",
  healthcare:     "health-sciences",
  science:        "health-sciences",
  sports:         "health-sciences",
  legal:          "legal-compliance",
  law:            "legal-compliance",
  education:      "education-social",
  social:         "education-social",
  nonprofit:      "education-social",
  government:     "education-social",
  engineering:    "engineering",
  construction:   "trades-vocational",
  trades:         "trades-vocational",
  agriculture:    "environment",
  environment:    "environment",
};

export const SECTOR_LABELS: Record<CareerSector, string> = {
  "computing-technology": "Computing & Technology",
  "data-ai":              "Data & AI",
  "engineering":          "Engineering",
  "health-sciences":      "Health Sciences",
  "business-management":  "Business & Finance",
  "arts-design-media":    "Arts, Design & Media",
  "legal-compliance":     "Legal & Compliance",
  "education-social":     "Education & Social",
  "trades-vocational":    "Trades & Vocational",
  "environment":          "Environment & Agriculture",
};

export type ExperienceLevel = "explorer" | "focused" | "professional";

export type EducationStage =
  | "jhs_student"
  | "shs_student"
  | "tvet_student"
  | "polytechnic_student"
  | "university_student"
  | "graduate"
  | "working_professional"
  | "career_switcher";

export const EDUCATION_STAGE_LABELS: Record<EducationStage, string> = {
  jhs_student:          "JHS Student",
  shs_student:          "SHS Student",
  tvet_student:         "TVET Student",
  polytechnic_student:  "Polytechnic Student",
  university_student:   "University Student",
  graduate:             "Graduate",
  working_professional: "Working Professional",
  career_switcher:      "Career Switcher",
};

export type WorkPreference =
  | "technology"
  | "people"
  | "creative"
  | "analytical"
  | "physical"
  | "business";

// ─────────────────────────────────────────────
// Recommendation types
// ─────────────────────────────────────────────

export interface Recommendation {
  id: string;
  user_id: string;
  career_id: string;
  career?: Career;
  match_score: number;
  match_reasons: string[];
  skill_gaps: string[];
  matching_skills: string[];
  generated_at: string;
}

export interface RecommendationResult {
  career: Career;
  match_score: number;
  match_reasons: string[];
  skill_gaps: string[];
  matching_skills: string[];
}

// ─────────────────────────────────────────────
// Learning roadmap types
// ─────────────────────────────────────────────

export interface LearningRoadmap {
  id: string;
  career_id: string;
  title: string;
  description: string;
  total_weeks: number;
  phases: RoadmapPhase[];
}

export interface RoadmapPhase {
  id: string;
  phase_number: number;
  title: string;
  description: string;
  duration_weeks: number;
  skills_covered: string[];
  steps: RoadmapStep[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  resources: Resource[];
  estimated_hours: number;
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  provider: string;
  url?: string;
  is_free: boolean;
  skill_level: SkillLevel;
}

export type ResourceType =
  | "course"
  | "book"
  | "tool"
  | "certification"
  | "project"
  | "community"
  | "documentation";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

// ─────────────────────────────────────────────
// Saved careers
// ─────────────────────────────────────────────

export interface SavedCareer {
  id: string;
  user_id: string;
  career_id: string;
  career?: Career;
  saved_at: string;
}

// ─────────────────────────────────────────────
// Roadmap progress
// ─────────────────────────────────────────────

export interface RoadmapProgress {
  id: string;
  user_id: string;
  career_id: string;
  completed_steps: string[];
  started_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Onboarding form types
// ─────────────────────────────────────────────

export interface OnboardingData {
  name: string;
  education_stage: EducationStage;
  current_program: string;
  academic_background: string;
  preferred_next_step: string;
  certification_interest: boolean;
  entrepreneurial_interest: boolean;
  /** @deprecated use education_stage — kept for backwards compat */
  experience_level: ExperienceLevel;
  work_preferences: WorkPreference[];
  interests: string[];
  skills: string[];
  weak_areas: string[];
  preferred_work_style: WorkStyle;
  learning_mode: LearningMode;
  availability: Availability;
  career_goals: string[];
  industries_of_interest: string[];
}

// ─────────────────────────────────────────────
// Chat types
// ─────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ─────────────────────────────────────────────
// Auth types
// ─────────────────────────────────────────────

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ─────────────────────────────────────────────
// API response types
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}
