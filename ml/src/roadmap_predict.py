"""
PathWise — Roadmap Prediction & Personalisation
================================================
Loads the trained roadmap personalisation model and applies it to
generate a personalised roadmap for a given career + user profile.

Usage:
    from roadmap_predict import generate_roadmap
    roadmap = generate_roadmap("software-engineer", matching_skills, skill_gaps, "part_time", "self_paced")
"""

import os
import sys
import copy
import math
import joblib
import pandas as pd

sys.path.insert(0, os.path.dirname(__file__))
from roadmap_templates import ROADMAP_TEMPLATES

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Lazy-loaded artefacts
_artefacts = None


def _load():
    global _artefacts
    path = os.path.join(MODEL_DIR, "roadmap_model.joblib")
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Roadmap model not found at {path}. Run: python src/train_roadmap.py"
        )
    _artefacts = joblib.load(path)


def _ensure_loaded():
    if _artefacts is None:
        _load()


# ─────────────────────────────────────────────
# Level → step filter mapping
# ─────────────────────────────────────────────
# Which step 'level' tags are visible at each user level:
STEP_VISIBILITY = {
    "starter":  {"all", "starter_only"},
    "builder":  {"all", "builder_plus"},
    "advanced": {"all", "builder_plus", "advanced_only"},
}


def _filter_steps(steps: list, user_level: str) -> list:
    """Remove steps that don't apply to this user's level."""
    visible = STEP_VISIBILITY.get(user_level, {"all", "starter_only"})
    return [s for s in steps if s.get("level", "all") in visible]


def generate_roadmap(
    career_id: str,
    matching_skills: list[str],
    skill_gaps: list[str],
    availability: str = "part_time",
    learning_mode: str = "self_paced",
) -> dict:
    """
    Generate a personalised roadmap using the ML personalisation model
    and the career's template.

    Returns a dict matching the PersonalizedRoadmap TypeScript interface.
    """
    _ensure_loaded()

    template = ROADMAP_TEMPLATES.get(career_id)
    if template is None:
        # Fallback: return a minimal generic roadmap
        return _generic_fallback(career_id, matching_skills, skill_gaps)

    # ── 1. Predict user level and duration factor ──────────────
    level_pipeline    = _artefacts["level_pipeline"]
    duration_pipeline = _artefacts["duration_pipeline"]
    le                = _artefacts["label_encoder"]

    # Clamp availability and learning_mode to known values
    valid_avail  = {"full_time", "part_time", "evenings", "weekends", "limited"}
    valid_modes  = {"self_paced", "structured", "bootcamp", "university", "mentorship"}
    safe_avail   = availability   if availability   in valid_avail  else "part_time"
    safe_mode    = learning_mode  if learning_mode  in valid_modes  else "self_paced"

    n_matching = len(matching_skills)
    n_gaps     = len(skill_gaps)

    sample = pd.DataFrame([{
        "n_matching_skills": n_matching,
        "n_skill_gaps":      n_gaps,
        "availability":      safe_avail,
        "learning_mode":     safe_mode,
    }])

    level_enc      = level_pipeline.predict(sample)[0]
    user_level     = le.inverse_transform([level_enc])[0]
    duration_factor = float(duration_pipeline.predict(sample)[0])
    duration_factor = round(max(0.5, min(2.5, duration_factor)), 2)

    # ── 2. Build personalised phases ──────────────────────────
    phases = []
    total_weeks = 0

    for tmpl_phase in template["phases"]:
        phase = copy.deepcopy(tmpl_phase)

        # Adjust duration
        raw_weeks = tmpl_phase["base_weeks"] * duration_factor
        phase["duration_weeks"] = max(1, math.ceil(raw_weeks))
        total_weeks += phase["duration_weeks"]

        # Filter steps by user level
        phase["steps"] = _filter_steps(tmpl_phase["steps"], user_level)

        # Remove internal metadata fields before returning
        phase.pop("base_weeks", None)

        # Ensure every step has clean resource objects
        for step in phase["steps"]:
            step.pop("level", None)  # don't expose internal tag to client

        phases.append(phase)

    from datetime import datetime, timezone

    return {
        "careerId":    career_id,
        "careerTitle": template["career_title"],
        "totalWeeks":  total_weeks,
        "userLevel":   user_level,
        "phases":      phases,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }


# ─────────────────────────────────────────────
# Fallback for unrecognised career IDs
# ─────────────────────────────────────────────
def _generic_fallback(
    career_id: str,
    matching_skills: list[str],
    skill_gaps: list[str],
) -> dict:
    from datetime import datetime, timezone

    phases = [
        {
            "id": "phase-1", "phase_number": 1,
            "title": "Foundations",
            "description": "Build the core knowledge and skills for this career path.",
            "duration_weeks": 4,
            "skills_covered": skill_gaps[:3] if skill_gaps else [],
            "steps": [
                {
                    "id": "p1-s1",
                    "title": "Research the core curriculum",
                    "description": "Identify the top online courses, books, and communities for this career.",
                    "resources": [{"title": "Coursera — search your career title", "type": "course"}],
                }
            ],
        },
        {
            "id": "phase-2", "phase_number": 2,
            "title": "Core Skills",
            "description": "Develop the key competencies required for entry-level work.",
            "duration_weeks": 6,
            "skills_covered": skill_gaps[3:6] if len(skill_gaps) > 3 else [],
            "steps": [
                {
                    "id": "p2-s1",
                    "title": "Build practical projects",
                    "description": "Apply your skills in real projects. Portfolio work matters more than certificates.",
                    "resources": [{"title": "GitHub — Host your project portfolio", "type": "project"}],
                }
            ],
        },
        {
            "id": "phase-3", "phase_number": 3,
            "title": "Advanced Practice",
            "description": "Deepen your skills and work on more complex, realistic challenges.",
            "duration_weeks": 5,
            "skills_covered": [],
            "steps": [
                {
                    "id": "p3-s1",
                    "title": "Contribute to community / open source",
                    "description": "Join communities, share your work, and get feedback from practitioners.",
                    "resources": [{"title": "LinkedIn — Connect with professionals in this field", "type": "practice"}],
                }
            ],
        },
        {
            "id": "phase-4", "phase_number": 4,
            "title": "Portfolio & Job Preparation",
            "description": "Prepare your portfolio and job applications.",
            "duration_weeks": 3,
            "skills_covered": [],
            "steps": [
                {
                    "id": "p4-s1",
                    "title": "Apply and network",
                    "description": "Polish your CV, apply to roles, and reach out to people already in this career.",
                    "resources": [{"title": "LinkedIn Jobs", "type": "practice"}],
                }
            ],
        },
    ]

    return {
        "careerId":    career_id,
        "careerTitle": career_id.replace("-", " ").title(),
        "totalWeeks":  18,
        "userLevel":   "starter",
        "phases":      phases,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
    }


# ─────────────────────────────────────────────
# CLI smoke test
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import json

    roadmap = generate_roadmap(
        career_id="software-engineer",
        matching_skills=["JavaScript", "HTML/CSS", "Git"],
        skill_gaps=["TypeScript", "React", "Node.js", "SQL", "Docker"],
        availability="part_time",
        learning_mode="self_paced",
    )

    print(f"\nCareer   : {roadmap['careerTitle']}")
    print(f"Level    : {roadmap['userLevel']}")
    print(f"Duration : {roadmap['totalWeeks']} weeks")
    print(f"Phases   : {len(roadmap['phases'])}")
    for p in roadmap["phases"]:
        print(f"  Phase {p['phase_number']}: {p['title']} ({p['duration_weeks']}w, {len(p['steps'])} steps)")
