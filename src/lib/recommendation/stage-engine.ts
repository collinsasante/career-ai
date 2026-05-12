/**
 * PathWise — Stage-Aware Recommendation Engine
 *
 * Produces personalised guidance based on the user's education/career stage.
 * Each stage returns a different output shape optimised for what that user
 * actually needs: programs, careers, certs, next steps, or advancement paths.
 */

import type { ProfileData } from "@/lib/airtable/client";
import type { EducationStage } from "@/lib/types";
import {
  SHS_PATHWAYS,
  TVET_TRACKS,
  UNIVERSITY_TRACKS,
  PROFESSIONAL_TRACKS,
  JHS_TO_SHS_GUIDE,
  type ShsPathway,
  type TvetTrack,
  type UniversityTrack,
  type ProfessionalTrack,
  type TertiaryProgram,
  type Certification,
} from "@/lib/data/progression-graph";
import { CAREERS_DATA } from "./careers-data";

// ─── Output types ─────────────────────────────────────────────────────────────

export interface SuggestedCareer {
  id: string;
  title: string;
  category: string;
  description: string;
  avgSalaryMin: number;
  avgSalaryMax: number;
  jobDemand: string;
  timeToReady: string;
  whyItFits: string;
}

export interface StageRecommendationBase {
  stage: EducationStage;
  headline: string;
  subheadline: string;
  nextStepMessage: string;
  alternativeRoutes: string[];
}

export interface JhsRecommendation extends StageRecommendationBase {
  type: "jhs";
  suggestedShsPrograms: { id: string; name: string; rationale: string }[];
  careerPreview: SuggestedCareer[];
}

export interface ShsRecommendation extends StageRecommendationBase {
  type: "shs";
  detectedPathway: ShsPathway | null;
  suggestedTertiaryPrograms: (TertiaryProgram & { rationale: string })[];
  careerOutcomes: SuggestedCareer[];
  tvetAlternatives: string[];
}

export interface TvetRecommendation extends StageRecommendationBase {
  type: "tvet";
  detectedTrack: TvetTrack | null;
  careerPaths: SuggestedCareer[];
  certifications: (Certification & { rationale: string })[];
  entrepreneurshipOpps: string[];
  apprenticeshipPaths: string[];
  advancedPrograms: string[];
}

export interface UniversityRecommendation extends StageRecommendationBase {
  type: "university" | "polytechnic";
  detectedTrack: UniversityTrack | null;
  careerMatches: SuggestedCareer[];
  certifications: (Certification & { rationale: string })[];
  internshipSectors: string[];
  specializations: string[];
  postgraduateOptions: string[];
}

export interface ProfessionalRecommendation extends StageRecommendationBase {
  type: "professional" | "graduate" | "switcher";
  detectedTrack: ProfessionalTrack | null;
  careerMatches: SuggestedCareer[];
  advancementPaths: { title: string; description: string }[];
  upskillCertifications: (Certification & { rationale: string })[];
  transitionPaths: { to: string; bridgeSkills: string[] }[];
  leadershipPrograms: string[];
}

export type StageRecommendation =
  | JhsRecommendation
  | ShsRecommendation
  | TvetRecommendation
  | UniversityRecommendation
  | ProfessionalRecommendation;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function careerById(id: string): SuggestedCareer | null {
  const c = CAREERS_DATA.find((x) => x.id === id);
  if (!c) return null;
  return {
    id: c.id,
    title: c.title,
    category: c.category,
    description: c.description,
    avgSalaryMin: c.avg_salary_min,
    avgSalaryMax: c.avg_salary_max,
    jobDemand: c.job_demand,
    timeToReady: c.time_to_ready,
    whyItFits: "",
  };
}

