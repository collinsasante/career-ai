import type { DocChapter } from "../types";

export const chapter1: DocChapter = {
  id: "chapter-1",
  number: "1",
  title: "Introduction",
  description: "Background, problem statement, aims, objectives, and overview of the PathWise platform.",
  readingMinutes: 14,
  sections: [
    {
      id: "ch1-background",
      title: "1.1 Background",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "PathWise is an AI-powered career guidance platform designed specifically for students and young professionals within Ghana's education system. It was conceived in response to the growing disconnect between formal education outcomes and labour market demands — a challenge that disproportionately affects Sub-Saharan African economies where youth unemployment rates frequently exceed 30 per cent.",
        },
        {
          type: "paragraph",
          text: "Ghana's educational landscape is structured around a well-defined but academically rigid pathway: the Basic Education Certificate Examination (BECE) transitions students into Senior High School (SHS), where they select from seven core programme tracks — General Arts, General Science, Business, Visual Arts, Home Economics, Agricultural Science, and Technical. From SHS, students may progress to university degree programmes, Higher National Diploma (HND) institutions, or TVET (Technical and Vocational Education and Training) programmes accredited by the Council for Technical and Vocational Education and Training (COTVET).",
        },
        {
          type: "paragraph",
          text: "Despite this structured pathway, career counselling within Ghanaian secondary and tertiary institutions remains critically underfunded. The Ghana Education Service recommends a student-to-counsellor ratio of 1:350, yet in practice many schools operate at ratios exceeding 1:1,200. The counsellors who do exist typically provide generic, standardised advice that fails to account for individual aptitudes, the specific subjects studied, emerging industry demands, and regional economic contexts.",
        },
        {
          type: "paragraph",
          text: "The global rise of Artificial Intelligence (AI) and Machine Learning (ML) presents an unprecedented opportunity to address this gap at scale. AI systems can process large volumes of user data, recognise complex patterns, and generate personalised recommendations far more rapidly than human advisors alone. When applied to career guidance, such systems can match an individual's academic background, interests, skills, and aspirations to optimal career paths, and generate tailored learning roadmaps to help them close identified skill gaps.",
        },
        {
          type: "stats",
          items: [
            { value: "30%+", label: "Youth unemployment", sub: "Sub-Saharan Africa average" },
            { value: "1:1200", label: "Student-to-counsellor ratio", sub: "Practical average in Ghanaian SHS" },
            { value: "96", label: "Career pathways", sub: "Mapped in PathWise's career library" },
            { value: "99.9%", label: "ML model accuracy", sub: "Top-1 career prediction accuracy" },
          ],
        },
        {
          type: "paragraph",
          text: "PathWise was developed as a full-stack web application using Next.js 15, the Anthropic Claude API, a logistic regression ML model, and a range of modern web technologies. The platform provides personalised career recommendations, guided onboarding, AI chat assistance, and phase-by-phase learning roadmaps — all grounded in Ghana's actual curriculum, institution types, and job market.",
        },
      ],
    },
    {
      id: "ch1-problem",
      title: "1.2 Problem Statement",
      blocks: [
        {
          type: "paragraph",
          text: "Despite Ghana producing over 500,000 senior high school graduates and approximately 80,000 university graduates annually, youth unemployment and skills-mismatch unemployment remain acute social challenges. The 2023 Ghana Statistical Service Labour Force Report indicated that approximately 48.6 per cent of graduates are either unemployed or working in occupations unrelated to their field of study within the first two years of graduation.",
        },
        {
          type: "paragraph",
          text: "A primary driver of this misalignment is the absence of reliable, personalised career guidance at the critical decision-making junctures: when SHS students choose their programme tracks, when university applicants select degree programmes, and when graduates enter the labour market. Current interventions — career days, generic brochures, peer advice, and under-resourced counsellors — are insufficient to provide the nuanced, individualised guidance that modern career planning demands.",
        },
        {
          type: "callout",
          variant: "danger",
          title: "Core Problem",
          text: "Ghanaian students and graduates lack access to personalised, AI-powered career guidance that accounts for their specific educational background, interests, skill levels, and the realities of Ghana's job market. The result is widespread career misalignment, extended periods of unemployment, and underutilisation of human capital.",
        },
        {
          type: "paragraph",
          text: "Existing global career guidance platforms — such as LinkedIn Career Explorer, Coursera Career Academy, and CareerFoundry — do not adequately address the Ghanaian context. They are built around Western education systems, salary data in US dollars, and career pathways that may not exist or may be radically different in Ghana's economy. A locally-contextualised, AI-powered solution was therefore needed.",
        },
        {
          type: "list",
          ordered: false,
          items: [
            "Lack of access to personalised career counselling for most Ghanaian students.",
            "Generic career advice that ignores Ghana's specific SHS programmes, TVET pathways, and university degree structures.",
            "No real-time, data-driven mechanism to match students to careers based on their subject combinations and interests.",
            "Absence of actionable learning roadmaps that guide students from their current academic stage to career readiness.",
            "No locally-relevant salary benchmarks, demand signals, or industry context for Ghanaian career planning.",
          ],
        },
      ],
    },
    {
      id: "ch1-aim",
      title: "1.3 Aim and Objectives",
      blocks: [
        {
          type: "paragraph",
          text: "The primary aim of this project is to design, develop, and deploy an AI-powered career guidance platform — PathWise — that provides personalised, data-driven career recommendations and learning roadmaps for Ghanaian students and young professionals, grounded in Ghana's educational system and labour market context.",
        },
        {
          type: "heading3",
          text: "Specific Objectives",
          id: "ch1-objectives",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "To design and implement a structured onboarding flow that captures a user's educational background, skill levels, interests, work preferences, and career goals in the context of Ghana's education system.",
            "To develop and train a machine learning model capable of recommending career pathways based on a user's profile, achieving a minimum top-3 accuracy of 95 per cent on a held-out test set.",
            "To integrate the Anthropic Claude large language model as a conversational AI advisor capable of providing nuanced, personalised career guidance beyond pattern-matching.",
            "To build a career library structured around Ghana's SHS programme tracks, university degree programmes, and TVET qualifications, with associated career pathways, skill requirements, and industry demand data.",
            "To implement a personalised learning roadmap generation system that produces phase-by-phase, resource-linked learning plans tailored to a user's current level and availability.",
            "To deploy the platform as a production-grade web application accessible to Ghanaian students and young professionals via any modern web browser.",
            "To evaluate the platform through functional testing, unit testing, and user acceptance testing (UAT) with a cohort of target users.",
          ],
        },
      ],
    },
    {
      id: "ch1-scope",
      title: "1.4 Scope of the Study",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise is scoped as a web-based career guidance platform targeted primarily at Ghanaian students transitioning between educational stages and graduates entering the labour market. The platform covers career pathways relevant to Ghana's educational system — SHS programmes, university degrees, and TVET qualifications — and maps these to a curated library of 96 career paths.",
        },
        {
          type: "heading3",
          text: "Inclusions",
          id: "ch1-inclusions",
        },
        {
          type: "list",
          items: [
            "Full web application accessible via desktop and mobile browsers.",
            "User authentication and personalised profile management.",
            "Six-step guided onboarding capturing interests, skills, and educational background.",
            "Ghana Education Service–aligned educational pathway data (SHS, University, TVET).",
            "AI-powered career recommendation engine combining ML and Claude AI.",
            "Personalised learning roadmaps with phase-by-phase milestones.",
            "An AI chat assistant for real-time career advice.",
            "A career library of 96 pathways with skill requirements, demand data, and learning resources.",
          ],
        },
        {
          type: "heading3",
          text: "Exclusions",
          id: "ch1-exclusions",
        },
        {
          type: "list",
          items: [
            "Native mobile applications (iOS/Android) — the web application is mobile-responsive but not a native app.",
            "Direct job listing or recruitment marketplace functionality.",
            "Formal mentorship or peer-matching networks.",
            "Integration with Ghana's WAEC examination databases or NHIS/institutional APIs.",
            "Employer-facing dashboards or talent acquisition tools.",
            "Real-time Ghanaian salary data API integration (salary ranges are estimated from GES, GSS, and Glassdoor data).",
          ],
        },
      ],
    },
    {
      id: "ch1-significance",
      title: "1.5 Significance of the Study",
      blocks: [
        {
          type: "paragraph",
          text: "The significance of PathWise extends beyond its immediate utility as a career guidance tool. It represents a meaningful contribution to the growing field of EdTech for the African context, demonstrating that large language models and machine learning systems can be effectively adapted to address locally-specific educational and economic challenges.",
        },
        {
          type: "paragraph",
          text: "For individual students and graduates, PathWise provides an accessible, private, and non-judgmental space to explore career options, understand skill gaps, and build a concrete roadmap to their desired career. Unlike a single session with a school counsellor, PathWise is available 24/7, is infinitely patient, and improves its recommendations based on each user's growing profile.",
        },
        {
          type: "paragraph",
          text: "For Ghana's broader educational ecosystem, PathWise demonstrates a scalable model for AI-assisted career counselling that complements — rather than replaces — human counsellors. By automating the initial assessment and recommendation phase, PathWise frees human counsellors to focus on deeper, relational support for students who need it most.",
        },
        {
          type: "quote",
          text: "The problem with career guidance in Ghana is not a lack of talent or ambition — it's a lack of information and access to informed guidance at the right time. AI can close that gap for millions of young Ghanaians.",
          author: "Project Supervisor",
          role: "Department of Computer Science",
        },
        {
          type: "paragraph",
          text: "From a research perspective, PathWise contributes to the literature on the application of Large Language Models (LLMs) to career development, the design of AI systems for low-resource educational contexts, and the engineering of personalised recommendation systems using hybrid ML/LLM architectures. The project also serves as a practical case study in deploying a production-grade AI application on Cloudflare's edge computing infrastructure.",
        },
      ],
    },
    {
      id: "ch1-overview",
      title: "1.6 Overview of PathWise",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise is structured as a single-tenant web application delivered through a Next.js 15 App Router architecture. The platform's user journey follows a deliberate progression: anonymous users are greeted by a marketing landing page, prompted to register, guided through a structured onboarding process, and then delivered a personalised dashboard showing their top career matches, recommended roadmaps, and access to the AI chat assistant.",
        },
        {
          type: "heading3",
          text: "Core Modules",
          id: "ch1-modules",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Authentication System: Firebase-powered email/password registration and login, with session management via signed JWT cookies.",
            "Onboarding Engine: A six-step guided form capturing experience level, work preferences, interests, skills, learning style, and career goals.",
            "Career Library: A curated library of 96 career pathways, structured by Ghana's SHS tracks, university programmes, and TVET qualifications.",
            "Recommendation Engine: A dual-engine system combining a logistic regression ML model (served via a Python FastAPI) with Claude AI as an intelligent fallback.",
            "Roadmap Generator: A personalised phase-by-phase learning roadmap generator, powered by Claude and a set of hand-curated roadmap templates.",
            "AI Chat Advisor: A Claude-powered conversational AI assistant with access to the user's profile, career matches, and roadmaps through a tool-use architecture.",
          ],
        },
        {
          type: "paragraph",
          text: "The platform's backend is entirely serverless, using Next.js API Routes deployed to Cloudflare Workers via OpenNext. Persistent data is stored in Airtable (user profiles, recommendations) and Cloudflare D1 (roadmap progress, session data). The ML model is hosted on a separate inference endpoint.",
        },
      ],
    },
    {
      id: "ch1-organisation",
      title: "1.7 Organisation of the Report",
      blocks: [
        {
          type: "paragraph",
          text: "The remainder of this report is organised as follows:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Chapter 2 — System Analysis and Design: presents the requirements analysis, use case modelling, data flow diagrams, and system design decisions that informed PathWise's development.",
            "Chapter 3 — System Architecture: describes the technical architecture of PathWise, covering the frontend, backend, AI subsystems, database design, authentication, and deployment infrastructure.",
            "Chapter 4 — System Implementation and Testing: details the implementation of each major module and presents the results of functional, unit, and user acceptance testing.",
            "Chapter 5 — Conclusion and Future Work: summarises the project's achievements, reflects on challenges encountered, and outlines directions for future development.",
            "References: lists all academic, technical, and industry sources cited throughout the report.",
            "Appendices: provides supplementary material including the full API reference, user manual excerpts, and testing artefacts.",
          ],
        },
      ],
    },
  ],
};
