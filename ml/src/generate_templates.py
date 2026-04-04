"""
generate_templates.py
=====================
Reads careers-data.ts and auto-generates ROADMAP_TEMPLATES entries
for every career ID that doesn't already have one.

Run from the ml/ directory:
    python src/generate_templates.py

It appends the new templates to roadmap_templates.py (before the closing `}`).
"""

import re
import json
import os
import sys

ML_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(ML_DIR)
CAREERS_FILE = os.path.join(ROOT, "src", "lib", "recommendation", "careers-data.ts")
TEMPLATES_FILE = os.path.join(ML_DIR, "src", "roadmap_templates.py")

# ── 1. Parse existing template keys ───────────────────────────────────────────
sys.path.insert(0, os.path.join(ML_DIR, "src"))
from roadmap_templates import ROADMAP_TEMPLATES
existing_keys = set(ROADMAP_TEMPLATES.keys())
print(f"Existing templates: {len(existing_keys)}")

# ── 2. Parse careers-data.ts ──────────────────────────────────────────────────
with open(CAREERS_FILE) as f:
    raw = f.read()

# Split on top-level career objects by finding `  {` blocks at the array level
# Each career starts with `  {` and ends with `  },`
blocks = re.split(r'\n  \{', raw)

careers = []
for block in blocks[1:]:  # skip preamble
    career = {}

    for key in ["id", "title", "description", "overview", "category"]:
        m = re.search(rf'{key}:\s*"([^"]*)"', block)
        if m:
            career[key] = m.group(1)

    for key in ["required_skills", "tools", "possible_roles"]:
        m = re.search(rf'{key}:\s*\[([^\]]*)\]', block, re.DOTALL)
        if m:
            items = re.findall(r'"([^"]+)"', m.group(1))
            career[key] = items
        else:
            career[key] = []

    if "id" in career and "title" in career:
        careers.append(career)

print(f"Parsed {len(careers)} careers from careers-data.ts")

# Deduplicate by ID (careers-data.ts has duplicates)
seen = set()
unique_careers = []
for c in careers:
    if c["id"] not in seen:
        seen.add(c["id"])
        unique_careers.append(c)
careers = unique_careers

missing = [c for c in careers if c["id"] not in existing_keys]
print(f"Missing templates: {len(missing)}")

# ── 3. Template generator ─────────────────────────────────────────────────────

def q(s):
    """Escape single quotes for Python string."""
    return s.replace("'", "\\'")

