"""
PathWise ML API — FastAPI
==========================
Serves career predictions and roadmap generation from trained scikit-learn models.

Endpoints:
  POST /predict    — top-N career predictions for a student profile
  POST /roadmap    — personalised learning roadmap for a career + profile
  GET  /health     — liveness check

Run (development):
    cd ml
    uvicorn src.api:app --reload --port 8000

Run (production):
    uvicorn src.api:app --host 0.0.0.0 --port 8000 --workers 2
"""

import os
import sys
import json
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

sys.path.insert(0, os.path.dirname(__file__))
from predict import predict_careers
from roadmap_predict import generate_roadmap

# ─────────────────────────────────────────────
# App setup
# ─────────────────────────────────────────────
app = FastAPI(
    title="PathWise Career Recommendation API",
    description="scikit-learn powered career prediction for the PathWise platform",
    version="1.0.0",
)

# Allow requests from the Next.js frontend (adjust origin for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Next.js dev server
        "https://pathwise.app",    # Production (update with real domain)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Request / Response schemas
# ─────────────────────────────────────────────
class StudentProfile(BaseModel):
    interests:           list[str] = Field(default_factory=list, example=["Web Development", "AI"])
    skills:              list[str] = Field(default_factory=list, example=["Python", "SQL"])
    weakAreas:           list[str] = Field(default_factory=list, example=["Public Speaking"])
    workStyle:           str       = Field(default="hybrid", example="hybrid")
    learningMode:        str       = Field(default="self_paced", example="self_paced")
    availabilityPerWeek: str       = Field(default="part_time", example="part_time")
    careerGoals:         list[str] = Field(default_factory=list, example=["Build my own product"])
    industries:          list[str] = Field(default_factory=list, example=["Technology"])

    # Normalise string fields
    @field_validator("workStyle", "learningMode", "availabilityPerWeek", mode="before")
    @classmethod
    def strip_strings(cls, v):
        return v.strip() if isinstance(v, str) else v

    # Parse list fields that arrive as JSON strings (defensive)
    @field_validator("interests", "skills", "weakAreas", "careerGoals", "industries", mode="before")
    @classmethod
    def parse_list(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [x.strip() for x in v.split(",") if x.strip()]
        return v


class CareerPrediction(BaseModel):
    career:    str
    score:     float
    reasoning: list[str]


class PredictResponse(BaseModel):
    top_predictions: list[CareerPrediction]


class HealthResponse(BaseModel):
    status:  str
    model:   str
    version: str


# ── Roadmap endpoint schemas ──────────────────
class RoadmapRequest(BaseModel):
    career_id:        str             = Field(example="software-engineer")
    matching_skills:  list[str]       = Field(default_factory=list)
    skill_gaps:       list[str]       = Field(default_factory=list)
    availability:     str             = Field(default="part_time", example="part_time")
    learning_mode:    str             = Field(default="self_paced", example="self_paced")

    @field_validator("availability", "learning_mode", mode="before")
    @classmethod
    def strip_strings(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("matching_skills", "skill_gaps", mode="before")
    @classmethod
    def parse_list(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [x.strip() for x in v.split(",") if x.strip()]
        return v


# ─────────────────────────────────────────────
# Load model metadata on startup
# ─────────────────────────────────────────────
_model_meta: dict = {}

@app.on_event("startup")
async def startup_event():
    global _model_meta
    meta_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "models", "model_meta.json",
    )
    if os.path.exists(meta_path):
        with open(meta_path) as f:
            _model_meta = json.load(f)
    # Trigger model load at startup (not on first request)
    try:
        from predict import _load
        _load()
        print(f"[PathWise ML] Career model loaded: {_model_meta.get('best_model_name', 'unknown')}")
        print(f"[PathWise ML] Test accuracy: {_model_meta.get('test_accuracy', '?'):.4f}")
    except FileNotFoundError as e:
        print(f"[PathWise ML] WARNING: Career model not found — {e}")

    # Trigger roadmap model load at startup
    try:
        from roadmap_predict import _load as _load_roadmap
        _load_roadmap()
        print("[PathWise ML] Roadmap personalisation model loaded.")
    except FileNotFoundError as e:
        print(f"[PathWise ML] WARNING: Roadmap model not found — {e}")


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["system"])
async def health():
    """Liveness check — also returns model info."""
    return HealthResponse(
        status="ok",
        model=_model_meta.get("best_model_name", "not loaded"),
        version="1.0.0",
    )


@app.post("/predict", response_model=PredictResponse, tags=["prediction"])
async def predict(profile: StudentProfile, top_n: int = 3):
    """
    Predict the top career matches for a student profile.

    - **top_n**: number of career predictions to return (1–10, default 3)

    Returns each career with a confidence score (0–1) and a list of
    plain-English reasons why the model predicted that career.
    """
    if not 1 <= top_n <= 10:
        raise HTTPException(status_code=400, detail="top_n must be between 1 and 10")

    try:
        raw = predict_careers(profile.model_dump(), top_n=top_n)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Model not available. {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )

    predictions = [
        CareerPrediction(career=r["career"], score=r["score"], reasoning=r["reasoning"])
        for r in raw
    ]

    return PredictResponse(top_predictions=predictions)


@app.post("/roadmap", tags=["roadmap"])
async def roadmap(req: RoadmapRequest):
    """
    Generate a personalised learning roadmap for a career.

    The scikit-learn personalisation model predicts the user's level
    (starter / builder / advanced) and a duration multiplier based on
    their matching skills and weekly availability. The result is drawn
    from the career's curated template, with steps filtered and durations
    adjusted to match the individual learner.
    """
    try:
        result = generate_roadmap(
            career_id=req.career_id,
            matching_skills=req.matching_skills,
            skill_gaps=req.skill_gaps,
            availability=req.availability,
            learning_mode=req.learning_mode,
        )
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Roadmap model not available. {e}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Roadmap generation failed: {str(e)}",
        )

    return result
