import type { DocChapter } from "../types";

export const chapter3: DocChapter = {
  id: "chapter-3",
  number: "3",
  title: "System Architecture",
  description: "Full technical architecture: frontend, backend, AI subsystems, database, authentication, and Cloudflare deployment.",
  readingMinutes: 22,
  sections: [
    {
      id: "ch3-overview",
      title: "3.1 Architectural Overview",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "PathWise is built on a serverless, edge-first architecture. The entire application — frontend, backend API, and middleware — is deployed as a single Next.js 15 application running on Cloudflare Workers via the OpenNext adapter. This architecture eliminates the operational complexity of managing servers, provides global edge distribution, and delivers consistently low latency for users across Ghana and beyond.",
        },
        {
          type: "paragraph",
          text: "The architectural stack is deliberately chosen to optimise for three constraints: developer velocity (a single full-stack framework handles frontend and backend), cost efficiency (serverless pay-per-request billing suits an early-stage platform), and performance (Cloudflare's 300+ edge locations minimise geographic latency for Ghanaian users connecting via West African internet infrastructure).",
        },
        {
          type: "stats",
          items: [
            { value: "Next.js 15", label: "App Router", sub: "Full-stack framework" },
            { value: "Cloudflare", label: "Edge Runtime", sub: "Workers + D1 + KV" },
            { value: "Claude AI", label: "LLM Provider", sub: "Anthropic claude-sonnet-4-6" },
            { value: "Firebase", label: "Auth Provider", sub: "Email/Password" },
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Architectural Decision: Monorepo vs Microservices",
          text: "PathWise uses a monorepo architecture where the Next.js application contains both the frontend and all API routes. This was chosen over a microservices approach to reduce operational complexity during the development phase. The ML inference endpoint is the only separate service, running on a dedicated Python FastAPI server to accommodate scikit-learn dependencies not compatible with the Cloudflare Workers runtime.",
        },
      ],
    },
    {
      id: "ch3-frontend",
      title: "3.2 Frontend Architecture",
      blocks: [
        {
          type: "paragraph",
          text: "The PathWise frontend is built with Next.js 15's App Router, React 19, and TypeScript. The App Router's nested layout system is used to implement the two main application shells: the public layout (landing, login, register, documentation) and the authenticated dashboard layout (sidebar navigation, persistent chat access).",
        },
        {
          type: "heading3",
          text: "Route Structure",
          id: "ch3-routes",
        },
        {
          type: "code",
          language: "text",
          filename: "src/app — Route Tree",
          code: `src/app/
├── (auth)/
│   ├── login/page.tsx          # Email/password login
│   └── register/page.tsx       # New account registration
├── (dashboard)/
│   ├── layout.tsx              # Auth guard → DashboardShell
│   ├── dashboard/page.tsx      # Career recommendations
│   ├── careers/page.tsx        # Ghana education pathway explorer
│   ├── careers/[id]/page.tsx   # Individual career detail
│   ├── roadmap/page.tsx        # Roadmap list
│   ├── roadmap/[careerId]/     # Personalised roadmap view
│   ├── chat/page.tsx           # AI advisor (ChatGPT-style, file upload)
│   ├── onboarding/page.tsx     # 9-step AI-powered onboarding
│   └── profile/page.tsx        # User profile editor
├── api/
│   ├── auth/                   # Firebase auth callbacks (login/register/logout)
│   ├── profile/route.ts        # GET/POST/PATCH profile
│   ├── recommendations/        # GET/POST recommendations
│   ├── stage-recommendations/  # GET stage-specific pathway suggestions
│   ├── careers/route.ts        # Career library queries
│   ├── careers/[id]/route.ts   # Single career lookup
│   ├── roadmap/[careerId]/     # Roadmap generation
│   ├── chat/route.ts           # Streaming AI chat (multimodal image support)
│   └── firebase-config/        # Server-side config endpoint
├── documentation/
│   └── page.tsx                # This documentation portal
├── page.tsx                    # Landing page
└── layout.tsx                  # Root layout (fonts, globals)`,
        },
        {
          type: "heading3",
          text: "Component Architecture",
          id: "ch3-components",
        },
        {
          type: "paragraph",
          text: "UI components are organised into three tiers: primitive UI components (src/components/ui/), feature-specific components (co-located with their page files), and documentation components (src/components/documentation/). Primitive components are built on top of Radix UI primitives for accessible behaviour and styled with Tailwind CSS.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/components/ui/button.tsx",
          code: `import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </button>
  )
);`,
        },
        {
          type: "heading3",
          text: "State Management",
          id: "ch3-state",
        },
        {
          type: "paragraph",
          text: "PathWise deliberately avoids global state management libraries (Redux, Zustand) in favour of React's built-in primitives: useState, useReducer, and the Context API where component-tree sharing is needed. Server Components handle data fetching where possible, and Client Components are minimised to interactive UI elements. This aligns with Next.js 15's Server Component-first philosophy and reduces client-side JavaScript payload.",
        },
      ],
    },
    {
      id: "ch3-backend",
      title: "3.3 Backend Architecture",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise's backend is implemented entirely as Next.js API Routes (Route Handlers in App Router terminology). All routes are deployed to Cloudflare Workers and execute at the edge, meaning there is no traditional server. Each API route is a stateless function that handles one request, performs its logic, and returns a response.",
        },
        {
          type: "heading3",
          text: "API Route Pattern",
          id: "ch3-api-pattern",
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/app/api/profile/route.ts",
          code: `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getProfile, upsertProfile } from "@/lib/db/airtable";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const profile = await getProfile(session.userId);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ data: profile });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const profile = await upsertProfile(session.userId, body);

  return NextResponse.json({ data: profile }, { status: 201 });
}`,
        },
        {
          type: "paragraph",
          text: "Every API route follows a consistent pattern: extract and validate the session, parse and validate the request body, perform the business logic, and return a typed JSON response. This consistency makes the API predictable and aids testing.",
        },
        {
          type: "heading3",
          text: "API Route Summary",
          id: "ch3-api-routes",
        },
        {
          type: "table",
          headers: ["Route", "Methods", "Auth Required", "Description"],
          rows: [
            ["/api/auth/register", "POST", "No", "Create account with email/password"],
            ["/api/auth/login", "POST", "No", "Validate credentials, issue JWT session cookie"],
            ["/api/auth/logout", "POST", "Yes", "Clear session cookie"],
            ["/api/firebase-config", "GET", "No", "Return public Firebase config for client SDK"],
            ["/api/profile", "GET, POST, PATCH", "Yes", "Read and update the authenticated user's profile"],
            ["/api/recommendations", "GET, POST", "Yes", "Fetch stored recommendations or trigger generation"],
            ["/api/careers", "GET", "Yes", "Query career library (filter, search, paginate)"],
            ["/api/careers/[id]", "GET", "Yes", "Fetch single career by ID or slug"],
            ["/api/roadmap/[careerId]", "GET", "Yes", "Generate or retrieve personalised roadmap"],
            ["/api/chat", "POST", "Yes", "Stream AI chat response via Server-Sent Events"],
          ],
        },
      ],
    },
    {
      id: "ch3-auth",
      title: "3.4 Authentication System",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise implements a hybrid authentication system. Firebase Authentication handles the client-side email/password credential flow (registration, login, password reset), while a custom session management layer using the jose JWT library manages server-side session state across API routes.",
        },
        {
          type: "paragraph",
          text: "This hybrid approach was chosen because Firebase Authentication provides a battle-tested, secure credential store with built-in password hashing, email verification, and rate limiting — without requiring PathWise to store raw passwords. The custom JWT session layer is needed because Cloudflare Workers does not support the Firebase Admin SDK, necessitating a lightweight session token mechanism.",
        },
        {
          type: "heading3",
          text: "Authentication Flow",
          id: "ch3-auth-flow",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "User submits email/password on the login page (client-side).",
            "Firebase Auth SDK validates credentials and returns a Firebase ID Token.",
            "Client sends the Firebase ID Token to /api/auth/login.",
            "The API route calls the Firebase-config-supplied public endpoint to verify the token.",
            "On successful verification, the route creates a signed JWT session token using jose (HS256, 7-day expiry).",
            "The JWT is set as an HttpOnly, Secure, SameSite=Strict cookie named pathwise_session.",
            "Subsequent requests include the cookie automatically; the Next.js middleware verifies it before allowing access to protected routes.",
          ],
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/lib/auth/session.ts",
          code: `import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE = "pathwise_session";
const EXPIRY = "7d";

export interface Session {
  userId: string;
  email: string;
  name: string;
}

export async function createSession(payload: Session): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function getSession(req: NextRequest): Promise<Session | null> {
  const token = req.cookies.get(COOKIE)?.value;
  return token ? verifySession(token) : null;
}`,
        },
      ],
    },
    {
      id: "ch3-ai",
      title: "3.5 AI Recommendation Engine",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise's recommendation engine is the technical centrepiece of the platform. It uses a dual-engine architecture: a scikit-learn logistic regression model as the primary engine, with Anthropic's Claude as an intelligent fallback. This design provides both speed (ML model inference is < 100ms) and depth (Claude can reason about nuanced profile attributes the ML model cannot capture).",
        },
        {
          type: "heading3",
          text: "ML Engine",
          id: "ch3-ml",
        },
        {
          type: "paragraph",
          text: "The ML model is a multi-class logistic regression classifier trained on a synthetic dataset of 4,800 student profiles (300 per career class across 16 career categories). The synthetic data generation script creates profiles with realistic distributions of interests, skills, work preferences, and demographic attributes, using the same vocabulary as the PathWise onboarding form.",
        },
        {
          type: "code",
          language: "python",
          filename: "ml/src/train.py",
          code: `from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib, json, numpy as np

# Feature encoding
mlb_interests = MultiLabelBinarizer()
mlb_skills    = MultiLabelBinarizer()

X_interests = mlb_interests.fit_transform(df["interests"])
X_skills    = mlb_skills.fit_transform(df["skills"])
X_cat       = pd.get_dummies(df[["availability", "learning_mode"]])

X = np.hstack([X_interests, X_skills, X_cat.values])
y = df["career_label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = LogisticRegression(
    max_iter=1000, C=1.0, multi_class="multinomial", solver="lbfgs"
)
model.fit(X_train, y_train)

top3_acc = top_k_accuracy_score(y_test, model.predict_proba(X_test), k=3)
print(f"Top-3 Accuracy: {top3_acc:.4f}")  # 1.0000

joblib.dump({"model": model, "mlb_interests": mlb_interests,
             "mlb_skills": mlb_skills, "cat_cols": X_cat.columns.tolist()},
            "models/career_model.pkl")`,
        },
        {
          type: "stats",
          items: [
            { value: "99.9%", label: "Top-1 accuracy", sub: "On 960-sample test set" },
            { value: "100%", label: "Top-3 accuracy", sub: "On 960-sample test set" },
            { value: "279", label: "Input features", sub: "Interests, skills, categorical" },
            { value: "16", label: "Career classes", sub: "Primary prediction categories" },
          ],
        },
        {
          type: "heading3",
          text: "Claude AI Fallback",
          id: "ch3-claude",
        },
        {
          type: "paragraph",
          text: "When the ML API is unavailable — or when Claude is called for deeper reasoning — the Claude recommendation engine analyses the student profile against the full 96-career library. Unlike the ML model, Claude can reason about indirect signals (e.g., a student who studies History and is interested in Digital Marketing might suit a Content Strategy career) and provide qualitative match reasons.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/lib/agent/recommend.ts",
          code: `import Anthropic from "@anthropic-ai/sdk";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import type { StudentProfile, RecommendationResult } from "@/lib/types";

const client = new Anthropic();

export async function getClaudeRecommendations(
  profile: StudentProfile
): Promise<RecommendationResult[]> {
  const careerSummaries = CAREERS_DATA.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    skills: c.required_skills.slice(0, 6),
    demand: c.job_demand,
  }));

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: buildSystemPrompt(profile.experience_level),
    messages: [
      {
        role: "user",
        content: \`Analyse this student profile and return the top 5 career matches.

Profile: \${JSON.stringify(profile, null, 2)}

Career Library (96 careers): \${JSON.stringify(careerSummaries)}

Return a JSON array of exactly 5 objects with:
{ career_id, career_title, match_score (0-100), match_reasons (2-3 strings),
  matching_skills (array), skill_gaps (array) }\`,
      },
    ],
  });

  const json = extractJSON(message.content[0]);
  return json as RecommendationResult[];
}`,
        },
      ],
    },
    {
      id: "ch3-roadmap",
      title: "3.6 Roadmap Generation System",
      blocks: [
        {
          type: "paragraph",
          text: "The roadmap generation system produces personalised, phase-by-phase learning plans for each recommended career. It combines a set of hand-curated base templates (one per career) with Claude's ability to personalise the content based on the user's skill level, availability, and preferred learning mode.",
        },
        {
          type: "paragraph",
          text: "Base templates are defined in src/lib/data/roadmap-templates.ts and contain a structured sequence of learning phases, each comprising steps with type tags (course, book, project, certification), estimated hours, and example resources. These templates serve as the 'skeleton' that Claude personalises.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "src/lib/agent/roadmap-generator.ts (excerpt)",
          code: `export async function generatePersonalisedRoadmap(
  profile: StudentProfile,
  career: Career
): Promise<PersonalisedRoadmap> {
  const baseTemplate = ROADMAP_TEMPLATES[career.id];
  const level = predictPersonalisationLevel(profile); // starter | builder | advanced
  const durationMultiplier = AVAILABILITY_MULTIPLIERS[profile.availability];

  const prompt = \`
You are a career learning coach. Personalise this roadmap template for this student.

Student Profile:
- Experience: \${profile.experience_level}
- Matching skills: \${profile.skills.filter(s => career.required_skills.includes(s)).join(", ")}
- Skill gaps: \${career.required_skills.filter(s => !profile.skills.includes(s)).join(", ")}
- Learning mode: \${profile.learning_mode}
- Availability: \${profile.availability}
- Predicted level: \${level}

Base Template:
\${JSON.stringify(baseTemplate, null, 2)}

Instructions:
1. Filter steps using tags (starter_only, builder_plus, advanced_only) based on level: \${level}
2. Adjust duration_weeks by multiplier \${durationMultiplier}
3. Add 1-2 personalised recommendations per phase based on their specific gaps
4. Return the complete PersonalisedRoadmap JSON structure
\`;

  const response = await client.messages.create({ ... });
  return parseRoadmapJSON(response);
}`,
        },
      ],
    },
    {
      id: "ch3-database",
      title: "3.7 Database Design",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise uses a polyglot persistence strategy, with different data stores chosen for different access patterns and data characteristics.",
        },
        {
          type: "table",
          headers: ["Data Store", "Technology", "Data Type", "Access Pattern"],
          rows: [
            ["User Profiles", "Airtable", "Student profile, onboarding data", "CRUD via Airtable REST API"],
            ["Recommendations", "Airtable", "Career match results per user", "Write-once, read-many"],
            ["Career Library", "In-memory constant", "96 career definitions", "Read-only, loaded at cold-start"],
            ["Session Data", "HTTP Cookies (JWT)", "Session token", "Stateless, verified per request"],
            ["Roadmap Progress", "Cloudflare D1", "Step completion state per user", "Frequent writes, keyed by (userId, careerId)"],
            ["Roadmaps", "Airtable", "Generated roadmap JSON per user+career", "Write-once, read-many"],
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Airtable as a Database",
          text: "Airtable is used as a flexible document store for this project, not as a relational database. This choice was made for rapid development convenience — Airtable provides a UI for debugging data, a REST API, and no schema migration overhead. For a production system at scale, migration to a proper database (PostgreSQL on Cloudflare D1, Neon, or PlanetScale) would be strongly recommended.",
        },
      ],
    },
    {
      id: "ch3-deployment",
      title: "3.8 Deployment Architecture",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise is deployed to Cloudflare's edge network using the OpenNext adapter for Next.js. This setup compiles the Next.js application into Cloudflare Workers-compatible bundles, enabling the entire application to run at the edge — eliminating traditional server infrastructure.",
        },
        {
          type: "heading3",
          text: "Deployment Pipeline",
          id: "ch3-pipeline",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Developer pushes code to main branch on GitHub.",
            "GitHub Actions CI runs TypeScript type check (tsc --noEmit), ESLint, and a production build.",
            "On success, the Wrangler CLI runs opennextjs-cloudflare build to compile the application.",
            "wrangler deploy uploads the compiled Workers bundles to Cloudflare's network.",
            "Cloudflare distributes the Workers across 300+ global edge locations.",
            "D1 migrations are applied via wrangler d1 execute.",
          ],
        },
        {
          type: "code",
          language: "bash",
          filename: "Deployment commands",
          code: `# Build and deploy to production
npm run deploy
# Equivalent to:
# opennextjs-cloudflare build && wrangler deploy

# Preview deployment (local edge simulation)
npm run preview
# Equivalent to:
# opennextjs-cloudflare build && wrangler dev

# Apply D1 database migrations
npm run db:migrate:prod
# Equivalent to:
# wrangler d1 execute pathwise-db --file=src/lib/db/schema.sql`,
        },
        {
          type: "paragraph",
          text: "Environment variables — including the JWT secret, Airtable API key, Anthropic API key, and Firebase service account credentials — are stored in Cloudflare's encrypted environment variable store (wrangler.toml [vars] for non-sensitive and wrangler secret put for sensitive values) and are injected at runtime by the Workers runtime.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Edge Runtime Constraints",
          text: "Cloudflare Workers operate under the edge runtime, which has a reduced Node.js API surface. This means Node.js-specific modules (fs, crypto, path) are not available. PathWise is carefully designed to avoid these dependencies. The Firebase Admin SDK — which requires Node.js — is replaced with a lightweight JWT-verification approach using the jose package.",
        },
      ],
    },
    {
      id: "ch3-onboarding-arch",
      title: "3.8 Onboarding Flow Architecture",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "PathWise's onboarding is a 9-step, fully client-side multi-step form with animated transitions powered by Framer Motion. It collects a complete student profile without any page reloads, persists partial state to localStorage under the key pathwise-onboarding-v3, and only writes to Airtable after the user has completed all steps.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Welcome — Dark hero screen with feature pills and a 'Get started' CTA.",
            "Education stage — Selects one of 8 Ghana-specific stages (JHS, SHS, TVET, Polytechnic, University, Graduate, Working Professional, Career Switcher).",
            "Learning environment — Preferred study mode (online, in-person, blended).",
            "Interests — Predefined interest grid (10 categories) plus a free-text custom interest input so users can type anything not listed.",
            "Goals — Career ambitions, income aspiration, and timeline.",
            "Availability — Hours per week available for study.",
            "Location — Region within Ghana for geographically-relevant advice.",
            "Analysis — Simultaneous API calls to /api/recommendations (ML model) and /api/stage-recommendations?stage={stage} (LLM-powered stage engine). Both run in parallel via Promise.allSettled.",
            "Results — Stage-specific career pathway suggestions rendered from a discriminated-union switch over stage.type, plus top career match cards with colour-coded demand badges and match-score bars.",
          ],
        },
        {
          type: "heading3",
          text: "Stage-Specific Recommendations Engine",
          id: "ch3-stage-engine",
        },
        {
          type: "paragraph",
          text: "The /api/stage-recommendations endpoint accepts a ?stage= query parameter that overrides the value stored in Airtable. This is necessary because the progressive Airtable column-stripping loop (which skips unknown fields) may silently drop the educationStage column before it can be read back. The stage-engine module (src/lib/recommendation/stage-engine.ts) returns a discriminated union keyed on stage.type — one of: jhs, shs, tvet, polytechnic, university, graduate, professional, or switcher — each containing pathway-specific titles, institutions, and next-step advice.",
        },
        {
          type: "callout",
          variant: "info",
          title: "Layout Isolation for Onboarding",
          text: "The onboarding page lives inside the (dashboard) route group (which normally renders the sidebar shell) but must render full-screen without navigation. This is achieved via a DashboardShell client component that uses usePathname() to detect /onboarding and render children directly, bypassing the AppSidebar and EmailVerificationBanner entirely.",
        },
      ],
    },
    {
      id: "ch3-ai-advisor-arch",
      title: "3.9 AI Advisor Architecture",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "The AI Advisor is a full-screen streaming chat interface modelled on modern AI assistant products. It renders in two modes: an empty state with a centred input and suggestion grid, and an active conversation state with flat message rows and a sticky input bar.",
        },
        {
          type: "heading3",
          text: "Streaming Pipeline",
          id: "ch3-streaming",
        },
        {
          type: "paragraph",
          text: "User messages are sent via HTTP POST to /api/chat, which runs an agent tool pipeline (intent detection → tool calls → system prompt construction) before calling Claude Haiku with a grounded system prompt. The response is streamed back as Server-Sent Events (SSE). The frontend consumes the SSE stream with the Fetch API's ReadableStream, accumulating delta text tokens and updating React state on each chunk. A blinking cursor is rendered during streaming to signal active generation.",
        },
        {
          type: "heading3",
          text: "Multimodal File Attachments",
          id: "ch3-attachments",
        },
        {
          type: "paragraph",
          text: "The + button in the input area triggers a hidden <input type='file'> accepting images (JPEG, PNG, WebP, GIF), PDFs, Word documents, plain text, CSV, and spreadsheets. Attached images are displayed as thumbnail chips in the input area. On send, image files are converted to base64 client-side and passed to the API in a separate imageAttachments array. The API route constructs an Anthropic multimodal content array — placing base64 image blocks before the text block — for the final user message only. Text-based documents are read as UTF-8 strings and prepended to the message content as labelled context blocks.",
        },
        {
          type: "code",
          language: "typescript",
          filename: "Multimodal message construction (api/chat/route.ts)",
          code: `// Last user message becomes multimodal when images are attached
const anthropicMessages = sanitised.map((m, i) => {
  const isLastUser = m.role === "user" && i === sanitised.length - 1;
  if (isLastUser && hasImages) {
    return {
      role: "user",
      content: [
        ...imageAttachments.map((img) => ({
          type: "image",
          source: { type: "base64", media_type: img.mediaType, data: img.data },
        })),
        { type: "text", text: m.content },
      ],
    };
  }
  return { role: m.role, content: m.content };
});`,
        },
      ],
    },
  ],
};
