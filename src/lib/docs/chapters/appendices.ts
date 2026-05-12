import type { DocChapter } from "../types";

export const appendicesChapter: DocChapter = {
  id: "appendices",
  number: "A",
  title: "Appendices",
  description: "API reference, user manual excerpts, test case inventory, and supplementary technical documentation.",
  readingMinutes: 12,
  sections: [
    {
      id: "app-api",
      title: "Appendix A — API Reference",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "This appendix provides a complete reference for all PathWise API routes. All routes except authentication endpoints require a valid pathwise_session cookie. All responses are JSON.",
        },
        {
          type: "heading3",
          text: "A.1 Authentication Endpoints",
          id: "app-auth-api",
        },
        {
          type: "code",
          language: "bash",
          filename: "POST /api/auth/register",
          code: `# Request
POST /api/auth/register
Content-Type: application/json

{
  "idToken": "firebase-id-token",
  "name": "Kwame Mensah",
  "email": "kwame@example.com"
}

# Success Response (201)
{
  "message": "Account created",
  "user": {
    "id": "usr_abc123",
    "email": "kwame@example.com",
    "name": "Kwame Mensah"
  }
}
# Sets: Set-Cookie: pathwise_session=<jwt>; HttpOnly; Secure; SameSite=Strict

# Error Response (409 — duplicate email)
{ "error": "Email already registered" }`,
        },
        {
          type: "code",
          language: "bash",
          filename: "POST /api/auth/login",
          code: `# Request
POST /api/auth/login
Content-Type: application/json

{
  "idToken": "firebase-id-token"
}

# Success Response (200)
{ "message": "Login successful", "userId": "usr_abc123" }
# Sets: Set-Cookie: pathwise_session=<jwt>; HttpOnly; Secure; SameSite=Strict

# Error Response (401)
{ "error": "Invalid credentials" }`,
        },
        {
          type: "heading3",
          text: "A.2 Profile Endpoints",
          id: "app-profile-api",
        },
        {
          type: "code",
          language: "bash",
          filename: "GET /api/profile",
          code: `# Request (cookie automatically included by browser)
GET /api/profile

# Success Response (200)
{
  "data": {
    "id": "rec_xyz",
    "user_id": "usr_abc123",
    "program": "BSc Computer Science",
    "level": "year_2",
    "experience_level": "focused",
    "interests": ["Web Development", "AI"],
    "skills": ["Python", "JavaScript"],
    "weak_areas": ["System Design"],
    "preferred_work_style": "hybrid",
    "learning_mode": "self_paced",
    "availability": "part_time",
    "industries_of_interest": ["Technology", "Startups"],
    "onboarding_completed": true,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-20T14:30:00Z"
  }
}`,
        },
        {
          type: "heading3",
          text: "A.3 Recommendations Endpoint",
          id: "app-recs-api",
        },
        {
          type: "code",
          language: "bash",
          filename: "POST /api/recommendations",
          code: `# Request — trigger recommendation generation
POST /api/recommendations
Content-Type: application/json
{}

# Success Response (201)
{
  "data": [
    {
      "career_id": "software-engineer",
      "career_title": "Software Engineer",
      "match_score": 94,
      "match_reasons": [
        "Strong alignment with your Python and JavaScript skills",
        "Your interest in AI/ML maps directly to backend engineering roles",
        "Technology and Startups are high-demand industries for software engineers"
      ],
      "matching_skills": ["Python", "JavaScript"],
      "skill_gaps": ["System Design", "SQL", "Cloud Computing"]
    }
  ]
}

# Error Response (400 — profile incomplete)
{ "error": "Please complete onboarding before generating recommendations" }`,
        },
      ],
    },
    {
      id: "app-user-manual",
      title: "Appendix B — User Manual",
      blocks: [
        {
          type: "paragraph",
          text: "This appendix provides step-by-step instructions for the primary user journeys in PathWise.",
        },
        {
          type: "heading3",
          text: "B.1 Getting Started",
          id: "app-manual-start",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Navigate to the PathWise URL in any modern web browser (Chrome, Firefox, Safari, Edge).",
            "Click 'Get Started Free' on the landing page.",
            "Enter your full name, email address, and a password (minimum 8 characters). Click 'Create Account'.",
            "You will be redirected to the onboarding form. Complete all 6 steps.",
            "After submitting the onboarding form, your personalised career recommendations will be generated. This takes approximately 5–10 seconds.",
            "You will be redirected to your Dashboard, where your top 3 career matches are displayed.",
          ],
        },
        {
          type: "heading3",
          text: "B.2 Using the Career Library",
          id: "app-manual-careers",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Click 'Careers' in the left sidebar navigation.",
            "Select your educational track tab: SHS, University, or TVET.",
            "Click on any programme card to expand it.",
            "The expanded card shows the programme's courses and a list of suggested career paths.",
            "Click any career in the 'Suggested Career Paths' section to view full career details including salary, demand level, required skills, and tools.",
          ],
        },
        {
          type: "heading3",
          text: "B.3 Generating and Using a Roadmap",
          id: "app-manual-roadmap",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "From the Dashboard or a Career Detail page, click 'View Roadmap' for any career.",
            "PathWise will generate a personalised roadmap (this may take 5–15 seconds on first generation).",
            "The roadmap is organised into phases. Each phase contains learning steps.",
            "Each step includes a title, description, type (course, project, book, etc.), and estimated hours.",
            "As you complete steps, click the checkbox next to each step to mark it complete. Your progress is saved automatically.",
          ],
        },
        {
          type: "heading3",
          text: "B.4 Using the AI Career Advisor",
          id: "app-manual-chat",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Click 'Chat' in the left sidebar navigation.",
            "Type your career question in the text box at the bottom and press Enter or click Send.",
            "The AI advisor will respond with personalised advice referencing your profile and recommendations.",
            "You can ask about: career paths, skill gaps, roadmaps, salary expectations, or any career-related question.",
            "Example questions: 'What career suits my background in General Science?', 'How do I become a software engineer?', 'Compare my top 2 career matches.'",
          ],
        },
      ],
    },
    {
      id: "app-test-cases",
      title: "Appendix C — Test Case Inventory",
      blocks: [
        {
          type: "paragraph",
          text: "The following table lists all functional test cases executed during the testing phase of the PathWise project.",
        },
        {
          type: "table",
          headers: ["Test ID", "Module", "Test Case", "Expected Result", "Priority"],
          rows: [
            ["TC-001", "Auth", "Register with valid email and password", "Account created, session cookie set, redirect to onboarding", "Critical"],
            ["TC-002", "Auth", "Register with existing email", "409 error, no account created", "Critical"],
            ["TC-003", "Auth", "Register with invalid email format", "Validation error displayed", "High"],
            ["TC-004", "Auth", "Register with password < 8 characters", "Validation error displayed", "High"],
            ["TC-005", "Auth", "Login with correct credentials", "Session established, redirect to dashboard", "Critical"],
            ["TC-006", "Auth", "Login with wrong password", "401 error, no session created", "Critical"],
            ["TC-007", "Auth", "Access protected route without session", "Redirect to /login", "Critical"],
            ["TC-008", "Auth", "Session expires after 7 days", "User redirected to /login on next request", "High"],
            ["TC-009", "Onboarding", "Complete all 6 steps with valid data", "Profile saved, recommendations generated", "Critical"],
            ["TC-010", "Onboarding", "Advance without required fields", "Step validation error, cannot advance", "High"],
            ["TC-011", "Onboarding", "Navigate back to previous step", "Previous step data preserved", "Medium"],
            ["TC-012", "Careers", "Load career library page", "SHS tab active, 7 programmes listed", "Critical"],
            ["TC-013", "Careers", "Switch to University tab", "18 university programmes listed", "High"],
            ["TC-014", "Careers", "Expand a programme card", "Courses list and career suggestions visible", "Critical"],
            ["TC-015", "Careers", "Click a career link from programme", "Navigates to /careers/[id]", "High"],
            ["TC-016", "Recommendations", "Request recommendations post-onboarding", "5 ranked matches returned within 10s", "Critical"],
            ["TC-017", "Recommendations", "Request recommendations with incomplete profile", "400 error returned", "High"],
            ["TC-018", "Roadmap", "Generate roadmap for recommended career", "Phase-based roadmap displayed within 15s", "Critical"],
            ["TC-019", "Roadmap", "Mark a step as complete", "Checkbox state persisted in D1", "High"],
            ["TC-020", "Chat", "Send a career question", "AI response generated within 8s", "Critical"],
            ["TC-021", "Chat", "AI references user's profile data", "Response mentions user's specific skills/interests", "High"],
            ["TC-022", "Profile", "Update interests and save", "Updated interests persisted to Airtable", "High"],
            ["TC-023", "Performance", "Landing page LCP", "< 2.5 seconds on throttled 4G", "High"],
            ["TC-024", "Accessibility", "Lighthouse accessibility score", "> 90 on all primary screens", "Medium"],
          ],
        },
      ],
    },
    {
      id: "app-env",
      title: "Appendix D — Environment Configuration",
      blocks: [
        {
          type: "paragraph",
          text: "The following environment variables must be configured in Cloudflare's environment variable store (via the Cloudflare dashboard or wrangler secret put) for PathWise to function in production.",
        },
        {
          type: "table",
          headers: ["Variable Name", "Type", "Required", "Description"],
          rows: [
            ["NEXT_PUBLIC_FIREBASE_API_KEY", "Public", "Yes", "Firebase project API key (safe to expose)"],
            ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "Public", "Yes", "Firebase Authentication domain"],
            ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", "Public", "Yes", "Firebase project identifier"],
            ["JWT_SECRET", "Secret", "Yes", "256-bit random string for session token signing"],
            ["ANTHROPIC_API_KEY", "Secret", "Yes", "Anthropic API key for Claude access"],
            ["AIRTABLE_API_KEY", "Secret", "Yes", "Airtable personal access token"],
            ["AIRTABLE_BASE_ID", "Secret", "Yes", "Airtable base identifier"],
            ["ML_API_URL", "Secret", "No", "URL of ML inference endpoint (fallback to Claude if absent)"],
            ["NEXT_PUBLIC_SENTRY_DSN", "Public", "No", "Sentry DSN for error monitoring"],
          ],
        },
        {
          type: "callout",
          variant: "danger",
          title: "Security Warning",
          text: "Never commit JWT_SECRET, ANTHROPIC_API_KEY, or AIRTABLE_API_KEY to version control. Use Cloudflare's wrangler secret put command to store sensitive values, or the Cloudflare Dashboard environment variables UI. These values are injected at runtime and are never exposed to the client.",
        },
      ],
    },
  ],
};
