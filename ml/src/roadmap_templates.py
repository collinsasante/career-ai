"""
PathWise — Roadmap Template Library
=====================================
Hand-curated, phase-by-phase learning roadmaps for all 26 supported careers.

Step level tags control which users see each step:
  'all'            – every user sees this step
  'starter_only'   – only beginner users (skip if user already has foundation)
  'builder_plus'   – intermediate + advanced users only
  'advanced_only'  – only shown to users who already have a strong foundation

Phase 'base_weeks' is the baseline duration at part-time pace.
The personalization model multiplies this by a duration_factor
(0.7 for full-time learners → 2.0 for limited availability).
"""

ROADMAP_TEMPLATES: dict[str, dict] = {

    # ──────────────────────────────────────────────────────────────────────
    "software-engineer": {
        "career_title": "Software Engineer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Programming Foundations",
                "description": "Build solid fundamentals in a primary language and understand how the web works.",
                "base_weeks": 5,
                "skills_covered": ["HTML/CSS", "JavaScript", "Python", "Git"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Learn HTML & CSS fundamentals",
                        "description": "Understand document structure, semantic HTML, and core CSS layout techniques (flexbox, grid).",
                        "resources": [
                            {"title": "The Odin Project — Foundations", "type": "course"},
                            {"title": "freeCodeCamp — Responsive Web Design", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "starter_only",
                        "title": "JavaScript essentials",
                        "description": "Learn variables, functions, DOM manipulation, async/await, and ES6+ syntax.",
                        "resources": [
                            {"title": "javascript.info — Modern JavaScript Tutorial", "type": "course"},
                            {"title": "Eloquent JavaScript (book, free online)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Version control with Git & GitHub",
                        "description": "Learn branching, merging, pull requests, and collaborative workflows — non-negotiable for any engineering role.",
                        "resources": [
                            {"title": "GitHub's Git Handbook", "type": "course"},
                            {"title": "Learn Git Branching (interactive)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p1-s4", "level": "builder_plus",
                        "title": "TypeScript for safer JavaScript",
                        "description": "Add static types to your JS projects. Most professional codebases use TypeScript — get comfortable with it early.",
                        "resources": [
                            {"title": "Total TypeScript — Beginner's TypeScript", "type": "course"},
                            {"title": "TypeScript Handbook (official docs)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Full-Stack Development",
                "description": "Build complete web applications with a frontend framework and a backend API.",
                "base_weeks": 7,
                "skills_covered": ["React", "Node.js", "SQL", "REST APIs"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "React fundamentals",
                        "description": "Build component-based UIs with hooks, state management, and routing. React is the dominant choice in the industry.",
                        "resources": [
                            {"title": "React docs (beta) — react.dev", "type": "course"},
                            {"title": "Scrimba — Learn React for Free", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Backend with Node.js & Express",
                        "description": "Build REST APIs, handle authentication, connect to databases, and understand the request/response lifecycle.",
                        "resources": [
                            {"title": "The Odin Project — NodeJS Path", "type": "course"},
                            {"title": "freeCodeCamp — Backend Development & APIs", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "Databases: SQL & PostgreSQL",
                        "description": "Learn relational database design, SQL queries, joins, indexes, and connecting a database to your backend.",
                        "resources": [
                            {"title": "SQLZoo — Interactive SQL", "type": "practice"},
                            {"title": "PostgreSQL Tutorial (postgresqltutorial.com)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s4", "level": "builder_plus",
                        "title": "Testing: unit, integration, and end-to-end",
                        "description": "Write tests with Jest and Cypress. Untested code is a liability — build the habit early.",
                        "resources": [
                            {"title": "Testing JavaScript by Kent C. Dodds", "type": "course"},
                            {"title": "Cypress Docs — Getting Started", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Systems & Advanced Practices",
                "description": "Level up with cloud deployment, system design, and the engineering practices used in professional teams.",
                "base_weeks": 6,
                "skills_covered": ["Docker", "AWS", "System Design", "CI/CD"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Containerise apps with Docker",
                        "description": "Learn Dockerfiles, containers, and Docker Compose to create reproducible development and production environments.",
                        "resources": [
                            {"title": "Docker — Official Getting Started", "type": "course"},
                            {"title": "TechWorld with Nana — Docker Tutorial", "type": "video"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Deploy to the cloud (AWS or Vercel)",
                        "description": "Deploy a full-stack app end-to-end. Understand EC2, S3, Lambda basics, or use Vercel/Render for quick wins.",
                        "resources": [
                            {"title": "AWS Free Tier — Hands-on Labs", "type": "practice"},
                            {"title": "Fireship — Next.js + Vercel Deployment", "type": "video"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "System design fundamentals",
                        "description": "Learn how to design scalable systems: load balancers, caching, databases at scale, and API design patterns.",
                        "resources": [
                            {"title": "System Design Primer (GitHub)", "type": "book"},
                            {"title": "ByteByteGo — System Design Newsletter", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s4", "level": "advanced_only",
                        "title": "Set up a CI/CD pipeline",
                        "description": "Automate tests and deployments with GitHub Actions or similar. Understand linting, code coverage, and automated releases.",
                        "resources": [
                            {"title": "GitHub Actions — Official Docs", "type": "course"},
                            {"title": "DevOps with GitHub Actions (Udemy)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Job Preparation",
                "description": "Build a standout portfolio project, practice technical interviews, and land your first role.",
                "base_weeks": 4,
                "skills_covered": ["Portfolio", "Algorithms", "System Design Interviews"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build a full-stack portfolio project",
                        "description": "Ship a real product end-to-end: auth, database, deployed URL, clean README. One strong project beats five tutorials.",
                        "resources": [
                            {"title": "Build a SaaS app (Fireship — 100 Seconds series)", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "LeetCode: data structures & algorithms",
                        "description": "Practice 50–75 easy/medium problems covering arrays, hashmaps, trees, and dynamic programming.",
                        "resources": [
                            {"title": "Neetcode.io — Roadmap (free)", "type": "practice"},
                            {"title": "Cracking the Coding Interview (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Optimise your GitHub and LinkedIn",
                        "description": "Pin your best project, write a compelling README, and make your LinkedIn headline and about section role-specific.",
                        "resources": [
                            {"title": "GitHub Profile README guide (GitHub Docs)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "data-scientist": {
        "career_title": "Data Scientist",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Maths & Programming Foundations",
                "description": "Build the statistical and coding bedrock that every data science technique depends on.",
                "base_weeks": 6,
                "skills_covered": ["Python", "Statistics", "Linear Algebra", "Probability"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Python for data: NumPy, pandas, matplotlib",
                        "description": "Get fluent with the core data stack. You'll spend 80% of your time in pandas — know it deeply.",
                        "resources": [
                            {"title": "Kaggle — Python & Pandas (free micro-courses)", "type": "course"},
                            {"title": "Python for Data Analysis by Wes McKinney (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "starter_only",
                        "title": "Statistics essentials",
                        "description": "Probability distributions, hypothesis testing, confidence intervals, and Bayesian thinking. These underpin every ML model.",
                        "resources": [
                            {"title": "StatQuest with Josh Starmer (YouTube)", "type": "video"},
                            {"title": "Khan Academy — Statistics & Probability", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "SQL for analysts",
                        "description": "Write complex queries, CTEs, window functions. Most production data lives in relational databases — SQL is non-negotiable.",
                        "resources": [
                            {"title": "Mode Analytics SQL Tutorial", "type": "course"},
                            {"title": "SQLZoo — interactive practice", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p1-s4", "level": "builder_plus",
                        "title": "Linear algebra for ML",
                        "description": "Understand vectors, matrices, and decompositions. Essential for understanding PCA, neural networks, and embeddings.",
                        "resources": [
                            {"title": "3Blue1Brown — Essence of Linear Algebra (YouTube)", "type": "video"},
                            {"title": "Fast.ai — Computational Linear Algebra", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Machine Learning Core",
                "description": "Learn classical ML algorithms, model evaluation, and the scikit-learn workflow.",
                "base_weeks": 8,
                "skills_covered": ["Scikit-learn", "Machine Learning", "Feature Engineering", "Model Evaluation"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Supervised learning with scikit-learn",
                        "description": "Linear/logistic regression, decision trees, random forests, gradient boosting. Understand bias-variance tradeoff and cross-validation.",
                        "resources": [
                            {"title": "Hands-On Machine Learning (Géron) — Chapters 1-7", "type": "book"},
                            {"title": "Kaggle — Intro to Machine Learning", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Feature engineering & preprocessing",
                        "description": "Scaling, encoding, imputation, feature selection. The quality of features matters more than model choice.",
                        "resources": [
                            {"title": "Feature Engineering for Machine Learning (Udemy)", "type": "course"},
                            {"title": "Kaggle — Feature Engineering micro-course", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "Unsupervised learning & dimensionality reduction",
                        "description": "K-means, DBSCAN, PCA, t-SNE. Used for segmentation, anomaly detection, and exploratory analysis.",
                        "resources": [
                            {"title": "Hands-On Machine Learning — Chapters 8-9", "type": "book"},
                        ],
                    },
                    {
                        "id": "p2-s4", "level": "builder_plus",
                        "title": "Build an end-to-end ML pipeline",
                        "description": "Package a model with scikit-learn Pipelines, evaluate with proper holdout strategy, and serialise with joblib/pickle.",
                        "resources": [
                            {"title": "Kaggle — Intermediate Machine Learning", "type": "course"},
                            {"title": "MLflow Getting Started (mlflow.org)", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Deep Learning & NLP",
                "description": "Extend into neural networks and language models — the cutting edge of modern data science.",
                "base_weeks": 8,
                "skills_covered": ["TensorFlow", "PyTorch", "NLP", "Computer Vision basics"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Neural networks with PyTorch",
                        "description": "Build feedforward, convolutional, and recurrent networks from scratch. PyTorch's dynamic graph makes it the research standard.",
                        "resources": [
                            {"title": "fast.ai — Practical Deep Learning for Coders", "type": "course"},
                            {"title": "Deep Learning with PyTorch (official tutorial)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "NLP: text classification and transformers",
                        "description": "Tokenisation, embeddings, fine-tuning BERT/GPT models with HuggingFace Transformers.",
                        "resources": [
                            {"title": "HuggingFace NLP Course (free, huggingface.co)", "type": "course"},
                            {"title": "Andrej Karpathy — Neural Networks: Zero to Hero (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Experiment tracking and model registry",
                        "description": "Use MLflow or Weights & Biases to track experiments, compare runs, and manage model versions.",
                        "resources": [
                            {"title": "Weights & Biases — Intro Course", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s4", "level": "advanced_only",
                        "title": "Deploy ML models to production",
                        "description": "Serve models via FastAPI or TorchServe. Understand latency, drift monitoring, and A/B testing.",
                        "resources": [
                            {"title": "Full Stack Deep Learning (fullstackdeeplearning.com)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio Projects & Interview Prep",
                "description": "Build Kaggle credibility, showcase end-to-end projects, and prepare for technical interviews.",
                "base_weeks": 5,
                "skills_covered": ["Portfolio", "Kaggle", "Storytelling"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Complete a Kaggle competition",
                        "description": "Join a Playground or Getting Started competition. The leaderboard, discussion forums, and notebooks are an unbeatable learning environment.",
                        "resources": [
                            {"title": "Kaggle Competitions (kaggle.com)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build an end-to-end public project",
                        "description": "Data collection → EDA → modelling → deployment or dashboard. Publish on GitHub with a clear README and results summary.",
                        "resources": [
                            {"title": "Streamlit — Deploy ML apps in Python", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "SQL + statistics interview prep",
                        "description": "Practice data manipulation SQL, probability puzzles, and A/B test analysis questions — common at FAANG and growth companies.",
                        "resources": [
                            {"title": "DataLemur — SQL Interview Questions", "type": "practice"},
                            {"title": "Ace the Data Science Interview (book)", "type": "book"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "data-analyst": {
        "career_title": "Data Analyst",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Spreadsheets & SQL Foundations",
                "description": "Master the two tools that every data analyst uses every single day.",
                "base_weeks": 4,
                "skills_covered": ["Excel / Spreadsheets", "SQL", "Data Cleaning"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Excel / Google Sheets essentials",
                        "description": "PivotTables, VLOOKUP/XLOOKUP, IF formulas, data validation, and basic charts. This is entry-level data work.",
                        "resources": [
                            {"title": "Excel for Data Analysis — Coursera (Duke)", "type": "course"},
                            {"title": "freeCodeCamp — Excel Tutorial (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "SQL from beginner to intermediate",
                        "description": "SELECT, JOINs, GROUP BY, window functions, subqueries, and CTEs. You'll write SQL every day in this role.",
                        "resources": [
                            {"title": "SQLZoo — Interactive SQL Tutorials", "type": "practice"},
                            {"title": "Mode Analytics SQL Tutorial", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Python for data analysis (pandas)",
                        "description": "Automate repetitive data tasks, clean messy datasets, and build reusable analysis scripts.",
                        "resources": [
                            {"title": "Kaggle — Pandas Micro-Course (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Visualisation & Dashboards",
                "description": "Turn data into clear, compelling visuals that non-technical stakeholders can act on.",
                "base_weeks": 4,
                "skills_covered": ["Power BI", "Tableau", "Data Storytelling"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Tableau fundamentals",
                        "description": "Build calculated fields, filters, LOD expressions, and interactive dashboards. Tableau is widely used in enterprise.",
                        "resources": [
                            {"title": "Tableau Public — Free Training Videos", "type": "course"},
                            {"title": "Coursera — Data Visualisation with Tableau (UC Davis)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Power BI for business reporting",
                        "description": "Create reports with DAX measures, Power Query transformations, and direct database connections.",
                        "resources": [
                            {"title": "Microsoft Learn — Power BI Fundamentals (free)", "type": "course"},
                            {"title": "Guy in a Cube (YouTube — Power BI)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Data storytelling principles",
                        "description": "Learn to choose the right chart type, reduce chart junk, and structure a data narrative that drives a decision.",
                        "resources": [
                            {"title": "Storytelling with Data by Cole Nussbaumer Knaflic", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Statistics & Analysis Methods",
                "description": "Apply statistical thinking to answer real business questions with confidence.",
                "base_weeks": 4,
                "skills_covered": ["Statistics", "A/B Testing", "Regression"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Statistics for analysts",
                        "description": "Descriptive stats, distributions, hypothesis testing, p-values, and confidence intervals. Be able to explain findings correctly.",
                        "resources": [
                            {"title": "Khan Academy — Statistics & Probability", "type": "course"},
                            {"title": "StatQuest with Josh Starmer (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "A/B testing and experiment design",
                        "description": "Design and analyse experiments: sample size calculation, p-values, practical significance vs statistical significance.",
                        "resources": [
                            {"title": "Udacity — A/B Testing by Google (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Linear regression and correlation",
                        "description": "Understand OLS regression, correlation coefficients, and multicollinearity. Used in demand forecasting and attribution.",
                        "resources": [
                            {"title": "Kaggle — Intro to Machine Learning (regression section)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Job Preparation",
                "description": "Build a portfolio that demonstrates real analytical thinking and prepare for interviews.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Business Acumen", "SQL Interviews"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Complete an end-to-end analysis project",
                        "description": "Pick a public dataset, define a business question, clean the data, visualise findings, and write a clear summary. Publish on GitHub or Tableau Public.",
                        "resources": [
                            {"title": "Kaggle Datasets (kaggle.com/datasets)", "type": "project"},
                            {"title": "Alex the Analyst — Portfolio Project Walkthrough (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "SQL interview practice",
                        "description": "Practice window functions, aggregations, and case-study SQL questions typical of analyst interviews.",
                        "resources": [
                            {"title": "DataLemur — SQL Interview Questions", "type": "practice"},
                            {"title": "StrataScratch — SQL + Python Practice", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Practice business case walkthroughs",
                        "description": "Practise interpreting metrics drops, designing dashboards, and presenting findings — common interview formats at data-driven companies.",
                        "resources": [
                            {"title": "Ace the Data Science Interview — Business Cases chapter", "type": "book"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "ux-ui-designer": {
        "career_title": "UX/UI Designer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Design Fundamentals",
                "description": "Learn the core principles of visual design and UX thinking before picking up any tools.",
                "base_weeks": 4,
                "skills_covered": ["Typography", "Colour Theory", "Layout", "UX Principles"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Visual design principles",
                        "description": "Typography, colour theory, whitespace, contrast, and hierarchy. These make the difference between amateur and professional work.",
                        "resources": [
                            {"title": "Google — UX Design Certificate (Coursera, course 1)", "type": "course"},
                            {"title": "Refactoring UI by Tailwind CSS creators (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Introduction to UX: research, empathy, and problem framing",
                        "description": "Learn user interviews, empathy maps, personas, and how to define the problem before jumping to solutions.",
                        "resources": [
                            {"title": "NN/g — UX Fundamentals (free articles)", "type": "course"},
                            {"title": "Don't Make Me Think by Steve Krug", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Accessibility and inclusive design",
                        "description": "WCAG guidelines, colour contrast ratios, keyboard navigation, and ARIA labels. Accessible design is professional design.",
                        "resources": [
                            {"title": "WebAIM — Web Accessibility Introduction (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Figma & Prototyping",
                "description": "Become proficient in Figma — the industry-standard tool for UI design and prototyping.",
                "base_weeks": 5,
                "skills_covered": ["Figma", "Wireframing", "Prototyping", "Design Systems"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Figma fundamentals",
                        "description": "Frames, components, auto layout, variants, and styles. These are the building blocks of professional UI work.",
                        "resources": [
                            {"title": "Figma — Official YouTube channel (free)", "type": "video"},
                            {"title": "Designcode.io — Figma for Beginners", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Wireframing to high-fidelity UI",
                        "description": "Practice the full flow from low-fi sketches to polished mockups. Speed and iteration matter more than perfection.",
                        "resources": [
                            {"title": "Sharpen — Design Challenge Generator", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Build a design system",
                        "description": "Create reusable components, tokens, and documentation. Design systems are expected at any company beyond startup scale.",
                        "resources": [
                            {"title": "Figma — Design Systems (official course)", "type": "course"},
                            {"title": "Material Design 3 — documentation examples", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "User Research & Usability Testing",
                "description": "Validate designs with real users — the skill that separates junior and senior designers.",
                "base_weeks": 4,
                "skills_covered": ["User Research", "Usability Testing", "Analytics"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Usability testing methods",
                        "description": "Moderated vs unmoderated, task-based testing, think-aloud protocol, and analysing session recordings.",
                        "resources": [
                            {"title": "Maze — Free UX Research Certification", "type": "course"},
                            {"title": "NN/g — Usability Testing 101", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Heatmaps and analytics for UX",
                        "description": "Use Hotjar or Microsoft Clarity to interpret click maps, scroll depth, and session recordings in real products.",
                        "resources": [
                            {"title": "Hotjar — Free plan for personal projects", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "UX writing and microcopy",
                        "description": "Button labels, error messages, empty states, onboarding — good UX writing is a competitive differentiator.",
                        "resources": [
                            {"title": "UX Writing Hub — Free course", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Career Launch",
                "description": "Build 2-3 case studies that showcase your process and land your first design role.",
                "base_weeks": 4,
                "skills_covered": ["Portfolio", "Case Studies", "Design Interviews"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Create 2-3 detailed case studies",
                        "description": "Document problem → research → ideation → design → testing → outcome. Process matters as much as visuals to hiring managers.",
                        "resources": [
                            {"title": "Notion or Framer — Free portfolio sites", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Redesign a live app (speculative project)",
                        "description": "Pick a real app with UX problems, document your critique, redesign, and share the case study. Shows initiative and analytical thinking.",
                        "resources": [
                            {"title": "Mobbin — UI Design Inspiration & Research", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Portfolio review and interview prep",
                        "description": "Practice walking through your case studies in 5 minutes. Record yourself. Get feedback on ADPList from senior designers.",
                        "resources": [
                            {"title": "ADPList — Free mentorship from design professionals", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "digital-marketer": {
        "career_title": "Digital Marketer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Marketing Fundamentals",
                "description": "Understand the strategic and analytical foundations before diving into specific channels.",
                "base_weeks": 3,
                "skills_covered": ["Marketing Strategy", "Buyer Personas", "Google Analytics"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Digital marketing overview",
                        "description": "Learn the full funnel (awareness → acquisition → retention), key channels, and how they work together.",
                        "resources": [
                            {"title": "Google Digital Garage — Fundamentals of Digital Marketing (free, certified)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Google Analytics 4 fundamentals",
                        "description": "Set up GA4, understand sessions, events, conversions, and attribution. Data literacy is your competitive edge.",
                        "resources": [
                            {"title": "Google Skillshop — GA4 Certification (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Marketing attribution and measurement",
                        "description": "First-touch, last-touch, and multi-touch attribution models. Understand what's actually driving conversions.",
                        "resources": [
                            {"title": "Measure What Matters by John Doerr (book)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "SEO & Content Marketing",
                "description": "Build organic traffic that compounds over time — the highest ROI long-term channel.",
                "base_weeks": 4,
                "skills_covered": ["SEO", "Writing & Copywriting", "Keyword Research"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "SEO fundamentals",
                        "description": "On-page SEO, keyword research, internal linking, and understanding how Google ranks pages.",
                        "resources": [
                            {"title": "Ahrefs — SEO Training Course (free)", "type": "course"},
                            {"title": "Backlinko — The Definitive SEO Guide", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Content writing and copywriting",
                        "description": "Write headlines, CTAs, and long-form articles that rank and convert. AIDA, PAS, and other frameworks.",
                        "resources": [
                            {"title": "Copyblogger — Content Marketing Education (free)", "type": "course"},
                            {"title": "Everybody Writes by Ann Handley (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Technical SEO",
                        "description": "Site speed, Core Web Vitals, structured data, crawlability, and indexing. These become more important as you grow.",
                        "resources": [
                            {"title": "Google Search Console (free tool + docs)", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Paid Advertising & Social Media",
                "description": "Drive predictable, scalable traffic through paid channels and build audience on social platforms.",
                "base_weeks": 4,
                "skills_covered": ["PPC Advertising", "Social Media Management", "Email Marketing"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Google Ads fundamentals",
                        "description": "Search campaigns, keyword match types, Quality Score, bidding strategies, and conversion tracking.",
                        "resources": [
                            {"title": "Google Skillshop — Google Ads Certification (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Meta Ads (Facebook & Instagram)",
                        "description": "Audience targeting, creative formats, pixel setup, retargeting, and campaign optimization.",
                        "resources": [
                            {"title": "Meta Blueprint — Free online courses", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "all",
                        "title": "Email marketing with Mailchimp or HubSpot",
                        "description": "List building, segmentation, automated sequences, A/B testing subject lines, and deliverability basics.",
                        "resources": [
                            {"title": "HubSpot Academy — Email Marketing Certification (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Job Preparation",
                "description": "Build a results-oriented portfolio and position yourself for your first role or freelance clients.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Analytics Reporting", "Campaign Management"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Run a real mini-campaign",
                        "description": "Use $50–100 on Google or Meta Ads for a real product (your own or a friend's business). Document setup, results, and learnings.",
                        "resources": [
                            {"title": "Google Ads Sandbox — Practice environment", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build a marketing metrics dashboard",
                        "description": "Connect GA4 + Search Console + Google Sheets and build a weekly reporting template. Shows data fluency to employers.",
                        "resources": [
                            {"title": "Looker Studio (free from Google)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Get certified",
                        "description": "Google Ads, GA4, and HubSpot certifications are free and respected. They signal fundamentals to employers who screen CVs.",
                        "resources": [
                            {"title": "Google Skillshop (free certifications)", "type": "practice"},
                            {"title": "HubSpot Academy (free certifications)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "financial-analyst": {
        "career_title": "Financial Analyst",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Accounting & Finance Foundations",
                "description": "Understand financial statements, accounting principles, and the language of business.",
                "base_weeks": 4,
                "skills_covered": ["Accounting", "Financial Statements", "Excel"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Accounting fundamentals",
                        "description": "Balance sheet, income statement, cash flow statement — how they link and what they tell you about a business.",
                        "resources": [
                            {"title": "Coursera — Financial Accounting (University of Pennsylvania)", "type": "course"},
                            {"title": "Accounting Coach (free, accountingcoach.com)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Excel for finance",
                        "description": "Advanced formulas (INDEX/MATCH, SUMIFS), PivotTables, data tables, and keyboard shortcuts for speed.",
                        "resources": [
                            {"title": "CFI — Excel Crash Course (free)", "type": "course"},
                            {"title": "ExcelJet — Function reference (free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Introduction to macroeconomics",
                        "description": "Interest rates, inflation, GDP, and central bank policy. These shape every investment and corporate decision.",
                        "resources": [
                            {"title": "Khan Academy — Macroeconomics (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Financial Modelling",
                "description": "Build the core models that analysts use daily: DCF, three-statement, and scenario models.",
                "base_weeks": 6,
                "skills_covered": ["Financial Modelling", "DCF Analysis", "Budgeting"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Three-statement financial model",
                        "description": "Link the P&L, balance sheet, and cash flow statement in Excel so they update dynamically. The foundation of all financial models.",
                        "resources": [
                            {"title": "CFI — Financial Modelling Fundamentals (free trial)", "type": "course"},
                            {"title": "Wall Street Prep — Financial Modelling (Excel)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "DCF valuation",
                        "description": "Project free cash flows, calculate WACC, build a terminal value, and arrive at an intrinsic value. The fundamental valuation method.",
                        "resources": [
                            {"title": "Aswath Damodaran — Valuation (free, NYU Stern lectures)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Scenario analysis and sensitivity tables",
                        "description": "Build base/bull/bear scenarios and two-variable data tables to stress-test your models.",
                        "resources": [
                            {"title": "Breaking Into Wall Street — Modelling practice files", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Data & Reporting",
                "description": "Add SQL and BI tools to your toolkit to handle large datasets and build automated reports.",
                "base_weeks": 4,
                "skills_covered": ["SQL", "Power BI", "Statistics"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "SQL for financial analysts",
                        "description": "Query accounting and ERP databases, build financial reports directly from raw data, and automate month-end reporting.",
                        "resources": [
                            {"title": "Mode Analytics — SQL Tutorial for Analysts", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Power BI financial dashboards",
                        "description": "Build P&L dashboards, variance reports, and KPI scorecards. Excel dashboards are being replaced by BI tools at scale.",
                        "resources": [
                            {"title": "Microsoft Learn — Power BI Fundamentals (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Statistics for finance",
                        "description": "Regression analysis, correlation, VaR, and Monte Carlo simulation for risk modelling.",
                        "resources": [
                            {"title": "Statistics for Finance — Khan Academy", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Interview Preparation",
                "description": "Build a modelling portfolio and prepare for technical finance interviews.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Investment Analysis", "Interview Prep"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build a public company model",
                        "description": "Pick a public company, download 10-Ks, build a three-statement model and DCF in Excel, and write a 1-page investment thesis.",
                        "resources": [
                            {"title": "SEC Edgar — Company filings (free)", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "CFA Level 1 self-study (optional but valuable)",
                        "description": "Even partial CFA study signals commitment to the profession. Ethics, Quantitative Methods, and FRA are the highest-value sections for analysts.",
                        "resources": [
                            {"title": "CFA Institute — Free study materials", "type": "course"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Technical interview prep",
                        "description": "Practise DCF questions, accounting brain teasers, and walk-me-through-your-model exercises.",
                        "resources": [
                            {"title": "Mergers & Inquisitions — Free Interview Guides", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "cybersecurity-analyst": {
        "career_title": "Cybersecurity Analyst",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Networking & OS Foundations",
                "description": "You cannot protect what you do not understand — start with how networks and operating systems actually work.",
                "base_weeks": 5,
                "skills_covered": ["Networking", "Linux", "TCP/IP", "Protocols"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Networking fundamentals",
                        "description": "TCP/IP, DNS, HTTP/S, firewalls, subnetting. The CompTIA Network+ syllabus is the best structured path here.",
                        "resources": [
                            {"title": "Professor Messer — CompTIA Network+ (free YouTube)", "type": "video"},
                            {"title": "TryHackMe — Pre-Security Learning Path", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Linux command line",
                        "description": "File permissions, processes, networking tools (netstat, nmap, tcpdump), and Bash scripting basics.",
                        "resources": [
                            {"title": "OverTheWire — Bandit wargame (free)", "type": "practice"},
                            {"title": "The Linux Command Line by William Shotts (free online)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Windows Active Directory basics",
                        "description": "Most enterprise environments run on AD. Understand domains, GPOs, and common misconfigurations attackers exploit.",
                        "resources": [
                            {"title": "TryHackMe — Active Directory room", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Security Concepts & Blue Team Skills",
                "description": "Learn to detect, investigate, and respond to security incidents.",
                "base_weeks": 6,
                "skills_covered": ["SIEM", "Risk Assessment", "Incident Response", "Threat Analysis"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "SIEM and log analysis",
                        "description": "Use Splunk or the ELK stack to ingest logs, write detection rules, and triage alerts.",
                        "resources": [
                            {"title": "Splunk Free Training — Fundamentals 1", "type": "course"},
                            {"title": "TryHackMe — SOC Level 1 Path", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Vulnerability management and risk assessment",
                        "description": "CVSS scoring, vulnerability scanning with Nessus/OpenVAS, and remediation prioritisation.",
                        "resources": [
                            {"title": "NIST Cybersecurity Framework (free)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "CompTIA Security+ certification study",
                        "description": "Security+ is the baseline employer certification. It validates networking security, cryptography, and compliance concepts.",
                        "resources": [
                            {"title": "Professor Messer — CompTIA Security+ (free YouTube)", "type": "video"},
                            {"title": "Jason Dion — Security+ Practice Exams (Udemy)", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Offensive Security & Penetration Testing",
                "description": "Learn attacker techniques so you can build better defences and qualify for offensive roles.",
                "base_weeks": 7,
                "skills_covered": ["Penetration Testing", "Bash / Shell", "Python", "Exploit Development"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Web application penetration testing",
                        "description": "OWASP Top 10: SQL injection, XSS, IDOR, broken auth. Use Burp Suite Community to intercept and manipulate requests.",
                        "resources": [
                            {"title": "PortSwigger Web Security Academy (free)", "type": "practice"},
                            {"title": "TryHackMe — Web Application Hacking Path", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Network penetration testing",
                        "description": "Reconnaissance, scanning, enumeration, exploitation, and post-exploitation with Kali Linux tools.",
                        "resources": [
                            {"title": "Hack The Box — Starting Point machines", "type": "practice"},
                            {"title": "TCM Security — Practical Ethical Hacking (Udemy)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Python scripting for security",
                        "description": "Write custom scripts for port scanning, log parsing, and basic exploit PoCs. Automate the tedious parts of pentesting.",
                        "resources": [
                            {"title": "Black Hat Python by Justin Seitz (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s4", "level": "advanced_only",
                        "title": "eJPT or OSCP preparation",
                        "description": "The eJPT (entry) and OSCP (industry gold standard) are the certifications that open doors to offensive security roles.",
                        "resources": [
                            {"title": "INE — eJPT Certification (free starter path)", "type": "course"},
                            {"title": "Offensive Security — PEN-200 (OSCP prep)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Career Preparation",
                "description": "Build a lab portfolio and prepare for technical security interviews.",
                "base_weeks": 4,
                "skills_covered": ["Home Lab", "CTF", "Portfolio"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build a home lab",
                        "description": "Set up virtual machines with VirtualBox/VMware: Kali Linux, vulnerable VMs (Metasploitable, DVWA). Document everything as a portfolio.",
                        "resources": [
                            {"title": "VirtualBox (free)", "type": "project"},
                            {"title": "Vulnhub — free vulnerable VMs", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Participate in CTF competitions",
                        "description": "CTFtime.org lists beginner-friendly Capture The Flag events. Write-ups of solved challenges make excellent portfolio pieces.",
                        "resources": [
                            {"title": "CTFtime.org — Upcoming CTFs", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Security certifications roadmap",
                        "description": "CompTIA Security+ → CompTIA CySA+ → eJPT → OSCP. Plan your certification path based on whether you want blue or red team.",
                        "resources": [
                            {"title": "Paul Jerimy — Security Certification Roadmap (free)", "type": "book"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "devops-engineer": {
        "career_title": "DevOps Engineer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Linux, Scripting & Version Control",
                "description": "The bedrock: command-line fluency, scripting, and source control are prerequisites for everything else.",
                "base_weeks": 4,
                "skills_covered": ["Linux", "Bash / Shell", "Git", "Python"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Linux fundamentals",
                        "description": "File system, permissions, processes, systemd, package management, and common tools (grep, sed, awk, curl).",
                        "resources": [
                            {"title": "The Linux Command Line (free online)", "type": "book"},
                            {"title": "TryHackMe — Linux Fundamentals rooms (free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Bash scripting",
                        "description": "Variables, loops, conditionals, functions, and writing automation scripts. You'll write dozens of these in your first month on the job.",
                        "resources": [
                            {"title": "Greg's Bash Guide (mywiki.wooledge.org)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Git advanced workflows",
                        "description": "Branching strategies, rebasing, merge conflict resolution, and Git hooks. DevOps engineers own the Git workflow for their team.",
                        "resources": [
                            {"title": "Atlassian Git Tutorials (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s4", "level": "builder_plus",
                        "title": "Python scripting for automation",
                        "description": "Automate system tasks, parse logs, call APIs. Python is the glue language of DevOps.",
                        "resources": [
                            {"title": "Automate the Boring Stuff with Python (free online)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Containers & Orchestration",
                "description": "Docker and Kubernetes are now foundational skills for any DevOps role.",
                "base_weeks": 6,
                "skills_covered": ["Docker", "Kubernetes", "CI/CD"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Docker: containers from scratch",
                        "description": "Images, containers, Dockerfile best practices, multi-stage builds, networking, and Docker Compose.",
                        "resources": [
                            {"title": "Docker Official Getting Started", "type": "course"},
                            {"title": "TechWorld with Nana — Docker Tutorial (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Kubernetes fundamentals",
                        "description": "Pods, Deployments, Services, ConfigMaps, PVCs, and Helm charts. K8s is the de-facto container orchestration standard.",
                        "resources": [
                            {"title": "Kubernetes.io — Official Interactive Tutorial", "type": "course"},
                            {"title": "TechWorld with Nana — Kubernetes Crash Course (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "CI/CD with GitHub Actions",
                        "description": "Build pipelines that automatically test, lint, build Docker images, and deploy on merge. This is table stakes for a DevOps role.",
                        "resources": [
                            {"title": "GitHub Actions — Official Documentation", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Cloud Infrastructure & IaC",
                "description": "Provision and manage cloud infrastructure programmatically at scale.",
                "base_weeks": 7,
                "skills_covered": ["AWS", "Terraform", "Monitoring", "Networking"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "AWS core services",
                        "description": "EC2, S3, IAM, VPC, RDS, Lambda, ECS/EKS. The AWS Solutions Architect Associate exam structures this learning well.",
                        "resources": [
                            {"title": "AWS Free Tier — Hands-on labs", "type": "practice"},
                            {"title": "Adrian Cantrill — AWS Solutions Architect Associate (Udemy)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Infrastructure as Code with Terraform",
                        "description": "Write, plan, and apply Terraform configurations to provision cloud resources repeatably and version-controlled.",
                        "resources": [
                            {"title": "HashiCorp — Terraform Getting Started (free)", "type": "course"},
                            {"title": "TechWorld with Nana — Terraform Tutorial (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Observability: Prometheus + Grafana",
                        "description": "Instrument services, write PromQL queries, and build dashboards to monitor your infrastructure.",
                        "resources": [
                            {"title": "Prometheus Docs — Getting Started", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Certifications & Job Preparation",
                "description": "Get cloud certified and build a portfolio of real infrastructure projects.",
                "base_weeks": 4,
                "skills_covered": ["AWS Certification", "Portfolio", "Interview Prep"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "AWS Solutions Architect Associate certification",
                        "description": "The most recognised AWS certification for infrastructure engineers. Opens doors at cloud-native companies.",
                        "resources": [
                            {"title": "Tutorials Dojo — AWS Practice Exams (Udemy)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build an end-to-end portfolio project",
                        "description": "Deploy a multi-tier application on AWS using Terraform, Docker, Kubernetes, and GitHub Actions CI/CD. Document it in a public GitHub repo.",
                        "resources": [
                            {"title": "Cloud Resume Challenge (cloudresumechallenge.dev)", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "DevOps interview preparation",
                        "description": "Practice Linux troubleshooting scenarios, Kubernetes debugging, and system design questions common at DevOps interviews.",
                        "resources": [
                            {"title": "DevOps Interview Questions — GitHub repo (free)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "product-manager": {
        "career_title": "Product Manager",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Product Thinking Foundations",
                "description": "Learn the core frameworks for defining problems, understanding users, and making product decisions.",
                "base_weeks": 3,
                "skills_covered": ["Product Thinking", "User Research", "Problem Framing"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Intro to product management",
                        "description": "What PMs actually do, where the role sits between engineering/design/business, and the product development lifecycle.",
                        "resources": [
                            {"title": "Product School — Product Management Basics (free)", "type": "course"},
                            {"title": "Inspired by Marty Cagan (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Discovery: user interviews and problem framing",
                        "description": "Run user interviews, synthesise insights, write problem statements. The best PMs spend more time in discovery than in delivery.",
                        "resources": [
                            {"title": "Continuous Discovery Habits by Teresa Torres (book)", "type": "book"},
                            {"title": "User Interviews — Research fundamentals (free articles)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Product strategy and OKRs",
                        "description": "Write a product vision, set OKRs, and align roadmap priorities to company strategy. This separates tactical from strategic PMs.",
                        "resources": [
                            {"title": "Measure What Matters by John Doerr (book)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Roadmap, Prioritisation & Delivery",
                "description": "Turn strategy into a backlog, prioritise ruthlessly, and ship with engineering and design teams.",
                "base_weeks": 4,
                "skills_covered": ["Product Roadmaps", "Agile / Scrum", "JIRA", "Prioritisation"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Agile and Scrum in practice",
                        "description": "Sprints, ceremonies, story points, and velocity. Learn how to run a backlog and work effectively with engineering.",
                        "resources": [
                            {"title": "Scrum.org — Scrum Guide (free)", "type": "book"},
                            {"title": "Atlassian — Agile Tutorials (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Jira for product teams",
                        "description": "Create epics, stories, bugs, and sprints. Write clear acceptance criteria. Jira is ubiquitous — know it well.",
                        "resources": [
                            {"title": "Atlassian University — Jira Fundamentals (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "Prioritisation frameworks",
                        "description": "RICE, ICE, MoSCoW, and opportunity scoring. Learn when each framework is appropriate and how to defend decisions.",
                        "resources": [
                            {"title": "Intercom — On Product Management (free ebook)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Data & Metrics",
                "description": "PMs who can self-serve data make better decisions and are far more valuable.",
                "base_weeks": 4,
                "skills_covered": ["Data Analysis", "Analytics Tools", "A/B Testing"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Product analytics with Mixpanel or Amplitude",
                        "description": "Funnel analysis, retention cohorts, and event tracking. Understand your metrics before you can improve them.",
                        "resources": [
                            {"title": "Mixpanel — Product Analytics Certification (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "SQL for product managers",
                        "description": "Write basic SQL queries to pull your own data. PMs who can't query data are dependent on engineers for every answer.",
                        "resources": [
                            {"title": "Mode Analytics SQL Tutorial (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "A/B testing and experimentation",
                        "description": "Design experiments, calculate sample sizes, and interpret results correctly. Avoid common p-hacking and novelty effect mistakes.",
                        "resources": [
                            {"title": "Udacity — A/B Testing by Google (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Job Preparation",
                "description": "Build a PM portfolio and prepare for case study and product sense interviews.",
                "base_weeks": 3,
                "skills_covered": ["PM Portfolio", "Product Design", "Interview Prep"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Write a product teardown",
                        "description": "Pick an app you use daily. Analyse its strategy, user flows, and metrics, then propose 3 prioritised improvements with clear reasoning.",
                        "resources": [
                            {"title": "Notion — template for PM teardowns", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Practice product sense interviews",
                        "description": "How would you improve X? How do you measure success for Y? Practice with the CIRCLES method and get feedback from PMs.",
                        "resources": [
                            {"title": "Decode and Conquer by Lewis Lin (book)", "type": "book"},
                            {"title": "PM Exercises (pmexercises.com — free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Build or manage a side project",
                        "description": "Launch a simple product (no-code tools work). The experience of owning a product from idea to users is transformative.",
                        "resources": [
                            {"title": "Webflow or Bubble — No-code tools", "type": "project"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "project-manager": {
        "career_title": "Project Manager",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Project Management Foundations",
                "description": "Learn the frameworks, terminology, and processes that underpin every project.",
                "base_weeks": 3,
                "skills_covered": ["Project Management", "Agile / Scrum", "JIRA"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "PMBOK and PMP fundamentals",
                        "description": "The 10 knowledge areas, 5 process groups, and core project management vocabulary. Not all projects use PMBOK, but this is the lingua franca.",
                        "resources": [
                            {"title": "Google Project Management Certificate (Coursera)", "type": "course"},
                            {"title": "PMBOK Guide 7th Edition (overview)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Agile and Scrum",
                        "description": "Sprints, retrospectives, user stories, and velocity. Most tech and hybrid projects use Agile frameworks.",
                        "resources": [
                            {"title": "Scrum.org — Scrum Guide (free)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Project management tools",
                        "description": "Get hands-on with Asana, Monday.com, and Jira. Gantt charts, Kanban boards, and resource allocation views.",
                        "resources": [
                            {"title": "Asana Academy (free courses)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Planning, Risk & Stakeholder Management",
                "description": "The technical core of project management: scope, schedule, budget, and people.",
                "base_weeks": 4,
                "skills_covered": ["Risk Assessment", "Budgeting", "Stakeholder Communication"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Scope and requirements management",
                        "description": "Writing a project charter, WBS (work breakdown structure), and managing scope creep — the #1 reason projects fail.",
                        "resources": [
                            {"title": "PMI — Free PMBOK excerpts and templates", "type": "book"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Risk management",
                        "description": "Risk identification, probability/impact matrix, mitigation strategies, and maintaining a live risk register.",
                        "resources": [
                            {"title": "Google PM Certificate — Risk Management module", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "Stakeholder communication",
                        "description": "Status reports, escalation paths, RACI matrices, and managing expectations across diverse stakeholders.",
                        "resources": [
                            {"title": "Harvard Business Review — Managing Stakeholders (free articles)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Execution & Leadership",
                "description": "Delivering projects requires people skills as much as process skills.",
                "base_weeks": 3,
                "skills_covered": ["Team Leadership", "Negotiation", "Public Speaking"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Leading teams without authority",
                        "description": "PMs rarely have direct reports but must influence engineers, designers, and executives. Influence and coalition-building techniques.",
                        "resources": [
                            {"title": "Crucial Conversations (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Conflict resolution and negotiation",
                        "description": "Interest-based negotiation, handling difficult stakeholders, and de-escalating team conflict.",
                        "resources": [
                            {"title": "Getting to Yes by Roger Fisher (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "MS Project for complex scheduling",
                        "description": "Critical path method, resource levelling, and earned value analysis for large multi-workstream projects.",
                        "resources": [
                            {"title": "Microsoft Learn — MS Project (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Certifications & Career Launch",
                "description": "Get certified and build a portfolio of project experience.",
                "base_weeks": 3,
                "skills_covered": ["PMP Certification", "Prince2", "Portfolio"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "CAPM or PMP certification preparation",
                        "description": "CAPM for those without 3 years experience; PMP for those with. Both are globally recognised and boost salary significantly.",
                        "resources": [
                            {"title": "PMI — CAPM Exam Prep (official)", "type": "course"},
                            {"title": "Andrew Ramdayal — PMP Prep (Udemy)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Volunteer to run a real project",
                        "description": "Run an event, lead a community initiative, or manage a side project end-to-end. Document the plan, execution, and retrospective.",
                        "resources": [
                            {"title": "Catch up on project docs with Notion templates", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "PM interview preparation",
                        "description": "STAR format behavioural questions, situational questions (how do you handle a project behind schedule?), and case studies.",
                        "resources": [
                            {"title": "PM interview questions — PMI Blog (free)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "graphic-designer": {
        "career_title": "Graphic Designer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Design Theory & Foundations",
                "description": "Build a strong theoretical foundation — designers without principles produce visuals that look busy, not intentional.",
                "base_weeks": 3,
                "skills_covered": ["Typography", "Colour Theory", "Composition", "Grid Systems"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Core design principles",
                        "description": "Typography, colour theory, contrast, alignment, hierarchy, and white space. Study these with real-world examples.",
                        "resources": [
                            {"title": "Design Fundamentals — CalArts (Coursera, free to audit)", "type": "course"},
                            {"title": "The Elements of Typographic Style (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Colour systems and brand colour theory",
                        "description": "CMYK vs RGB, colour psychology, building a brand colour palette, and accessibility contrast ratios.",
                        "resources": [
                            {"title": "Adobe Color Wheel (free tool)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Study design history and movements",
                        "description": "Bauhaus, Swiss International Style, postmodernism — understanding design history makes your references richer.",
                        "resources": [
                            {"title": "Fonts In Use (fontsinuse.com) — visual research", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Adobe Creative Suite & Figma",
                "description": "Master the tools that graphic designers use daily across print and digital work.",
                "base_weeks": 5,
                "skills_covered": ["Photoshop", "Illustrator", "Figma", "InDesign"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Adobe Illustrator for vector design",
                        "description": "Pen tool, paths, shapes, live effects, and exporting logos/icons at any resolution. Illustrator is the standard for logo and brand work.",
                        "resources": [
                            {"title": "Adobe Learn — Illustrator tutorials (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Adobe Photoshop for raster work",
                        "description": "Photo retouching, compositing, layer masks, and smart objects. Also used for social media and web assets.",
                        "resources": [
                            {"title": "Adobe Learn — Photoshop tutorials (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "Figma for digital/UI design",
                        "description": "Even graphic designers need Figma for digital deliverables — social templates, web banners, and handoff to developers.",
                        "resources": [
                            {"title": "Figma — Official YouTube channel (free)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s4", "level": "builder_plus",
                        "title": "Motion graphics with After Effects",
                        "description": "Animate logos, create GIF-style social content, and produce short motion sequences. Motion skills command higher rates.",
                        "resources": [
                            {"title": "School of Motion — AE Kickstart (free preview)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Brand Identity & Real Projects",
                "description": "Develop complete brand systems and build a portfolio through real project work.",
                "base_weeks": 5,
                "skills_covered": ["Brand Identity", "Logo Design", "Design Systems"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Build a complete brand identity system",
                        "description": "Create a brand for a fictional company: logo suite, colour palette, typography, usage guidelines, and mockups.",
                        "resources": [
                            {"title": "Futur Academy — How to build a brand (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Redesign an existing brand",
                        "description": "Pick a local business or non-profit with weak design. Diagnose the problems, redesign, and document the before/after with rationale.",
                        "resources": [
                            {"title": "Mockup World — free mockup templates", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Editorial and print design",
                        "description": "Lay out a magazine spread, poster, or report in InDesign. Print design skills are valued and often overlooked by digital-focused designers.",
                        "resources": [
                            {"title": "Adobe Learn — InDesign tutorials (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Career Launch",
                "description": "Build a curated portfolio site and start finding your first freelance or agency clients.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Client Communication", "Freelancing"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build a portfolio website",
                        "description": "3-5 strong case studies with before/after, process, and outcomes. Use Behance, Adobe Portfolio, or a custom site.",
                        "resources": [
                            {"title": "Behance — Free portfolio hosting", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Get first clients through freelance platforms",
                        "description": "Upwork, 99designs, and local businesses are entry points. Take smaller projects to build reviews and referrals.",
                        "resources": [
                            {"title": "Upwork — Freelancer profile guide", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "content-writer": {
        "career_title": "Content Writer / Journalist",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Writing Craft & Research",
                "description": "Great writing is learned. Develop the core habits of research, clarity, and audience awareness.",
                "base_weeks": 3,
                "skills_covered": ["Writing & Copywriting", "Research", "Editing"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Writing fundamentals",
                        "description": "Clarity, structure, tone, and editing ruthlessly. The best writers are the best editors of their own work.",
                        "resources": [
                            {"title": "On Writing Well by William Zinsser (book)", "type": "book"},
                            {"title": "Coursera — Good with Words: Writing and Editing", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Research methods and source verification",
                        "description": "Primary vs secondary sources, fact-checking, interviewing techniques, and citing correctly.",
                        "resources": [
                            {"title": "Knight Center — Introduction to Journalism (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Copywriting and persuasion frameworks",
                        "description": "AIDA, PAS, before-after-bridge. Writing that converts requires a different muscle than journalism or long-form.",
                        "resources": [
                            {"title": "The Copywriter's Handbook by Robert Bly (book)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "SEO & Digital Content",
                "description": "Writing that no one reads is wasted. Learn how to create content that ranks and gets found.",
                "base_weeks": 3,
                "skills_covered": ["SEO", "Content Strategy", "Keyword Research"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "SEO writing fundamentals",
                        "description": "Keyword research, search intent, on-page optimisation, and how to write content that ranks without sounding robotic.",
                        "resources": [
                            {"title": "Ahrefs — Blogging for Business (free course)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "CMS tools: WordPress and headless",
                        "description": "Publish on WordPress, understand categories vs tags, Yoast/Rank Math for SEO, and basic HTML for formatting.",
                        "resources": [
                            {"title": "WordPress.com — Getting Started (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Content strategy and editorial calendars",
                        "description": "Map content to the buyer journey, plan a content calendar, and repurpose content across formats and channels.",
                        "resources": [
                            {"title": "HubSpot — Content Marketing Certification (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Specialist Formats & Tools",
                "description": "Develop skills in the specific formats and niches that command higher rates.",
                "base_weeks": 3,
                "skills_covered": ["Technical Writing", "Social Media", "Long-form"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Technical writing basics",
                        "description": "Write documentation, API guides, and how-to articles. Technical writers are in high demand and consistently out-earn content generalists.",
                        "resources": [
                            {"title": "Google — Technical Writing Courses (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Social media copywriting",
                        "description": "Twitter/X, LinkedIn, and Instagram require distinct voices. Learn hooks, engagement patterns, and format-specific best practices.",
                        "resources": [
                            {"title": "Buffer Blog — Social Media Writing (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & First Clients",
                "description": "Build a portfolio of published work and land your first paid writing role or clients.",
                "base_weeks": 2,
                "skills_covered": ["Portfolio", "Pitching", "Freelance"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Publish 5-10 portfolio pieces",
                        "description": "Start a Substack or Medium publication. Quality over quantity — one brilliant article beats ten mediocre ones.",
                        "resources": [
                            {"title": "Substack — Free publishing platform", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Guest post on established publications",
                        "description": "Write for Towards Data Science, HubSpot Blog, or industry publications in your niche. Bylines with domain authority signal credibility.",
                        "resources": [
                            {"title": "AllTop — Find publications accepting guest posts", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Pitch your first freelance clients",
                        "description": "Cold email outreach, Contently, Skyword, and ProBlogger job board. Write a short pitch that leads with value, not biography.",
                        "resources": [
                            {"title": "ProBlogger Job Board (free)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "hr-specialist": {
        "career_title": "HR Specialist",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "HR Foundations & Employment Law",
                "description": "Build a grounding in the legal and conceptual framework that governs employment.",
                "base_weeks": 3,
                "skills_covered": ["HR Principles", "Employment Law", "Research"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Introduction to Human Resources Management",
                        "description": "HR functions, the employee lifecycle, HR's strategic vs administrative role, and how HR aligns to business goals.",
                        "resources": [
                            {"title": "Coursera — Human Resource Management (HRCI, free to audit)", "type": "course"},
                            {"title": "SHRM — HR Basics for Non-HR Managers (free articles)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Employment law essentials",
                        "description": "Equality Act, GDPR/data privacy, employment contracts, disciplinary procedures, and redundancy. Compliance is non-negotiable in HR.",
                        "resources": [
                            {"title": "ACAS — Employment law guidance (free, UK-focused)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Recruitment & Talent Acquisition",
                "description": "Master the full hiring cycle from job design through offer negotiation.",
                "base_weeks": 3,
                "skills_covered": ["Recruitment", "Interviewing", "Employer Branding"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "The hiring lifecycle",
                        "description": "Job analysis, writing job descriptions, sourcing, screening, structured interviews, and offer management.",
                        "resources": [
                            {"title": "LinkedIn Talent Solutions — Talent Insights (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Structured and behavioural interviewing",
                        "description": "STAR questions, avoiding bias, designing scoring rubrics, and interviewer calibration.",
                        "resources": [
                            {"title": "Greenhouse — Structured Hiring Guide (free)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "ATS tools: Workday, Greenhouse, and LinkedIn Recruiter",
                        "description": "The main tools used in talent acquisition. Get hands-on with at least one via a free trial or university access.",
                        "resources": [
                            {"title": "Greenhouse Academy (free certification)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "People Operations & Culture",
                "description": "From onboarding through performance management and learning & development.",
                "base_weeks": 3,
                "skills_covered": ["Onboarding", "Performance Management", "L&D"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Onboarding programme design",
                        "description": "Best-practice onboarding cuts time-to-productivity in half. Design a 30/60/90 day plan framework.",
                        "resources": [
                            {"title": "BambooHR — Onboarding Guide (free)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Performance management and reviews",
                        "description": "OKRs vs KPIs, continuous feedback loops, performance improvement plans, and avoiding rating bias.",
                        "resources": [
                            {"title": "Gallup — Performance Management Resources (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Certifications & Job Preparation",
                "description": "Get HR certified and build a portfolio of HR project work.",
                "base_weeks": 3,
                "skills_covered": ["CIPD", "SHRM", "Portfolio"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "CIPD or SHRM certification study",
                        "description": "CIPD Level 3 (UK/global) or SHRM-CP (US) are the baseline professional certifications for HR. They signal commitment to the profession.",
                        "resources": [
                            {"title": "CIPD — Qualifications overview (cipd.org)", "type": "course"},
                            {"title": "SHRM — Learning System overview (shrm.org)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "HR data analysis with Excel",
                        "description": "Track headcount, turnover, time-to-hire, and engagement scores. HR analytics is growing — even basic Excel skills stand out.",
                        "resources": [
                            {"title": "People Analytics for HR (AIHR, free intro)", "type": "course"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "business-analyst": {
        "career_title": "Business Analyst",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Business Analysis Foundations",
                "description": "Learn the core frameworks for gathering requirements and understanding business processes.",
                "base_weeks": 3,
                "skills_covered": ["Requirements Gathering", "Process Mapping", "Stakeholder Management"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "What BAs actually do",
                        "description": "The BA role across industries, the BABOK framework, and how BAs sit between business and IT.",
                        "resources": [
                            {"title": "IIBA — What is Business Analysis? (free)", "type": "course"},
                            {"title": "A Guide to the Business Analysis Body of Knowledge (BABOK)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Requirements elicitation techniques",
                        "description": "Interviews, workshops, observations, surveys, and document analysis. The skill of asking the right questions is the core of BA work.",
                        "resources": [
                            {"title": "Coursera — Business Analysis & Process Management", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Process modelling with BPMN",
                        "description": "Business Process Model and Notation — how to diagram current-state and future-state processes clearly.",
                        "resources": [
                            {"title": "Bizagi — Free BPMN Modelling tool + tutorials", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Data Analysis & SQL",
                "description": "BAs who can self-serve data are significantly more effective than those who rely on developers.",
                "base_weeks": 4,
                "skills_covered": ["SQL", "Excel / Spreadsheets", "Data Analysis", "Power BI"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "SQL for business analysts",
                        "description": "Write queries to pull, aggregate, and analyse data directly. This is increasingly expected of BAs in tech-adjacent organisations.",
                        "resources": [
                            {"title": "Mode Analytics SQL Tutorial (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Excel advanced: pivot tables and data models",
                        "description": "Advanced pivot tables, Power Pivot, and data validation for business reporting.",
                        "resources": [
                            {"title": "Excel at Business Analysis — Chandoo.org (free blog)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Power BI for business reporting",
                        "description": "Build dashboards that non-technical stakeholders can use. Data visualisation is a key deliverable for BAs.",
                        "resources": [
                            {"title": "Microsoft Learn — Power BI Fundamentals (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Agile, Systems & Strategy",
                "description": "BAs in modern environments must work in Agile teams and think systemically.",
                "base_weeks": 4,
                "skills_covered": ["Agile / Scrum", "Use Cases", "Business Strategy"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "BA in Agile teams",
                        "description": "Writing user stories, acceptance criteria, and working with Scrum teams as a BA or Product Owner proxy.",
                        "resources": [
                            {"title": "Agile Analysis and Design — Mike Griffiths (PMI)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Use case and UML basics",
                        "description": "Use case diagrams, activity diagrams, and sequence diagrams. Light UML is still used in requirements documentation.",
                        "resources": [
                            {"title": "Lucidchart — UML Diagram Tutorial (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Business case writing",
                        "description": "Structure a business case with cost-benefit analysis, risk assessment, and recommended option. BAs often write these for senior stakeholders.",
                        "resources": [
                            {"title": "HBR — How to write a business case (free article)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Certifications & Portfolio",
                "description": "Get certified and build documented evidence of BA deliverables.",
                "base_weeks": 3,
                "skills_covered": ["CBAP", "Portfolio", "Interview Prep"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "CBAP or CCBA certification study",
                        "description": "IIBA certifications (CCBA for entry, CBAP for experienced) are the most recognised BA credentials globally.",
                        "resources": [
                            {"title": "IIBA — Certification overview (iiba.org)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build a BA deliverables portfolio",
                        "description": "Create sample requirements documents, process maps, use cases, and a mini business case. Real or fictional case — the quality of the artefacts is what matters.",
                        "resources": [
                            {"title": "Lucidchart — Free diagramming tool", "type": "project"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "healthcare-professional": {
        "career_title": "Healthcare Professional",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Health & Science Foundations",
                "description": "Build the scientific literacy and domain knowledge needed for any healthcare pathway.",
                "base_weeks": 5,
                "skills_covered": ["Biology", "Research", "Statistics", "Healthcare Systems"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Biology, anatomy, and physiology essentials",
                        "description": "Cell biology, organ systems, and how the body works. The minimum scientific foundation for any clinical or health-adjacent role.",
                        "resources": [
                            {"title": "Khan Academy — Health and Medicine (free)", "type": "course"},
                            {"title": "OpenStax — Anatomy and Physiology (free textbook)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "How health systems work",
                        "description": "Understand public vs private, NHS/US models, clinical vs non-clinical roles, and career pathways.",
                        "resources": [
                            {"title": "Coursera — Healthcare Delivery in the US (UMich)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Research & Data Skills",
                "description": "Evidence-based practice depends on the ability to find, read, and apply research.",
                "base_weeks": 4,
                "skills_covered": ["Research Methods", "Statistics", "Technical Writing"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Research methods and evidence-based practice",
                        "description": "Study designs (RCT, cohort, case-control), levels of evidence, and how to critically appraise a paper.",
                        "resources": [
                            {"title": "Cochrane Learning — Research Methods (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Biostatistics basics",
                        "description": "Hypothesis testing, p-values, confidence intervals, and survival analysis. These appear in nearly all clinical research.",
                        "resources": [
                            {"title": "StatQuest — Biostatistics series (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Excel / SPSS for health data",
                        "description": "Manage patient/study data, run descriptive statistics, and create clear tables and charts for reports.",
                        "resources": [
                            {"title": "IBM SPSS — Free student version", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Clinical Practice & Communication",
                "description": "Develop the people skills and ethical frameworks required in patient-facing and team-based care.",
                "base_weeks": 4,
                "skills_covered": ["Communication", "Ethics", "Patient Safety"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Healthcare communication and patient interaction",
                        "description": "Active listening, health literacy, motivational interviewing, and breaking bad news frameworks (SPIKES).",
                        "resources": [
                            {"title": "edX — Communication in Healthcare (free audit)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Medical ethics and law",
                        "description": "Principles of bioethics (autonomy, beneficence, non-maleficence, justice), consent, confidentiality, and professional codes.",
                        "resources": [
                            {"title": "Coursera — Bioethics (Penn, free to audit)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Specialisation & Career Launch",
                "description": "Choose your sub-specialty pathway and prepare for applications or further qualifications.",
                "base_weeks": 4,
                "skills_covered": ["Specialisation", "Portfolio", "Applications"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Volunteer in a clinical or health-adjacent setting",
                        "description": "Hospital volunteering, health charity work, shadowing professionals. Hands-on experience is often required for programme applications.",
                        "resources": [
                            {"title": "NHS Volunteering — NHS Jobs portal", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build a targeted application portfolio",
                        "description": "Personal statement, reference letters, evidence of relevant experience. Applications to healthcare roles and training programmes are highly competitive.",
                        "resources": [
                            {"title": "Medic Portal — Application guides (free)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "video-producer": {
        "career_title": "Video Producer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Filmmaking Fundamentals",
                "description": "Understand storytelling, shot composition, and the language of video before picking up a camera.",
                "base_weeks": 3,
                "skills_covered": ["Cinematography", "Storytelling", "Shot Composition"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Visual storytelling and shot language",
                        "description": "Shot types, camera movement, the 180-degree rule, and basic storyboarding. Great videos tell stories through pictures.",
                        "resources": [
                            {"title": "FILM RIOT — YouTube channel (free)", "type": "video"},
                            {"title": "Coursera — Introduction to Video Production (free audit)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Lighting fundamentals",
                        "description": "3-point lighting, natural light, colour temperature, and how lighting changes the emotional tone of a shot.",
                        "resources": [
                            {"title": "Indy Mogul — Lighting Tutorials (YouTube, free)", "type": "video"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Editing & Post-Production",
                "description": "Post-production is where the video actually comes together — most video producers spend the majority of their time here.",
                "base_weeks": 5,
                "skills_covered": ["Premiere Pro", "After Effects", "Colour Grading", "Audio"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Adobe Premiere Pro",
                        "description": "Multi-track editing, J/L cuts, colour correction, audio mixing, and export settings for every platform.",
                        "resources": [
                            {"title": "Adobe Learn — Premiere Pro tutorials (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Colour grading",
                        "description": "Use Lumetri Color in Premiere or DaVinci Resolve's free version for professional-quality colour work.",
                        "resources": [
                            {"title": "DaVinci Resolve — Official Training (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Motion graphics with After Effects",
                        "description": "Lower thirds, title cards, logo reveals, and basic kinetic typography. Motion graphics separate amateur from professional content.",
                        "resources": [
                            {"title": "Motion Array — AE tutorials (YouTube, free)", "type": "video"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Production Workflow & Content Strategy",
                "description": "Learn to produce content at scale — from pre-production planning to platform-specific distribution.",
                "base_weeks": 3,
                "skills_covered": ["Production Planning", "Social Media", "YouTube"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Pre-production: scripting and shot lists",
                        "description": "Write scripts, storyboard, create shot lists, and plan shoots efficiently. Good pre-production cuts post-production time in half.",
                        "resources": [
                            {"title": "StudioBinder — Free production templates", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Platform-specific content: YouTube, Reels, TikTok",
                        "description": "Each platform has different aspect ratios, length norms, and audience behaviour. Optimise content for where it lives.",
                        "resources": [
                            {"title": "Think Media — YouTube Strategy (YouTube, free)", "type": "video"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Career Launch",
                "description": "Build a video portfolio and land your first client or production role.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Freelancing", "Show Reel"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build a show reel",
                        "description": "60-90 seconds of your best work, well-edited with good music. This is what clients and employers watch first.",
                        "resources": [
                            {"title": "Vimeo — Free portfolio hosting", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "First client project",
                        "description": "Offer to produce a video for a local business, event, or charity for a reduced rate. Testimonials and real footage are more valuable than practice projects.",
                        "resources": [
                            {"title": "Upwork or local Facebook groups — Find first clients", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "mobile-developer": {
        "career_title": "Mobile Developer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Programming & Mobile Foundations",
                "description": "Learn the core programming concepts and how mobile operating systems differ from the web.",
                "base_weeks": 5,
                "skills_covered": ["JavaScript", "TypeScript", "Git", "Mobile Basics"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "JavaScript & TypeScript essentials",
                        "description": "React Native uses JavaScript/TypeScript. Get solid on modern JS before picking up the framework.",
                        "resources": [
                            {"title": "javascript.info — Modern JavaScript Tutorial", "type": "course"},
                            {"title": "Total TypeScript — Beginner's TypeScript (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "How mobile platforms work",
                        "description": "iOS vs Android architectures, app lifecycles, permissions, and the App Store / Google Play publishing process.",
                        "resources": [
                            {"title": "Apple Developer — App Design Fundamentals (free)", "type": "course"},
                            {"title": "Android Developers — Android Basics (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Git and version control",
                        "description": "Branching, merging, and pull request workflows. Mobile teams use Git the same way web teams do.",
                        "resources": [
                            {"title": "Learn Git Branching (interactive)", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "React Native or Flutter",
                "description": "Pick one cross-platform framework and go deep — both target iOS and Android from a single codebase.",
                "base_weeks": 7,
                "skills_covered": ["React Native", "Flutter", "Navigation", "State Management"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "React Native fundamentals",
                        "description": "Components, StyleSheet, navigation with React Navigation, and the Expo workflow for rapid development.",
                        "resources": [
                            {"title": "React Native docs — Getting Started", "type": "course"},
                            {"title": "Expo — Tutorial (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "builder_plus",
                        "title": "Flutter & Dart as an alternative",
                        "description": "Flutter's widget model and Dart language. If you're coming from a strong OOP background, Flutter may suit you better.",
                        "resources": [
                            {"title": "Flutter — Official Get Started (free)", "type": "course"},
                            {"title": "Flutter & Dart — The Complete Guide (Udemy)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "State management: Redux or Zustand",
                        "description": "Managing global state is essential beyond tutorial-sized apps. Learn one pattern deeply.",
                        "resources": [
                            {"title": "Zustand — Official Docs (simple, recommended start)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s4", "level": "builder_plus",
                        "title": "Native modules and device APIs",
                        "description": "Camera, location, push notifications, biometrics. These integrate platform APIs into your JS/Dart code.",
                        "resources": [
                            {"title": "Expo SDK — Native APIs (free docs)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Backend Integration & Performance",
                "description": "Connect your app to APIs, handle auth, and make it fast and reliable.",
                "base_weeks": 5,
                "skills_covered": ["REST APIs", "Firebase", "Auth", "Performance"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "REST API integration and async data fetching",
                        "description": "Fetch, Axios, react-query/TanStack Query for caching and loading states. Every real app calls an API.",
                        "resources": [
                            {"title": "TanStack Query — Official Docs", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Firebase Auth and Firestore",
                        "description": "Firebase gives you auth, a real-time database, and cloud functions with minimal backend code — perfect for mobile-first apps.",
                        "resources": [
                            {"title": "Firebase for Web/Mobile — Official Docs (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Performance optimisation and debugging",
                        "description": "Reduce re-renders, optimise lists with FlatList, profile with Flipper, and understand JS thread vs native thread.",
                        "resources": [
                            {"title": "React Native — Performance Guide (official docs)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & App Store Launch",
                "description": "Ship a real app, publish it, and prepare for mobile developer interviews.",
                "base_weeks": 5,
                "skills_covered": ["App Store", "Portfolio", "Interview Prep"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build and publish a complete app",
                        "description": "Ship something real to the App Store or Play Store. The publishing process itself (certificates, provisioning, review) is a valuable experience.",
                        "resources": [
                            {"title": "Expo EAS Build — Free tier available", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Mobile-specific interview preparation",
                        "description": "Common questions: lifecycle methods, performance, state management patterns, native modules, and offline handling.",
                        "resources": [
                            {"title": "React Native Interview Questions — GitHub repos", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "ml-engineer": {
        "career_title": "Machine Learning Engineer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "ML & Software Engineering Foundations",
                "description": "MLE roles require both strong ML fundamentals and production-quality software engineering skills.",
                "base_weeks": 6,
                "skills_covered": ["Python", "Statistics", "Scikit-learn", "SQL"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Python + the data science stack",
                        "description": "NumPy, pandas, matplotlib. These are prerequisites for everything else.",
                        "resources": [
                            {"title": "Kaggle — Python & Pandas (free micro-courses)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Classical ML with scikit-learn",
                        "description": "Supervised and unsupervised algorithms, pipelines, cross-validation, and model evaluation. Internalize the sklearn API — it mirrors production ML patterns.",
                        "resources": [
                            {"title": "Hands-On Machine Learning by Géron — Chapters 1-9", "type": "book"},
                            {"title": "Kaggle — Intro + Intermediate ML (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Software engineering practices for ML",
                        "description": "Clean code, unit testing, type annotations, virtual environments, and packaging Python projects. ML code that can't be maintained is worthless.",
                        "resources": [
                            {"title": "Full Stack Deep Learning — Software Engineering for ML (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Deep Learning & Model Development",
                "description": "Build and train neural networks using PyTorch, with a focus on practical production use cases.",
                "base_weeks": 7,
                "skills_covered": ["PyTorch", "TensorFlow", "Deep Learning", "NLP", "Computer Vision"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Deep learning with PyTorch",
                        "description": "Autograd, layers, optimizers, training loops, and GPU usage. PyTorch is the research and production standard.",
                        "resources": [
                            {"title": "fast.ai — Practical Deep Learning for Coders (free)", "type": "course"},
                            {"title": "Andrej Karpathy — Neural Networks Zero to Hero (YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Transformers and HuggingFace",
                        "description": "Fine-tune pre-trained models for NLP tasks. Transformers are now the default architecture for text and increasingly for vision.",
                        "resources": [
                            {"title": "HuggingFace — NLP Course (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Experiment tracking with MLflow or W&B",
                        "description": "Track hyperparameters, metrics, and artefacts across runs. Essential for systematic experimentation.",
                        "resources": [
                            {"title": "Weights & Biases — Intro to MLOps (free course)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "MLOps & Production Deployment",
                "description": "The skill that separates ML Engineers from Data Scientists — getting models into production reliably.",
                "base_weeks": 7,
                "skills_covered": ["Docker", "FastAPI", "AWS", "CI/CD", "Model Serving"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Serve models with FastAPI",
                        "description": "Build REST APIs that load and serve ML models. Understand latency, batching, and input validation.",
                        "resources": [
                            {"title": "FastAPI — Official Tutorial (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Containerise and deploy with Docker + AWS",
                        "description": "Package your model API in Docker, push to ECR, and deploy on ECS or Lambda. This is the standard production pathway.",
                        "resources": [
                            {"title": "Full Stack Deep Learning — Deployment module (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Data pipelines with Airflow",
                        "description": "Schedule and orchestrate data preprocessing, retraining triggers, and model evaluation pipelines.",
                        "resources": [
                            {"title": "Apache Airflow — Official Tutorial (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s4", "level": "advanced_only",
                        "title": "Model monitoring and drift detection",
                        "description": "Monitor prediction distributions, detect data drift, and set up automated retraining triggers in production.",
                        "resources": [
                            {"title": "Evidently AI — Open source monitoring (free)", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Interview Preparation",
                "description": "Build an end-to-end ML project and prepare for the technical MLE interview process.",
                "base_weeks": 5,
                "skills_covered": ["Portfolio", "ML System Design", "Coding Interviews"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build an end-to-end ML project",
                        "description": "Data → model → API → monitoring, deployed publicly. Document everything. This is your primary portfolio piece.",
                        "resources": [
                            {"title": "Streamlit + HuggingFace Spaces — free hosting", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "ML system design interview prep",
                        "description": "Design a recommendation system, fraud detection model, or search ranking system. MLE interviews include ML design alongside coding.",
                        "resources": [
                            {"title": "Machine Learning System Design Interview by Chip Huyen (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "LeetCode for MLE coding rounds",
                        "description": "MLE coding rounds overlap with SWE. Focus on arrays, hashmaps, and graph algorithms (top 75 Neetcode problems).",
                        "resources": [
                            {"title": "Neetcode.io — Roadmap (free)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "social-media-manager": {
        "career_title": "Social Media Manager",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Platform Fundamentals",
                "description": "Understand how each major platform works, what content performs, and how algorithms distribute reach.",
                "base_weeks": 3,
                "skills_covered": ["Platform Strategy", "Content Formats", "Audience Research"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Social media landscape overview",
                        "description": "Instagram, TikTok, LinkedIn, X/Twitter, YouTube Shorts — each has a different audience, format, and algorithm.",
                        "resources": [
                            {"title": "HubSpot — Social Media Marketing Certification (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Content strategy and pillars",
                        "description": "Define content pillars, posting cadence, tone of voice, and content mix (educational / entertaining / promotional).",
                        "resources": [
                            {"title": "Buffer Blog — Social Media Strategy Guide (free)", "type": "course"},
                            {"title": "Hootsuite Academy — Social Marketing Certification (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Algorithm and distribution mechanics",
                        "description": "How Instagram Reels, TikTok FYP, and LinkedIn feed algorithms work. Optimise for reach, saves, and shares — not just likes.",
                        "resources": [
                            {"title": "Later Blog — Instagram Algorithm (free, updated regularly)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Content Creation & Tools",
                "description": "Build the hands-on skills to create high-quality visual and video content at a consistent pace.",
                "base_weeks": 4,
                "skills_covered": ["Canva", "Video Editing", "Copywriting", "Photography"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Graphic design for social with Canva",
                        "description": "Create on-brand templates, carousels, and story assets. Canva's free plan is enough to produce professional-looking content.",
                        "resources": [
                            {"title": "Canva Design School (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Short-form video editing",
                        "description": "Edit Reels and TikToks with CapCut or Premiere Rush. Hooks in the first 2 seconds, captions, and good audio are non-negotiable.",
                        "resources": [
                            {"title": "CapCut — Built-in tutorials (free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "Social media copywriting",
                        "description": "Write hooks, captions, and CTAs for each platform's native voice. What works on LinkedIn falls flat on TikTok.",
                        "resources": [
                            {"title": "Copyblogger — Content Marketing (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Analytics & Community Management",
                "description": "Use data to improve content, grow followers, and manage the community you build.",
                "base_weeks": 3,
                "skills_covered": ["Analytics", "Community Management", "Scheduling Tools"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Social media analytics",
                        "description": "Impressions vs reach vs engagement rate. Which metrics actually matter and how to use platform native analytics.",
                        "resources": [
                            {"title": "Sprout Social — Social Media Metrics Guide (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Scheduling and management tools",
                        "description": "Buffer, Hootsuite, or Later for scheduling content in batches. Reclaim your time by not posting in real-time.",
                        "resources": [
                            {"title": "Buffer — Free plan + learning resources", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Influencer and partnership outreach",
                        "description": "Finding relevant micro-influencers, writing outreach templates, and managing collaborations.",
                        "resources": [
                            {"title": "Later — Influencer Marketing Guide (free)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Career Launch",
                "description": "Build a portfolio account or case study and land your first brand or agency role.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Case Studies", "Freelancing"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Grow a personal or project account",
                        "description": "Run a real account for 2-3 months. Document follower growth, engagement rate, and content experiments. This is your portfolio.",
                        "resources": [
                            {"title": "Create an Instagram or TikTok account and post consistently", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build a brand case study",
                        "description": "Manage social for a friend's business, local charity, or your own brand. Document the strategy, content, and results.",
                        "resources": [
                            {"title": "Notion — Free case study template", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "accountant": {
        "career_title": "Accountant",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Accounting Foundations",
                "description": "Build a rigorous understanding of double-entry bookkeeping and the three core financial statements.",
                "base_weeks": 5,
                "skills_covered": ["Bookkeeping", "Accounting", "Financial Statements", "Excel"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Double-entry bookkeeping",
                        "description": "Debits, credits, journals, ledgers, and the trial balance. This is the mechanical foundation of all accounting.",
                        "resources": [
                            {"title": "AccountingCoach — Bookkeeping (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Financial statements in depth",
                        "description": "How the P&L, balance sheet, and cash flow statement link together, and what they reveal about a business.",
                        "resources": [
                            {"title": "Coursera — Financial Accounting (UPenn, free to audit)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Excel for accountants",
                        "description": "PivotTables, SUMIFS, IF, INDEX/MATCH, and data tables. Excel is the universal tool — master it before any accounting software.",
                        "resources": [
                            {"title": "CFI — Excel Fundamentals (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Tax, Compliance & Accounting Software",
                "description": "Learn tax principles, compliance obligations, and the accounting software used by most businesses.",
                "base_weeks": 5,
                "skills_covered": ["Tax", "QuickBooks", "Xero", "Compliance"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Introduction to taxation",
                        "description": "Income tax, VAT/sales tax, corporation tax, and payroll taxes. Compliance is a core deliverable of the accounting function.",
                        "resources": [
                            {"title": "HMRC / IRS — Free guidance for new businesses", "type": "book"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "QuickBooks or Xero",
                        "description": "Set up a company, record transactions, reconcile bank accounts, and run standard financial reports.",
                        "resources": [
                            {"title": "QuickBooks Training — Free online courses", "type": "course"},
                            {"title": "Xero — Free certified advisor courses", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Management accounting",
                        "description": "Budgeting, variance analysis, cost accounting, and break-even analysis. Management accounts drive internal decisions.",
                        "resources": [
                            {"title": "CIMA — Introduction to Management Accounting (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Advanced Topics & Audit",
                "description": "Deepen into auditing, financial reporting standards, and analytical skills valued at mid-level roles.",
                "base_weeks": 5,
                "skills_covered": ["IFRS / GAAP", "Auditing", "Financial Modelling"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "IFRS / UK GAAP fundamentals",
                        "description": "Revenue recognition, leases, financial instruments. Most large companies report under IFRS or GAAP.",
                        "resources": [
                            {"title": "ICAEW — Financial Reporting resources (free articles)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "builder_plus",
                        "title": "Audit principles and internal controls",
                        "description": "External vs internal audit, audit assertions, substantive testing, and internal control frameworks (COSO).",
                        "resources": [
                            {"title": "IIA — Introduction to Internal Audit (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Professional Qualification & Career Launch",
                "description": "Choose and begin your professional accounting qualification pathway.",
                "base_weeks": 4,
                "skills_covered": ["ACA", "ACCA", "CIMA", "CPA"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Choose your qualification: ACA, ACCA, CIMA, or CPA",
                        "description": "ACA for practice/big 4 (UK), ACCA for global flexibility, CIMA for industry/management, CPA for US market. Each opens different doors.",
                        "resources": [
                            {"title": "ACCA — Career Navigator tool (free)", "type": "practice"},
                            {"title": "ICAEW — ACA overview (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Graduate scheme and practice job applications",
                        "description": "Big 4 (Deloitte, PwC, EY, KPMG) and mid-tier firm graduate schemes are the primary route into professional accounting.",
                        "resources": [
                            {"title": "AccountingWEB — Job board and career guides", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "sales-executive": {
        "career_title": "Sales Executive",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Sales Foundations",
                "description": "Understand the psychology of buying decisions, the sales process, and how to build genuine rapport.",
                "base_weeks": 3,
                "skills_covered": ["Sales Process", "Communication", "Buyer Psychology"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Sales fundamentals and buyer psychology",
                        "description": "The SPIN, Challenger, and BANT frameworks. Understanding what motivates buying decisions is more valuable than any script.",
                        "resources": [
                            {"title": "HubSpot Academy — Inbound Sales Certification (free)", "type": "course"},
                            {"title": "SPIN Selling by Neil Rackham (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Prospecting and lead qualification",
                        "description": "ICP (ideal customer profile), BANT qualification, cold outreach frameworks, and building a healthy pipeline.",
                        "resources": [
                            {"title": "Predictable Revenue by Aaron Ross (book)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Outreach, Pitching & CRM",
                "description": "Master multi-channel outreach, craft compelling pitches, and manage your pipeline in a CRM.",
                "base_weeks": 4,
                "skills_covered": ["Cold Outreach", "CRM", "Pitching", "Negotiation"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Cold email and LinkedIn outreach",
                        "description": "Write personalised, value-first cold messages. High-volume spray-and-pray kills your domain. Quality beats quantity.",
                        "resources": [
                            {"title": "Lemlist — Cold email masterclass (free resources)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "CRM: HubSpot or Salesforce",
                        "description": "Log activities, manage deal stages, track follow-ups, and forecast pipeline. Undisciplined CRM usage costs deals.",
                        "resources": [
                            {"title": "HubSpot CRM — Free + certification", "type": "course"},
                            {"title": "Salesforce Trailhead — Free learning (trailhead.salesforce.com)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Discovery calls and demo delivery",
                        "description": "Run consultative discovery calls, ask the right questions, and deliver demos tailored to the prospect's specific pain.",
                        "resources": [
                            {"title": "The Qualified Sales Leader by John McMahon (book)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Closing & Negotiation",
                "description": "Handle objections confidently, structure deals, and close without discounting unnecessarily.",
                "base_weeks": 3,
                "skills_covered": ["Objection Handling", "Negotiation", "Deal Closing"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Objection handling",
                        "description": "Common objections (price, timing, competition) and how to reframe them. Objections are buying signals — don't panic.",
                        "resources": [
                            {"title": "Never Split the Difference by Chris Voss (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Negotiation and deal structure",
                        "description": "Multi-variable negotiation (not just price), procurement tactics, and protecting your margin.",
                        "resources": [
                            {"title": "Coursera — Successful Negotiation (UMich, free audit)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Career Launch",
                "description": "Land your first SDR or AE role — the entry point to a high-earning sales career.",
                "base_weeks": 2,
                "skills_covered": ["Interview Prep", "Role Research", "Career Progression"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "SDR vs AE role research",
                        "description": "Start as an SDR (outbound focus, quota for meetings) or AE (closing). Understand the comp structure: base + commission + OTE.",
                        "resources": [
                            {"title": "RevGenius — Community for sales professionals (free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Sales interview prep",
                        "description": "Role play objection handling, walk through your sales process, and prepare a 30/60/90 day plan.",
                        "resources": [
                            {"title": "Glassdoor — Company-specific interview questions (free)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "data-engineer": {
        "career_title": "Data Engineer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "SQL, Python & Data Fundamentals",
                "description": "Data engineers write a lot of SQL and Python — get these deeply solid before anything else.",
                "base_weeks": 5,
                "skills_covered": ["SQL", "Python", "Data Modelling", "Git"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Advanced SQL",
                        "description": "Window functions, CTEs, recursive queries, query optimisation, and execution plans. Data engineers write complex SQL every day.",
                        "resources": [
                            {"title": "Mode Analytics SQL Tutorial (free)", "type": "course"},
                            {"title": "DataLemur — Advanced SQL (free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Python for data engineering",
                        "description": "pandas, pyarrow, file I/O (CSV, JSON, Parquet), API calls, and writing reusable Python packages.",
                        "resources": [
                            {"title": "Kaggle — Python + Pandas micro-courses (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "Data modelling: star schema and normalisation",
                        "description": "Understand dimensional modelling (facts and dimensions), normalisation, and when to denormalise for analytics performance.",
                        "resources": [
                            {"title": "dbt Learn — Data Modelling (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Pipelines & Orchestration",
                "description": "Build robust ETL/ELT pipelines that move and transform data reliably at scale.",
                "base_weeks": 6,
                "skills_covered": ["Airflow", "dbt", "ETL/ELT", "Data Warehouses"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "dbt for data transformation",
                        "description": "Write modular SQL transformations, test data quality, and document your data models. dbt is now the standard for the T in ELT.",
                        "resources": [
                            {"title": "dbt Learn — dbt Fundamentals (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Apache Airflow for orchestration",
                        "description": "Write DAGs to schedule and monitor pipelines. Understand sensors, operators, and XComs.",
                        "resources": [
                            {"title": "Astronomer — Airflow Fundamentals (free certification)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Cloud data warehouses: BigQuery or Snowflake",
                        "description": "Load data, run queries at scale, understand partitioning, clustering, and cost optimisation.",
                        "resources": [
                            {"title": "Google Cloud — BigQuery free tier + codelabs", "type": "practice"},
                            {"title": "Snowflake — Free trial + getting started guide", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Cloud, Containers & Streaming",
                "description": "Deploy pipelines to the cloud and handle real-time data where required.",
                "base_weeks": 6,
                "skills_covered": ["AWS", "Docker", "Kafka", "Spark"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "AWS for data engineers",
                        "description": "S3, Glue, Lambda, RDS, Redshift, and IAM. Most production data pipelines run on AWS or GCP.",
                        "resources": [
                            {"title": "AWS Free Tier — Hands-on labs", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Docker for reproducible pipelines",
                        "description": "Package your data pipelines as Docker images for consistent local and cloud execution.",
                        "resources": [
                            {"title": "Docker Official Getting Started", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "Apache Kafka for streaming data",
                        "description": "Producers, consumers, topics, and consumer groups. Streaming pipelines process events in real time rather than batches.",
                        "resources": [
                            {"title": "Confluent — Kafka Fundamentals (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Job Preparation",
                "description": "Build a public data engineering portfolio project and prepare for technical interviews.",
                "base_weeks": 4,
                "skills_covered": ["Portfolio", "Interview Prep", "System Design"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Build an end-to-end data pipeline project",
                        "description": "Ingest a public API → transform with dbt → load to BigQuery → visualise in Looker Studio. Document on GitHub.",
                        "resources": [
                            {"title": "Data Engineering Zoomcamp (free, cohort-based)", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Data engineering interview prep",
                        "description": "SQL hard questions, Python coding, pipeline design questions (idempotency, late data, backfilling), and system design.",
                        "resources": [
                            {"title": "DataLemur — SQL + Data Engineering interview questions (free)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "game-developer": {
        "career_title": "Game Developer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Programming Foundations",
                "description": "Game development is software engineering — solid programming fundamentals are non-negotiable.",
                "base_weeks": 5,
                "skills_covered": ["C#", "C++", "Object-Oriented Programming", "Git"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "C# programming for beginners",
                        "description": "Variables, control flow, OOP (classes, inheritance, interfaces). C# is Unity's primary language and transfers well to C++.",
                        "resources": [
                            {"title": "Microsoft Learn — C# Fundamentals (free)", "type": "course"},
                            {"title": "Unity Learn — C# Scripting (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Git for game projects",
                        "description": "Large binary files (assets) need Git LFS. Set up proper .gitignore and understand branching workflows for team projects.",
                        "resources": [
                            {"title": "Git LFS — Official Setup Guide (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "builder_plus",
                        "title": "Data structures and algorithms for games",
                        "description": "Spatial partitioning, pathfinding (A*), collision detection algorithms. Game performance depends on choosing the right data structure.",
                        "resources": [
                            {"title": "Game Programming Patterns by Robert Nystrom (free online)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Unity Game Engine",
                "description": "Unity is the industry standard for indie, mobile, and mid-size studio games.",
                "base_weeks": 7,
                "skills_covered": ["Unity", "GameObjects", "Physics", "Animation"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Unity fundamentals",
                        "description": "GameObjects, components, scenes, prefabs, and the Unity Editor workflow. Build your first 2D platformer.",
                        "resources": [
                            {"title": "Unity Learn — Junior Programmer Pathway (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Physics, collision, and player movement",
                        "description": "Rigidbody, colliders, raycasting, and building character controllers. Physics is at the heart of game feel.",
                        "resources": [
                            {"title": "Brackeys — Unity Physics (YouTube, free)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "all",
                        "title": "Game UI and menus",
                        "description": "Unity UI system, canvas, health bars, inventory panels, and main menus. UI polish separates hobbyist from commercial games.",
                        "resources": [
                            {"title": "Unity Learn — UI Design and Implementation (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s4", "level": "builder_plus",
                        "title": "AI and pathfinding with NavMesh",
                        "description": "Unity's NavMesh system for NPC navigation. Implementing enemy behaviour with finite state machines.",
                        "resources": [
                            {"title": "Brackeys — Enemy AI (YouTube, free)", "type": "video"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "3D Art Basics & Audio",
                "description": "Game developers who understand the art pipeline collaborate better and produce better-integrated games.",
                "base_weeks": 4,
                "skills_covered": ["Blender", "Texturing", "Audio", "Shaders"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Blender basics for game assets",
                        "description": "Model a simple prop, UV unwrap it, bake textures, and import it into Unity. You don't need to be an artist — just understand the pipeline.",
                        "resources": [
                            {"title": "Blender Guru — Beginner Donut Tutorial (YouTube, free)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Game audio with FMOD or Unity Audio",
                        "description": "Sound design, music looping, and spatial audio. Good audio adds more perceived polish than better graphics.",
                        "resources": [
                            {"title": "FMOD — Game Audio Tutorial (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Ship a Game & Build Portfolio",
                "description": "Shipping a complete game — even a small one — is the most valuable thing you can do for your career.",
                "base_weeks": 5,
                "skills_covered": ["Game Jam", "Portfolio", "Publishing"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Participate in a Game Jam",
                        "description": "Ludum Dare, Global Game Jam, itch.io game jams. Build something complete in 48-72 hours. Constraints force creativity and completion.",
                        "resources": [
                            {"title": "itch.io — Game Jams calendar (free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Publish on itch.io",
                        "description": "Upload your completed games to itch.io with a proper cover image, screenshots, and description. Your public portfolio.",
                        "resources": [
                            {"title": "itch.io — Free publishing platform", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "builder_plus",
                        "title": "Apply to studios or go indie",
                        "description": "Build one polished, complete game as a portfolio centrepiece. Studio jobs require a playable demo; indie requires a Steam page.",
                        "resources": [
                            {"title": "GameDevJobs.io — Job board for game developers", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "cloud-architect": {
        "career_title": "Cloud Architect",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Cloud & Networking Foundations",
                "description": "Cloud architecture sits on top of solid networking and OS knowledge — you can't design what you don't understand.",
                "base_weeks": 5,
                "skills_covered": ["Networking", "Linux", "AWS Core", "Security Basics"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Networking fundamentals",
                        "description": "TCP/IP, DNS, load balancers, VPNs, subnetting, and routing. Cloud VPCs mirror physical networks.",
                        "resources": [
                            {"title": "Professor Messer — CompTIA Network+ (free YouTube)", "type": "video"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "AWS core services",
                        "description": "IAM, VPC, EC2, S3, RDS, Lambda, Route53, CloudFront, and ELB. These are the building blocks of every AWS architecture.",
                        "resources": [
                            {"title": "AWS Free Tier — Hands-on labs", "type": "practice"},
                            {"title": "Adrian Cantrill — AWS Solutions Architect Associate (Udemy)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s3", "level": "all",
                        "title": "AWS Solutions Architect Associate certification",
                        "description": "The baseline certification for cloud architects. Validates multi-service architecture knowledge and the Well-Architected Framework.",
                        "resources": [
                            {"title": "Tutorials Dojo — AWS SAA Practice Exams (Udemy)", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Infrastructure as Code & Containers",
                "description": "All serious cloud infrastructure is managed as code. Master IaC and container orchestration.",
                "base_weeks": 6,
                "skills_covered": ["Terraform", "Kubernetes", "Docker", "CI/CD"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Terraform for infrastructure as code",
                        "description": "Write, plan, and apply Terraform to provision and manage AWS infrastructure repeatably and version-controlled.",
                        "resources": [
                            {"title": "HashiCorp — Terraform Getting Started (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Kubernetes at scale",
                        "description": "Multi-node clusters, Helm, RBAC, namespaces, autoscaling, and managed services (EKS, GKE). K8s is the container orchestration standard.",
                        "resources": [
                            {"title": "Certified Kubernetes Administrator (CKA) — killer.sh practice (free trial)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Multi-cloud and hybrid architecture",
                        "description": "Design patterns for using AWS + Azure or GCP together. Cross-cloud networking, identity federation, and data sovereignty considerations.",
                        "resources": [
                            {"title": "Cloud Architecture Patterns by Bill Wilder (book)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Security, Cost & Reliability",
                "description": "The three dimensions that separate a good cloud architecture from a great one.",
                "base_weeks": 5,
                "skills_covered": ["IAM", "Security", "Cost Optimisation", "Well-Architected"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "AWS Security: IAM, KMS, and WAF",
                        "description": "Least-privilege IAM, encryption at rest/in transit, WAF rules, GuardDuty, and CloudTrail. Security is architecture, not an afterthought.",
                        "resources": [
                            {"title": "AWS Security Specialty — Study Guide", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "all",
                        "title": "Cost optimisation",
                        "description": "Reserved Instances vs Savings Plans, right-sizing, spot instances, storage tiers, and Cost Explorer. Cloud bills surprise unprepared architects.",
                        "resources": [
                            {"title": "AWS — Cost Optimisation Hub (free tool)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p3-s3", "level": "builder_plus",
                        "title": "AWS Well-Architected Framework",
                        "description": "The five pillars: operational excellence, security, reliability, performance efficiency, and cost optimisation. This is the framework clients expect you to apply.",
                        "resources": [
                            {"title": "AWS Well-Architected Framework Whitepaper (free)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Advanced Certifications & Portfolio",
                "description": "Cloud Architect roles require multiple certifications and a portfolio of real architecture designs.",
                "base_weeks": 5,
                "skills_covered": ["AWS Professional", "Solutions Architecture", "Portfolio"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "AWS Solutions Architect Professional",
                        "description": "The senior-level AWS certification. Covers complex multi-account architectures, migration strategies, and advanced networking.",
                        "resources": [
                            {"title": "Adrian Cantrill — AWS SAP (Udemy)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build and document architecture designs",
                        "description": "Create architecture diagrams (AWS draw.io library) for real or fictional projects. Include cost estimates and trade-off explanations.",
                        "resources": [
                            {"title": "AWS Architecture Center — Reference architectures (free)", "type": "project"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "technical-writer": {
        "career_title": "Technical Writer",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Writing Craft & Technical Literacy",
                "description": "Technical writers must write clearly and understand the subject matter well enough to explain it accurately.",
                "base_weeks": 3,
                "skills_covered": ["Technical Writing", "Writing Style", "Research"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Technical writing fundamentals",
                        "description": "Plain language, active voice, scannable structure (headings, bullets, tables), and writing for specific audiences.",
                        "resources": [
                            {"title": "Google — Technical Writing Courses (free, 2 courses)", "type": "course"},
                            {"title": "Docs for Developers by Bhatti et al. (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Build technical literacy",
                        "description": "You don't need to code, but you need to understand APIs, CLIs, software architecture, and developer concepts. Learn enough to ask smart questions.",
                        "resources": [
                            {"title": "freeCodeCamp — Web Development basics (free, just the first module)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Documentation Tools & Formats",
                "description": "Learn the tools and formats that professional technical documentation teams actually use.",
                "base_weeks": 4,
                "skills_covered": ["Markdown", "Git", "Docusaurus", "Confluence"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Markdown and Git for docs",
                        "description": "Most modern docs are written in Markdown and stored in Git. Docs-as-code is the industry standard for developer documentation.",
                        "resources": [
                            {"title": "CommonMark — Markdown Spec and Tutorial (free)", "type": "course"},
                            {"title": "GitHub Docs — Contributing to docs via PR (free)", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Docusaurus for documentation sites",
                        "description": "Build a static documentation site with Docusaurus. Used by Meta, Stripe, and many open-source projects.",
                        "resources": [
                            {"title": "Docusaurus — Getting Started (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "API documentation with OpenAPI/Swagger",
                        "description": "Read and write OpenAPI spec files. API reference docs follow standard patterns — learn to work from source code and spec files.",
                        "resources": [
                            {"title": "Swagger — OpenAPI tutorial (free)", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Content Types & Specialisation",
                "description": "Master the specific content types that technical writers produce: tutorials, how-tos, references, and explainers.",
                "base_weeks": 3,
                "skills_covered": ["Tutorials", "API Docs", "UX Writing", "Diátaxis Framework"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "The Diátaxis documentation framework",
                        "description": "Tutorials, how-to guides, explanations, and reference docs serve different user needs. Diátaxis helps you structure content intentionally.",
                        "resources": [
                            {"title": "Diátaxis — Official site (free, diataxis.fr)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "builder_plus",
                        "title": "UX writing and in-product copy",
                        "description": "Error messages, onboarding flows, and tooltips are technical writing. UX writers who understand dev tooling are in high demand.",
                        "resources": [
                            {"title": "UX Writing Hub — Free fundamentals course", "type": "course"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Job Search",
                "description": "Build a public writing portfolio and target developer-focused companies hiring technical writers.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Open Source Contributions", "Job Applications"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Contribute to open-source documentation",
                        "description": "Fix confusing docs in a project you use. Open-source doc contributions are the best portfolio pieces because they're public and real.",
                        "resources": [
                            {"title": "Good Docs Project — Templates and guidelines (free)", "type": "project"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Build a technical blog",
                        "description": "Write tutorials or explainers on topics you've learned. Shows writing ability, technical curiosity, and audience empathy.",
                        "resources": [
                            {"title": "Hashnode or Dev.to — Free developer blogging platforms", "type": "practice"},
                        ],
                    },
                    {
                        "id": "p4-s3", "level": "all",
                        "title": "Technical writing job search",
                        "description": "Target companies with public developer docs (Stripe, Twilio, Vercel, Cloudflare). Developer advocacy roles are adjacent and often pay more.",
                        "resources": [
                            {"title": "Write the Docs — Job board (writethedocs.org)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },

    # ──────────────────────────────────────────────────────────────────────
    "teacher-educator": {
        "career_title": "Teacher / Educator",
        "phases": [
            {
                "id": "phase-1", "phase_number": 1,
                "title": "Education Foundations",
                "description": "Understand how people learn and the frameworks that shape effective teaching.",
                "base_weeks": 3,
                "skills_covered": ["Learning Theory", "Curriculum Design", "Communication"],
                "steps": [
                    {
                        "id": "p1-s1", "level": "starter_only",
                        "title": "How people learn",
                        "description": "Cognitive load theory, spacing, retrieval practice, and growth mindset. These evidence-based principles should underpin all teaching decisions.",
                        "resources": [
                            {"title": "Make It Stick by Brown, Roediger & McDaniel (book)", "type": "book"},
                            {"title": "Coursera — Learning How to Learn (free audit)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p1-s2", "level": "all",
                        "title": "Curriculum and lesson design",
                        "description": "Backward design: start with learning outcomes, then plan assessments, then build activities. Most teachers learn this backwards.",
                        "resources": [
                            {"title": "Understanding by Design by Wiggins & McTighe (book)", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-2", "phase_number": 2,
                "title": "Classroom & Facilitation Skills",
                "description": "The craft of delivering engaging, inclusive, and effective learning experiences.",
                "base_weeks": 4,
                "skills_covered": ["Facilitation", "Assessment", "Inclusion", "Behaviour Management"],
                "steps": [
                    {
                        "id": "p2-s1", "level": "all",
                        "title": "Facilitation and engagement techniques",
                        "description": "Cold calling, think-pair-share, exit tickets, live polling, and managing classroom energy. Active learning beats passive lecturing.",
                        "resources": [
                            {"title": "Teach Like a Champion 3.0 by Doug Lemov (book)", "type": "book"},
                        ],
                    },
                    {
                        "id": "p2-s2", "level": "all",
                        "title": "Assessment and feedback",
                        "description": "Formative vs summative, rubrics, written feedback that actually improves learning, and tracking progress over time.",
                        "resources": [
                            {"title": "Dylan Wiliam — Assessment for Learning resources (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p2-s3", "level": "builder_plus",
                        "title": "Inclusive and differentiated instruction",
                        "description": "Adjusting content, process, and product for diverse learners. Includes SEN basics, EAL, and gifted & talented considerations.",
                        "resources": [
                            {"title": "Universal Design for Learning (UDL) Guidelines — free at udlguidelines.cast.org", "type": "book"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-3", "phase_number": 3,
                "title": "Digital Tools & E-Learning",
                "description": "Modern educators use technology to extend learning beyond the classroom.",
                "base_weeks": 3,
                "skills_covered": ["Google Classroom", "Canva", "Video Creation", "LMS"],
                "steps": [
                    {
                        "id": "p3-s1", "level": "all",
                        "title": "Google Workspace for Education",
                        "description": "Classroom, Forms (quizzes), Slides, Meet, and Drive. The most widely adopted edtech stack globally.",
                        "resources": [
                            {"title": "Google for Education — Teacher Center (free)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p3-s2", "level": "builder_plus",
                        "title": "Create online course content",
                        "description": "Record explanatory videos with Loom, build interactive content with H5P, and publish on an LMS (Moodle or Teachable).",
                        "resources": [
                            {"title": "Loom — Free screen recording for educators", "type": "practice"},
                            {"title": "H5P — Free interactive content builder", "type": "practice"},
                        ],
                    },
                ],
            },
            {
                "id": "phase-4", "phase_number": 4,
                "title": "Qualification & Career Launch",
                "description": "Get qualified for your target education pathway and apply strategically.",
                "base_weeks": 3,
                "skills_covered": ["PGCE / QTS", "Corporate Training", "Portfolio"],
                "steps": [
                    {
                        "id": "p4-s1", "level": "all",
                        "title": "Choose your qualification route",
                        "description": "PGCE/QTS for schools (UK), teaching credential for US, CELTA/DELTA for EFL, CIPD L&D for corporate training. Each opens specific doors.",
                        "resources": [
                            {"title": "Get Into Teaching — UK routes (free, gov.uk)", "type": "course"},
                            {"title": "CELTA — Cambridge English (for EFL/ESL)", "type": "course"},
                        ],
                    },
                    {
                        "id": "p4-s2", "level": "all",
                        "title": "Volunteer or tutor to gain experience",
                        "description": "School experience is required for most teaching programmes. Tutoring, coaching, or running workshops all count.",
                        "resources": [
                            {"title": "Tutortoo or MyTutor — Tutor registration (UK)", "type": "practice"},
                        ],
                    },
                ],
            },
        ],
    },
}