/** Score a career against a profile's interests + skills. Returns 0–100. */
function scoreCareer(careerId: string, profile: ProfileData): number {
  const career = CAREERS_DATA.find((c) => c.id === careerId);
  if (!career) return 0;

  const interests = profile.interests.map((i) => i.toLowerCase());
  const skills = profile.skills.map((s) => s.toLowerCase());

  let score = 50; // baseline

  // Skill overlap
  const matchedSkills = career.required_skills.filter((s) =>
    skills.some((ps) => ps.includes(s.toLowerCase()) || s.toLowerCase().includes(ps))
  );
  score += Math.min(30, matchedSkills.length * 6);

  // Interest alignment
  const interestHit = career.required_skills.concat(career.industries).some((tag) =>
    interests.some((i) => i.includes(tag.toLowerCase()) || tag.toLowerCase().includes(i))
  );
  if (interestHit) score += 20;

  return Math.min(100, score);
}

function topCareers(ids: string[], profile: ProfileData, limit = 5): SuggestedCareer[] {
  return ids
    .map((id) => {
      const c = careerById(id);
      if (!c) return null;
      const score = scoreCareer(id, profile);
      return { ...c, whyItFits: score > 70 ? "Strong skills & interests match" : score > 55 ? "Good alignment with your profile" : "Explored through this pathway" };
    })
    .filter((c): c is SuggestedCareer => c !== null)
    .sort((a, b) => scoreCareer(b.id, profile) - scoreCareer(a.id, profile))
    .slice(0, limit);
}

