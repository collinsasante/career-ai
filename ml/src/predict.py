"""
PathWise Career Prediction
===========================
Loads the trained model and preprocessors, and exposes:

  predict_careers(profile, top_n=3)
    → list of {"career": str, "score": float, "reasoning": list[str]}

  explain_prediction(career, profile, feature_names, importances)
    → list[str] — human-readable reasons based on feature importance

Usage:
    from predict import predict_careers
    results = predict_careers({"program": "Computer Science", "skills": ["Python"], ...})
"""

import os
import sys
import json
import numpy as np
import joblib

sys.path.insert(0, os.path.dirname(__file__))
from preprocess import profile_to_df, LIST_COLS

# ─────────────────────────────────────────────
# Load artefacts (once at import time)
# ─────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

_model    = None
_ct       = None
_le_feat  = None
_le_label = None
_meta     = None


def _load():
    global _model, _ct, _le_feat, _le_label, _meta

    model_path = os.path.join(MODEL_DIR, "career_model.joblib")
    prep_path  = os.path.join(MODEL_DIR, "preprocessor.joblib")
    meta_path  = os.path.join(MODEL_DIR, "model_meta.json")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found at {model_path}. Run: python src/train.py"
        )

    _model = joblib.load(model_path)
    prep   = joblib.load(prep_path)
    _ct        = prep["ct"]
    _le_feat   = prep["le_feat"]
    _le_label  = prep["le_label"]

    with open(meta_path) as f:
        _meta = json.load(f)


def _ensure_loaded():
    if _model is None:
        _load()


# ─────────────────────────────────────────────
# Feature names helper
# ─────────────────────────────────────────────
def _get_feature_names() -> list[str]:
    std_names  = list(_ct.get_feature_names_out())
    list_names = list(_le_feat.get_feature_names_out())
    return std_names + list_names


# ─────────────────────────────────────────────
# Explain prediction via feature importance
# ─────────────────────────────────────────────
def _explain_prediction(
    career: str,
    feature_vec: np.ndarray,
    feature_names: list[str],
    top_k: int = 4,
) -> list[str]:
    """
    Generate human-readable reasoning for why a career was predicted.

    For tree-based models (RandomForest, HistGradientBoosting) we use
    feature importances to identify which active features contributed most.

    For linear models (LogisticRegression) we use the class coefficients.

    Returns a list of plain-English reason strings.
    """
    reasons = []

    try:
        if hasattr(_model, "feature_importances_"):
            # Tree-based: global importance × active feature
            importances = _model.feature_importances_
            # Only consider active (non-zero) features in this profile
            active_mask = feature_vec > 0
            scores = importances * active_mask
            top_idx = np.argsort(scores)[::-1][:top_k]
            for idx in top_idx:
                if scores[idx] < 1e-6:
                    break
                fname = feature_names[idx]
                col, val = fname.split("__", 1) if "__" in fname else ("", fname)
                reasons.append(_format_reason(col, val))

        elif hasattr(_model, "coef_"):
            # Linear: use class-specific coefficients
            class_idx = list(_le_label.classes_).index(career)
            coefs = _model.coef_[class_idx]
            active_mask = feature_vec > 0
            scores = coefs * active_mask
            top_idx = np.argsort(scores)[::-1][:top_k]
            for idx in top_idx:
                if scores[idx] <= 0:
                    break
                fname = feature_names[idx]
                col, val = fname.split("__", 1) if "__" in fname else ("", fname)
                reasons.append(_format_reason(col, val))
    except Exception:
        pass  # Explanation is best-effort — never block prediction

    return reasons or ["Strong overall profile match for this career."]


def _format_reason(col: str, val: str) -> str:
    """Turn a feature column+value into a human sentence."""
    col = col.replace("cat__", "").replace("num__", "")
    val = val.strip()
    mapping = {
        "skills":           f"You have the skill: {val}",
        "interests":        f"Your interest in {val} aligns with this career",
        "favoriteSubjects": f"Your subject background in {val} is relevant",
        "careerGoals":      f"Your goal to {val} fits this path",
        "industries":       f"Your preferred industry ({val}) matches this career",
        "program":          f"Your program ({val}) is a common pathway here",
        "academicLevel":    f"Your academic level ({val}) suits this role",
        "workStyle":        f"Your work style ({val}) is a good cultural fit",
        "weakAreas":        f"This career works around your weaker area in {val}",
        "availabilityPerWeek": "Your available hours per week support this path",
    }
    for key, sentence in mapping.items():
        if key in col:
            return sentence
    return f"{col}: {val} is a positive signal"


# ─────────────────────────────────────────────
# Main prediction function
# ─────────────────────────────────────────────
def predict_careers(profile: dict, top_n: int = 3) -> list[dict]:
    """
    Predict top career recommendations for a student profile.

    Args:
        profile: dict matching the student profile schema
        top_n:   number of top careers to return (default 3)

    Returns:
        list of dicts:
            {
                "career":    str,        # career title
                "score":     float,      # confidence 0–1
                "reasoning": list[str],  # plain-English reasons
            }
        Sorted by score descending.
    """
    _ensure_loaded()

    df = profile_to_df(profile)

    # Transform: standard features + list features
    X_std  = _ct.transform(df)
    X_list = _le_feat.transform(df)
    X      = np.hstack([X_std, X_list])

    # Probabilities across all classes
    proba = _model.predict_proba(X)[0]  # shape: (n_classes,)

    # Sort by probability descending
    top_idx = np.argsort(proba)[::-1][:top_n]

    feature_names = _get_feature_names()
    feature_vec   = X[0]

    results = []
    for idx in top_idx:
        career = _le_label.classes_[idx]
        score  = float(round(proba[idx], 4))
        reasoning = _explain_prediction(career, feature_vec, feature_names)
        results.append({
            "career":    career,
            "score":     score,
            "reasoning": reasoning,
        })

    return results


# ─────────────────────────────────────────────
# CLI smoke test
# ─────────────────────────────────────────────
if __name__ == "__main__":
    sample_profile = {
        "program":             "Computer Science",
        "academicLevel":       "undergraduate",
        "interests":           ["programming", "machine learning", "problem-solving"],
        "skills":              ["Python", "TensorFlow", "SQL", "algorithms"],
        "weakAreas":           ["public speaking", "marketing"],
        "workStyle":           "analytical",
        "learningMode":        "hands-on",
        "availabilityPerWeek": 30,
        "careerGoals":         ["build ML systems at scale", "do AI research"],
        "industries":          ["technology", "research"],
        "favoriteSubjects":    ["Machine Learning", "Mathematics", "Statistics"],
    }

    predictions = predict_careers(sample_profile, top_n=5)

    print("\nTop Career Predictions")
    print("─" * 50)
    for i, p in enumerate(predictions, 1):
        print(f"\n{i}. {p['career']} — {p['score'] * 100:.1f}% match")
        for reason in p["reasoning"]:
            print(f"   • {reason}")
