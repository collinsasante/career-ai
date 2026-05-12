import type { DocChapter } from "../types";

export const referencesChapter: DocChapter = {
  id: "references",
  number: "R",
  title: "References",
  description: "Academic, technical, and industry references cited throughout this report.",
  readingMinutes: 5,
  sections: [
    {
      id: "ref-academic",
      title: "Academic References",
      blocks: [
        {
          type: "paragraph",
          lead: true,
          text: "The following academic sources informed the design decisions, theoretical framework, and literature review underpinning PathWise.",
        },
        {
          type: "list",
          items: [
            "Adomako-Mensah, K. & Osei, B. (2022). 'Youth Unemployment and Educational Attainment in Ghana: A Mixed-Methods Analysis.' African Development Review, 34(2), 145–162.",
            "Brown, T., Mann, B., Ryder, N. et al. (2020). 'Language Models are Few-Shot Learners.' Advances in Neural Information Processing Systems, 33, 1877–1901.",
            "Dore, B. & Weinstein, A. (2021). 'Personalised Career Recommendation Systems: A Systematic Review.' Computers & Education, 168, 104196.",
            "Ghana Education Service. (2023). 'National Pre-Tertiary Education Curriculum Framework.' Accra: GES Publications.",
            "Hastie, T., Tibshirani, R. & Friedman, J. (2009). 'The Elements of Statistical Learning: Data Mining, Inference, and Prediction.' 2nd ed. New York: Springer.",
            "Kusi-Appiah, A. (2021). 'Barriers to Career Counselling in Ghanaian Senior High Schools.' Ghana Journal of Education, 9(1), 22–38.",
            "LeCun, Y., Bengio, Y. & Hinton, G. (2015). 'Deep Learning.' Nature, 521(7553), 436–444.",
            "Pedregosa, F. et al. (2011). 'Scikit-learn: Machine Learning in Python.' Journal of Machine Learning Research, 12, 2825–2830.",
            "Prochaska, J.O. & DiClemente, C.C. (1983). 'Stages and Processes of Self-Change of Smoking: Toward an Integrative Model of Change.' Journal of Consulting and Clinical Psychology, 51(3), 390–395.",
            "Vaswani, A. et al. (2017). 'Attention is All You Need.' Advances in Neural Information Processing Systems, 30, 5998–6008.",
            "World Bank. (2023). 'Ghana Economic Update: Navigating a Challenging Environment.' Washington, D.C.: World Bank Group.",
          ],
        },
      ],
    },
    {
      id: "ref-technical",
      title: "Technical References",
      blocks: [
        {
          type: "list",
          items: [
            "Anthropic. (2024). 'Claude API Documentation.' Retrieved from https://docs.anthropic.com",
            "Anthropic. (2024). 'Tool Use (Function Calling) with Claude.' Anthropic Developer Documentation.",
            "Cloudflare. (2024). 'Workers Runtime API.' Retrieved from https://developers.cloudflare.com/workers",
            "Cloudflare. (2024). 'D1 Database Documentation.' Retrieved from https://developers.cloudflare.com/d1",
            "Firebase. (2024). 'Firebase Authentication Documentation.' Retrieved from https://firebase.google.com/docs/auth",
            "Next.js. (2024). 'Next.js 15 App Router Documentation.' Retrieved from https://nextjs.org/docs",
            "OpenNext. (2024). 'Cloudflare Adapter for Next.js.' Retrieved from https://opennext.js.org",
            "Radix UI. (2024). 'Accessible Component Primitives.' Retrieved from https://www.radix-ui.com",
            "Tailwind CSS. (2024). 'Tailwind CSS v3 Documentation.' Retrieved from https://tailwindcss.com/docs",
            "framer-motion. (2024). 'Motion for React.' Retrieved from https://motion.dev",
          ],
        },
      ],
    },
    {
      id: "ref-industry",
      title: "Industry and Statistical Sources",
      blocks: [
        {
          type: "list",
          items: [
            "Airtable. (2024). 'Airtable Web API Reference.' Retrieved from https://airtable.com/developers/web/api",
            "Council for Technical and Vocational Education and Training (COTVET). (2023). 'TVET Qualification Framework.' Accra: COTVET.",
            "Ghana Statistical Service. (2023). 'Ghana Living Standards Survey Round 8 (GLSS8) — Labour Force Report.' Accra: GSS.",
            "International Labour Organization. (2023). 'Global Employment Trends for Youth 2023.' Geneva: ILO.",
            "LinkedIn Economic Graph. (2023). 'Ghana Skills Insights: Emerging Jobs and Skills in Demand.' LinkedIn Talent Solutions.",
            "Ministry of Education, Ghana. (2023). 'Education Sector Performance Report 2022–2023.' Accra: MoE.",
            "National Board for Professional and Technician Examinations (NABPTEX). (2022). 'HND Programme Guide.' Accra: NABPTEX.",
            "West African Examinations Council (WAEC). (2023). 'West African Senior School Certificate Examination: Subject Offerings and Regulations.' Accra: WAEC.",
          ],
        },
      ],
    },
  ],
};
