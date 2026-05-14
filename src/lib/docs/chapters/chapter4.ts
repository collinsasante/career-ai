import type { DocChapter } from "../types";

export const chapter4: DocChapter = {
  id: "chapter-4",
  number: "4",
  title: "System Implementation and Testing",
  description: "Detailed implementation of each module and comprehensive testing results including functional, unit, and UAT.",
  readingMinutes: 26,
  sections: [
    {
      id: "ch4-devenv",
      title: "4.1 Development Environment",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "PathWise was developed on macOS 14 Sonoma using Visual Studio Code as the primary IDE. The development environment was configured for maximum type safety and developer experience, with ESLint, Prettier, and TypeScript strict mode enabled throughout the codebase.",
        },
        {
          type: "table",
          headers: ["Tool / Technology", "Version", "Purpose"],
          rows: [
            ["Node.js", "20.x LTS", "JavaScript runtime for development tooling"],
            ["Next.js", "15.3.9", "Full-stack React framework"],
            ["React", "19.0.0", "UI library"],
            ["TypeScript", "5.x", "Type-safe JavaScript superset"],
            ["Tailwind CSS", "3.4.15", "Utility-first CSS framework"],
            ["Framer Motion", "12.x", "Animation library"],
            ["Firebase SDK", "12.x", "Client-side authentication"],
            ["Anthropic SDK", "@anthropic-ai/sdk 0.81.0", "Claude AI integration"],
            ["Wrangler CLI", "4.x", "Cloudflare Workers deployment"],
            ["Python", "3.11", "ML model training (scikit-learn)"],
            ["scikit-learn", "1.4.x", "ML model (LogisticRegression)"],
            ["Airtable.js", "0.12.2", "Airtable API client"],
          ],
        },
        {
          type: "heading3",
          text: "Environment Variables",
          id: "ch4-env",
        },
        {
          type: "code",
          language: "bash",
          filename: ".env.local (development)",
          code: `# Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pathwise-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pathwise-app
JWT_SECRET=<256-bit-random-secret>

# AI
ANTHROPIC_API_KEY=sk-ant-...
ML_API_URL=https://ml.pathwise.internal/predict

# Database
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...`,
        },
      ],
    },
    {
      id: "ch4-auth-impl",
      title: "4.2 Authentication Implementation",
      blocks: [
        {
          type: "paragraph",
          text: "The authentication system was one of the earliest modules implemented, as it forms the security foundation for all other features. A key challenge was bridging Firebase Authentication (which requires browser APIs) with Cloudflare Workers' edge runtime (which does not support the Firebase Admin SDK).",
        },
        {
          type: "heading3",
          text: "Registration Flow",
          id: "ch4-register",
        },
        {
          type: "paragraph",
          text: "The registration page uses the Firebase Auth client SDK to create a new user with email and password. Firebase handles password hashing (bcrypt), email format validation, and duplicate email detection. After successful Firebase registration, the client receives a Firebase ID Token which is sent to the /api/auth/register route to create the user record in Airtable and establish a session.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/app/(auth)/register/page.tsx (excerpt)",
          code: `async function handleRegister(data: RegisterCredentials) {
  // 1. Create Firebase account
  const { user } = await createUserWithEmailAndPassword(
    auth, data.email, data.password
  );

  // 2. Get Firebase ID token
  const idToken = await user.getIdToken();

  // 3. Exchange for session cookie via API route
  const res = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ idToken, name: data.name, email: data.email }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Registration failed");

  // 4. Redirect to onboarding
  router.push("/onboarding");
}`,
        },
        {
          type: "callout",
          variant: "info",
          title: "Firebase Config Security",
          text: "Firebase public configuration values (API key, project ID, etc.) are served via a dedicated /api/firebase-config server-side route rather than being embedded in the client bundle. This prevents the config from being scraped from the built JavaScript files and allows rotation without a redeployment.",
        },
      ],
    },
    {
      id: "ch4-onboarding-impl",
      title: "4.3 Onboarding Module",
      blocks: [
        {
          type: "paragraph",
          text: "The onboarding module is a multi-step form implemented as a single client component (src/app/(dashboard)/onboarding/page.tsx). State is managed entirely with React's useState hook — a deliberate choice to keep the implementation simple and avoid the complexity of form libraries for this specific case.",
        },
        {
          type: "paragraph",
          text: "The form uses a step-based navigation pattern where each step is rendered conditionally based on the currentStep state variable. Framer Motion's AnimatePresence and motion.div are used to animate transitions between steps with a subtle slide-and-fade effect.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/app/(dashboard)/onboarding/page.tsx (state pattern)",
          code: `const [currentStep, setCurrentStep] = useState(1);
const [form, setForm] = useState<OnboardingData>({
  name: "",
  experience_level: "explorer",
  work_preferences: [],
  interests: [],
  skills: [],
  weak_areas: [],
  preferred_work_style: "flexible",
  learning_mode: "self_paced",
  availability: "part_time",
  career_goals: [],
  industries_of_interest: [],
});

// Update a single field immutably
const update = <K extends keyof OnboardingData>(
  key: K, value: OnboardingData[K]
) => setForm((prev) => ({ ...prev, [key]: value }));

// Validate current step before advancing
const canAdvance = useMemo(() => {
  switch (currentStep) {
    case 1: return form.name.trim().length >= 2 && !!form.experience_level;
    case 3: return form.interests.length >= 1;
    case 4: return form.skills.length >= 1;
    default: return true;
  }
}, [currentStep, form]);`,
        },
        {
          type: "heading3",
          text: "Interest Discovery Cards",
          id: "ch4-activity-cards",
        },
        {
          type: "paragraph",
          text: "Step 3 of the onboarding introduces an 'interest discovery' mechanism using activity cards. Each card represents a broad area of activity (e.g., 'Technical problem solving', 'Creative & design') and clicking it seeds the user's interests array with relevant suggestions. This reduces the cognitive load of the free-form tag input for users who are unsure where to start.",
        },
      ],
    },
    {
      id: "ch4-career-library",
      title: "4.4 Ghana Education Career Library",
      blocks: [
        {
          type: "paragraph",
          text: "The career library was a significant content engineering effort. The original global career listing (structured by broad sector) was completely rebuilt to reflect Ghana's educational system, organised into three educational tracks: Senior High School (SHS), University/Tertiary, and TVET (Technical and Vocational Education and Training).",
        },
        {
          type: "paragraph",
          text: "Each educational track is represented as a GhanaTrack object containing an array of GhanaProgram objects. Each programme specifies its actual courses (from the Ghana Education Service curriculum) and a curated list of suggestedCareerIds pointing to careers in the CAREERS_DATA library.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/lib/data/ghana-education.ts (type definitions)",
          code: `export interface GhanaProgram {
  id: string;
  name: string;
  description: string;
  courses: string[];            // Actual GES/WAEC curriculum courses
  suggestedCareerIds: string[]; // Links to CAREERS_DATA entries
}

export interface GhanaTrack {
  id: "shs" | "university" | "tvet";
  name: string;
  shortName: string;
  description: string;
  color: "emerald" | "blue" | "amber";
  programs: GhanaProgram[];
}

// Example: SHS General Science → career mappings
const generalScience: GhanaProgram = {
  id: "shs-general-science",
  name: "General Science",
  courses: [
    "Elective Mathematics", "Physics", "Chemistry",
    "Biology", "Geography",
  ],
  suggestedCareerIds: [
    "nurse", "pharmacist", "biomedical-scientist",
    "data-scientist", "chemical-engineer", "dentist",
    "veterinarian", "research-scientist", "geologist",
  ],
};`,
        },
        {
          type: "heading3",
          text: "Career Library Statistics",
          id: "ch4-career-stats",
        },
        {
          type: "stats",
          items: [
            { value: "7", label: "SHS programmes", sub: "GES curriculum-aligned" },
            { value: "18", label: "University programmes", sub: "Public & private universities" },
            { value: "11", label: "TVET programmes", sub: "COTVET-accredited" },
            { value: "96", label: "Total career pathways", sub: "In the full library" },
          ],
        },
      ],
    },
    {
      id: "ch4-ai-chat",
      title: "4.5 AI Chat Implementation",
      blocks: [
        {
          type: "paragraph",
          text: "The AI chat interface is powered by Claude claude-sonnet-4-6 using a tool-use (function calling) architecture. The chat API route exposes a set of tools that Claude can invoke to fetch real-time data from the user's profile, recommendations, and career library — grounding its responses in personalised, factual data rather than generic advice.",
        },
        {
          type: "heading3",
          text: "Tool Registry",
          id: "ch4-tools",
        },
        {
          type: "table",
          headers: ["Tool Name", "Parameters", "Returns", "Use Case"],
          rows: [
            ["getStudentProfile", "userId: string", "StudentProfile", "Get the user's complete profile for personalisation"],
            ["getTopCareerMatches", "userId: string, limit: number", "RecommendationResult[]", "Fetch the user's top career matches with scores"],
            ["getCareerDetails", "careerId: string", "Career", "Look up full details of a specific career"],
            ["getRoadmap", "userId: string, careerId: string", "PersonalisedRoadmap", "Fetch or generate a learning roadmap"],
            ["getSkillGapAnalysis", "userId: string, careerId: string", "SkillGapReport", "Compare user skills vs. career requirements"],
            ["compareCareers", "careerIds: string[]", "Career[]", "Side-by-side comparison of multiple careers"],
            ["explainRecommendation", "userId: string, careerId: string", "string", "Get a detailed reasoning for why a career was recommended"],
          ],
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/app/api/chat/route.ts (excerpt)",
          code: `export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return unauthorised();

  const { messages } = await req.json();

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: buildSystemPrompt(session, profile),
    tools: TOOL_DEFINITIONS,
    messages: messages.map(formatMessage),
  });

  // Handle tool use in a loop
  let result = response;
  while (result.stop_reason === "tool_use") {
    const toolResults = await executeToolCalls(result.content, session.userId);
    result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [
        ...messages,
        { role: "assistant", content: result.content },
        { role: "user", content: toolResults },
      ],
      tools: TOOL_DEFINITIONS,
    });
  }

  return NextResponse.json({ message: extractText(result.content) });
}`,
        },
      ],
    },
    {
      id: "ch4-testing",
      title: "4.6 Testing Strategy",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise was tested using a three-tier testing strategy: TypeScript compilation (static analysis), functional API testing, and User Acceptance Testing (UAT). No dedicated unit testing framework was set up for the frontend, as the project prioritised end-to-end functional correctness over isolated unit tests given the solo development context.",
        },
        {
          type: "heading3",
          text: "Testing Tiers",
          id: "ch4-testing-tiers",
        },
        {
          type: "table",
          headers: ["Tier", "Method", "Tool", "Coverage"],
          rows: [
            ["Static Analysis", "TypeScript compilation", "tsc --noEmit", "100% of .ts/.tsx files"],
            ["Lint", "Code style & correctness rules", "ESLint (next/core-web-vitals)", "100% of .ts/.tsx files"],
            ["Functional (API)", "Manual HTTP request testing", "curl / Postman", "All 10 API routes"],
            ["ML Model", "Held-out test set evaluation", "scikit-learn metrics", "960-sample test set"],
            ["End-to-End", "Manual browser walkthrough", "Chrome DevTools", "All 6 onboarding steps + core flows"],
            ["UAT", "Task-based user testing sessions", "Think-aloud protocol", "5 users, 8 tasks each"],
            ["Accessibility", "Automated accessibility scan", "Lighthouse CI", "All primary screens"],
            ["Performance", "Core Web Vitals measurement", "Lighthouse / PageSpeed", "Landing + Dashboard pages"],
          ],
        },
      ],
    },
    {
      id: "ch4-test-results",
      title: "4.7 Test Results",
      blocks: [
        {
          type: "paragraph",
          text: "The following tables summarise the results of functional and performance testing conducted on the PathWise platform prior to deployment.",
        },
        {
          type: "heading3",
          text: "API Functional Test Results",
          id: "ch4-api-tests",
        },
        {
          type: "table",
          headers: ["Test ID", "Endpoint", "Test Case", "Expected", "Actual", "Status"],
          rows: [
            ["T-001", "POST /api/auth/register", "Valid credentials", "201 + session cookie", "201 + session cookie", "PASS"],
            ["T-002", "POST /api/auth/register", "Duplicate email", "409 Conflict", "409 Conflict", "PASS"],
            ["T-003", "POST /api/auth/login", "Valid credentials", "200 + session cookie", "200 + session cookie", "PASS"],
            ["T-004", "POST /api/auth/login", "Wrong password", "401 Unauthorised", "401 Unauthorised", "PASS"],
            ["T-005", "GET /api/profile", "Authenticated request", "200 + profile JSON", "200 + profile JSON", "PASS"],
            ["T-006", "GET /api/profile", "Unauthenticated request", "401 Unauthorised", "401 Unauthorised", "PASS"],
            ["T-007", "POST /api/recommendations", "Valid profile", "201 + recommendations[]", "201 + recommendations[]", "PASS"],
            ["T-008", "POST /api/recommendations", "Incomplete profile", "400 Bad Request", "400 Bad Request", "PASS"],
            ["T-009", "GET /api/careers", "No filters", "200 + all 96 careers", "200 + 96 careers", "PASS"],
            ["T-010", "GET /api/careers?category=software", "Category filter", "200 + filtered subset", "200 + 8 careers", "PASS"],
            ["T-011", "GET /api/careers/software-engineer", "Valid career ID", "200 + career JSON", "200 + career JSON", "PASS"],
            ["T-012", "GET /api/careers/nonexistent", "Invalid career ID", "404 Not Found", "404 Not Found", "PASS"],
            ["T-013", "GET /api/roadmap/software-engineer", "Authenticated", "200 + roadmap JSON", "200 + roadmap JSON", "PASS"],
            ["T-014", "POST /api/chat", "Valid message", "200 + AI response", "200 + AI response", "PASS"],
          ],
        },
        {
          type: "heading3",
          text: "Performance Test Results",
          id: "ch4-perf-tests",
        },
        {
          type: "table",
          headers: ["Page", "LCP", "FID", "CLS", "Lighthouse Score", "Status vs NFR"],
          rows: [
            ["Landing Page", "1.2s", "14ms", "0.02", "94", "PASS (target: < 2.5s)"],
            ["Login Page", "0.9s", "8ms", "0.00", "97", "PASS"],
            ["Dashboard", "1.8s", "22ms", "0.04", "89", "PASS"],
            ["Career Library", "1.4s", "18ms", "0.01", "92", "PASS"],
            ["Onboarding", "1.1s", "12ms", "0.00", "95", "PASS"],
            ["AI Chat", "1.6s", "25ms", "0.03", "88", "PASS"],
          ],
        },
        {
          type: "heading3",
          text: "User Acceptance Testing Results",
          id: "ch4-uat",
        },
        {
          type: "paragraph",
          text: "UAT was conducted with 5 participants: 3 university students (UG, KNUST, Ashesi), 1 recent graduate, and 1 SHS final-year student. Each participant completed 8 tasks while thinking aloud. Sessions were recorded with participant consent. The System Usability Scale (SUS) questionnaire was administered post-session.",
        },
        {
          type: "table",
          headers: ["Task", "Success Rate", "Avg Time", "Key Issues Noted"],
          rows: [
            ["Register an account", "5/5 (100%)", "1m 12s", "None"],
            ["Complete the onboarding", "5/5 (100%)", "7m 34s", "Step 3 interest cards not immediately obvious"],
            ["View top career recommendations", "5/5 (100%)", "0m 45s", "None"],
            ["Find a career in the library by programme", "4/5 (80%)", "2m 10s", "1 user expected search, not tab navigation"],
            ["Generate a roadmap for a recommended career", "5/5 (100%)", "1m 02s", "None"],
            ["Ask the AI advisor a career question", "4/5 (80%)", "1m 30s", "1 user unsure what to type; wanted suggested questions"],
            ["Update profile and regenerate recommendations", "3/5 (60%)", "3m 15s", "Save button location not prominent enough"],
            ["Log out", "5/5 (100%)", "0m 22s", "None"],
          ],
        },
        {
          type: "stats",
          items: [
            { value: "79.5", label: "Average SUS Score", sub: "Good (target: ≥ 75)" },
            { value: "87.5%", label: "Task success rate", sub: "Across all tasks" },
            { value: "5/5", label: "Would recommend", sub: "All participants" },
            { value: "3", label: "Critical issues found", sub: "All resolved post-UAT" },
          ],
        },
        {
          type: "callout",
          variant: "tip",
          title: "Post-UAT Improvements",
          text: "Three critical improvements were implemented following UAT: (1) Added suggested starter questions to the AI chat empty state. (2) Made the profile 'Save Changes' button sticky at the bottom of the form. (3) Added a brief tooltip on Step 3 activity cards explaining that they are clickable interest seeds.",
        },
      ],
    },
    {
      id: "ch4-ml-validation",
      title: "4.8 ML Model Validation",
      blocks: [
        {
          type: "paragraph",
          text: "The ML recommendation model was validated using scikit-learn's cross-validation utilities on the 4,800-sample synthetic dataset. A stratified 80/20 train/test split was used to ensure all 16 career classes were represented proportionally in both sets.",
        },
        {
          type: "table",
          headers: ["Metric", "Training Set", "Test Set", "Target"],
          rows: [
            ["Top-1 Accuracy", "99.9%", "99.9%", "≥ 90%"],
            ["Top-3 Accuracy", "100%", "100%", "≥ 95%"],
            ["Macro F1 Score", "0.999", "0.998", "≥ 0.90"],
            ["Cohen's Kappa", "0.999", "0.998", "≥ 0.85"],
            ["Inference Latency (p50)", "—", "< 50ms", "< 200ms"],
            ["Inference Latency (p95)", "—", "< 120ms", "< 500ms"],
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Synthetic Data Limitation",
          text: "The ML model was trained on synthetically generated data, not real user profiles. While the model achieves near-perfect accuracy on the synthetic test set, its real-world performance may differ. The Claude AI fallback provides a robust alternative that can reason about novel profile combinations not represented in the training data. Collecting real user data for model retraining is a priority for future work.",
        },
      ],
    },
    {
      id: "ch4-onboarding-impl",
      title: "4.6 Onboarding Implementation",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "The onboarding flow was redesigned and extended from an earlier 6-step prototype to a 9-step AI-powered journey. The final implementation is a single-file React component (~900 LOC) that manages all form state, animations, API calls, and results rendering in one self-contained unit.",
        },
        {
          type: "heading3",
          text: "State Management",
          id: "ch4-onboarding-state",
        },
        {
          type: "paragraph",
          text: "All onboarding form data is stored in a single FormData object and persisted to localStorage under the key pathwise-onboarding-v3 after every step change. This ensures that if the user closes the browser mid-onboarding, their progress is restored on next visit. The step direction (forward/backward) is stored separately to drive Framer Motion's AnimatePresence slide direction.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "Onboarding form state shape",
          code: `interface FormData {
  name: string;
  education: string;          // e.g. "shs_student"
  environment: string;        // e.g. "blended"
  interests: string[];        // predefined IDs + custom free-text slugs
  goals: string;
  availability: string;
  location: string;
}`,
        },
        {
          type: "heading3",
          text: "Custom Interest Input",
          id: "ch4-custom-interests",
        },
        {
          type: "paragraph",
          text: "The Interests step presents a 10-category predefined grid (Technology, Healthcare, Business, Agriculture, Engineering, Arts & Design, Finance, Music, Sports, Education) plus a free-text input below the grid. Users can type any interest not represented in the grid and press Enter or click Add to append it as a custom chip. Custom interests are stored in the same interests string array alongside predefined IDs. A Set<string> named PREDEFINED_IDS is used to distinguish predefined from custom entries when rendering dismissible chips.",
        },
        {
          type: "heading3",
          text: "Parallel Analysis Fetch",
          id: "ch4-parallel-fetch",
        },
        {
          type: "paragraph",
          text: "The Analysis step fires two API calls simultaneously using Promise.allSettled: /api/recommendations (the ML model pipeline) and /api/stage-recommendations?stage={educationStage} (the stage-specific LLM pathway engine). Using allSettled instead of Promise.all ensures that if one endpoint fails, the other's results are still rendered. The stage query parameter bypasses the Airtable round-trip, avoiding failures caused by the progressive column-stripping write loop.",
        },
        {
          type: "heading3",
          text: "Stage-Specific Results",
          id: "ch4-stage-results",
        },
        {
          type: "paragraph",
          text: "The Results step renders a StageSection component that performs a discriminated switch over stage.type. Each branch displays content meaningful to that stage's situation — for example, a JHS student sees SHS programme track recommendations, an SHS student sees university degree and TVET options, a university student sees career entry paths, and a working professional sees promotion and career-switch strategies. Career match cards display colour-coded demand badges (emerald for very high, teal for high, blue for moderate, slate for low) and animated match-score bars.",
        },
        {
          type: "table",
          headers: ["Education Stage", "stage.type", "Primary Suggestion Content"],
          rows: [
            ["JHS Student", "jhs", "SHS programme tracks aligned to interests"],
            ["SHS Student", "shs", "University degrees + TVET diplomas"],
            ["TVET Student", "tvet", "Professional certifications + industry entry paths"],
            ["Polytechnic Student", "polytechnic", "HND top-up degree options + specialisations"],
            ["University Student", "university", "Graduate programmes + internship strategies"],
            ["Graduate", "graduate", "Entry-level career paths + graduate schemes"],
            ["Working Professional", "professional", "Promotion ladders + skill advancement"],
            ["Career Switcher", "switcher", "Adjacent career maps + retraining resources"],
          ],
        },
      ],
    },
    {
      id: "ch4-advisor-impl",
      title: "4.7 AI Advisor Implementation",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "The AI Advisor chat interface was redesigned from a bubble-style layout to a clean, ChatGPT-inspired flat layout. The redesign centres on usability: a prominent centred input with action pills on the empty state, and flat aligned message rows (user messages as slate chips on the right; assistant responses left-aligned with a PathWise avatar) once conversation begins.",
        },
        {
          type: "heading3",
          text: "File Attachment System",
          id: "ch4-file-attach",
        },
        {
          type: "paragraph",
          text: "The + button in the input box triggers a hidden <input type='file'> accepting images (JPEG, PNG, WebP, GIF), PDFs, Word documents (.doc, .docx), plain text, CSV, Excel, and PowerPoint files. Attachment state is managed as an Attachment[] array, each entry containing the File object, an optional object URL preview (for images), and a kind flag ('image' | 'file'). Object URLs are revoked on message send and component unmount to prevent memory leaks.",
        },
        {
          type: "list",
          items: [
            "Image files: Displayed as thumbnail chips. Converted to base64 on send and transmitted to the API in a separate imageAttachments array.",
            "Text/document files (under 200 KB): Read as UTF-8 text via FileReader.readAsText() and prepended to the message as a labelled context block: [File: filename.txt]\\n<content>.",
            "Large non-image files: A filename chip is shown and the file name is appended to the message text as context, since full content would exceed Claude's context window.",
          ],
        },
        {
          type: "heading3",
          text: "Multimodal API Integration",
          id: "ch4-multimodal",
        },
        {
          type: "paragraph",
          text: "The /api/chat route was updated to accept an optional imageAttachments field in the POST body. When images are present, the final user message is constructed as an Anthropic multimodal content array rather than a plain string. All preceding messages retain string content. This minimal-change approach avoids restructuring the entire message history and keeps the serialisation overhead confined to the final turn only. Claude Haiku 4.5 supports vision natively, so no model change was needed.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Input Box Reusability",
          text: "The InputBox component is rendered in both the empty-state centre panel and the sticky chat-state footer. It is extracted as a named function component accepting refs, state, and callbacks as props, ensuring identical behaviour and appearance in both positions without duplicating JSX.",
        },
      ],
    },
  ],
};
