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

    # ── Law & Legal ───────────────────────────────────────────────────────

    "Solicitor / Lawyer": {
        "core_interests": ["Law & Legal Tech", "Policy & Government", "Business Strategy",
                           "Finance & Investing", "Research & Science"],
        "core_skills":    ["Research", "Writing & Copywriting", "Negotiation",
                           "Public Speaking", "Technical Writing"],
        "industries":     ["Legal & Law", "Finance & Banking", "Government & Public Sector",
                           "Real Estate"],
        "goals":          ["Earn a high salary", "Become a specialist in my field",
                           "Work at a top company", "Help people through my work",
                           "Make a social impact"],
    },

    "Paralegal": {
        "core_interests": ["Law & Legal Tech", "Research & Science", "Writing & Journalism",
                           "Policy & Government"],
        "core_skills":    ["Research", "Writing & Copywriting", "Technical Writing",
                           "Customer Service", "Negotiation"],
        "industries":     ["Legal & Law", "Government & Public Sector",
                           "Finance & Banking", "Real Estate"],
        "goals":          ["Become a specialist in my field", "Help people through my work",
                           "Work at a top company", "Transition into a new field"],
    },

    "Compliance Officer": {
        "core_interests": ["Law & Legal Tech", "Finance & Investing", "Policy & Government",
                           "Research & Science", "Business Strategy"],
        "core_skills":    ["Research", "Writing & Copywriting", "Risk Assessment",
                           "Negotiation", "Public Speaking"],
        "industries":     ["Finance & Banking", "Healthcare", "Technology",
                           "Government & Public Sector"],
        "goals":          ["Become a specialist in my field", "Earn a high salary",
                           "Work at a top company", "Solve real-world problems"],
    },

    # ── Engineering ───────────────────────────────────────────────────────

    "Civil Engineer": {
        "core_interests": ["Engineering", "Architecture", "Construction",
                           "Environment & Sustainability", "Project Management"],
        "core_skills":    ["Project Management", "Research", "Statistics",
                           "Technical Writing", "Risk Assessment"],
        "industries":     ["Construction", "Government & Public Sector",
                           "Consulting", "Energy & Renewables"],
        "goals":          ["Solve real-world problems", "Become a specialist in my field",
                           "Work at a top company", "Make a social impact"],
    },

    "Mechanical Engineer": {
        "core_interests": ["Engineering", "Robotics", "Electronics",
                           "Research & Science", "Manufacturing"],
        "core_skills":    ["Engineering", "Statistics", "Technical Writing",
                           "Research", "Project Management", "MATLAB"],
        "industries":     ["Manufacturing", "Energy & Renewables",
                           "Healthcare", "Consulting"],
        "goals":          ["Become a specialist in my field", "Solve real-world problems",
                           "Work at a top company", "Earn a high salary"],
    },

    "Electrical Engineer": {
        "core_interests": ["Electronics", "Engineering", "Energy & Renewables",
                           "Robotics", "Research & Science"],
        "core_skills":    ["Engineering", "Statistics", "Technical Writing",
                           "Research", "Risk Assessment", "MATLAB"],
        "industries":     ["Energy & Renewables", "Manufacturing",
                           "Telecommunications", "Defence & Security"],
        "goals":          ["Become a specialist in my field", "Solve real-world problems",
                           "Earn a high salary", "Work at a top company"],
    },

    "Electrician": {
        "core_interests": ["Engineering", "Electronics", "Construction",
                           "Energy & Renewables"],
        "core_skills":    ["Engineering", "Risk Assessment", "Customer Service",
                           "Technical Writing"],
        "industries":     ["Construction", "Manufacturing",
                           "Government & Public Sector", "Energy & Renewables"],
        "goals":          ["Earn a high salary", "Freelance and work independently",
                           "Become a specialist in my field", "Work independently"],
    },

    "Plumber": {
        "core_interests": ["Engineering", "Construction", "Real Estate",
                           "Entrepreneurship"],
        "core_skills":    ["Engineering", "Customer Service", "Risk Assessment"],
        "industries":     ["Construction", "Government & Public Sector", "Real Estate"],
        "goals":          ["Earn a high salary", "Freelance and work independently",
                           "Become a specialist in my field"],
    },

    "Aerospace Engineer": {
        "core_interests": ["Engineering", "Research & Science", "Robotics",
                           "Electronics", "Physics"],
        "core_skills":    ["Engineering", "Statistics", "Research",
                           "Technical Writing", "MATLAB"],
        "industries":     ["Defence & Security", "Government & Public Sector",
                           "Research & Academia", "Manufacturing"],
        "goals":          ["Become a specialist in my field", "Work in research",
                           "Solve real-world problems", "Work at a top company"],
    },

    "Chemical Engineer": {
        "core_interests": ["Engineering", "Research & Science", "Biotech",
                           "Pharmaceuticals", "Environment & Sustainability"],
        "core_skills":    ["Engineering", "Statistics", "Research",
                           "Risk Assessment", "Technical Writing", "MATLAB"],
        "industries":     ["Manufacturing", "Pharmaceuticals",
                           "Energy & Renewables", "Agriculture"],
        "goals":          ["Solve real-world problems", "Become a specialist in my field",
                           "Work in research", "Earn a high salary"],
    },

    # ── Healthcare & Science ──────────────────────────────────────────────

    "Nurse": {
        "core_interests": ["Healthcare & Medicine", "Mental Health", "Non-profit & Social Impact",
                           "Education & Teaching", "Research & Science"],
        "core_skills":    ["Customer Service", "Public Speaking", "Research",
                           "Technical Writing", "Statistics"],
        "industries":     ["Healthcare", "Government & Public Sector",
                           "Non-profit", "Research & Academia"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Grow into management"],
    },

    "Pharmacist": {
        "core_interests": ["Healthcare & Medicine", "Pharmaceuticals", "Research & Science",
                           "Biotech", "Education & Teaching"],
        "core_skills":    ["Research", "Customer Service", "Statistics",
                           "Technical Writing", "Public Speaking"],
        "industries":     ["Healthcare", "Pharmaceuticals",
                           "Government & Public Sector", "Research & Academia"],
        "goals":          ["Help people through my work", "Become a specialist in my field",
                           "Earn a high salary", "Work in research"],
    },

    "Physiotherapist": {
        "core_interests": ["Healthcare & Medicine", "Mental Health", "Research & Science",
                           "Education & Teaching"],
        "core_skills":    ["Research", "Customer Service", "Public Speaking", "Statistics"],
        "industries":     ["Healthcare", "Government & Public Sector", "Non-profit"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Freelance and work independently"],
    },

    "Psychologist": {
        "core_interests": ["Mental Health", "Healthcare & Medicine", "Research & Science",
                           "Education & Teaching", "Non-profit & Social Impact"],
        "core_skills":    ["Research", "Public Speaking", "Statistics",
                           "Writing & Copywriting", "Customer Service"],
        "industries":     ["Healthcare", "Government & Public Sector",
                           "Research & Academia", "Non-profit"],
        "goals":          ["Help people through my work", "Work in research",
                           "Make a social impact", "Become a specialist in my field"],
    },

    "Biomedical Scientist": {
        "core_interests": ["Research & Science", "Healthcare & Medicine", "Biotech",
                           "Pharmaceuticals", "Data Analysis"],
        "core_skills":    ["Research", "Statistics", "Technical Writing", "Data Analysis"],
        "industries":     ["Healthcare", "Research & Academia",
                           "Pharmaceuticals", "Government & Public Sector"],
        "goals":          ["Work in research", "Become a specialist in my field",
                           "Solve real-world problems", "Help people through my work"],
    },

    "Environmental Scientist": {
        "core_interests": ["Environment & Sustainability", "Research & Science",
                           "Energy & Renewables", "Agriculture & Food Tech", "Data Analysis"],
        "core_skills":    ["Research", "Statistics", "Technical Writing",
                           "Data Analysis", "R"],
        "industries":     ["Government & Public Sector", "Consulting",
                           "Energy & Renewables", "Research & Academia"],
        "goals":          ["Make a social impact", "Work in research",
                           "Solve real-world problems", "Become a specialist in my field"],
    },

    # ── Business, Finance & Management ───────────────────────────────────

    "Management Consultant": {
        "core_interests": ["Consulting", "Business Strategy", "Economics",
                           "Operations", "Data Analysis"],
        "core_skills":    ["Research", "Data Analysis", "Public Speaking",
                           "Writing & Copywriting", "Project Management", "Excel / Spreadsheets"],
        "industries":     ["Consulting", "Finance & Banking",
                           "Technology", "Government & Public Sector"],
        "goals":          ["Earn a high salary", "Work at a top company",
                           "Grow into management", "Solve real-world problems",
                           "Work internationally"],
    },

    "Supply Chain Manager": {
        "core_interests": ["Supply Chain", "Logistics", "Operations",
                           "E-commerce", "Business Strategy"],
        "core_skills":    ["Project Management", "Negotiation", "Data Analysis",
                           "Excel / Spreadsheets", "Agile / Scrum"],
        "industries":     ["Logistics & Supply Chain", "Manufacturing",
                           "E-commerce & Retail", "Healthcare"],
        "goals":          ["Earn a high salary", "Grow into management",
                           "Become a specialist in my field", "Solve real-world problems"],
    },

    "Operations Manager": {
        "core_interests": ["Operations", "Business Strategy", "Logistics",
                           "Supply Chain", "Project Management"],
        "core_skills":    ["Project Management", "Team Leadership", "Budgeting",
                           "Data Analysis", "Negotiation", "Public Speaking"],
        "industries":     ["Manufacturing", "E-commerce & Retail",
                           "Healthcare", "Consulting"],
        "goals":          ["Lead a team one day", "Grow into management",
                           "Earn a high salary", "Become a specialist in my field"],
    },

    "Entrepreneur / Startup Founder": {
        "core_interests": ["Entrepreneurship", "Product Management", "Business Strategy",
                           "E-commerce", "Digital Marketing"],
        "core_skills":    ["Sales", "Product Roadmaps", "Team Leadership",
                           "Financial Modelling", "Writing & Copywriting", "Public Speaking"],
        "industries":     ["Startups", "Technology", "E-commerce & Retail"],
        "goals":          ["Start my own business", "Build my own product",
                           "Earn a high salary", "Lead a team one day",
                           "Build something people use every day"],
    },

    "Investment Banker": {
        "core_interests": ["Finance & Investing", "Economics", "Business Strategy",
                           "Accounting", "Consulting"],
        "core_skills":    ["Financial Modelling", "Excel / Spreadsheets", "Accounting",
                           "Public Speaking", "Negotiation", "Statistics"],
        "industries":     ["Finance & Banking", "Consulting"],
        "goals":          ["Earn a high salary", "Work at a top company",
                           "Grow into management", "Become a specialist in my field"],
    },

    "Actuary": {
        "core_interests": ["Finance & Investing", "Research & Science", "Economics",
                           "Data Analysis", "Mathematics"],
        "core_skills":    ["Statistics", "Financial Modelling", "R",
                           "MATLAB", "Excel / Spreadsheets", "Data Analysis"],
        "industries":     ["Finance & Banking", "Consulting", "Government & Public Sector"],
        "goals":          ["Become a specialist in my field", "Earn a high salary",
                           "Work at a top company", "Work in research"],
    },

    "Insurance Broker": {
        "core_interests": ["Finance & Investing", "Business Strategy", "Consulting",
                           "Real Estate", "Entrepreneurship"],
        "core_skills":    ["Sales", "Negotiation", "Customer Service",
                           "Research", "Writing & Copywriting"],
        "industries":     ["Finance & Banking", "Consulting",
                           "Real Estate", "Manufacturing"],
        "goals":          ["Earn a high salary", "Lead a team one day",
                           "Start my own business", "Work at a top company"],
    },

    # ── Creative & Media ──────────────────────────────────────────────────

    "Animator / Motion Designer": {
        "core_interests": ["Animation", "Video Production", "Game Development",
                           "Graphic Design", "UI/UX Design"],
        "core_skills":    ["Animation", "3D Modelling", "After Effects",
                           "Photoshop", "Illustrator"],
        "industries":     ["Media & Entertainment", "Technology",
                           "E-commerce & Retail", "Education"],
        "goals":          ["Work in a creative field", "Freelance and work independently",
                           "Build something people use every day", "Work remotely",
                           "Create content and grow an audience"],
    },

    "Photographer": {
        "core_interests": ["Photography", "Content Creation", "Video Production",
                           "Brand Identity", "Social Media"],
        "core_skills":    ["Photography", "Photoshop", "Video Editing",
                           "Writing & Copywriting"],
        "industries":     ["Media & Entertainment", "E-commerce & Retail",
                           "Startups", "Non-profit"],
        "goals":          ["Freelance and work independently", "Work in a creative field",
                           "Travel while working", "Create content and grow an audience",
                           "Work remotely"],
    },

    "Music Producer": {
        "core_interests": ["Music & Audio", "Content Creation", "Video Production",
                           "Entrepreneurship", "Social Media"],
        "core_skills":    ["Music & Audio", "Video Editing", "Writing & Copywriting"],
        "industries":     ["Media & Entertainment", "E-commerce & Retail"],
        "goals":          ["Work in a creative field", "Freelance and work independently",
                           "Create content and grow an audience", "Start my own business"],
    },

    "Interior Designer": {
        "core_interests": ["Architecture", "Graphic Design", "Product Design",
                           "Real Estate", "Entrepreneurship"],
        "core_skills":    ["Figma", "Illustrator", "Photoshop",
                           "Project Management", "Writing & Copywriting", "Negotiation"],
        "industries":     ["Real Estate", "Consulting", "Construction"],
        "goals":          ["Work in a creative field", "Freelance and work independently",
                           "Build something people use every day", "Start my own business"],
    },

    "Fashion Designer": {
        "core_interests": ["Graphic Design", "Brand Identity", "Content Creation",
                           "Photography", "E-commerce"],
        "core_skills":    ["Illustrator", "Photoshop", "Research", "Writing & Copywriting"],
        "industries":     ["Media & Entertainment", "E-commerce & Retail", "Non-profit"],
        "goals":          ["Work in a creative field", "Freelance and work independently",
                           "Create content and grow an audience", "Start my own business"],
    },

    "Podcast Producer": {
        "core_interests": ["Music & Audio", "Content Creation", "Writing & Journalism",
                           "Social Media", "Marketing"],
        "core_skills":    ["Writing & Copywriting", "Video Editing",
                           "Social Media Management", "Research", "Public Speaking"],
        "industries":     ["Media & Entertainment", "Non-profit", "Consulting"],
        "goals":          ["Create content and grow an audience", "Freelance and work independently",
                           "Work remotely", "Travel while working"],
    },

    "Journalist": {
        "core_interests": ["Writing & Journalism", "Research & Science", "Publishing",
                           "Social Media", "Policy & Government"],
        "core_skills":    ["Writing & Copywriting", "Research", "Public Speaking",
                           "SEO", "Social Media Management"],
        "industries":     ["Media & Entertainment", "Government & Public Sector", "Non-profit"],
        "goals":          ["Create content and grow an audience", "Make a social impact",
                           "Freelance and work independently", "Travel while working",
                           "Work remotely"],
    },

    "PR Specialist": {
        "core_interests": ["Marketing", "Writing & Journalism", "Social Media",
                           "Content Creation", "Consulting"],
        "core_skills":    ["Writing & Copywriting", "Public Speaking", "Research",
                           "Social Media Management", "Negotiation"],
        "industries":     ["Consulting", "Media & Entertainment",
                           "Government & Public Sector", "Non-profit"],
        "goals":          ["Create content and grow an audience", "Work at a top company",
                           "Lead a team one day", "Make a social impact"],
    },

    # ── Education & Social ────────────────────────────────────────────────

    "Social Worker": {
        "core_interests": ["Non-profit & Social Impact", "Mental Health",
                           "Healthcare & Medicine", "Education & Teaching",
                           "Policy & Government"],
        "core_skills":    ["Customer Service", "Public Speaking", "Research",
                           "Writing & Copywriting", "Negotiation"],
        "industries":     ["Government & Public Sector", "Non-profit", "Healthcare"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Solve real-world problems"],
    },

    "Counsellor / Therapist": {
        "core_interests": ["Mental Health", "Coaching & Mentoring", "Healthcare & Medicine",
                           "Non-profit & Social Impact", "Research & Science"],
        "core_skills":    ["Customer Service", "Public Speaking", "Research",
                           "Writing & Copywriting"],
        "industries":     ["Healthcare", "Government & Public Sector",
                           "Non-profit", "Consulting"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Freelance and work independently", "Become a specialist in my field"],
    },

    "Careers Advisor": {
        "core_interests": ["Coaching & Mentoring", "Education & Teaching",
                           "HR & People", "Non-profit & Social Impact", "Research & Science"],
        "core_skills":    ["Public Speaking", "Customer Service", "Research",
                           "Writing & Copywriting"],
        "industries":     ["Education", "Government & Public Sector",
                           "Non-profit", "Consulting"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Lead a team one day", "Become a specialist in my field"],
    },

    "Sports Coach / Performance Analyst": {
        "core_interests": ["Research & Science", "Data Analysis",
                           "Education & Teaching", "Coaching & Mentoring"],
        "core_skills":    ["Public Speaking", "Customer Service", "Research",
                           "Statistics", "Data Analysis"],
        "industries":     ["Education", "Healthcare", "Government & Public Sector"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Lead a team one day"],
    },

    # ── Hospitality, Travel & Retail ──────────────────────────────────────

    "Hotel Manager": {
        "core_interests": ["Operations", "Entrepreneurship", "Business Strategy",
                           "HR & People", "Non-profit & Social Impact"],
        "core_skills":    ["Customer Service", "Team Leadership", "Budgeting",
                           "Public Speaking", "Negotiation"],
        "industries":     ["Real Estate", "Consulting"],
        "goals":          ["Lead a team one day", "Earn a high salary",
                           "Grow into management", "Start my own business"],
    },

    "Chef": {
        "core_interests": ["Agriculture & Food Tech", "Entrepreneurship",
                           "Content Creation", "Education & Teaching"],
        "core_skills":    ["Team Leadership", "Budgeting", "Customer Service"],
        "industries":     ["Non-profit", "Education"],
        "goals":          ["Start my own business", "Work in a creative field",
                           "Lead a team one day", "Earn a high salary"],
    },

    "Travel Consultant": {
        "core_interests": ["Logistics", "Consulting", "Entrepreneurship",
                           "E-commerce", "Social Media"],
        "core_skills":    ["Customer Service", "Sales", "Negotiation",
                           "Writing & Copywriting", "Research"],
        "industries":     ["Consulting", "Startups"],
        "goals":          ["Travel while working", "Start my own business",
                           "Freelance and work independently", "Help people through my work"],
    },

    "Retail Manager": {
        "core_interests": ["E-commerce", "Operations", "Business Strategy",
                           "HR & People", "Supply Chain"],
        "core_skills":    ["Team Leadership", "Customer Service", "Budgeting",
                           "Sales", "Negotiation", "Data Analysis"],
        "industries":     ["E-commerce & Retail"],
        "goals":          ["Lead a team one day", "Grow into management",
                           "Earn a high salary", "Become a specialist in my field"],
    },

    # ── Government, Science & Research ────────────────────────────────────

    "Policy Analyst": {
        "core_interests": ["Policy & Government", "Research & Science", "Economics",
                           "Non-profit & Social Impact", "Data Analysis"],
        "core_skills":    ["Research", "Writing & Copywriting", "Statistics",
                           "Data Analysis", "Public Speaking"],
        "industries":     ["Government & Public Sector", "Non-profit",
                           "Consulting", "Research & Academia"],
        "goals":          ["Make a social impact", "Work in research",
                           "Solve real-world problems", "Help people through my work",
                           "Work internationally"],
    },

    "Research Scientist": {
        "core_interests": ["Research & Science", "Biotech", "Data Science",
                           "Healthcare & Medicine", "Pharmaceuticals"],
        "core_skills":    ["Research", "Statistics", "Technical Writing",
                           "Data Analysis", "R", "Python"],
        "industries":     ["Research & Academia", "Pharmaceuticals",
                           "Healthcare", "Government & Public Sector"],
        "goals":          ["Work in research", "Become a specialist in my field",
                           "Solve real-world problems", "Make a social impact"],
    },

    "Urban Planner": {
        "core_interests": ["Architecture", "Policy & Government", "Environment & Sustainability",
                           "Research & Science", "Construction"],
        "core_skills":    ["Research", "Writing & Copywriting", "Statistics",
                           "Public Speaking", "Project Management"],
        "industries":     ["Government & Public Sector", "Consulting",
                           "Construction", "Real Estate"],
        "goals":          ["Make a social impact", "Solve real-world problems",
                           "Become a specialist in my field", "Work internationally"],
    },

    # ── Real Estate & Construction ─────────────────────────────────────────

    "Estate Agent": {
        "core_interests": ["Real Estate", "Entrepreneurship", "Business Strategy",
                           "E-commerce", "Consulting"],
        "core_skills":    ["Sales", "Customer Service", "Negotiation",
                           "Writing & Copywriting", "Research"],
        "industries":     ["Real Estate", "Finance & Banking"],
        "goals":          ["Earn a high salary", "Start my own business",
                           "Lead a team one day", "Work independently"],
    },

    "Quantity Surveyor": {
        "core_interests": ["Construction", "Engineering", "Real Estate",
                           "Project Management", "Finance & Investing"],
        "core_skills":    ["Budgeting", "Negotiation", "Research",
                           "Technical Writing", "Excel / Spreadsheets"],
        "industries":     ["Construction", "Consulting",
                           "Government & Public Sector", "Real Estate"],
        "goals":          ["Earn a high salary", "Become a specialist in my field",
                           "Work at a top company", "Grow into management"],
    },

    "Architect": {
        "core_interests": ["Architecture", "Graphic Design", "Engineering",
                           "Construction", "Environment & Sustainability"],
        "core_skills":    ["3D Modelling", "Technical Writing", "Project Management",
                           "Research", "Illustrator"],
        "industries":     ["Construction", "Real Estate",
                           "Government & Public Sector", "Consulting"],
        "goals":          ["Work in a creative field", "Become a specialist in my field",
                           "Build something people use every day", "Make a social impact"],
    },

    "Construction Manager / Site Manager": {
        "core_interests": ["Construction", "Engineering", "Project Management",
                           "Operations", "Real Estate"],
        "core_skills":    ["Project Management", "Risk Assessment", "Budgeting",
                           "Negotiation", "Team Leadership"],
        "industries":     ["Construction", "Government & Public Sector",
                           "Real Estate", "Energy & Renewables"],
        "goals":          ["Lead a team one day", "Earn a high salary",
                           "Grow into management", "Become a specialist in my field"],
    },

    # ── Agriculture, Environment & Energy ─────────────────────────────────

    "Sustainability Manager": {
        "core_interests": ["Environment & Sustainability", "Energy & Renewables",
                           "Policy & Government", "Research & Science", "Non-profit & Social Impact"],
        "core_skills":    ["Research", "Writing & Copywriting", "Data Analysis",
                           "Project Management", "Public Speaking"],
        "industries":     ["Government & Public Sector", "Consulting",
                           "Energy & Renewables", "Finance & Banking"],
        "goals":          ["Make a social impact", "Solve real-world problems",
                           "Become a specialist in my field", "Work internationally"],
    },

    "Renewable Energy Engineer": {
        "core_interests": ["Energy & Renewables", "Engineering", "Environment & Sustainability",
                           "Research & Science", "Electronics"],
        "core_skills":    ["Engineering", "Statistics", "Technical Writing",
                           "Research", "Risk Assessment", "MATLAB"],
        "industries":     ["Energy & Renewables", "Government & Public Sector",
                           "Consulting", "Manufacturing"],
        "goals":          ["Solve real-world problems", "Make a social impact",
                           "Become a specialist in my field", "Work at a top company"],
    },

    "Agronomist": {
        "core_interests": ["Agriculture & Food Tech", "Environment & Sustainability",
                           "Research & Science", "Data Analysis"],
        "core_skills":    ["Research", "Statistics", "Writing & Copywriting",
                           "Technical Writing", "Data Analysis"],
        "industries":     ["Agriculture", "Government & Public Sector",
                           "Consulting", "Research & Academia"],
        "goals":          ["Solve real-world problems", "Work in research",
                           "Make a social impact", "Become a specialist in my field"],
    },

    # ── Logistics & Transport ──────────────────────────────────────────────

    "Logistics Coordinator": {
        "core_interests": ["Logistics", "Supply Chain", "Operations",
                           "E-commerce", "Business Strategy"],
        "core_skills":    ["Project Management", "Customer Service", "Negotiation",
                           "Data Analysis", "Excel / Spreadsheets"],
        "industries":     ["Logistics & Supply Chain", "E-commerce & Retail",
                           "Manufacturing", "Agriculture"],
        "goals":          ["Earn a high salary", "Grow into management",
                           "Become a specialist in my field", "Solve real-world problems"],
    },

    "Commercial Pilot": {
        "core_interests": ["Logistics", "Engineering", "Research & Science",
                           "Operations"],
        "core_skills":    ["Public Speaking", "Customer Service", "Risk Assessment",
                           "Research", "Statistics"],
        "industries":     ["Logistics & Supply Chain", "Government & Public Sector"],
        "goals":          ["Travel while working", "Earn a high salary",
                           "Become a specialist in my field", "Work internationally"],
    },

    # ── Additional Healthcare ──────────────────────────────────────────────

    "Dentist": {
        "core_interests": ["Healthcare & Medicine", "Research & Science", "Biotech",
                           "Entrepreneurship"],
        "core_skills":    ["Research", "Customer Service", "Statistics",
                           "Technical Writing", "Public Speaking"],
        "industries":     ["Healthcare", "Government & Public Sector", "Research & Academia"],
        "goals":          ["Earn a high salary", "Help people through my work",
                           "Become a specialist in my field", "Start my own business"],
    },

    "Veterinarian": {
        "core_interests": ["Healthcare & Medicine", "Research & Science",
                           "Agriculture & Food Tech", "Biotech"],
        "core_skills":    ["Research", "Customer Service", "Statistics",
                           "Technical Writing", "Public Speaking"],
        "industries":     ["Healthcare", "Agriculture", "Research & Academia"],
        "goals":          ["Help people through my work", "Earn a high salary",
                           "Become a specialist in my field", "Work in research"],
    },

    "Optometrist": {
        "core_interests": ["Healthcare & Medicine", "Research & Science",
                           "Biotech", "Entrepreneurship"],
        "core_skills":    ["Research", "Customer Service", "Statistics",
                           "Technical Writing", "Public Speaking"],
        "industries":     ["Healthcare", "Government & Public Sector"],
        "goals":          ["Help people through my work", "Earn a high salary",
                           "Become a specialist in my field", "Start my own business"],
    },

    "Events Manager": {
        "core_interests": ["Operations", "Marketing", "Project Management",
                           "Consulting", "Entrepreneurship"],
        "core_skills":    ["Project Management", "Negotiation", "Budgeting",
                           "Customer Service", "Public Speaking"],
        "industries":     ["Consulting", "Non-profit", "E-commerce & Retail"],
        "goals":          ["Lead a team one day", "Start my own business",
                           "Work in a creative field", "Earn a high salary"],
    },

    "Tax Advisor": {
        "core_interests": ["Finance & Investing", "Accounting", "Law & Legal Tech",
                           "Business Strategy", "Economics"],
        "core_skills":    ["Accounting", "Financial Modelling", "Excel / Spreadsheets",
                           "Research", "Writing & Copywriting"],
        "industries":     ["Finance & Banking", "Legal & Law", "Consulting"],
        "goals":          ["Earn a high salary", "Become a specialist in my field",
                           "Work at a top company", "Freelance and work independently"],
    },

    "Forensic Scientist": {
        "core_interests": ["Research & Science", "Law & Legal Tech", "Data Analysis",
                           "Cybersecurity", "Policy & Government"],
        "core_skills":    ["Research", "Statistics", "Technical Writing", "Data Analysis"],
        "industries":     ["Government & Public Sector", "Legal & Law", "Healthcare"],
        "goals":          ["Become a specialist in my field", "Work in research",
                           "Solve real-world problems", "Make a social impact"],
    },

    "Occupational Therapist": {
        "core_interests": ["Healthcare & Medicine", "Mental Health", "Education & Teaching",
                           "Non-profit & Social Impact", "Research & Science"],
        "core_skills":    ["Customer Service", "Public Speaking", "Research",
                           "Writing & Copywriting", "Technical Writing"],
        "industries":     ["Healthcare", "Government & Public Sector", "Non-profit"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Grow into management"],
    },

    "Film & TV Director": {
        "core_interests": ["Video Production", "Animation", "Content Creation",
                           "Photography", "Writing & Journalism"],
        "core_skills":    ["Video Editing", "Writing & Copywriting", "Public Speaking",
                           "Research", "After Effects"],
        "industries":     ["Media & Entertainment", "Non-profit"],
        "goals":          ["Work in a creative field", "Create content and grow an audience",
                           "Build something people use every day", "Freelance and work independently"],
    },

    "Fundraising Manager": {
        "core_interests": ["Non-profit & Social Impact", "Marketing", "Writing & Journalism",
                           "Coaching & Mentoring", "Policy & Government"],
        "core_skills":    ["Writing & Copywriting", "Public Speaking", "Research",
                           "Data Analysis", "Customer Service"],
        "industries":     ["Non-profit", "Education", "Healthcare"],
        "goals":          ["Make a social impact", "Help people through my work",
                           "Lead a team one day", "Grow into management"],
    },

    "Marine Biologist": {
        "core_interests": ["Research & Science", "Environment & Sustainability",
                           "Agriculture & Food Tech", "Data Analysis"],
        "core_skills":    ["Research", "Statistics", "Technical Writing",
                           "Data Analysis", "R"],
        "industries":     ["Research & Academia", "Government & Public Sector",
                           "Non-profit"],
        "goals":          ["Work in research", "Make a social impact",
                           "Solve real-world problems", "Travel while working"],
    },

    "Diagnostic Radiographer": {
        "core_interests": ["Healthcare & Medicine", "Research & Science",
                           "Electronics", "Data Analysis"],
        "core_skills":    ["Research", "Statistics", "Technical Writing",
                           "Customer Service", "Data Analysis"],
        "industries":     ["Healthcare", "Government & Public Sector"],
        "goals":          ["Help people through my work", "Become a specialist in my field",
                           "Earn a high salary", "Grow into management"],
    },

    "Sound Engineer": {
        "core_interests": ["Music & Audio", "Video Production", "Electronics",
                           "Content Creation", "Engineering"],
        "core_skills":    ["Music & Audio", "Video Editing", "Writing & Copywriting"],
        "industries":     ["Media & Entertainment"],
        "goals":          ["Work in a creative field", "Freelance and work independently",
                           "Become a specialist in my field", "Work remotely"],
    },

    "Immigration Officer": {
        "core_interests": ["Policy & Government", "Law & Legal Tech",
                           "Non-profit & Social Impact", "Research & Science"],
        "core_skills":    ["Research", "Writing & Copywriting", "Public Speaking",
                           "Negotiation", "Customer Service"],
        "industries":     ["Government & Public Sector", "Legal & Law"],
        "goals":          ["Make a social impact", "Become a specialist in my field",
                           "Help people through my work", "Work internationally"],
    },

    "Sports Scientist": {
        "core_interests": ["Research & Science", "Data Analysis", "Healthcare & Medicine",
                           "Education & Teaching"],
        "core_skills":    ["Research", "Statistics", "Data Analysis",
                           "Public Speaking", "Customer Service"],
        "industries":     ["Healthcare", "Education"],
        "goals":          ["Become a specialist in my field", "Work in research",
                           "Help people through my work", "Solve real-world problems"],
    },

    "Geologist": {
        "core_interests": ["Research & Science", "Environment & Sustainability",
                           "Energy & Renewables", "Data Analysis"],
        "core_skills":    ["Research", "Statistics", "Technical Writing",
                           "Data Analysis", "R"],
        "industries":     ["Energy & Renewables", "Government & Public Sector",
                           "Research & Academia"],
        "goals":          ["Work in research", "Become a specialist in my field",
                           "Solve real-world problems", "Travel while working"],
    },

    "Speech & Language Therapist": {
        "core_interests": ["Healthcare & Medicine", "Mental Health", "Education & Teaching",
                           "Research & Science", "Translation & Languages"],
        "core_skills":    ["Customer Service", "Public Speaking", "Research",
                           "Writing & Copywriting", "Technical Writing"],
        "industries":     ["Healthcare", "Government & Public Sector",
                           "Non-profit", "Education"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Freelance and work independently"],
    },

    "Air Traffic Controller": {
        "core_interests": ["Logistics", "Engineering", "Operations",
                           "Policy & Government"],
        "core_skills":    ["Public Speaking", "Risk Assessment", "Research",
                           "Statistics", "Customer Service"],
        "industries":     ["Government & Public Sector", "Logistics & Supply Chain"],
        "goals":          ["Earn a high salary", "Become a specialist in my field",
                           "Work internationally", "Work at a top company"],
    },

    "Midwife": {
        "core_interests": ["Healthcare & Medicine", "Mental Health", "Non-profit & Social Impact",
                           "Education & Teaching", "Research & Science"],
        "core_skills":    ["Customer Service", "Public Speaking", "Research",
                           "Technical Writing", "Statistics"],
        "industries":     ["Healthcare", "Government & Public Sector", "Non-profit"],
        "goals":          ["Help people through my work", "Make a social impact",
                           "Become a specialist in my field", "Grow into management"],
    },

    "Data Journalist": {
        "core_interests": ["Data Analysis", "Writing & Journalism", "Research & Science",
                           "Data Science", "Social Media"],
        "core_skills":    ["Data Analysis", "Python", "Writing & Copywriting",
                           "Research", "Statistics", "R"],
        "industries":     ["Media & Entertainment", "Government & Public Sector",
                           "Non-profit"],
        "goals":          ["Create content and grow an audience", "Make a social impact",
                           "Become a specialist in my field", "Work remotely"],
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
