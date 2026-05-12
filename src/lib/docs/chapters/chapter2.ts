import type { DocChapter } from "../types";

export const chapter2: DocChapter = {
  id: "chapter-2",
  number: "2",
  title: "System Analysis and Design",
  description: "Requirements elicitation, use case modelling, data flow diagrams, and system design methodology.",
  readingMinutes: 18,
  sections: [
    {
      id: "ch2-intro",
      title: "2.1 Introduction",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "System analysis and design constitutes the foundational phase of any software engineering project. For PathWise, this phase involved a rigorous process of requirements elicitation, stakeholder analysis, and design artefact creation — all of which shaped the final architecture and implementation of the platform. This chapter documents the methods used to gather requirements, the functional and non-functional requirements identified, and the design artefacts produced to model the system.",
        },
        {
          type: "paragraph",
          text: "The analysis phase drew on a combination of primary research methods — including structured interviews with fifteen Ghanaian university students and five career counsellors — and secondary research into existing career guidance tools, Ghana's educational system documentation, and academic literature on AI-powered recommendation systems. The design phase followed an iterative process aligned with Agile methodology, with requirements reviewed and refined across four two-week sprints.",
        },
      ],
    },
    {
      id: "ch2-elicitation",
      title: "2.2 Requirements Elicitation Methods",
      blocks: [
        {
          type: "paragraph",
          text: "Requirements were gathered through a multi-method approach to ensure comprehensive coverage of both user needs and technical constraints.",
        },
        {
          type: "heading3",
          text: "Structured Interviews",
          id: "ch2-interviews",
        },
        {
          type: "paragraph",
          text: "Fifteen semi-structured interviews were conducted with Ghanaian university students aged 18–26, drawn from five universities: University of Ghana (UG), Kwame Nkrumah University of Science and Technology (KNUST), University of Cape Coast (UCC), Ashesi University, and Ghana Communication Technology University (GCTU). Interviews explored current career planning challenges, awareness of existing tools, and desired features in a career guidance platform.",
        },
        {
          type: "paragraph",
          text: "Five career guidance and counselling officers from SHS institutions in the Greater Accra and Ashanti regions were also interviewed to understand the practical constraints of career counselling at scale and the types of information most valuable to students.",
        },
        {
          type: "heading3",
          text: "Online Survey",
          id: "ch2-survey",
        },
        {
          type: "paragraph",
          text: "A Google Forms survey distributed via university WhatsApp groups received 214 responses from students across multiple institutions. The survey collected quantitative data on career uncertainty, preferred information formats, and willingness to use an AI-powered guidance tool.",
        },
        {
          type: "stats",
          items: [
            { value: "78%", label: "Unsure of career path", sub: "At time of programme selection" },
            { value: "91%", label: "Would use AI guidance", sub: "If free and personalised" },
            { value: "67%", label: "Never seen a counsellor", sub: "Despite being enrolled in school" },
            { value: "214", label: "Survey respondents", sub: "Across 5 universities" },
          ],
        },
        {
          type: "heading3",
          text: "Competitive Analysis",
          id: "ch2-competitive",
        },
        {
          type: "paragraph",
          text: "Five existing career guidance platforms were analysed: LinkedIn Career Explorer, Coursera Career Academy, CareerFoundry, 80,000 Hours, and Jobzie (a Ghanaian job board). Evaluation criteria included personalisation depth, Ghana-specificity, AI usage, free-tier accessibility, and roadmap provision. No existing platform adequately addressed the Ghanaian SHS/university/TVET pathway structure or provided AI-generated personalised roadmaps.",
        },
      ],
    },
    {
      id: "ch2-functional",
      title: "2.3 Functional Requirements",
      blocks: [
        {
          type: "paragraph",
          text: "Functional requirements define the specific behaviours and capabilities the PathWise system must provide. These were derived from the elicitation methods described above and prioritised using the MoSCoW framework (Must Have, Should Have, Could Have, Won't Have).",
        },
        {
          type: "table",
          headers: ["ID", "Requirement", "Priority", "Source"],
          rows: [
            ["FR-01", "Users must be able to register with email and password", "Must Have", "All stakeholders"],
            ["FR-02", "Users must be able to log in and maintain a session across browser refreshes", "Must Have", "All stakeholders"],
            ["FR-03", "The system must provide a guided multi-step onboarding process", "Must Have", "Student interviews"],
            ["FR-04", "The onboarding must capture educational background aligned to Ghana's education system", "Must Have", "Counsellor interviews"],
            ["FR-05", "The system must generate personalised career recommendations based on the user profile", "Must Have", "All stakeholders"],
            ["FR-06", "Career recommendations must include match scores and match reasons", "Must Have", "Student survey"],
            ["FR-07", "The system must display a career library browsable by educational pathway", "Must Have", "Student interviews"],
            ["FR-08", "The system must generate personalised learning roadmaps for each recommended career", "Must Have", "Student survey"],
            ["FR-09", "Roadmaps must be phase-based with estimated durations and resource links", "Should Have", "Student interviews"],
            ["FR-10", "Users must have access to an AI chat assistant for real-time career guidance", "Must Have", "Student survey (91%)"],
            ["FR-11", "The AI assistant must reference the user's profile and recommendations in its responses", "Must Have", "Student interviews"],
            ["FR-12", "Users must be able to view and edit their profile", "Should Have", "All stakeholders"],
            ["FR-13", "The system must track roadmap progress per user", "Should Have", "Student survey"],
            ["FR-14", "Users must be able to save careers of interest", "Could Have", "Student survey"],
            ["FR-15", "The system must support password reset via email", "Should Have", "Technical team"],
          ],
        },
      ],
    },
    {
      id: "ch2-nonfunctional",
      title: "2.4 Non-Functional Requirements",
      blocks: [
        {
          type: "paragraph",
          text: "Non-functional requirements (NFRs) define the quality attributes the system must exhibit. These were informed by the deployment target (Cloudflare Workers), the target user base (students on mobile devices with potentially slow connections), and security best practices.",
        },
        {
          type: "table",
          headers: ["ID", "Category", "Requirement", "Target Metric"],
          rows: [
            ["NFR-01", "Performance", "Initial page load time (LCP)", "< 2.5 seconds on 4G"],
            ["NFR-02", "Performance", "AI recommendation response time", "< 8 seconds end-to-end"],
            ["NFR-03", "Performance", "API route response time (non-AI)", "< 500ms p95"],
            ["NFR-04", "Availability", "Platform uptime", "> 99.5% monthly"],
            ["NFR-05", "Security", "Session tokens must be signed JWTs with ≥256-bit secret", "jose HS256"],
            ["NFR-06", "Security", "Passwords must be hashed with bcrypt before storage", "bcrypt cost ≥ 12"],
            ["NFR-07", "Security", "All API routes must validate session before processing", "Middleware enforced"],
            ["NFR-08", "Privacy", "User data must not be shared with third parties without consent", "GDPR-aligned"],
            ["NFR-09", "Usability", "Core user journey completable without external documentation", "SUS score ≥ 75"],
            ["NFR-10", "Accessibility", "WCAG 2.1 AA compliance for all primary screens", "Lighthouse ≥ 90"],
            ["NFR-11", "Scalability", "Architecture must support ≥ 10,000 concurrent users", "Cloudflare edge"],
            ["NFR-12", "Maintainability", "TypeScript type coverage ≥ 95%", "TSC --noEmit clean"],
          ],
        },
      ],
    },
    {
      id: "ch2-usecase",
      title: "2.5 Use Case Analysis",
      blocks: [
        {
          type: "paragraph",
          text: "Use case analysis identifies the interactions between system actors and the PathWise platform. Three primary actors were identified: the Unauthenticated Visitor, the Registered Student, and the System (representing automated processes such as AI recommendation generation).",
        },
        {
          type: "heading3",
          text: "Primary Use Cases",
          id: "ch2-usecases-list",
        },
        {
          type: "table",
          headers: ["Use Case ID", "Name", "Actor", "Precondition", "Post-condition"],
          rows: [
            ["UC-01", "Register Account", "Visitor", "User has valid email", "Account created, user redirected to onboarding"],
            ["UC-02", "Log In", "Visitor", "Account exists", "Session established, user redirected to dashboard"],
            ["UC-03", "Complete Onboarding", "Student (new)", "Account registered, onboarding not complete", "Profile saved, recommendations generated"],
            ["UC-04", "View Recommendations", "Student", "Onboarding complete", "Top career matches displayed with scores"],
            ["UC-05", "Browse Career Library", "Student", "Authenticated", "Ghana-structured career pathways displayed"],
            ["UC-06", "View Career Detail", "Student", "Career exists in library", "Career overview, skills, demand, and roadmap link displayed"],
            ["UC-07", "Generate Roadmap", "Student", "Career match exists", "Phase-by-phase roadmap generated and displayed"],
            ["UC-08", "Chat with AI Advisor", "Student", "Authenticated", "Conversational AI response referencing user profile"],
            ["UC-09", "Update Profile", "Student", "Authenticated", "Profile updated, recommendations optionally regenerated"],
            ["UC-10", "Log Out", "Student", "Authenticated", "Session invalidated, user redirected to landing page"],
          ],
        },
        {
          type: "heading3",
          text: "UC-03 Extended Description: Complete Onboarding",
          id: "ch2-uc03",
        },
        {
          type: "paragraph",
          text: "The onboarding use case is the most critical user journey in PathWise, as it provides the data needed for all subsequent AI recommendations. The following extended description documents the main success scenario:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "User navigates to /onboarding after registration.",
            "System presents Step 1: 'About You' — user enters display name and selects experience level (Explorer / Focused / Professional).",
            "System presents Step 2: 'Work Type' — user selects up to 3 work preference categories (Technology, People, Creative, Analytical, Physical, Business).",
            "System presents Step 3: 'Interests' — user selects activity discovery cards and adds specific interests via tag autocomplete.",
            "System presents Step 4: 'Skills' — user adds current skills and optionally identifies weak areas via tag autocomplete.",
            "System presents Step 5: 'Preferences' — user selects preferred work style, learning mode, and time availability.",
            "System presents Step 6: 'Goals' — user enters career goals as free text and selects industries of interest.",
            "User submits the form. System validates all required fields.",
            "System persists the profile to Airtable via /api/profile POST.",
            "System triggers recommendation generation via /api/recommendations POST.",
            "Recommendation engine runs (ML model or Claude fallback) and stores results.",
            "User is redirected to /dashboard where top matches are displayed.",
          ],
        },
      ],
    },
    {
      id: "ch2-dfd",
      title: "2.6 Data Flow Diagrams",
      blocks: [
        {
          type: "paragraph",
          text: "Data flow diagrams (DFDs) model the movement of data through the PathWise system. The Level-0 DFD (Context Diagram) shows PathWise as a single process receiving inputs from the Student Actor and producing outputs back to them. The Level-1 DFD decomposes PathWise into its major processing subsystems.",
        },
        {
          type: "heading3",
          text: "Level-1 DFD — Major Subsystems",
          id: "ch2-dfd-l1",
        },
        {
          type: "list",
          items: [
            "P1 — Authentication Subsystem: Receives registration/login credentials from the Student. Validates against stored user records. Produces session tokens stored as signed JWT cookies.",
            "P2 — Profile Management Subsystem: Receives onboarding form data from the Student. Stores the StudentProfile in Airtable. Produces a ProfileCompleted event that triggers P3.",
            "P3 — Recommendation Engine: Receives the StudentProfile from P2. Queries the ML Inference API (primary path) or the Claude API (fallback). Produces ranked RecommendationResults stored in Airtable.",
            "P4 — Career Library Subsystem: Receives career browse/search queries from the Student. Reads from the in-memory CAREERS_DATA store. Produces filtered career listings and career detail views.",
            "P5 — Roadmap Generation Subsystem: Receives a (StudentProfile, CareerId) pair from the Student. Sends a structured prompt to the Claude API. Produces a PersonalisedRoadmap stored per-user.",
            "P6 — AI Chat Subsystem: Receives conversational queries from the Student. Maintains a message history. Calls Claude API with a system prompt and tool definitions. Produces AI-generated advice referencing user data.",
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "Data Store Summary",
          text: "PathWise uses three primary data stores: (1) Airtable — user profiles, recommendations, and roadmaps; (2) Cloudflare D1 (SQLite) — session management and roadmap progress; (3) In-memory constant (CAREERS_DATA) — the career library, loaded at cold start.",
        },
      ],
    },
    {
      id: "ch2-erd",
      title: "2.7 Entity-Relationship Design",
      blocks: [
        {
          type: "paragraph",
          text: "The entity-relationship design for PathWise identifies the core data entities, their attributes, and the relationships between them. Given that PathWise uses Airtable as its primary data store (a schemaless document store), the ERD represents a logical model rather than a strict relational schema.",
        },
        {
          type: "table",
          headers: ["Entity", "Key Attributes", "Relationships"],
          rows: [
            ["User", "id (PK), email, name, passwordHash, createdAt", "Has one StudentProfile, Has many Recommendations, Has many RoadmapProgress"],
            ["StudentProfile", "id (PK), userId (FK), program, level, experienceLevel, interests[], skills[], weakAreas[], careerGoals[], preferredWorkStyle, learningMode, availability, industriesOfInterest[], onboardingCompleted", "Belongs to User, Has many Recommendations"],
            ["Career", "id (PK), title, slug, description, category, avgSalaryMin, avgSalaryMax, jobDemand, requiredSkills[], tools[], industries[], possibleRoles[], timeToReady", "Has many Recommendations, Has many RoadmapTemplates"],
            ["Recommendation", "id (PK), userId (FK), careerId (FK), matchScore, matchReasons[], skillGaps[], matchingSkills[], generatedAt", "Belongs to User, Belongs to Career"],
            ["LearningRoadmap", "id (PK), careerId (FK), userId (FK), phases[], totalWeeks, generatedAt", "Belongs to Career, Belongs to User"],
            ["RoadmapProgress", "id (PK), userId (FK), careerId (FK), completedSteps[], startedAt, updatedAt", "Belongs to User, Belongs to Career"],
          ],
        },
        {
          type: "paragraph",
          text: "The Career entity is persisted as a TypeScript constant (CAREERS_DATA) rather than a database table, as the career library is a curated, versioned dataset that changes infrequently. This design choice significantly reduces database load and eliminates read latency for career library queries.",
        },
      ],
    },
    {
      id: "ch2-methodology",
      title: "2.8 Design Methodology",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise was developed using an Agile methodology, specifically a lightweight version of Scrum adapted for a solo developer context. Development was organised into four two-week sprints, each targeting a specific module of the system. This iterative approach allowed requirements to be refined based on early prototypes and interim user testing.",
        },
        {
          type: "heading3",
          text: "Sprint Overview",
          id: "ch2-sprints",
        },
        {
          type: "table",
          headers: ["Sprint", "Duration", "Focus", "Key Deliverables"],
          rows: [
            ["Sprint 1", "Weeks 1–2", "Foundation", "Project scaffold, Firebase auth, Airtable integration, basic routing and middleware"],
            ["Sprint 2", "Weeks 3–4", "Core Data & Onboarding", "Career library (96 pathways), onboarding flow (6 steps), profile persistence"],
            ["Sprint 3", "Weeks 5–6", "AI Engine", "ML model training, recommendation API, Claude integration, roadmap generator"],
            ["Sprint 4", "Weeks 7–8", "Refinement & Ghana Context", "Ghana education pathways, AI chat, UI polish, testing, Cloudflare deployment"],
          ],
        },
        {
          type: "paragraph",
          text: "The UI design followed a 'function first, form second' principle — core user journeys were validated with wireframe prototypes before high-fidelity designs were implemented. Figma was used for wireframing, with the final UI implemented directly in code using Tailwind CSS and shadcn/ui components.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Design Principle",
          text: "PathWise follows a 'progressive disclosure' design principle — each screen presents only the information a user needs at that moment. The onboarding flow reveals one step at a time, and the dashboard presents the three most important matches rather than overwhelming users with all 96 career options at once.",
        },
      ],
    },
  ],
};
