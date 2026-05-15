/**
 * Curated resource map — keyword → specific known-good URL.
 * Covers the most common skills appearing in career roadmaps.
 * No API key required. Add entries here for new skills.
 *
 * Matching: lowercased resource title or step title must CONTAIN the keyword.
 */

export interface CuratedEntry {
  title: string;
  url: string;
  platform: string;
}

// ── Video resources ───────────────────────────────────────────────────────────
// Prefer freeCodeCamp, CS50, Traversy Media, Programming with Mosh.
// All are free, high quality, and widely trusted.

export const CURATED_VIDEOS: [string, CuratedEntry][] = [
  // Web / Frontend
  ["html",             { title: "HTML & CSS Full Course", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", platform: "freeCodeCamp" }],
  ["css",              { title: "CSS Full Course", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", platform: "freeCodeCamp" }],
  ["javascript",       { title: "JavaScript Full Course for Beginners", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", platform: "freeCodeCamp" }],
  ["typescript",       { title: "TypeScript Full Course", url: "https://www.youtube.com/watch?v=30LWjhZzg50", platform: "freeCodeCamp" }],
  ["react",            { title: "React Tutorial for Beginners", url: "https://www.youtube.com/watch?v=SqcY0GlETPk", platform: "Programming with Mosh" }],
  ["next.js",          { title: "Next.js Crash Course", url: "https://www.youtube.com/watch?v=mTz0GXj8NN0", platform: "Traversy Media" }],
  ["vue",              { title: "Vue.js Crash Course", url: "https://www.youtube.com/watch?v=qZXt1Aom3Cs", platform: "Traversy Media" }],
  ["tailwind",         { title: "Tailwind CSS Full Course", url: "https://www.youtube.com/watch?v=lCxcTsOHrjo", platform: "Traversy Media" }],

  // Backend / Databases
  ["node",             { title: "Node.js Full Course", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", platform: "freeCodeCamp" }],
  ["express",          { title: "Express.js Crash Course", url: "https://www.youtube.com/watch?v=SccSCuHhOw0", platform: "Traversy Media" }],
  ["python",           { title: "Python for Beginners - Full Course", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", platform: "freeCodeCamp" }],
  ["django",           { title: "Python Django Full Course", url: "https://www.youtube.com/watch?v=PtQiiknWUcI", platform: "freeCodeCamp" }],
  ["flask",            { title: "Flask Full Course", url: "https://www.youtube.com/watch?v=Qr4QMBUPxWo", platform: "freeCodeCamp" }],
  ["java",             { title: "Java Full Course", url: "https://www.youtube.com/watch?v=GoXwIVyNvX0", platform: "freeCodeCamp" }],
  ["c++",              { title: "C++ Tutorial for Beginners", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", platform: "freeCodeCamp" }],
  ["php",              { title: "PHP for Beginners", url: "https://www.youtube.com/watch?v=2eebptXfEvw", platform: "Traversy Media" }],
  ["sql",              { title: "SQL Tutorial - Full Database Course", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", platform: "freeCodeCamp" }],
  ["mysql",            { title: "MySQL Full Course", url: "https://www.youtube.com/watch?v=ER8oKX5myE0", platform: "Programming with Mosh" }],
  ["postgresql",       { title: "PostgreSQL Tutorial Full Course", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", platform: "freeCodeCamp" }],
  ["mongodb",          { title: "MongoDB Crash Course", url: "https://www.youtube.com/watch?v=-56x56UppqQ", platform: "Traversy Media" }],

  // DevOps / Cloud
  ["git",              { title: "Git and GitHub for Beginners", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", platform: "freeCodeCamp" }],
  ["linux",            { title: "Linux Command Line Full Course", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", platform: "freeCodeCamp" }],
  ["docker",           { title: "Docker Tutorial for Beginners", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", platform: "freeCodeCamp" }],
  ["kubernetes",       { title: "Kubernetes Course - Full Beginners Tutorial", url: "https://www.youtube.com/watch?v=d6WC5n9G_sM", platform: "freeCodeCamp" }],
  ["aws",              { title: "AWS Certified Cloud Practitioner Course", url: "https://www.youtube.com/watch?v=ulprqHHWlng", platform: "freeCodeCamp" }],
  ["google cloud",     { title: "Google Cloud Digital Leader Certification", url: "https://www.youtube.com/watch?v=UGRDM86MBIQ", platform: "freeCodeCamp" }],
  ["azure",            { title: "Microsoft Azure Fundamentals Course", url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", platform: "freeCodeCamp" }],
  ["terraform",        { title: "Terraform Course for Beginners", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", platform: "freeCodeCamp" }],

  // Data / AI / ML
  ["data science",     { title: "Data Science Full Course", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", platform: "freeCodeCamp" }],
  ["machine learning", { title: "Machine Learning with Python", url: "https://www.youtube.com/watch?v=NWONeJKn6kc", platform: "freeCodeCamp" }],
  ["deep learning",    { title: "Deep Learning with TensorFlow", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", platform: "freeCodeCamp" }],
  ["tensorflow",       { title: "TensorFlow 2.0 Complete Course", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", platform: "freeCodeCamp" }],
  ["pandas",           { title: "Pandas & Python for Data Analysis", url: "https://www.youtube.com/watch?v=vmEHCJofslg", platform: "freeCodeCamp" }],
  ["excel",            { title: "Excel Full Course for Beginners", url: "https://www.youtube.com/watch?v=Vl0H-qTclOg", platform: "Leila Gharani" }],
  ["tableau",          { title: "Tableau Tutorial for Beginners", url: "https://www.youtube.com/watch?v=fHh_iy5RJSM", platform: "freeCodeCamp" }],
  ["power bi",         { title: "Power BI Tutorial for Beginners", url: "https://www.youtube.com/watch?v=NNSHu0rkew8", platform: "Guy in a Cube" }],

  // Cybersecurity
  ["cybersecurity",    { title: "Cybersecurity Full Course for Beginners", url: "https://www.youtube.com/watch?v=U_P23SqJaDc", platform: "freeCodeCamp" }],
  ["ethical hacking",  { title: "Ethical Hacking Full Course", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", platform: "freeCodeCamp" }],
  ["networking",       { title: "Computer Networking Full Course", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", platform: "freeCodeCamp" }],

  // Design / UX
  ["figma",            { title: "Figma Tutorial for Beginners", url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8", platform: "freeCodeCamp" }],
  ["ui ux",            { title: "UX Design Full Course", url: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", platform: "freeCodeCamp" }],
  ["graphic design",   { title: "Graphic Design Course for Beginners", url: "https://www.youtube.com/watch?v=9QTCvayLhCA", platform: "freeCodeCamp" }],
  ["photoshop",        { title: "Photoshop Tutorial for Beginners", url: "https://www.youtube.com/watch?v=IyR_uYsRdPs", platform: "freeCodeCamp" }],

  // Business
  ["accounting",       { title: "Accounting for Beginners", url: "https://www.youtube.com/watch?v=_PXkyHQlBhk", platform: "Accounting Stuff" }],
  ["bookkeeping",      { title: "Bookkeeping Basics", url: "https://www.youtube.com/watch?v=oLGCRMlM4BY", platform: "Accounting Stuff" }],
  ["marketing",        { title: "Digital Marketing Full Course", url: "https://www.youtube.com/watch?v=bixR-KIJKYM", platform: "HubSpot" }],
  ["project management", { title: "Project Management Full Course", url: "https://www.youtube.com/watch?v=vLFQvfUKgUQ", platform: "freeCodeCamp" }],
  ["agile",            { title: "Agile Project Management", url: "https://www.youtube.com/watch?v=8eVXTyIZ1Hs", platform: "freeCodeCamp" }],
  ["business analysis",{ title: "Business Analysis Tutorial", url: "https://www.youtube.com/watch?v=sHOgQU4P3EI", platform: "freeCodeCamp" }],

  // Healthcare
  ["anatomy",          { title: "Human Anatomy and Physiology", url: "https://www.youtube.com/watch?v=Ae4MadKPJhg", platform: "Ninja Nerd" }],
  ["pharmacology",     { title: "Pharmacology Basics", url: "https://www.youtube.com/watch?v=R_j0bKsKWE0", platform: "Ninja Nerd" }],
  ["public health",    { title: "Introduction to Public Health", url: "https://www.youtube.com/watch?v=ULKuAlvTLl0", platform: "WHO" }],

  // Agriculture
  ["agriculture",      { title: "Introduction to Modern Agriculture", url: "https://www.youtube.com/watch?v=WKS5HBP0hN0", platform: "FAO" }],
  ["farming",          { title: "Modern Farming Techniques", url: "https://www.youtube.com/watch?v=V8Jq3FD2kBc", platform: "Agriculture Academy" }],

  // Finance
  ["financial modeling", { title: "Financial Modeling for Beginners", url: "https://www.youtube.com/watch?v=8Oq0N8EKZRY", platform: "Corporate Finance Institute" }],
  ["investment",       { title: "Stock Market Investing Course", url: "https://www.youtube.com/watch?v=p7HKvqRI_Bo", platform: "freeCodeCamp" }],

  // Soft skills / General
  ["communication",    { title: "Public Speaking and Communication", url: "https://www.youtube.com/watch?v=AykYRO5d_lI", platform: "TEDx Skills" }],
  ["leadership",       { title: "Leadership Skills Training", url: "https://www.youtube.com/watch?v=lmyZMtPVodo", platform: "Brian Tracy" }],
  ["entrepreneurship", { title: "How to Start a Business", url: "https://www.youtube.com/watch?v=Gb3bFRjh4Oc", platform: "GaryVee / HubSpot" }],
];

// ── Course resources (structured learning, not just video) ────────────────────

export const CURATED_COURSES: [string, CuratedEntry][] = [
  ["html",             { title: "Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", platform: "freeCodeCamp" }],
  ["javascript",       { title: "JavaScript Algorithms & Data Structures", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", platform: "freeCodeCamp" }],
  ["python",           { title: "Python for Everybody", url: "https://www.coursera.org/specializations/python", platform: "Coursera" }],
  ["react",            { title: "React — The Official Tutorial", url: "https://react.dev/learn", platform: "React.dev" }],
  ["sql",              { title: "Intro to SQL", url: "https://www.kaggle.com/learn/intro-to-sql", platform: "Kaggle" }],
  ["data science",     { title: "IBM Data Science Professional Certificate", url: "https://www.coursera.org/professional-certificates/ibm-data-science", platform: "Coursera" }],
  ["machine learning", { title: "Machine Learning Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction", platform: "Coursera - Andrew Ng" }],
  ["deep learning",    { title: "Deep Learning Specialization", url: "https://www.coursera.org/specializations/deep-learning", platform: "Coursera - Andrew Ng" }],
  ["cybersecurity",    { title: "Google Cybersecurity Certificate", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", platform: "Coursera" }],
  ["aws",              { title: "AWS Cloud Practitioner Essentials", url: "https://www.coursera.org/learn/aws-cloud-practitioner-essentials", platform: "Coursera" }],
  ["google cloud",     { title: "Google Cloud Fundamentals", url: "https://www.coursera.org/learn/gcp-fundamentals", platform: "Coursera" }],
  ["project management", { title: "Google Project Management Certificate", url: "https://www.coursera.org/professional-certificates/google-project-management", platform: "Coursera" }],
  ["marketing",        { title: "Google Digital Marketing Certificate", url: "https://grow.google/certificates/digital-marketing-ecommerce/", platform: "Google" }],
  ["ui ux",            { title: "Google UX Design Certificate", url: "https://www.coursera.org/professional-certificates/google-ux-design", platform: "Coursera" }],
  ["excel",            { title: "Excel Skills for Business", url: "https://www.coursera.org/specializations/excel", platform: "Coursera - Macquarie" }],
  ["accounting",       { title: "Introduction to Financial Accounting", url: "https://www.coursera.org/learn/wharton-accounting", platform: "Coursera - Wharton" }],
  ["public health",    { title: "Public Health Essentials", url: "https://www.coursera.org/learn/public-health", platform: "Coursera" }],
  ["entrepreneurship", { title: "Entrepreneurship Specialization", url: "https://www.coursera.org/specializations/wharton-entrepreneurship", platform: "Coursera - Wharton" }],
  ["agile",            { title: "Agile Development", url: "https://www.coursera.org/specializations/agile-development", platform: "Coursera - UC San Diego" }],
  ["git",              { title: "Version Control with Git", url: "https://www.coursera.org/learn/version-control-with-git", platform: "Coursera - Atlassian" }],
  ["linux",            { title: "Linux Fundamentals", url: "https://www.coursera.org/learn/linux-fundamentals", platform: "Coursera" }],
  ["docker",           { title: "Docker for Beginners", url: "https://training.play-with-docker.com/", platform: "Play with Docker" }],
  ["figma",            { title: "Learn Figma - UX/UI Design", url: "https://www.coursera.org/learn/ux-design-fundamentals", platform: "Coursera" }],
  ["tableau",          { title: "Data Visualisation with Tableau", url: "https://www.coursera.org/specializations/data-visualization", platform: "Coursera" }],
  ["financial modeling", { title: "Financial Modeling & Valuation", url: "https://corporatefinanceinstitute.com/resources/financial-modeling/", platform: "CFI" }],
];

// ── Practice platforms ────────────────────────────────────────────────────────

export const CURATED_PRACTICE: [string, CuratedEntry][] = [
  ["javascript",       { title: "JavaScript Exercises", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", platform: "freeCodeCamp" }],
  ["python",           { title: "Python Practice", url: "https://www.hackerrank.com/domains/python", platform: "HackerRank" }],
  ["sql",              { title: "SQL Practice", url: "https://www.hackerrank.com/domains/sql", platform: "HackerRank" }],
  ["algorithm",        { title: "Algorithm Practice", url: "https://leetcode.com/problemset/", platform: "LeetCode" }],
  ["data structure",   { title: "Data Structures Practice", url: "https://leetcode.com/problemset/", platform: "LeetCode" }],
  ["coding",           { title: "Coding Challenges", url: "https://www.codewars.com/", platform: "Codewars" }],
  ["programming",      { title: "Programming Challenges", url: "https://www.hackerrank.com/", platform: "HackerRank" }],
  ["excel",            { title: "Excel Practice Exercises", url: "https://www.excel-practice-online.com/", platform: "Excel Practice Online" }],
  ["accounting",       { title: "Accounting Practice Problems", url: "https://www.accountingcoach.com/", platform: "AccountingCoach" }],
  ["quiz",             { title: "Knowledge Quiz", url: "https://www.khanacademy.org/", platform: "Khan Academy" }],
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

function matchKeyword(text: string, list: [string, CuratedEntry][]): CuratedEntry | null {
  const lower = text.toLowerCase();
  // Longer keywords checked first to avoid partial false-matches
  const sorted = [...list].sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, entry] of sorted) {
    if (lower.includes(keyword)) return entry;
  }
  return null;
}

export function findCuratedVideo(searchText: string): CuratedEntry | null {
  return matchKeyword(searchText, CURATED_VIDEOS);
}

export function findCuratedCourse(searchText: string): CuratedEntry | null {
  return matchKeyword(searchText, CURATED_COURSES);
}

export function findCuratedPractice(searchText: string): CuratedEntry | null {
  return matchKeyword(searchText, CURATED_PRACTICE);
}
