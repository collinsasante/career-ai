import type { DocChapter } from "../types";

export const chapter5: DocChapter = {
  id: "chapter-5",
  number: "5",
  title: "Conclusion and Future Work",
  description: "Summary of achievements, challenges encountered, and the roadmap for future development.",
  readingMinutes: 10,
  sections: [
    {
      id: "ch5-summary",
      title: "5.1 Summary of the Project",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "PathWise set out to address a critical gap in Ghana's educational ecosystem: the absence of personalised, AI-powered career guidance accessible to the average Ghanaian student. This report has documented the analysis, design, implementation, and testing of a full-stack web platform that achieves this goal through a combination of machine learning, large language model integration, and thoughtful user experience design grounded in Ghana's actual curriculum.",
        },
        {
          type: "paragraph",
          text: "The platform was built using a modern, production-grade technology stack — Next.js 15, React 19, TypeScript, Tailwind CSS, Firebase Authentication, and Anthropic's Claude AI — and deployed to Cloudflare's global edge network for performance and scalability. The development followed an Agile methodology across four two-week sprints, with iterative user feedback incorporated throughout.",
        },
        {
          type: "paragraph",
          text: "The final system delivers on all seven primary objectives established in Chapter 1: a guided onboarding process aligned to Ghana's education system, a machine learning model achieving 99.9% top-1 accuracy, Claude AI integration for nuanced conversational guidance, a career library structured around SHS, university, and TVET pathways, personalised learning roadmap generation, production deployment, and validated usability through UAT with a cohort of five target users.",
        },
      ],
    },
    {
      id: "ch5-achievements",
      title: "5.2 Key Achievements",
      blocks: [
        {
          type: "paragraph",
          text: "Beyond meeting the stated objectives, several notable achievements emerged during the development of PathWise:",
        },
        {
          type: "list",
          items: [
            "Ghana-specific educational context: PathWise is the first known AI career guidance platform to structure its career library around Ghana's GES-mandated SHS programme tracks, university degree classifications, and COTVET TVET qualifications — providing a level of local relevance unavailable in existing global platforms.",
            "Hybrid recommendation architecture: The combination of a fast ML model for initial recommendations with Claude as an intelligent, reasoning fallback provides both performance and depth that neither approach alone could achieve.",
            "Zero-dependency authentication bridge: The custom JWT session management layer using jose enables full Firebase Authentication support on Cloudflare Workers' edge runtime — a non-trivial engineering challenge given the edge runtime's incompatibility with the Firebase Admin SDK.",
            "Scalable, serverless deployment: The Cloudflare Workers + D1 + Airtable architecture eliminates server management overhead entirely, allowing PathWise to scale from zero to thousands of concurrent users without provisioning or configuration.",
            "Strong usability outcomes: A UAT SUS score of 79.5 — placing PathWise in the 'Good' usability category — demonstrates that AI-powered career guidance systems can be made accessible and intuitive for non-technical student users.",
          ],
        },
        {
          type: "stats",
          items: [
            { value: "96", label: "Career pathways mapped", sub: "Across all sectors" },
            { value: "36", label: "Educational programmes", sub: "SHS + University + TVET" },
            { value: "79.5", label: "SUS usability score", sub: "Good category" },
            { value: "< 2s", label: "Average page load", sub: "LCP across all routes" },
          ],
        },
      ],
    },
    {
      id: "ch5-challenges",
      title: "5.3 Challenges and Limitations",
      blocks: [
        {
          type: "paragraph",
          text: "The development of PathWise encountered several significant technical and contextual challenges that shaped the final design decisions and impose limitations on the current implementation.",
        },
        {
          type: "heading3",
          text: "Technical Challenges",
          id: "ch5-tech-challenges",
        },
        {
          type: "list",
          items: [
            "Firebase Admin SDK incompatibility with Cloudflare Workers: Firebase's server-side SDK relies on Node.js APIs unavailable in the edge runtime. This required developing a custom authentication verification mechanism using the jose JWT library, adding development complexity and a custom session management layer.",
            "AI response latency: Claude API calls for recommendation generation and roadmap creation take 4–12 seconds depending on context window size. This latency required the implementation of optimistic UI patterns and loading states throughout the application.",
            "Synthetic training data: The ML model was trained on artificially generated data due to the absence of a real dataset of Ghanaian student profiles. While the model achieves high accuracy on the synthetic test set, real-world performance cannot be fully validated without genuine user data.",
            "Airtable rate limits: Airtable's free tier imposes API rate limits of 5 requests per second per base. Under concurrent user load, this could cause recommendation storage bottlenecks. A queue-based write pattern was implemented as a mitigation.",
          ],
        },
        {
          type: "heading3",
          text: "Contextual Limitations",
          id: "ch5-contextual",
        },
        {
          type: "list",
          items: [
            "Salary data accuracy: Salary ranges in PathWise are estimated from publicly available data (GES salary scales, GSS labour force reports, LinkedIn Salary) and may not reflect current market rates, especially in rapidly evolving sectors like technology.",
            "Regional variation: Ghana's labour market varies significantly by region (Greater Accra vs. rural Northern Region), but PathWise currently provides national-level guidance without regional differentiation.",
            "Language: PathWise is English-only. A significant portion of Ghana's youth are more comfortable in Ghanaian languages (Twi, Ga, Ewe). This limits accessibility for non-English-dominant users.",
            "Device access: While PathWise is mobile-responsive, it has not been optimised for feature phones or very slow internet connections common in some parts of Ghana.",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          title: "Data Limitation Acknowledgement",
          text: "PathWise's ML model and career data are based on synthetic and estimated data respectively. Users should treat AI recommendations as an informed starting point for career exploration, not as definitive professional career counselling. We recommend consulting qualified career counsellors for major academic and professional decisions.",
        },
      ],
    },
    {
      id: "ch5-future",
      title: "5.4 Future Work",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise's current implementation establishes a solid foundation for a comprehensive AI career guidance platform. Several significant enhancements are planned for future development cycles:",
        },
        {
          type: "heading3",
          text: "Near-term (3–6 months)",
          id: "ch5-nearterm",
        },
        {
          type: "list",
          items: [
            "Real user data collection and ML model retraining: As PathWise accumulates real user profiles (with explicit consent), the ML model will be retrained on genuine Ghanaian student data, significantly improving recommendation quality.",
            "Regional job market data: Integration with local job boards (Jobberman Ghana, BrighterMonday) to provide live demand signals and salary data by region.",
            "Multilingual support: Addition of Twi (Asante Twi) language support as the first Ghanaian-language interface, expanding accessibility to a significantly larger user base.",
            "Mobile app (Progressive Web App): Conversion of PathWise to a PWA with offline capability, enabling access in areas with intermittent internet connectivity.",
          ],
        },
        {
          type: "heading3",
          text: "Medium-term (6–18 months)",
          id: "ch5-midterm",
        },
        {
          type: "list",
          items: [
            "Mentorship matching: A peer and professional mentorship matching feature connecting students with PathWise alumni working in their target careers.",
            "Institution partnerships: Formal partnerships with Ghanaian universities and SHS institutions to integrate PathWise into their official career guidance services, potentially providing access to WAEC examination subject data for more accurate profiling.",
            "Employer portal: An employer-facing dashboard allowing companies to post career opportunities and view anonymised talent pool data, creating a sustainable revenue model for the platform.",
            "WAEC result integration: API integration with WAEC's result verification system to automatically populate a student's actual subject grades into their PathWise profile for more accurate recommendations.",
            "Improved roadmap resources: Partnerships with Ghanaian training providers (IPMC Ghana, Aptech, Niit) to embed locally-available courses into roadmaps, replacing predominantly Western resources.",
          ],
        },
        {
          type: "heading3",
          text: "Long-term (18+ months)",
          id: "ch5-longterm",
        },
        {
          type: "list",
          items: [
            "Pan-African expansion: Extension of the platform's educational framework to other West African nations (Nigeria, Côte d'Ivoire, Senegal) with country-specific curriculum mapping and labour market data.",
            "AI agent autonomy: Upgrade the AI advisor to a fully agentic system capable of autonomously researching and drafting personalised study plans, booking free online courses, and monitoring progress without user initiation.",
            "Scholarship and funding discovery: An AI-powered scholarship matching feature that identifies relevant funding opportunities (Ghana Education Trust Fund, MasterCard Foundation Scholars, Erasmus+) based on a student's profile.",
          ],
        },
      ],
    },
    {
      id: "ch5-conclusion",
      title: "5.5 Conclusion",
      blocks: [
        {
          type: "paragraph",
          text: "PathWise demonstrates that it is possible to build a production-grade, AI-powered career guidance platform that is meaningfully adapted to the Ghanaian educational and economic context — and that such a platform can be built by a small team using modern open-source tools, edge computing infrastructure, and state-of-the-art large language models.",
        },
        {
          type: "paragraph",
          text: "The platform's hybrid recommendation architecture — combining a fast ML model with Claude AI's deep reasoning capabilities — represents a practical pattern for AI applications that need both performance and nuance. The Ghana-specific career library, grounded in GES curriculum documentation and COTVET TVET frameworks, provides a template for how global AI tools can be localised to serve African educational contexts.",
        },
        {
          type: "paragraph",
          text: "Most importantly, PathWise represents a step towards democratising access to high-quality career guidance for Ghanaian students — young people who deserve the same quality of personalised, data-driven career support that their counterparts in wealthier nations take for granted. The platform is live, functional, and ready to serve as a foundation for continued development in partnership with Ghanaian educational institutions and employers.",
        },
        {
          type: "quote",
          text: "The best time to give a young person accurate career guidance is before they make decisions that are hard to reverse. PathWise aims to be there at exactly that moment — informed, personalised, and free.",
          author: "PathWise Project",
          role: "Mission Statement",
        },
      ],
    },
  ],
};
