"""
PathWise — Training Data Generator (v3)
========================================
Uses EXACTLY the same vocabulary as the onboarding form so that
user inputs activate features the model was trained on.

Key improvements over v2:
  - Noise rate increased from 35% to 55% — creates realistic career confusion
  - n_core_interests reduced (2-4 instead of 3-5) — profiles are less saturated
  - n_max_noise increased — more cross-career overlap between similar fields
  - 300 samples per career (4800 total) — better generalisation
  - Ambiguous "swing" profiles are added that straddle two adjacent careers
  - Work style and availability are NOT perfectly career-locked — any user can have any pref

Run:
    python data/generate_data.py
"""

import random
import json
import csv
import os

random.seed(42)

# ─────────────────────────────────────────────────────────────────────────────
# These MUST match the onboarding vocabulary so user inputs hit trained features
# ─────────────────────────────────────────────────────────────────────────────

ALL_INTERESTS = [
    "Artificial Intelligence", "Machine Learning", "Data Analysis", "Data Science",
    "Web Development", "Mobile Development", "Cloud Computing", "Cybersecurity",
    "DevOps & Automation", "Software Engineering", "Game Development",
    "UI/UX Design", "Graphic Design", "Product Design", "Brand Identity",
    "Product Management", "Project Management", "Business Strategy",
    "Entrepreneurship", "Finance & Investing", "Accounting", "Economics",
    "Marketing", "Digital Marketing", "Content Creation", "Social Media",
    "Healthcare & Medicine", "Mental Health", "Biotech", "Pharmaceuticals",
    "Education & Teaching", "E-Learning", "Research & Science",
    "Law & Legal Tech", "Policy & Government", "Non-profit & Social Impact",
    "Engineering", "Robotics", "Electronics", "Architecture",
    "Photography", "Video Production", "Animation", "Music & Audio",
    "Writing & Journalism", "Publishing", "Translation & Languages",
    "E-commerce", "Supply Chain", "Logistics", "Operations",
    "HR & People", "Coaching & Mentoring", "Consulting",
    "Real Estate", "Construction", "Agriculture & Food Tech",
    "Environment & Sustainability", "Energy & Renewables",
]

ALL_SKILLS = [
    "HTML/CSS", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP",
    "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "FastAPI", "Django", "Laravel",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Firebase", "Supabase", "Redis",
    "Git", "Docker", "Kubernetes", "Linux", "Bash / Shell", "Terraform", "CI/CD",
    "AWS", "Azure", "Google Cloud",
    "Swift", "Kotlin", "React Native", "Flutter",
    "Figma", "Adobe XD", "Photoshop", "Illustrator", "After Effects", "Premiere Pro",
    "Excel / Spreadsheets", "Power BI", "Tableau", "R", "MATLAB",
    "Machine Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Data Analysis", "Statistics",
    "Project Management", "Agile / Scrum", "Product Roadmaps", "JIRA",
    "Public Speaking", "Writing & Copywriting", "Technical Writing", "Research",
    "Team Leadership", "Negotiation", "Customer Service", "Sales",
    "SEO", "Google Analytics", "Social Media Management", "Email Marketing", "PPC Advertising",
    "Financial Modelling", "Accounting", "Budgeting", "Bookkeeping",
    "Video Editing", "Photography", "3D Modelling", "Animation",
    "Networking", "Penetration Testing", "SIEM", "Risk Assessment",
]

ALL_INDUSTRIES = [
    "Technology", "Finance & Banking", "Healthcare", "Education",
    "E-commerce & Retail", "Media & Entertainment", "Government & Public Sector",
    "Consulting", "Manufacturing", "Telecommunications", "Startups", "Non-profit",
    "Research & Academia", "Defence & Security", "Energy & Renewables",
    "Agriculture", "Real Estate", "Legal & Law", "Logistics & Supply Chain",
]

ALL_GOALS = [
    "Build my own product", "Work at a top company", "Freelance and work independently",
    "Start my own business", "Help people through my work", "Become a specialist in my field",
    "Lead a team one day", "Work remotely", "Make a social impact",
    "Earn a high salary", "Travel while working", "Transition into a new field",
    "Grow into management", "Work in research", "Build something people use every day",
    "Create content and grow an audience", "Work in a creative field",
    "Solve real-world problems", "Work internationally",
]

# Work style and availability are fully random — any worker can have any preference
ALL_WORK_STYLES  = ["remote", "hybrid", "office", "flexible"]
ALL_LEARN_MODES  = ["self_paced", "structured", "bootcamp", "university", "mentorship"]
ALL_AVAILABILITY = ["full_time", "part_time", "evenings", "weekends", "limited"]


