"""
PathWise — Roadmap Personalisation Training Data Generator
===========================================================
Generates a CSV dataset for training the roadmap personalisation model.

The model learns to predict two things given a user's profile:
  1. user_level   — starter | builder | advanced
  2. duration_factor — float multiplier applied to each phase's base_weeks

Ground-truth mapping (deterministic with realistic noise):
  user_level:
    - starter  (0–2 matching skills)
    - builder  (3–5 matching skills)
    - advanced (6+ matching skills)

  duration_factor:
    - full_time  → ~0.70  (learning faster, shorter calendar)
    - part_time  → ~1.00  (baseline)
    - evenings   → ~1.35
    - weekends   → ~1.65
    - limited    → ~2.00

Run:
    python data/generate_roadmap_data.py
"""

import random
import csv
import os

random.seed(99)

AVAILABILITIES = ["full_time", "part_time", "evenings", "weekends", "limited"]
LEARNING_MODES = ["self_paced", "structured", "bootcamp", "university", "mentorship"]

# Base duration factors per availability mode (before noise)
BASE_DURATION = {
    "full_time": 0.70,
    "part_time": 1.00,
    "evenings": 1.35,
    "weekends": 1.65,
    "limited": 2.00,
}


def generate_sample() -> dict:
    """Generate one training sample with realistic noise."""
    n_matching = random.randint(0, 10)
    n_gaps = max(0, random.randint(0, 8) - n_matching // 3)

    availability = random.choice(AVAILABILITIES)
    learning_mode = random.choice(LEARNING_MODES)

    # Determine ground-truth level (with some boundary noise)
    if n_matching <= 2:
        level = "starter"
    elif n_matching <= 5:
        # Small chance of being bumped up/down at boundaries
        if n_matching == 3 and random.random() < 0.15:
            level = "starter"
        elif n_matching == 5 and random.random() < 0.15:
            level = "advanced"
        else:
            level = "builder"
    else:
        if n_matching == 6 and random.random() < 0.15:
            level = "builder"
        else:
            level = "advanced"

    # Duration factor: base + Gaussian noise (±0.10)
    base = BASE_DURATION[availability]
    noise = random.gauss(0, 0.08)
    # Learning mode also affects pace slightly
    mode_adj = {
        "bootcamp": -0.10,
        "full_time": -0.05,
        "structured": -0.03,
        "self_paced": 0.05,
        "university": 0.08,
        "mentorship": 0.0,
    }.get(learning_mode, 0.0)
    duration_factor = round(max(0.5, min(2.5, base + noise + mode_adj)), 3)

    return {
        "n_matching_skills": n_matching,
        "n_skill_gaps": n_gaps,
        "availability": availability,
        "learning_mode": learning_mode,
        "user_level": level,
        "duration_factor": duration_factor,
    }


def generate_dataset(n_samples: int = 2000, output_path: str = None) -> str:
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "roadmap_profiles.csv")

    records = [generate_sample() for _ in range(n_samples)]
    random.shuffle(records)

    fieldnames = [
        "n_matching_skills", "n_skill_gaps", "availability",
        "learning_mode", "user_level", "duration_factor",
    ]
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"Generated {len(records)} roadmap profile samples → {output_path}")
    return output_path


if __name__ == "__main__":
    generate_dataset(n_samples=2000)
