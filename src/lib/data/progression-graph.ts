/**
 * PathWise — Ghana Education Progression Graph
 *
 * Maps every education stage to concrete next steps, programs,
 * institutions, certifications, and career endpoints.
 * Used by the stage-aware recommendation engine.
 */

// ─── Shared atoms ────────────────────────────────────────────────────────────

export interface Institution {
  name: string;
  type: "university" | "polytechnic" | "tvet" | "professional";
  location: string;
}

export interface Certification {
  name: string;
  body: string;
  level: "foundation" | "intermediate" | "advanced";
  durationMonths: number;
}

// ─── SHS Programs ────────────────────────────────────────────────────────────

export interface ShsPathway {
  id: string;
  name: string;
  coreConcepts: string[];
  electiveGroups: { label: string; subjects: string[] }[];
  /** Recommended tertiary programs a student of this track should consider */
  tertiaryPrograms: TertiaryProgram[];
  /** Career paths reachable long-term from this SHS track */
  careerIds: string[];
  /** Alternative vocational/TVET paths for students who prefer hands-on routes */
  tvetAlternatives: string[];
}

export const SHS_PATHWAYS: ShsPathway[] = [
  {
    id: "shs_general_science",
    name: "General Science",
    coreConcepts: ["Mathematics", "Integrated Science", "English Language", "Social Studies"],
    electiveGroups: [
      { label: "Core electives", subjects: ["Physics", "Chemistry", "Biology", "Elective Mathematics"] },
    ],
    tertiaryPrograms: [
      { id: "tp_cs", name: "Computer Science (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "Ashesi", "GCTU", "UCC"] },
      { id: "tp_it", name: "Information Technology (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "Ashesi", "GCTU"] },
      { id: "tp_medicine", name: "Medicine & Surgery (MBChB)", level: "degree", durationYears: 6, institutions: ["UG Medical School", "KNUST Medical School", "UCC Medical School"] },
      { id: "tp_nursing", name: "Nursing (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "UCC", "UHAS"] },
      { id: "tp_pharmacy", name: "Pharmacy (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG"] },
      { id: "tp_civil_eng", name: "Civil Engineering (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "UCC"] },
      { id: "tp_electrical_eng", name: "Electrical Engineering (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UCC"] },
      { id: "tp_mech_eng", name: "Mechanical Engineering (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG"] },
      { id: "tp_data_science", name: "Data Science / Statistics (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "Ashesi"] },
      { id: "tp_biomedical", name: "Biomedical Science (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "UHAS"] },
      { id: "tp_agriculture_sci", name: "Agricultural Science (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "UCC"] },
    ],
    careerIds: ["software_engineer", "data_scientist", "machine_learning_engineer", "ai_engineer",
      "doctor", "pharmacist", "nurse", "biomedical_scientist",
      "civil_engineer", "electrical_engineer", "mechanical_engineer",
      "network_engineer", "cybersecurity_analyst"],
    tvetAlternatives: ["tvet_ict_digital", "tvet_electrical", "tvet_auto_mechanics"],
  },
  {
    id: "shs_general_arts",
    name: "General Arts",
    coreConcepts: ["English Language", "Social Studies", "Mathematics", "Integrated Science"],
    electiveGroups: [
      { label: "Humanities electives", subjects: ["Literature", "Government", "History", "Geography", "French", "Economics"] },
    ],
    tertiaryPrograms: [
      { id: "tp_law", name: "Law (LLB)", level: "degree", durationYears: 4, institutions: ["UG School of Law", "KNUST", "UCC"] },
      { id: "tp_economics", name: "Economics (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "Ashesi", "UCC"] },
      { id: "tp_communication", name: "Communication Studies / Journalism (BA)", level: "degree", durationYears: 4, institutions: ["UG", "GIJ", "Zenith", "UPSA"] },
      { id: "tp_psychology", name: "Psychology (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "UCC"] },
      { id: "tp_sociology", name: "Sociology / Social Work (BA)", level: "degree", durationYears: 4, institutions: ["UG", "UCC", "KNUST"] },
      { id: "tp_education", name: "Education (B.Ed.)", level: "degree", durationYears: 4, institutions: ["UEW", "UCC", "UENR"] },
      { id: "tp_political_sci", name: "Political Science (BA)", level: "degree", durationYears: 4, institutions: ["UG", "UCC"] },
      { id: "tp_intl_relations", name: "International Relations (BA)", level: "degree", durationYears: 4, institutions: ["UG", "UCC"] },
    ],
    careerIds: ["lawyer", "journalist", "policy_analyst", "teacher", "counsellor",
      "public_administrator", "content_creator", "hr_manager", "social_worker"],
    tvetAlternatives: ["tvet_catering", "tvet_arts_crafts"],
  },
  {
    id: "shs_business",
    name: "Business",
    coreConcepts: ["Mathematics", "English Language", "Social Studies", "Integrated Science"],
    electiveGroups: [
      { label: "Business electives", subjects: ["Accounting", "Business Management", "Economics", "Cost Accounting / Office Admin"] },
    ],
    tertiaryPrograms: [
      { id: "tp_business_admin", name: "Business Administration (BBA)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG Business School", "Ashesi", "UPSA"] },
      { id: "tp_accounting", name: "Accounting (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "UPSA", "Zenith", "UCC"] },
      { id: "tp_marketing", name: "Marketing (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "UPSA", "Ashesi"] },
      { id: "tp_finance", name: "Finance (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "Ashesi"] },
      { id: "tp_economics", name: "Economics (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "Ashesi"] },
      { id: "tp_supply_chain", name: "Supply Chain Management (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UPSA"] },
      { id: "tp_it", name: "Information Technology (BSc)", level: "degree", durationYears: 4, institutions: ["GCTU", "KNUST"] },
      { id: "tp_hrm", name: "Human Resource Management (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "UPSA"] },
    ],
    careerIds: ["accountant", "financial_analyst", "business_analyst", "marketing_manager",
      "product_manager", "entrepreneur", "supply_chain_manager", "hr_manager", "data_analyst"],
    tvetAlternatives: ["tvet_catering", "tvet_fashion_design"],
  },
  {
    id: "shs_visual_arts",
    name: "Visual Arts",
    coreConcepts: ["English Language", "Social Studies", "Mathematics", "Integrated Science"],
    electiveGroups: [
      { label: "Arts electives", subjects: ["Graphic Design", "Picture Making", "Sculpture", "Ceramics / Basketry", "Leatherwork", "Textiles"] },
    ],
    tertiaryPrograms: [
      { id: "tp_graphic_design", name: "Graphic Design / Communication Design (BA)", level: "degree", durationYears: 4, institutions: ["KNUST College of Art", "Takoradi Technical University"] },
      { id: "tp_architecture", name: "Architecture (BSc/March)", level: "degree", durationYears: 5, institutions: ["KNUST", "Accra Technical University"] },
      { id: "tp_fine_arts", name: "Fine Art (BA)", level: "degree", durationYears: 4, institutions: ["KNUST College of Art", "GIJ"] },
      { id: "tp_fashion_design_deg", name: "Fashion Design (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "Takoradi Technical University"] },
      { id: "tp_film_media", name: "Film & Media Studies (BA)", level: "degree", durationYears: 4, institutions: ["UG", "GIJ"] },
    ],
    careerIds: ["graphic_designer", "ux_designer", "architect", "animator", "video_producer",
      "fashion_designer", "brand_strategist", "illustrator"],
    tvetAlternatives: ["tvet_fashion_design", "tvet_arts_crafts"],
  },
  {
    id: "shs_home_economics",
    name: "Home Economics",
    coreConcepts: ["English Language", "Social Studies", "Mathematics", "Integrated Science"],
    electiveGroups: [
      { label: "Home Econ electives", subjects: ["Food & Nutrition", "Management in Living", "Clothing & Textiles", "General Knowledge in Art"] },
    ],
    tertiaryPrograms: [
      { id: "tp_food_nutrition", name: "Food & Nutrition / Dietetics (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "UCC", "UHAS"] },
      { id: "tp_hospitality_mgt", name: "Hospitality Management (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UCC", "UG"] },
      { id: "tp_nursing", name: "Nursing (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "UHAS"] },
      { id: "tp_education", name: "Education (B.Ed. Home Economics)", level: "degree", durationYears: 4, institutions: ["UEW", "UCC"] },
    ],
    careerIds: ["nutritionist", "hotel_manager", "nurse", "teacher", "food_technologist",
      "caterer", "consumer_scientist"],
    tvetAlternatives: ["tvet_catering", "tvet_fashion_design", "tvet_hairdressing"],
  },
  {
    id: "shs_agricultural_science",
    name: "Agricultural Science",
    coreConcepts: ["Mathematics", "English Language", "Social Studies", "Integrated Science"],
    electiveGroups: [
      { label: "Agri electives", subjects: ["Animal Husbandry", "Crop Husbandry", "Agricultural Science Elective", "Biology"] },
    ],
    tertiaryPrograms: [
      { id: "tp_agriculture_sci", name: "Agricultural Science (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG", "UCC"] },
      { id: "tp_food_science", name: "Food Science & Technology (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG"] },
      { id: "tp_env_science", name: "Environmental Science (BSc)", level: "degree", durationYears: 4, institutions: ["UG", "KNUST", "UCC"] },
      { id: "tp_natural_resources", name: "Natural Resources Management (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG"] },
    ],
    careerIds: ["agricultural_officer", "food_technologist", "environmental_scientist",
      "agronomist", "veterinary_officer", "agribusiness_manager"],
    tvetAlternatives: ["tvet_agriculture"],
  },
  {
    id: "shs_technical",
    name: "Technical",
    coreConcepts: ["Mathematics", "English Language", "Social Studies", "Integrated Science"],
    electiveGroups: [
      { label: "Technical electives", subjects: ["Technical Drawing", "Building Construction", "Metalwork / Auto Mechanics / Electrical", "Applied Electricity / Electronics"] },
    ],
    tertiaryPrograms: [
      { id: "tp_civil_eng", name: "Civil Engineering (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG"] },
      { id: "tp_electrical_eng", name: "Electrical Engineering (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UCC"] },
      { id: "tp_mech_eng", name: "Mechanical Engineering (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UG"] },
      { id: "tp_architecture", name: "Architecture (BSc/March)", level: "degree", durationYears: 5, institutions: ["KNUST"] },
      { id: "tp_quantity_survey", name: "Quantity Surveying (BSc)", level: "degree", durationYears: 4, institutions: ["KNUST", "UCC"] },
    ],
    careerIds: ["civil_engineer", "electrical_engineer", "mechanical_engineer",
      "architect", "quantity_surveyor", "construction_manager"],
    tvetAlternatives: ["tvet_electrical", "tvet_building_construction", "tvet_auto_mechanics"],
  },
];

// ─── Tertiary Program (shared atom) ─────────────────────────────────────────

export interface TertiaryProgram {
  id: string;
  name: string;
  level: "degree" | "diploma" | "certificate" | "hnd" | "masters" | "phd";
  durationYears: number;
  institutions: string[];
}

// ─── TVET Tracks ─────────────────────────────────────────────────────────────

export interface TvetTrack {
  id: string;
  name: string;
  specializations: string[];
  certifications: Certification[];
  careerIds: string[];
  entrepreneurshipOpps: string[];
  apprenticeshipPaths: string[];
  advancedPrograms: string[];
}

export const TVET_TRACKS: TvetTrack[] = [
  {
    id: "tvet_ict_digital",
    name: "ICT & Digital Technology",
    specializations: ["Software Development", "Hardware Servicing", "Networking", "Web Design", "Cybersecurity", "Digital Marketing"],
    certifications: [
      { name: "CompTIA A+", body: "CompTIA", level: "foundation", durationMonths: 3 },
      { name: "CompTIA Network+", body: "CompTIA", level: "intermediate", durationMonths: 4 },
      { name: "Google IT Support Professional Certificate", body: "Google / Coursera", level: "foundation", durationMonths: 6 },
      { name: "AWS Cloud Practitioner", body: "Amazon Web Services", level: "foundation", durationMonths: 3 },
      { name: "COTVET Level 3 ICT Technician", body: "COTVET", level: "intermediate", durationMonths: 12 },
    ],
    careerIds: ["software_engineer", "network_engineer", "cybersecurity_analyst", "it_support",
      "web_developer", "data_analyst", "digital_marketer"],
    entrepreneurshipOpps: [
      "Freelance software development",
      "IT support & maintenance business",
      "Web design agency",
      "Computer repair & servicing",
      "Digital marketing agency",
      "Mobile money & fintech solutions",
    ],
    apprenticeshipPaths: ["IT firm apprenticeships", "Telecom company internships (MTN, Vodafone)", "Startup accelerator programmes"],
    advancedPrograms: ["HND Computer Science", "BSc IT at GCTU / KNUST", "Cisco CCNA", "Microsoft Azure Administrator"],
  },
  {
    id: "tvet_electrical",
    name: "Electrical Installation & Technology",
    specializations: ["Domestic Electrical Installation", "Industrial Wiring", "Solar PV Installation", "Automation & Control"],
    certifications: [
      { name: "COTVET Level 2 Electrical Installation", body: "COTVET", level: "foundation", durationMonths: 12 },
      { name: "City & Guilds Electrical Installation", body: "City & Guilds", level: "intermediate", durationMonths: 18 },
      { name: "Solar PV Installation Certificate", body: "Ghana Renewable Energy", level: "foundation", durationMonths: 3 },
      { name: "NABTEX Electrical", body: "NABTEX", level: "intermediate", durationMonths: 12 },
    ],
    careerIds: ["electrical_engineer", "electrical_technician", "solar_energy_technician",
      "automation_engineer", "facilities_manager"],
    entrepreneurshipOpps: [
      "Electrical contracting business",
      "Solar installation company",
      "Generator maintenance & repair",
      "Industrial electrical maintenance contracts",
    ],
    apprenticeshipPaths: ["ECG apprenticeship", "VRA technical apprentice", "Construction firm electrician trainee"],
    advancedPrograms: ["HND Electrical Engineering", "BSc Electrical Engineering at KNUST / UCC", "Advanced solar certification"],
  },
  {
    id: "tvet_auto_mechanics",
    name: "Automotive Mechanics",
    specializations: ["Engine Repair", "Auto Electrical", "Panel Beating & Spray Painting", "Heavy Duty Machinery"],
    certifications: [
      { name: "COTVET Level 2 Auto Mechanics", body: "COTVET", level: "foundation", durationMonths: 12 },
      { name: "City & Guilds Motor Vehicle Craft", body: "City & Guilds", level: "intermediate", durationMonths: 18 },
      { name: "NABTEX Motor Vehicle Mechanics", body: "NABTEX", level: "intermediate", durationMonths: 12 },
    ],
    careerIds: ["automotive_technician", "auto_electrician", "fleet_manager", "mechanical_engineer"],
    entrepreneurshipOpps: [
      "Auto repair workshop",
      "Car detailing & valeting business",
      "Spare parts dealership",
      "Fleet management service",
    ],
    apprenticeshipPaths: ["Dealer service centre apprentice (Toyota, Kia)", "Ghana Navy engineering apprentice", "Construction equipment operator"],
    advancedPrograms: ["HND Mechanical Engineering", "BSc Mechanical Engineering", "Advanced Auto Diagnostics Certificate"],
  },
  {
    id: "tvet_building_construction",
    name: "Building & Construction",
    specializations: ["Masonry", "Carpentry", "Plumbing", "Painting & Decoration", "Quantity Surveying"],
    certifications: [
      { name: "COTVET Level 2 Masonry", body: "COTVET", level: "foundation", durationMonths: 12 },
      { name: "City & Guilds Building Craft", body: "City & Guilds", level: "intermediate", durationMonths: 18 },
    ],
    careerIds: ["civil_engineer", "quantity_surveyor", "site_manager", "construction_manager"],
    entrepreneurshipOpps: [
      "Building contractor business",
      "Renovation & interior works",
      "Property development",
      "Hardware supply store",
    ],
    apprenticeshipPaths: ["Real estate developer apprentice", "Ministry of Works contract"],
    advancedPrograms: ["HND Building Technology", "BSc Civil Engineering", "BSc Quantity Surveying"],
  },
  {
    id: "tvet_electrical_engineering",
    name: "Electrical Engineering Technology (HND-level)",
    specializations: ["Power Systems", "Electronics", "Telecommunications", "Instrumentation"],
    certifications: [
      { name: "COTVET Level 3 Electrical Engineering", body: "COTVET", level: "advanced", durationMonths: 24 },
      { name: "City & Guilds Level 3 Electrical", body: "City & Guilds", level: "advanced", durationMonths: 18 },
    ],
    careerIds: ["electrical_engineer", "power_systems_engineer", "telecom_engineer", "automation_engineer"],
    entrepreneurshipOpps: ["Electrical engineering consultancy", "Power backup systems business"],
    apprenticeshipPaths: ["ECG technical staff", "Telecom engineering firms"],
    advancedPrograms: ["BSc Electrical Engineering at KNUST", "MSc Power Systems"],
  },
  {
    id: "tvet_fashion_design",
    name: "Fashion Design & Garment Making",
    specializations: ["Pattern Making", "Garment Construction", "Kente & Batik", "Fashion Merchandising"],
    certifications: [
      { name: "COTVET Level 2 Fashion Design", body: "COTVET", level: "foundation", durationMonths: 12 },
      { name: "City & Guilds Fashion", body: "City & Guilds", level: "intermediate", durationMonths: 18 },
    ],
    careerIds: ["fashion_designer", "textile_designer", "brand_strategist"],
    entrepreneurshipOpps: [
      "Fashion label & clothing brand",
      "Tailoring & bespoke clothing",
      "Online fashion store",
      "Costume & uniform supply",
    ],
    apprenticeshipPaths: ["Textile industry apprentice", "Fashion house attachments (local designers)"],
    advancedPrograms: ["BSc Fashion Design at KNUST", "Diploma in Fashion Business"],
  },
  {
    id: "tvet_catering",
    name: "Catering & Hospitality",
    specializations: ["Food Preparation", "Bakery & Pastry", "Restaurant Management", "Event Catering"],
    certifications: [
      { name: "COTVET Level 2 Food Preparation", body: "COTVET", level: "foundation", durationMonths: 12 },
      { name: "ServSafe Food Handler Certification", body: "NRA", level: "foundation", durationMonths: 1 },
    ],
    careerIds: ["chef", "hotel_manager", "caterer", "nutritionist", "food_technologist"],
    entrepreneurshipOpps: [
      "Restaurant or chop bar",
      "Bakery & pastry shop",
      "Event catering service",
      "Online food delivery business",
    ],
    apprenticeshipPaths: ["Hotel & restaurant attachments (Kempinski, Labadi Beach)", "School feeding programme caterer"],
    advancedPrograms: ["Diploma in Hospitality Management", "BSc Hospitality Management at UG / KNUST"],
  },
  {
    id: "tvet_hairdressing",
    name: "Hairdressing & Beauty",
    specializations: ["Natural Hair Care", "Chemical Processing", "Braiding & Weaving", "Beauty Therapy"],
    certifications: [
      { name: "COTVET Level 2 Hairdressing", body: "COTVET", level: "foundation", durationMonths: 12 },
      { name: "City & Guilds Beauty Therapy", body: "City & Guilds", level: "intermediate", durationMonths: 18 },
    ],
    careerIds: ["hairdresser", "beauty_therapist", "cosmetologist"],
    entrepreneurshipOpps: [
      "Hair salon",
      "Mobile beauty services",
      "Product retail (wigs, hair products)",
      "Beauty school",
    ],
    apprenticeshipPaths: ["Salon attachments", "Beauty product company representative"],
    advancedPrograms: ["Diploma in Beauty Therapy", "Cosmetology Advanced Certificate"],
  },
  {
    id: "tvet_agriculture",
    name: "Agriculture & Agribusiness",
    specializations: ["Crop Production", "Animal Husbandry", "Agro-processing", "Aquaculture"],
    certifications: [
      { name: "COTVET Level 2 Agriculture", body: "COTVET", level: "foundation", durationMonths: 12 },
      { name: "NABTEX Agriculture", body: "NABTEX", level: "intermediate", durationMonths: 12 },
    ],
    careerIds: ["agricultural_officer", "agronomist", "agribusiness_manager", "food_technologist"],
    entrepreneurshipOpps: [
      "Poultry / fish farm",
      "Vegetable farm with market supply",
      "Agro-processing business",
      "Agricultural input supply",
    ],
    apprenticeshipPaths: ["MoFA extension officer attachment", "Agribusiness company trainee"],
    advancedPrograms: ["Diploma in Agriculture", "BSc Agricultural Science at UG / KNUST"],
  },
  {
    id: "tvet_arts_crafts",
    name: "Arts & Crafts / Creative Industries",
    specializations: ["Ceramics", "Sculpture", "Kente Weaving", "Graphic Art", "Jewellery Making"],
    certifications: [
      { name: "COTVET Level 2 Arts & Crafts", body: "COTVET", level: "foundation", durationMonths: 12 },
    ],
    careerIds: ["graphic_designer", "illustrator", "animator", "textile_designer"],
    entrepreneurshipOpps: [
      "Craft market & export business",
      "Online Etsy / ArtStation store",
      "Cultural tourism art studio",
      "Custom design studio",
    ],
    apprenticeshipPaths: ["Cultural centre artist residency", "Gallery & museum attachment"],
    advancedPrograms: ["Diploma in Fine Art", "BSc Graphic Design at KNUST College of Art"],
  },
];

// ─── University Program Tracks ───────────────────────────────────────────────

export interface UniversityTrack {
  id: string;
  name: string;
  faculty: string;
  level: "undergraduate" | "postgraduate";
  careerIds: string[];
  certifications: Certification[];
  internshipSectors: string[];
  specializations: string[];
  postgraduateOptions: string[];
}

export const UNIVERSITY_TRACKS: UniversityTrack[] = [
  {
    id: "uni_cs",
    name: "Computer Science (BSc)",
    faculty: "Computing & IT",
    level: "undergraduate",
    careerIds: ["software_engineer", "machine_learning_engineer", "ai_engineer", "data_scientist",
      "cybersecurity_analyst", "network_engineer", "devops_engineer"],
    certifications: [
      { name: "AWS Certified Solutions Architect", body: "AWS", level: "intermediate", durationMonths: 6 },
      { name: "Google Cloud Professional", body: "Google", level: "intermediate", durationMonths: 6 },
      { name: "Meta Frontend Developer", body: "Meta / Coursera", level: "foundation", durationMonths: 7 },
    ],
    internshipSectors: ["Fintech", "Telecom", "Banking", "Startups", "NGOs", "Government IT"],
    specializations: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing", "Mobile Development", "Data Engineering"],
    postgraduateOptions: ["MSc Computer Science", "MSc AI & Machine Learning", "MSc Cybersecurity"],
  },
  {
    id: "uni_it",
    name: "Information Technology (BSc)",
    faculty: "Computing & IT",
    level: "undergraduate",
    careerIds: ["network_engineer", "it_support", "cybersecurity_analyst", "database_administrator",
      "systems_analyst", "web_developer"],
    certifications: [
      { name: "CompTIA Network+", body: "CompTIA", level: "intermediate", durationMonths: 4 },
      { name: "Cisco CCNA", body: "Cisco", level: "intermediate", durationMonths: 6 },
      { name: "CompTIA Security+", body: "CompTIA", level: "intermediate", durationMonths: 4 },
    ],
    internshipSectors: ["ISP companies", "Banking IT", "Government digital services", "Healthcare IT"],
    specializations: ["Network Administration", "IT Security", "Database Management", "Cloud Infrastructure"],
    postgraduateOptions: ["MSc Information Systems", "MSc Cybersecurity", "MBA (Technology Management)"],
  },
  {
    id: "uni_business_admin",
    name: "Business Administration (BBA)",
    faculty: "Business",
    level: "undergraduate",
    careerIds: ["business_analyst", "product_manager", "entrepreneur", "marketing_manager",
      "operations_manager", "hr_manager", "project_manager"],
    certifications: [
      { name: "Project Management Professional (PMP)", body: "PMI", level: "advanced", durationMonths: 12 },
      { name: "Google Data Analytics Certificate", body: "Google", level: "foundation", durationMonths: 6 },
      { name: "HubSpot Marketing Certification", body: "HubSpot", level: "foundation", durationMonths: 1 },
    ],
    internshipSectors: ["Banking", "FMCG", "Telecoms", "Consulting", "NGOs"],
    specializations: ["Strategy", "Operations", "Entrepreneurship", "International Business"],
    postgraduateOptions: ["MBA", "MSc Management", "MSc Entrepreneurship"],
  },
  {
    id: "uni_accounting",
    name: "Accounting (BSc)",
    faculty: "Business",
    level: "undergraduate",
    careerIds: ["accountant", "financial_analyst", "auditor", "tax_consultant", "investment_analyst"],
    certifications: [
      { name: "ACCA (Association of Chartered Certified Accountants)", body: "ACCA", level: "advanced", durationMonths: 36 },
      { name: "ICAG (Institute of Chartered Accountants, Ghana)", body: "ICAG", level: "advanced", durationMonths: 36 },
      { name: "CFA (Chartered Financial Analyst)", body: "CFA Institute", level: "advanced", durationMonths: 48 },
    ],
    internshipSectors: ["Audit firms (Deloitte, PWC, KPMG)", "Banking", "Insurance", "Revenue Authority (GRA)"],
    specializations: ["Forensic Accounting", "Taxation", "Financial Reporting", "Internal Audit"],
    postgraduateOptions: ["MSc Finance & Accounting", "MBA Finance", "MSc Taxation"],
  },
  {
    id: "uni_law",
    name: "Law (LLB)",
    faculty: "Law",
    level: "undergraduate",
    careerIds: ["lawyer", "legal_consultant", "policy_analyst", "judge", "corporate_counsel"],
    certifications: [
      { name: "Ghana School of Law Professional Certificate", body: "Ghana School of Law", level: "advanced", durationMonths: 24 },
      { name: "International Human Rights Law Certificate", body: "Various", level: "intermediate", durationMonths: 6 },
    ],
    internshipSectors: ["Law firms", "AG Department", "Human rights organisations", "Corporate legal departments"],
    specializations: ["Corporate Law", "Criminal Law", "Human Rights", "International Law", "IP Law"],
    postgraduateOptions: ["LLM", "MBA (Law & Business)", "PhD Law"],
  },
  {
    id: "uni_medicine",
    name: "Medicine & Surgery (MBChB)",
    faculty: "Health Sciences",
    level: "undergraduate",
    careerIds: ["doctor", "surgeon", "medical_researcher", "public_health_officer"],
    certifications: [
      { name: "Ghana Medical & Dental Council License", body: "GMDC", level: "advanced", durationMonths: 12 },
      { name: "Advanced Cardiac Life Support (ACLS)", body: "American Heart Association", level: "intermediate", durationMonths: 1 },
    ],
    internshipSectors: ["Teaching hospitals", "District hospitals", "NGO health programmes"],
    specializations: ["Surgery", "Paediatrics", "Obstetrics & Gynaecology", "Internal Medicine", "Public Health"],
    postgraduateOptions: ["Fellowship (GCPS)", "MSc Public Health", "PhD Medical Sciences"],
  },
  {
    id: "uni_nursing",
    name: "Nursing (BSc)",
    faculty: "Health Sciences",
    level: "undergraduate",
    careerIds: ["nurse", "community_health_officer", "public_health_officer", "midwife"],
    certifications: [
      { name: "Ghana Registered Nurse License", body: "Ghana Nursing & Midwifery Council", level: "advanced", durationMonths: 6 },
      { name: "Infection Control Certificate", body: "Various", level: "intermediate", durationMonths: 3 },
    ],
    internshipSectors: ["Teaching hospitals", "Community health centres", "NGO health", "School health"],
    specializations: ["Critical Care Nursing", "Midwifery", "Community Health Nursing", "Mental Health Nursing"],
    postgraduateOptions: ["MPhil Nursing", "MSc Public Health", "Nurse Practitioner programs"],
  },
  {
    id: "uni_engineering_civil",
    name: "Civil Engineering (BSc)",
    faculty: "Engineering",
    level: "undergraduate",
    careerIds: ["civil_engineer", "structural_engineer", "quantity_surveyor", "site_manager"],
    certifications: [
      { name: "Ghana Institution of Engineers (GhIE) membership", body: "GhIE", level: "intermediate", durationMonths: 12 },
      { name: "OSHA 30 (Construction Safety)", body: "OSHA", level: "foundation", durationMonths: 1 },
      { name: "AutoCAD Certification", body: "Autodesk", level: "foundation", durationMonths: 2 },
    ],
    internshipSectors: ["Construction companies", "Ghana Highway Authority", "GWCL", "Real estate developers"],
    specializations: ["Structural Engineering", "Transportation Engineering", "Environmental Engineering", "Geotechnical Engineering"],
    postgraduateOptions: ["MSc Structural Engineering", "MSc Environmental Engineering", "MBA Construction Management"],
  },
  {
    id: "uni_marketing",
    name: "Marketing (BSc)",
    faculty: "Business",
    level: "undergraduate",
    careerIds: ["marketing_manager", "brand_strategist", "digital_marketer", "content_creator",
      "market_research_analyst", "product_manager"],
    certifications: [
      { name: "Google Digital Marketing Certificate", body: "Google", level: "foundation", durationMonths: 6 },
      { name: "Facebook Blueprint", body: "Meta", level: "foundation", durationMonths: 3 },
      { name: "CIM Marketing Qualification", body: "CIM", level: "intermediate", durationMonths: 18 },
    ],
    internshipSectors: ["FMCG companies", "Digital agencies", "Telecoms", "Media companies", "NGOs"],
    specializations: ["Digital Marketing", "Brand Management", "Market Research", "Product Marketing"],
    postgraduateOptions: ["MBA Marketing", "MSc Digital Marketing", "MSc Brand Management"],
  },
  {
    id: "uni_education",
    name: "Education (B.Ed.)",
    faculty: "Education",
    level: "undergraduate",
    careerIds: ["teacher", "school_administrator", "educational_consultant", "curriculum_developer"],
    certifications: [
      { name: "Ghana Education Service (GES) License", body: "GES", level: "advanced", durationMonths: 6 },
      { name: "Cambridge CELTA", body: "Cambridge", level: "intermediate", durationMonths: 4 },
    ],
    internshipSectors: ["GES schools", "Private schools", "NGO education projects", "International schools"],
    specializations: ["STEM Education", "Special Needs Education", "Early Childhood Education", "Curriculum & Instruction"],
    postgraduateOptions: ["MEd Educational Leadership", "MEd Curriculum Studies", "PhD Education"],
  },
];

// ─── Professional Advancement Tracks ─────────────────────────────────────────

export interface ProfessionalTrack {
  id: string;
  sector: string;
  currentRoles: string[];
  advancementPaths: { title: string; description: string }[];
  upskillCertifications: Certification[];
  transitionPaths: { to: string; bridgeSkills: string[] }[];
  leadershipPrograms: string[];
}

export const PROFESSIONAL_TRACKS: ProfessionalTrack[] = [
  {
    id: "prof_tech",
    sector: "Technology",
    currentRoles: ["Junior Developer", "Software Engineer", "IT Support", "Network Engineer"],
    advancementPaths: [
      { title: "Senior Software Engineer", description: "Lead architecture decisions, mentor juniors, drive technical strategy" },
      { title: "Engineering Manager", description: "Lead engineering teams, manage delivery, handle HR for technical staff" },
      { title: "Chief Technology Officer (CTO)", description: "Own the entire technology vision of an organisation" },
    ],
    upskillCertifications: [
      { name: "AWS Solutions Architect – Professional", body: "AWS", level: "advanced", durationMonths: 6 },
      { name: "Certified Kubernetes Administrator (CKA)", body: "CNCF", level: "advanced", durationMonths: 4 },
      { name: "Google Cloud Professional Data Engineer", body: "Google", level: "advanced", durationMonths: 6 },
    ],
    transitionPaths: [
      { to: "Product Management", bridgeSkills: ["User research", "Roadmapping", "Agile/Scrum", "Data analysis"] },
      { to: "Data Science / AI", bridgeSkills: ["Python", "Statistics", "Machine learning fundamentals", "SQL"] },
      { to: "Cybersecurity", bridgeSkills: ["Network security", "SIEM tools", "Penetration testing basics"] },
    ],
    leadershipPrograms: ["PMP Certification", "Agile Leadership", "Executive MBA (Tech focus)"],
  },
  {
    id: "prof_finance",
    sector: "Finance & Accounting",
    currentRoles: ["Accountant", "Financial Analyst", "Auditor", "Tax Officer"],
    advancementPaths: [
      { title: "Senior Financial Analyst", description: "Lead financial modelling, forecasting, and business partnering" },
      { title: "Finance Manager / Controller", description: "Oversee financial operations and compliance" },
      { title: "Chief Financial Officer (CFO)", description: "Own the financial strategy of an organisation" },
    ],
    upskillCertifications: [
      { name: "ACCA Advanced Level", body: "ACCA", level: "advanced", durationMonths: 24 },
      { name: "CFA Level 2 / 3", body: "CFA Institute", level: "advanced", durationMonths: 24 },
      { name: "Data Analytics for Finance (Excel, Power BI)", body: "Various", level: "intermediate", durationMonths: 3 },
    ],
    transitionPaths: [
      { to: "Fintech", bridgeSkills: ["API basics", "Digital payments", "SQL", "Product thinking"] },
      { to: "Data Analytics", bridgeSkills: ["Python / R", "Power BI / Tableau", "Statistics", "SQL"] },
    ],
    leadershipPrograms: ["Executive Leadership Programme", "Chartered Director (IoD Ghana)", "MBA Finance"],
  },
  {
    id: "prof_health",
    sector: "Healthcare",
    currentRoles: ["Nurse", "Doctor", "Pharmacist", "Community Health Worker"],
    advancementPaths: [
      { title: "Senior / Specialist Clinician", description: "Specialise in a clinical area and become a recognised expert" },
      { title: "Hospital Administrator / Director", description: "Lead healthcare facilities, manage budgets and staff" },
      { title: "Public Health Officer", description: "Develop community health programmes and policy" },
    ],
    upskillCertifications: [
      { name: "MSc Public Health (online / evening)", body: "UG / UHAS", level: "advanced", durationMonths: 24 },
      { name: "Healthcare Management Certificate", body: "Various", level: "intermediate", durationMonths: 12 },
    ],
    transitionPaths: [
      { to: "Health Technology / Digital Health", bridgeSkills: ["Basic coding", "EHR systems", "Data analysis", "UX for health"] },
      { to: "Health Research & NGO", bridgeSkills: ["Research methods", "Grant writing", "Data collection", "Policy writing"] },
    ],
    leadershipPrograms: ["Healthcare Leadership Programme", "MPhil Health Administration"],
  },
];

// ─── JHS Transition Guide ─────────────────────────────────────────────────────

export const JHS_TO_SHS_GUIDE = {
  message: "You are at the JHS stage — your next step is choosing the right SHS programme. Your choice of programme will shape the tertiary options available to you.",
  trackingTips: [
    "Focus on getting strong BECE grades in English, Maths and Science — these open the widest range of SHS programmes",
    "If you enjoy science and maths, consider SHS General Science — it leads to medicine, engineering, computing and more",
    "If you enjoy writing, history and debates, consider SHS General Arts — it leads to law, journalism, social work and education",
    "If you enjoy business and accounting, SHS Business leads to BBA, Accounting, Finance and Marketing at university",
    "If you prefer hands-on work, SHS Technical or TVET directly after JHS are great paths to skilled trades",
  ],
  shsOptions: SHS_PATHWAYS.map((p) => ({ id: p.id, name: p.name })),
};

// ─── Helper: get SHS pathway by ID ───────────────────────────────────────────

export function getShsPathway(id: string): ShsPathway | undefined {
  return SHS_PATHWAYS.find((p) => p.id === id);
}

export function getTvetTrack(id: string): TvetTrack | undefined {
  return TVET_TRACKS.find((t) => t.id === id);
}

export function getUniversityTrack(id: string): UniversityTrack | undefined {
  return UNIVERSITY_TRACKS.find((t) => t.id === id);
}

export function getProfessionalTrack(sector: string): ProfessionalTrack | undefined {
  return PROFESSIONAL_TRACKS.find((t) =>
    t.sector.toLowerCase().includes(sector.toLowerCase())
  );
}