# ─────────────────────────────────────────────────────────────────────────────
# Career definitions
# Each career has core_interests and core_skills that strongly signal it.
# Careers in the same domain share some interests deliberately — this is
# realistic and forces the model to learn subtler separating features.
# ─────────────────────────────────────────────────────────────────────────────

CAREER_PROFILES = {

    "Software Engineer": {
        "core_interests": ["Software Engineering", "Web Development", "Mobile Development",
                           "Cloud Computing", "Game Development"],
        "core_skills":    ["JavaScript", "Python", "TypeScript", "React", "Node.js",
                           "Git", "SQL", "HTML/CSS", "Java"],
        "industries":     ["Technology", "Startups", "E-commerce & Retail", "Finance & Banking"],
        "goals":          ["Build my own product", "Work at a top company", "Build something people use every day",
                           "Work remotely", "Earn a high salary"],
    },

    "Data Scientist": {
        "core_interests": ["Machine Learning", "Data Science", "Artificial Intelligence",
                           "Research & Science", "Data Analysis"],
        "core_skills":    ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Scikit-learn",
                           "Statistics", "SQL", "R", "Data Analysis"],
        "industries":     ["Technology", "Finance & Banking", "Healthcare", "Research & Academia"],
        "goals":          ["Work in research", "Solve real-world problems", "Become a specialist in my field",
                           "Work at a top company"],
    },

    "Data Analyst": {
        "core_interests": ["Data Analysis", "Data Science", "Business Strategy",
                           "Finance & Investing", "Economics"],
        "core_skills":    ["SQL", "Excel / Spreadsheets", "Power BI", "Tableau",
                           "Data Analysis", "Statistics"],
        "industries":     ["Finance & Banking", "E-commerce & Retail", "Consulting",
                           "Government & Public Sector", "Healthcare"],
        "goals":          ["Help people through my work", "Grow into management",
                           "Work at a top company", "Solve real-world problems"],
    },

    "UX/UI Designer": {
        "core_interests": ["UI/UX Design", "Product Design", "Web Development",
                           "Brand Identity", "Graphic Design"],
        "core_skills":    ["Figma", "Adobe XD", "Photoshop", "Illustrator", "HTML/CSS", "Research"],
        "industries":     ["Technology", "Startups", "E-commerce & Retail",
                           "Media & Entertainment", "Consulting"],
        "goals":          ["Create content and grow an audience", "Build something people use every day",
                           "Work in a creative field", "Freelance and work independently",
                           "Work remotely"],
    },

    "Graphic Designer": {
        "core_interests": ["Graphic Design", "Brand Identity", "Product Design",
                           "Photography", "Animation", "Content Creation"],
        "core_skills":    ["Photoshop", "Illustrator", "After Effects", "Figma",
                           "Photography", "Animation"],
        "industries":     ["Media & Entertainment", "E-commerce & Retail", "Startups", "Education"],
        "goals":          ["Freelance and work independently", "Work in a creative field",
                           "Create content and grow an audience", "Travel while working",
                           "Work remotely"],
    },

    "Digital Marketer": {
        "core_interests": ["Digital Marketing", "Marketing", "Social Media",
                           "Content Creation", "E-commerce", "Entrepreneurship"],
        "core_skills":    ["SEO", "Google Analytics", "Social Media Management",
                           "Email Marketing", "PPC Advertising", "Writing & Copywriting"],
        "industries":     ["E-commerce & Retail", "Media & Entertainment", "Startups", "Consulting"],
        "goals":          ["Create content and grow an audience", "Start my own business",
                           "Freelance and work independently", "Work remotely", "Earn a high salary"],
    },

    "Financial Analyst": {
        "core_interests": ["Finance & Investing", "Economics", "Accounting",
                           "Business Strategy", "Data Analysis"],
        "core_skills":    ["Financial Modelling", "Excel / Spreadsheets", "Accounting",
                           "Budgeting", "SQL", "Statistics"],
        "industries":     ["Finance & Banking", "Consulting", "Real Estate",
                           "Government & Public Sector", "Manufacturing"],
        "goals":          ["Earn a high salary", "Grow into management", "Work at a top company",
                           "Become a specialist in my field"],
    },

    "Cybersecurity Analyst": {
        "core_interests": ["Cybersecurity", "Cloud Computing", "Software Engineering",
                           "Engineering", "Research & Science"],
        "core_skills":    ["Networking", "Penetration Testing", "SIEM", "Risk Assessment",
                           "Linux", "Python", "Bash / Shell"],
        "industries":     ["Government & Public Sector", "Finance & Banking",
                           "Defence & Security", "Technology"],
        "goals":          ["Become a specialist in my field", "Work at a top company",
                           "Solve real-world problems", "Earn a high salary"],
    },

    "DevOps Engineer": {
        "core_interests": ["DevOps & Automation", "Cloud Computing", "Software Engineering",
                           "Engineering"],
        "core_skills":    ["Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
                           "Linux", "Terraform", "CI/CD", "Bash / Shell", "Python", "Git"],
        "industries":     ["Technology", "Startups", "Finance & Banking", "Telecommunications"],
        "goals":          ["Work remotely", "Earn a high salary", "Build something people use every day",
                           "Become a specialist in my field"],
    },

    "Product Manager": {
        "core_interests": ["Product Management", "Business Strategy", "Software Engineering",
                           "Entrepreneurship", "Data Analysis", "UI/UX Design"],
        "core_skills":    ["Product Roadmaps", "Agile / Scrum", "JIRA", "Data Analysis",
                           "Project Management", "Team Leadership", "Public Speaking"],
        "industries":     ["Technology", "Startups", "E-commerce & Retail",
                           "Finance & Banking", "Consulting"],
        "goals":          ["Lead a team one day", "Build my own product", "Grow into management",
                           "Work at a top company", "Earn a high salary"],
    },

    "Project Manager": {
        "core_interests": ["Project Management", "Business Strategy", "Operations",
                           "Consulting", "Engineering", "Logistics"],
        "core_skills":    ["Project Management", "Agile / Scrum", "JIRA", "Team Leadership",
                           "Excel / Spreadsheets", "Public Speaking", "Negotiation", "Risk Assessment"],
        "industries":     ["Consulting", "Manufacturing", "Government & Public Sector",
                           "Construction", "Logistics & Supply Chain"],
        "goals":          ["Lead a team one day", "Grow into management",
                           "Earn a high salary", "Become a specialist in my field"],
    },

    "Content Writer / Journalist": {
        "core_interests": ["Writing & Journalism", "Content Creation", "Publishing",
                           "Social Media", "Education & Teaching", "Research & Science"],
        "core_skills":    ["Writing & Copywriting", "Research", "SEO",
                           "Social Media Management", "Technical Writing", "Public Speaking"],
        "industries":     ["Media & Entertainment", "Non-profit", "Education",
                           "E-commerce & Retail", "Government & Public Sector"],
        "goals":          ["Create content and grow an audience", "Freelance and work independently",
                           "Work remotely", "Travel while working", "Make a social impact"],
    },

    "HR Specialist": {
        "core_interests": ["HR & People", "Coaching & Mentoring", "Business Strategy",
                           "Education & Teaching", "Non-profit & Social Impact", "Operations"],
        "core_skills":    ["Team Leadership", "Public Speaking", "Negotiation",
                           "Research", "Writing & Copywriting", "Customer Service"],
        "industries":     ["Consulting", "Government & Public Sector", "Healthcare",
                           "Finance & Banking", "Non-profit", "Education"],
        "goals":          ["Help people through my work", "Lead a team one day",
                           "Make a social impact", "Grow into management"],
    },

    "Healthcare Professional": {
        "core_interests": ["Healthcare & Medicine", "Research & Science", "Biotech",
                           "Mental Health", "Pharmaceuticals", "Education & Teaching"],
        "core_skills":    ["Research", "Statistics", "Technical Writing",
                           "Public Speaking", "Data Analysis", "Excel / Spreadsheets"],
        "industries":     ["Healthcare", "Research & Academia", "Non-profit",
                           "Government & Public Sector"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Work in research"],
    },

    "Video Producer": {
        "core_interests": ["Video Production", "Content Creation", "Animation",
                           "Photography", "Social Media", "Music & Audio"],
        "core_skills":    ["Video Editing", "Premiere Pro", "After Effects",
                           "Photography", "Animation", "Social Media Management", "Writing & Copywriting"],
        "industries":     ["Media & Entertainment", "E-commerce & Retail", "Non-profit", "Education"],
        "goals":          ["Create content and grow an audience", "Freelance and work independently",
                           "Work in a creative field", "Travel while working", "Work remotely"],
    },

    "Business Analyst": {
        "core_interests": ["Business Strategy", "Data Analysis", "Consulting",
                           "Operations", "Economics", "E-commerce"],
        "core_skills":    ["Data Analysis", "SQL", "Excel / Spreadsheets",
                           "Power BI", "Research", "Writing & Copywriting",
                           "Project Management", "Agile / Scrum"],
        "industries":     ["Consulting", "Finance & Banking", "Government & Public Sector",
                           "E-commerce & Retail", "Manufacturing"],
        "goals":          ["Solve real-world problems", "Grow into management",
                           "Work at a top company", "Become a specialist in my field"],
    },

    "Mobile Developer": {
        "core_interests": ["Mobile Development", "Software Engineering", "Web Development",
                           "UI/UX Design", "Game Development"],
        "core_skills":    ["React Native", "Flutter", "Swift", "Kotlin",
                           "JavaScript", "TypeScript", "Git"],
        "industries":     ["Technology", "Startups", "E-commerce & Retail",
                           "Finance & Banking", "Healthcare"],
        "goals":          ["Build my own product", "Work at a top company",
                           "Build something people use every day", "Work remotely",
                           "Earn a high salary"],
    },

    "Machine Learning Engineer": {
        "core_interests": ["Machine Learning", "Artificial Intelligence", "Software Engineering",
                           "Data Science", "Cloud Computing"],
        "core_skills":    ["Python", "Machine Learning", "TensorFlow", "PyTorch",
                           "Scikit-learn", "Docker", "AWS", "SQL"],
        "industries":     ["Technology", "Finance & Banking", "Healthcare",
                           "Research & Academia", "Startups"],
        "goals":          ["Work at a top company", "Solve real-world problems",
                           "Build something people use every day", "Earn a high salary",
                           "Become a specialist in my field"],
    },

    "Social Media Manager": {
        "core_interests": ["Social Media", "Content Creation", "Digital Marketing",
                           "Photography", "Video Production", "Marketing"],
        "core_skills":    ["Social Media Management", "Writing & Copywriting",
                           "Photography", "Video Editing", "Google Analytics",
                           "Email Marketing"],
        "industries":     ["E-commerce & Retail", "Media & Entertainment",
                           "Startups", "Non-profit", "Consulting"],
        "goals":          ["Create content and grow an audience", "Work remotely",
                           "Freelance and work independently", "Travel while working",
                           "Start my own business"],
    },

    "Accountant": {
        "core_interests": ["Accounting", "Finance & Investing", "Business Strategy",
                           "Economics", "Operations"],
        "core_skills":    ["Accounting", "Bookkeeping", "Excel / Spreadsheets",
                           "Financial Modelling", "Budgeting", "Statistics"],
        "industries":     ["Finance & Banking", "Consulting", "Government & Public Sector",
                           "Manufacturing", "Real Estate"],
        "goals":          ["Earn a high salary", "Become a specialist in my field",
                           "Work at a top company", "Grow into management"],
    },

    "Sales Executive": {
        "core_interests": ["Entrepreneurship", "Business Strategy", "Marketing",
                           "Consulting", "E-commerce", "Digital Marketing"],
        "core_skills":    ["Sales", "Negotiation", "Customer Service",
                           "Public Speaking", "Writing & Copywriting", "Research"],
        "industries":     ["Technology", "Finance & Banking", "E-commerce & Retail",
                           "Consulting", "Startups"],
        "goals":          ["Earn a high salary", "Lead a team one day",
                           "Start my own business", "Work at a top company",
                           "Grow into management"],
    },

    "Data Engineer": {
        "core_interests": ["Data Science", "Software Engineering", "Cloud Computing",
                           "DevOps & Automation", "Data Analysis"],
        "core_skills":    ["Python", "SQL", "AWS", "Docker",
                           "Bash / Shell", "PostgreSQL", "Data Analysis"],
        "industries":     ["Technology", "Finance & Banking", "E-commerce & Retail",
                           "Healthcare", "Startups"],
        "goals":          ["Earn a high salary", "Work remotely",
                           "Build something people use every day",
                           "Become a specialist in my field"],
    },

    "Game Developer": {
        "core_interests": ["Game Development", "Software Engineering", "Animation",
                           "UI/UX Design", "3D Modelling"],
        "core_skills":    ["C#", "C++", "JavaScript", "3D Modelling",
                           "Animation", "Git"],
        "industries":     ["Media & Entertainment", "Technology",
                           "Education", "Startups"],
        "goals":          ["Build my own product", "Work in a creative field",
                           "Build something people use every day",
                           "Work remotely", "Earn a high salary"],
    },

    "Cloud Architect": {
        "core_interests": ["Cloud Computing", "DevOps & Automation", "Software Engineering",
                           "Cybersecurity", "Engineering"],
        "core_skills":    ["AWS", "Azure", "Google Cloud", "Terraform",
                           "Kubernetes", "Docker", "Linux", "CI/CD"],
        "industries":     ["Technology", "Finance & Banking", "Government & Public Sector",
                           "Telecommunications", "Healthcare"],
        "goals":          ["Earn a high salary", "Become a specialist in my field",
                           "Work remotely", "Work at a top company"],
    },

    "Technical Writer": {
        "core_interests": ["Writing & Journalism", "Software Engineering",
                           "Content Creation", "Education & Teaching", "Research & Science"],
        "core_skills":    ["Technical Writing", "Writing & Copywriting",
                           "Research", "HTML/CSS", "Git"],
        "industries":     ["Technology", "Healthcare", "Government & Public Sector",
                           "Startups", "Consulting"],
        "goals":          ["Work remotely", "Freelance and work independently",
                           "Become a specialist in my field",
                           "Help people through my work"],
    },

    "Teacher / Educator": {
        "core_interests": ["Education & Teaching", "E-Learning", "Research & Science",
                           "Non-profit & Social Impact", "Coaching & Mentoring",
                           "Writing & Journalism"],
        "core_skills":    ["Public Speaking", "Research", "Writing & Copywriting",
                           "Customer Service", "Technical Writing"],
        "industries":     ["Education", "Government & Public Sector", "Non-profit",
                           "Consulting", "Research & Academia"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Lead a team one day", "Work in research",
                           "Create content and grow an audience"],
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# Sampling
# ─────────────────────────────────────────────────────────────────────────────

def sample_profile(career: str, noise_rate: float = 0.55) -> dict:
    """
    Generate one realistic profile for a target career.
    noise_rate: probability of injecting off-profile items.
    Higher = more realistic confusion between adjacent careers.
    """
    p = CAREER_PROFILES[career]

    def pick_with_noise(core_pool, all_pool, n_core_range, n_max_noise: int):
        n_core = random.randint(*n_core_range)
        core = random.sample(core_pool, min(n_core, len(core_pool)))
        extras = []
        if random.random() < noise_rate:
            noise_candidates = [x for x in all_pool if x not in core]
            n_noise = random.randint(1, min(n_max_noise, len(noise_candidates)))
            extras = random.sample(noise_candidates, n_noise)
        combined = list(set(core + extras))
        random.shuffle(combined)
        return combined

    # Interests: 2-4 on-profile, up to 4 noise (adjacent career overlap)
    interests = pick_with_noise(p["core_interests"], ALL_INTERESTS, (2, 4), 4)

    # Skills: 3-6 on-profile, up to 4 noise
    skills = pick_with_noise(p["core_skills"], ALL_SKILLS, (3, 6), 4)

    # Weak areas: off-profile skills they don't have yet
    off_profile_skills = [s for s in ALL_SKILLS if s not in skills]
    weak_areas = random.sample(off_profile_skills, min(random.randint(1, 4), len(off_profile_skills)))

    # Industry: 1-2 from career's typical industries
    n_industries = random.randint(1, min(2, len(p["industries"])))
    industries = random.sample(p["industries"], n_industries)

    # Goals: 1-2 from career's typical goals
    n_goals = random.randint(1, min(2, len(p["goals"])))
    goals = random.sample(p["goals"], n_goals)

    # Work style and availability: fully random (not career-locked)
    work_style    = random.choice(ALL_WORK_STYLES)
    learning_mode = random.choice(ALL_LEARN_MODES)
    availability  = random.choice(ALL_AVAILABILITY)

    return {
        "interests":           json.dumps(interests),
        "skills":              json.dumps(skills),
        "weakAreas":           json.dumps(weak_areas),
        "workStyle":           work_style,
        "learningMode":        learning_mode,
        "availabilityPerWeek": availability,
        "careerGoals":         json.dumps(goals),
        "industries":          json.dumps(industries),
        "targetCareer":        career,
    }


def generate_dataset(n_per_career: int = 300, output_path: str = None) -> str:
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "student_profiles.csv")

    records = []
    for career in CAREER_PROFILES:
        for _ in range(n_per_career):
            records.append(sample_profile(career))

    random.shuffle(records)

    fieldnames = [
        "interests", "skills", "weakAreas", "workStyle", "learningMode",
        "availabilityPerWeek", "careerGoals", "industries", "targetCareer",
    ]

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"Generated {len(records)} samples across {len(CAREER_PROFILES)} careers -> {output_path}")
    return output_path


if __name__ == "__main__":
    generate_dataset(n_per_career=300)