def make_template(career: dict) -> str:
    cid   = career["id"]
    title = career["title"]
    desc  = career.get("description", f"Build a career as a {title}.")
    skills = career.get("required_skills", [])
    tools  = career.get("tools", [])
    roles  = career.get("possible_roles", [])
    cat    = career.get("category", "other")

    # Split skills into foundation / advanced buckets
    found_skills = skills[:3] if skills else [title]
    adv_skills   = skills[3:6] if len(skills) > 3 else []
    all_tools    = tools[:4] if tools else []

    entry_role   = roles[0] if roles else f"Junior {title}"
    senior_role  = roles[-1] if len(roles) > 1 else f"Senior {title}"

    # Phase 1 resources — fundamentals courses/books
    p1_resources = []
    for skill in found_skills[:2]:
        p1_resources.append(f'{{"title": "{q(skill)} fundamentals full course", "type": "video"}}')
    if not p1_resources:
        p1_resources.append(f'{{"title": "{q(title)} beginner guide", "type": "video"}}')

    # Phase 2 resources — tools
    p2_resources = []
    for tool in all_tools[:2]:
        p2_resources.append(f'{{"title": "{q(tool)} tutorial for beginners", "type": "video"}}')
    if not p2_resources:
        p2_resources.append(f'{{"title": "{q(title)} tools and software tutorial", "type": "video"}}')

    # Phase 3 resources — advanced
    p3_resources = []
    for skill in (adv_skills or found_skills)[:2]:
        p3_resources.append(f'{{"title": "Advanced {q(skill)} for {q(title)}s", "type": "course"}}')
    if not p3_resources:
        p3_resources.append(f'{{"title": "Advanced {q(title)} techniques and best practices", "type": "course"}}')

    # Phase 4 resources — portfolio / job prep
    p4_resources = [
        f'{{"title": "How to become a {q(title)} — career roadmap", "type": "video"}}',
        f'{{"title": "LinkedIn — {q(title)} job search and networking", "type": "practice"}}',
    ]

    skills_covered_1 = json.dumps(found_skills[:3])
    skills_covered_2 = json.dumps((adv_skills + found_skills)[:3])
    tool_skills      = json.dumps([t.split("/")[0].strip() for t in tools[:3]])

    p1_res = ", ".join(p1_resources)
    p2_res = ", ".join(p2_resources)
    p3_res = ", ".join(p3_resources)
    p4_res = ", ".join(p4_resources)

    return f'''
    # ──────────────────────────────────────────────────────────────────────
    "{cid}": {{
        "career_title": "{q(title)}",
        "phases": [
            {{
                "id": "phase-1", "phase_number": 1,
                "title": "Foundations",
                "description": "Build the essential knowledge base required to work as a {q(title)}.",
                "base_weeks": 4,
                "skills_covered": {skills_covered_1},
                "steps": [
                    {{
                        "id": "p1-s1", "level": "starter_only",
                        "title": "Core theory and fundamentals",
                        "description": "{q(desc)} Start with the foundational concepts that every {q(title)} must understand.",
                        "resources": [{p1_res}],
                    }},
                    {{
                        "id": "p1-s2", "level": "all",
                        "title": "Industry overview and career landscape",
                        "description": "Understand the day-to-day reality of working as a {q(title)}, including typical roles such as {q(entry_role)} and {q(senior_role)}.",
                        "resources": [
                            {{"title": "A day in the life of a {q(title)}", "type": "video"}},
                        ],
                    }},
                ],
            }},
            {{
                "id": "phase-2", "phase_number": 2,
                "title": "Core Tools & Practical Skills",
                "description": "Learn the tools and hands-on skills used in the {q(title)} profession.",
                "base_weeks": 5,
                "skills_covered": {tool_skills},
                "steps": [
                    {{
                        "id": "p2-s1", "level": "all",
                        "title": "Key tools and software",
                        "description": "Get hands-on with the tools used daily: {q(", ".join(tools[:3]) if tools else title)}.",
                        "resources": [{p2_res}],
                    }},
                    {{
                        "id": "p2-s2", "level": "builder_plus",
                        "title": "Practical exercises and mini-projects",
                        "description": "Apply your knowledge through structured exercises. Practical experience is what separates candidates at interview.",
                        "resources": [
                            {{"title": "{q(title)} practical projects for your portfolio", "type": "project"}},
                        ],
                    }},
                ],
            }},
            {{
                "id": "phase-3", "phase_number": 3,
                "title": "Advanced Skills & Specialism",
                "description": "Develop deeper expertise and begin to specialise within the {q(title)} field.",
                "base_weeks": 5,
                "skills_covered": {skills_covered_2},
                "steps": [
                    {{
                        "id": "p3-s1", "level": "all",
                        "title": "Advanced techniques",
                        "description": "Move beyond the basics and tackle more complex, realistic problems faced by mid-level {q(title)}s.",
                        "resources": [{p3_res}],
                    }},
                    {{
                        "id": "p3-s2", "level": "advanced_only",
                        "title": "Specialism and leadership",
                        "description": "Explore specialist areas within the {q(title)} field and develop the strategic thinking needed for senior roles.",
                        "resources": [
                            {{"title": "{q(senior_role)} — how to reach the senior level", "type": "video"}},
                        ],
                    }},
                ],
            }},
            {{
                "id": "phase-4", "phase_number": 4,
                "title": "Portfolio & Job Preparation",
                "description": "Build a portfolio, prepare your applications, and land your first {q(title)} role.",
                "base_weeks": 3,
                "skills_covered": ["Portfolio", "Job Applications", "Interview Preparation"],
                "steps": [
                    {{
                        "id": "p4-s1", "level": "all",
                        "title": "Build a portfolio project",
                        "description": "Create at least one substantial project that demonstrates your {q(title)} skills. This is the single most important thing you can do before applying.",
                        "resources": [
                            {{"title": "{q(title)} portfolio — what to include and how to present it", "type": "video"}},
                            {{"title": "GitHub — Host your project portfolio", "type": "project"}},
                        ],
                    }},
                    {{
                        "id": "p4-s2", "level": "all",
                        "title": "Job search and interview preparation",
                        "description": "Polish your CV, practise common {q(title)} interview questions, and start applying. Networking accounts for over 70% of hires.",
                        "resources": [{p4_res}],
                    }},
                ],
            }},
        ],
    }},'''


# ── 4. Append to roadmap_templates.py ─────────────────────────────────────────
with open(TEMPLATES_FILE) as f:
    content = f.read()

# Find the closing `}` of ROADMAP_TEMPLATES dict
last_brace = content.rfind("\n}")
if last_brace == -1:
    print("ERROR: Could not find closing } in roadmap_templates.py")
    sys.exit(1)

new_entries = ""
for career in missing:
    new_entries += make_template(career)
    print(f"  + {career['id']}")

new_content = content[:last_brace] + new_entries + "\n" + content[last_brace:]

with open(TEMPLATES_FILE, "w") as f:
    f.write(new_content)

print(f"\nDone. Added {len(missing)} new templates to roadmap_templates.py")