/** Match an SHS pathway from current_program or interests. */
function detectShsPathway(profile: ProfileData): ShsPathway | null {
  const program = (profile.currentProgram ?? "").toLowerCase();
  if (!program) return null;

  const directMatch = SHS_PATHWAYS.find((p) =>
    p.name.toLowerCase().includes(program) || program.includes(p.name.toLowerCase())
  );
  if (directMatch) return directMatch;

  // Try to infer from interests
  const interests = profile.interests.map((i) => i.toLowerCase());
  const scored = SHS_PATHWAYS.map((p) => {
    const overlap = p.careerIds.filter((cid) =>
      interests.some((i) => cid.includes(i) || i.includes(cid.split("_")[0]))
    ).length;
    return { pathway: p, score: overlap };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].pathway : null;
}

/** Match a TVET track from current_program. */
function detectTvetTrack(profile: ProfileData): TvetTrack | null {
  const program = (profile.currentProgram ?? "").toLowerCase();
  if (!program) {
    // Infer from interests
    const interests = profile.interests.join(" ").toLowerCase();
    const track = TVET_TRACKS.find((t) =>
      t.specializations.some((s) => interests.includes(s.toLowerCase()))
    );
    return track ?? null;
  }
  return (
    TVET_TRACKS.find((t) =>
      t.name.toLowerCase().includes(program) || program.includes(t.name.toLowerCase())
    ) ?? null
  );
}

/** Match a university track from current_program. */
function detectUniversityTrack(profile: ProfileData): UniversityTrack | null {
  const program = (profile.currentProgram ?? "").toLowerCase();
  const industries = profile.industries.map((i) => i.toLowerCase());

  if (program) {
    const direct = UNIVERSITY_TRACKS.find((t) =>
      t.name.toLowerCase().includes(program) || program.includes(t.name.toLowerCase())
    );
    if (direct) return direct;
  }

  // Infer from interests & industries
  const scored = UNIVERSITY_TRACKS.map((t) => {
    const overlap = t.careerIds.filter((cid) =>
      industries.some((ind) => cid.includes(ind) || ind.includes(cid.split("_")[0]))
    ).length;
    return { track: t, score: overlap };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].track : null;
}

function detectProfessionalTrack(profile: ProfileData): ProfessionalTrack | null {
  const industries = profile.industries.join(" ").toLowerCase();
  const goals = profile.careerGoals.join(" ").toLowerCase();
  const combined = `${industries} ${goals}`;

  return (
    PROFESSIONAL_TRACKS.find((t) =>
      combined.includes(t.sector.toLowerCase().split(" ")[0])
    ) ?? PROFESSIONAL_TRACKS[0]
  );
}

function withRationale<T extends Certification>(
  certs: T[],
  profile: ProfileData
): (T & { rationale: string })[] {
  const skills = profile.skills.map((s) => s.toLowerCase());
  return certs.map((c) => ({
    ...c,
    rationale:
      c.level === "foundation"
        ? "Great starting point — industry-recognised and achievable while studying"
        : skills.length > 3
          ? "Builds on your existing skills and significantly boosts employability"
          : "Industry-standard qualification for this career path",
  }));
}

// ─── Stage handlers ───────────────────────────────────────────────────────────

function buildJhsRecommendation(profile: ProfileData): JhsRecommendation {
  const interests = profile.interests.map((i) => i.toLowerCase());

  const suggestedShsPrograms = SHS_PATHWAYS.map((p) => {
    const overlap = p.careerIds.filter((cid) =>
      interests.some((i) => cid.includes(i.split(" ")[0]))
    ).length;
    return { id: p.id, name: p.name, overlap };
  })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 4)
    .map(({ id, name, overlap }) => ({
      id,
      name,
      rationale:
        overlap > 0
          ? "Aligns with your expressed interests"
          : "Broad programme with many career options",
    }));

  const topCareerIds = suggestedShsPrograms
    .flatMap((sp) => SHS_PATHWAYS.find((p) => p.id === sp.id)?.careerIds ?? [])
    .slice(0, 6);

  return {
    type: "jhs",
    stage: "jhs_student",
    headline: "Choose your SHS programme wisely",
    subheadline: "Your SHS programme is the first major career decision — let's make it the right one.",
    nextStepMessage: JHS_TO_SHS_GUIDE.message,
    suggestedShsPrograms,
    careerPreview: topCareers(topCareerIds, profile, 4),
    alternativeRoutes: [
      "TVET programmes directly after JHS (hands-on, faster entry to work)",
      "Apprenticeships in skilled trades",
    ],
  };
}

function buildShsRecommendation(profile: ProfileData): ShsRecommendation {
  const pathway = detectShsPathway(profile);

  const rawPrograms = pathway?.tertiaryPrograms ?? [];
  const suggestedTertiaryPrograms = rawPrograms.slice(0, 6).map((p) => ({
    ...p,
    rationale:
      p.level === "degree"
        ? `Leads directly to your ${pathway?.name ?? "chosen"} track career paths`
        : "Strong vocational alternative that gets you into the field faster",
  }));

  const careerIds = pathway?.careerIds ?? CAREERS_DATA.slice(0, 8).map((c) => c.id);

  return {
    type: "shs",
    stage: "shs_student",
    headline: pathway
      ? `SHS ${pathway.name} — Your Tertiary Options`
      : "SHS Student — Explore Your Tertiary Pathways",
    subheadline: pathway
      ? `Based on your ${pathway.name} programme, here are the best tertiary options and careers ahead.`
      : "Select your SHS programme to get personalised tertiary recommendations.",
    nextStepMessage: `After WASSCE, your next step is applying to tertiary institutions. Start researching ${rawPrograms[0]?.institutions.slice(0, 3).join(", ") ?? "universities like UG, KNUST, and Ashesi"} now.`,
    detectedPathway: pathway,
    suggestedTertiaryPrograms,
    careerOutcomes: topCareers(careerIds, profile, 6),
    tvetAlternatives: pathway?.tvetAlternatives ?? ["tvet_ict_digital", "tvet_electrical"],
    alternativeRoutes: [
      "TVET (Technical & Vocational): faster route into skilled work",
      "HND at polytechnics: practical 3-year route before topping up to a degree",
      "Professional certifications (e.g. ACCA, CompTIA) while working",
    ],
  };
}

function buildTvetRecommendation(profile: ProfileData): TvetRecommendation {
  const track = detectTvetTrack(profile);

  const careerIds = track?.careerIds ?? CAREERS_DATA.filter((c) =>
    ["trades", "engineering", "construction"].includes(c.category)
  ).map((c) => c.id).slice(0, 6);

  return {
    type: "tvet",
    stage: "tvet_student",
    headline: track
      ? `${track.name} — Career & Growth Paths`
      : "TVET Student — Your Vocational Career Paths",
    subheadline: track
      ? `Your ${track.name} training opens up solid career paths, certifications, and entrepreneurship opportunities.`
      : "Your TVET training is a launchpad — here's where it can take you.",
    nextStepMessage: track
      ? `After completing your COTVET programme, consider getting a ${track.certifications[0]?.name ?? "professional certification"} to boost your employability.`
      : "Complete your TVET programme, then pursue industry certifications to stand out.",
    detectedTrack: track,
    careerPaths: topCareers(careerIds, profile, 5),
    certifications: withRationale(track?.certifications ?? [], profile),
    entrepreneurshipOpps: track?.entrepreneurshipOpps ?? [
      "Start your own small business using your trade skills",
      "Offer freelance services in your local area",
    ],
    apprenticeshipPaths: track?.apprenticeshipPaths ?? ["Industry apprenticeship programmes"],
    advancedPrograms: track?.advancedPrograms ?? ["HND at technical university", "Top-up degree programme"],
    alternativeRoutes: [
      "HND at a technical university (e.g. KNUST, Accra Tech, Cape Coast Tech) — top up to a degree",
      "Distance learning BSc while working",
      "Entrepreneurship: start your own business using your trade",
    ],
  };
}

function buildUniversityRecommendation(
  profile: ProfileData,
  stage: "university_student" | "polytechnic_student"
): UniversityRecommendation {
  const track = detectUniversityTrack(profile);

  const careerIds = track?.careerIds ?? CAREERS_DATA.slice(0, 8).map((c) => c.id);

  return {
    type: stage === "polytechnic_student" ? "polytechnic" : "university",
    stage,
    headline: track
      ? `${track.name} — Careers & Certifications`
      : "University Student — Career Pathways",
    subheadline: track
      ? `Here's what your ${track.name} degree can lead to, and the certifications that will maximise your opportunities.`
      : "Start building career-relevant credentials now, while you study.",
    nextStepMessage: track
      ? `Start applying for internships in ${track.internshipSectors.slice(0, 2).join(" or ")} — employers value experience highly.`
      : "Secure at least one internship before graduation. It dramatically improves job prospects.",
    detectedTrack: track,
    careerMatches: topCareers(careerIds, profile, 6),
    certifications: withRationale(track?.certifications ?? [], profile),
    internshipSectors: track?.internshipSectors ?? ["Banking", "Technology", "NGOs", "Government"],
    specializations: track?.specializations ?? ["Data Analytics", "Project Management", "Digital Marketing"],
    postgraduateOptions: track?.postgraduateOptions ?? ["MBA", "MSc in your field", "Professional qualifications"],
    alternativeRoutes: [
      "Freelancing in your field while studying builds a portfolio",
      "Student entrepreneurship programmes (MEST, Tony Elumelu Foundation)",
      "Exchange programmes at international universities",
    ],
  };
}

function buildGraduateRecommendation(profile: ProfileData): ProfessionalRecommendation {
  const profTrack = detectProfessionalTrack(profile);
  const uniTrack = detectUniversityTrack(profile);
  const careerIds = uniTrack?.careerIds ?? profTrack?.currentRoles.slice(0, 5) as unknown as string[] ?? CAREERS_DATA.slice(0, 6).map((c) => c.id);

  return {
    type: "graduate",
    stage: "graduate",
    headline: "Graduate — Launch Your Career",
    subheadline: "You have your qualification — now let's get you your first role and build from there.",
    nextStepMessage: "Focus on your first 3 years: get a relevant role, build a portfolio, and pursue one certification. The first job is the hardest.",
    detectedTrack: profTrack,
    careerMatches: topCareers(careerIds as string[], profile, 6),
    advancementPaths: profTrack?.advancementPaths ?? [
      { title: "Junior → Mid-Level Professional", description: "2–3 years of solid execution and learning" },
      { title: "Mid-Level → Senior", description: "Lead projects, mentor peers, own outcomes" },
    ],
    upskillCertifications: withRationale(
      uniTrack?.certifications ?? profTrack?.upskillCertifications ?? [],
      profile
    ),
    transitionPaths: profTrack?.transitionPaths ?? [],
    leadershipPrograms: profTrack?.leadershipPrograms ?? ["Professional association membership", "Online leadership courses"],
    alternativeRoutes: [
      "National Service (for Ghanaian graduates) — use it strategically to gain sector experience",
      "Graduate trainee programmes at banks, telcos, and multinationals",
      "Startup / entrepreneurship — MEST Africa, Meltwater Entrepreneurial School of Technology",
    ],
  };
}

function buildProfessionalRecommendation(
  profile: ProfileData,
  stage: "working_professional" | "career_switcher"
): ProfessionalRecommendation {
  const profTrack = detectProfessionalTrack(profile);
  const careerIds = CAREERS_DATA
    .filter((c) => profile.industries.some((ind) => c.industries.some((ci) => ci.toLowerCase().includes(ind.toLowerCase()))))
    .map((c) => c.id)
    .slice(0, 6);

  return {
    type: stage === "career_switcher" ? "switcher" : "professional",
    stage,
    headline: stage === "career_switcher" ? "Career Switch — Your Bridge Plan" : "Working Professional — Level Up",
    subheadline:
      stage === "career_switcher"
        ? "Switching careers is a strategic move. Here's how to bridge from where you are to where you want to be."
        : "You're already in the field — here's how to accelerate your growth and maximise your impact.",
    nextStepMessage:
      stage === "career_switcher"
        ? "Start by identifying your transferable skills. Most switchers underestimate how much of their current expertise applies in a new field."
        : "Identify the next level in your career ladder and the 1–2 certifications or skills that will get you there.",
    detectedTrack: profTrack,
    careerMatches: topCareers(careerIds.length > 0 ? careerIds : CAREERS_DATA.slice(0, 6).map((c) => c.id), profile, 5),
    advancementPaths: profTrack?.advancementPaths ?? [
      { title: "Senior Professional", description: "Deepen expertise and take on larger scope" },
      { title: "Team Lead / Manager", description: "Lead people and programmes" },
      { title: "Director / C-Suite", description: "Own strategy at an organisational level" },
    ],
    upskillCertifications: withRationale(profTrack?.upskillCertifications ?? [], profile),
    transitionPaths:
      stage === "career_switcher"
        ? profTrack?.transitionPaths ?? [{ to: "Adjacent field", bridgeSkills: profile.skills.slice(0, 4) }]
        : [],
    leadershipPrograms: profTrack?.leadershipPrograms ?? ["Executive MBA", "Leadership coaching programme"],
    alternativeRoutes:
      stage === "career_switcher"
        ? [
            "Upskill via online courses (Coursera, edX, LinkedIn Learning) while keeping your current job",
            "Take on freelance projects in the new field to build a portfolio",
            "Network with people already in your target field — informational interviews",
          ]
        : [
            "Executive MBA for senior leadership track",
            "Mentorship programmes within your industry",
            "International assignments or secondments",
          ],
  };
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function buildStageRecommendation(profile: ProfileData): StageRecommendation {
  const stage = (profile.educationStage ?? "graduate") as EducationStage;

  switch (stage) {
    case "jhs_student":
      return buildJhsRecommendation(profile);
    case "shs_student":
      return buildShsRecommendation(profile);
    case "tvet_student":
      return buildTvetRecommendation(profile);
    case "university_student":
      return buildUniversityRecommendation(profile, "university_student");
    case "polytechnic_student":
      return buildUniversityRecommendation(profile, "polytechnic_student");
    case "graduate":
      return buildGraduateRecommendation(profile);
    case "working_professional":
      return buildProfessionalRecommendation(profile, "working_professional");
    case "career_switcher":
      return buildProfessionalRecommendation(profile, "career_switcher");
    default:
      return buildGraduateRecommendation(profile);
  }
}
