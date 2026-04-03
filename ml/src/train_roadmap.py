"""
PathWise — Roadmap Personalisation Model Training
==================================================
Trains two models on the roadmap profile dataset:
  1. GradientBoostingClassifier  → predicts user_level (starter/builder/advanced)
  2. Ridge Regression            → predicts duration_factor

Both models are saved alongside their preprocessing artefacts.

Run:
    cd ml
    python data/generate_roadmap_data.py   # generate data first
    python src/train_roadmap.py
"""

import os
import sys
import json
import numpy as np
import joblib

from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import Ridge
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, mean_absolute_error
import pandas as pd

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "roadmap_profiles.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

# ─────────────────────────────────────────────
# Load data
# ─────────────────────────────────────────────
print("─" * 60)
print("PathWise — Roadmap Personalisation Model Training")
print("─" * 60)

if not os.path.exists(DATA_PATH):
    print(f"[Error] Dataset not found at {DATA_PATH}")
    print("Run:  python data/generate_roadmap_data.py")
    sys.exit(1)

df = pd.read_csv(DATA_PATH)
print(f"Loaded {len(df)} samples")
print(f"Level distribution:\n{df['user_level'].value_counts().to_string()}\n")

# ─────────────────────────────────────────────
# Features
# ─────────────────────────────────────────────
NUM_FEATURES = ["n_matching_skills", "n_skill_gaps"]
CAT_FEATURES = ["availability", "learning_mode"]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", "passthrough", NUM_FEATURES),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CAT_FEATURES),
    ]
)

X = df[NUM_FEATURES + CAT_FEATURES]
y_level = df["user_level"].values
y_duration = df["duration_factor"].values

# Encode labels
le = LabelEncoder()
y_level_enc = le.fit_transform(y_level)

# ─────────────────────────────────────────────
# Train/test split
# ─────────────────────────────────────────────
X_train, X_test, yl_train, yl_test, yd_train, yd_test = train_test_split(
    X, y_level_enc, y_duration, test_size=0.2, random_state=42, stratify=y_level_enc
)

# ─────────────────────────────────────────────
# 1. Level classifier
# ─────────────────────────────────────────────
level_pipeline = Pipeline([
    ("prep", preprocessor),
    ("clf", GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.08,
        max_depth=3,
        min_samples_leaf=10,
        random_state=42,
    )),
])

level_pipeline.fit(X_train, yl_train)
yl_pred = level_pipeline.predict(X_test)
level_acc = accuracy_score(yl_test, yl_pred)

cv_scores = cross_val_score(level_pipeline, X_train, yl_train, cv=5, scoring="accuracy")
print(f"Level Classifier (GradientBoosting)")
print(f"  CV Accuracy  : {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
print(f"  Test Accuracy: {level_acc:.4f}")
print(f"  Classes      : {list(le.classes_)}\n")

# ─────────────────────────────────────────────
# 2. Duration factor regressor
# ─────────────────────────────────────────────
duration_pipeline = Pipeline([
    ("prep", ColumnTransformer(
        transformers=[
            ("num", "passthrough", NUM_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CAT_FEATURES),
        ]
    )),
    ("reg", Ridge(alpha=1.0)),
])

duration_pipeline.fit(X_train, yd_train)
yd_pred = duration_pipeline.predict(X_test)
duration_mae = mean_absolute_error(yd_test, yd_pred)

cv_mae = -cross_val_score(duration_pipeline, X_train, yd_train, cv=5, scoring="neg_mean_absolute_error")
print(f"Duration Regressor (Ridge)")
print(f"  CV MAE  : {cv_mae.mean():.4f} ± {cv_mae.std():.4f}")
print(f"  Test MAE: {duration_mae:.4f}\n")

# ─────────────────────────────────────────────
# Save models
# ─────────────────────────────────────────────
roadmap_model_path = os.path.join(MODEL_DIR, "roadmap_model.joblib")
roadmap_meta_path  = os.path.join(MODEL_DIR, "roadmap_meta.json")

joblib.dump({
    "level_pipeline":    level_pipeline,
    "duration_pipeline": duration_pipeline,
    "label_encoder":     le,
}, roadmap_model_path)

meta = {
    "level_classes":   list(le.classes_),
    "level_accuracy":  round(level_acc, 4),
    "duration_mae":    round(duration_mae, 4),
    "num_features":    NUM_FEATURES,
    "cat_features":    CAT_FEATURES,
}
with open(roadmap_meta_path, "w") as f:
    json.dump(meta, f, indent=2)

print(f"✓ Roadmap model saved → {roadmap_model_path}")
print(f"✓ Metadata saved      → {roadmap_meta_path}")
print("─" * 60)
