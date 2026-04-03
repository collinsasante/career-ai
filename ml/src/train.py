"""
PathWise ML Training Pipeline
==============================
Trains three classifiers on the synthetic student-profile dataset,
evaluates each with cross-validation and a held-out test set,
and saves the best model to models/career_model.joblib.

Run:
    cd ml
    python src/train.py

Output:
    models/career_model.joblib
    models/preprocessor.joblib
"""

import os
import sys
import json
import numpy as np
import joblib

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    top_k_accuracy_score,
)
from sklearn.pipeline import Pipeline

# Allow running from project root or from ml/
sys.path.insert(0, os.path.dirname(__file__))
from preprocess import build_preprocessor, load_profile_df, LIST_COLS, CAT_COLS, NUM_COLS

# ─────────────────────────────────────────────
# Paths
# ─────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH  = os.path.join(BASE_DIR, "data", "student_profiles.csv")
MODEL_DIR  = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)


# ─────────────────────────────────────────────
# Feature matrix builder
# ─────────────────────────────────────────────
def build_feature_matrix(df, ct, le, fit: bool = False) -> np.ndarray:
    """
    Transform DataFrame → numpy feature matrix by combining:
      - ColumnTransformer output (OHE + scaler)
      - ListFeatureEncoder output (multi-hot vectors)
    """
    if fit:
        X_std  = ct.fit_transform(df)
        X_list = le.fit_transform(df)
    else:
        X_std  = ct.transform(df)
        X_list = le.transform(df)
    return np.hstack([X_std, X_list])


def get_feature_names(ct, le) -> list[str]:
    std_names  = list(ct.get_feature_names_out())
    list_names = list(le.get_feature_names_out())
    return std_names + list_names


# ─────────────────────────────────────────────
# Load data
# ─────────────────────────────────────────────
print("─" * 60)
print("PathWise Career Recommendation — ML Training")
print("─" * 60)

if not os.path.exists(DATA_PATH):
    print(f"[Error] Dataset not found at {DATA_PATH}")
    print("Run:  python data/generate_data.py")
    sys.exit(1)

df = load_profile_df(DATA_PATH)
print(f"Loaded {len(df)} samples, {df['targetCareer'].nunique()} career classes")
print(f"Classes: {sorted(df['targetCareer'].unique())}\n")

# Labels
y = df["targetCareer"].values
# 1-D encoded labels for top-k metric
from sklearn.preprocessing import LabelEncoder
le_label = LabelEncoder()
y_enc = le_label.fit_transform(y)

# ─────────────────────────────────────────────
# Preprocessors
# ─────────────────────────────────────────────
ct, le_feat = build_preprocessor()

# ─────────────────────────────────────────────
# Train/test split
# ─────────────────────────────────────────────
X_df_train, X_df_test, y_train, y_test, y_enc_train, y_enc_test = train_test_split(
    df, y, y_enc, test_size=0.2, random_state=42, stratify=y
)

# Fit preprocessors on train, transform both
X_train = build_feature_matrix(X_df_train, ct, le_feat, fit=True)
X_test  = build_feature_matrix(X_df_test, ct, le_feat, fit=False)

n_features = X_train.shape[1]
n_classes  = len(le_label.classes_)
print(f"Feature matrix: {X_train.shape[0]} train | {X_test.shape[0]} test | {n_features} features\n")


# ─────────────────────────────────────────────
# Define models
# ─────────────────────────────────────────────
MODELS = {
    "Logistic Regression": LogisticRegression(
        max_iter=2000,
        C=0.3,          # stronger regularisation to reduce overfitting on synthetic data
        solver="lbfgs",
        random_state=42,
        n_jobs=-1,
    ),
    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=20,           # cap depth to prevent memorising training samples
        min_samples_leaf=4,     # require more evidence per leaf
        max_features="sqrt",
        random_state=42,
        n_jobs=-1,
    ),
    "HistGradientBoosting": HistGradientBoostingClassifier(
        max_iter=300,
        learning_rate=0.05,
        max_depth=5,
        min_samples_leaf=10,    # prevents tiny over-specific leaves
        l2_regularization=1.0,  # L2 shrinkage
        random_state=42,
    ),
}


# ─────────────────────────────────────────────
# Cross-validation + held-out evaluation
# ─────────────────────────────────────────────
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
results = {}

for name, model in MODELS.items():
    print(f"{'─' * 50}")
    print(f"Model: {name}")

    # 5-fold cross-validation on training set
    cv_scores = cross_validate(
        model, X_train, y_train,
        cv=cv,
        scoring=["accuracy", "f1_weighted", "precision_weighted", "recall_weighted"],
        n_jobs=-1,
    )

    cv_acc = cv_scores["test_accuracy"].mean()
    cv_f1  = cv_scores["test_f1_weighted"].mean()
    print(f"  CV Accuracy  : {cv_acc:.4f} ± {cv_scores['test_accuracy'].std():.4f}")
    print(f"  CV F1        : {cv_f1:.4f}")

    # Fit on full train, evaluate on held-out test
    model.fit(X_train, y_train)
    y_pred      = model.predict(X_test)
    y_proba     = model.predict_proba(X_test)
    y_enc_pred  = le_label.transform(y_pred)

    test_acc    = accuracy_score(y_test, y_pred)
    top3_acc    = top_k_accuracy_score(y_enc_test, y_proba, k=3, labels=np.arange(n_classes))

    print(f"\n  Test Accuracy : {test_acc:.4f}")
    print(f"  Top-3 Accuracy: {top3_acc:.4f}")
    print(f"\n  Classification Report (Test):")
    print(classification_report(y_test, y_pred, zero_division=0))

    results[name] = {
        "model":    model,
        "cv_acc":   cv_acc,
        "cv_f1":    cv_f1,
        "test_acc": test_acc,
        "top3_acc": top3_acc,
    }


# ─────────────────────────────────────────────
# Model selection
# ─────────────────────────────────────────────
print("─" * 60)
print("Model Comparison Summary")
print(f"{'Model':<30} {'CV Acc':>8} {'Test Acc':>10} {'Top-3 Acc':>12}")
print("─" * 60)

for name, r in results.items():
    print(f"{name:<30} {r['cv_acc']:>8.4f} {r['test_acc']:>10.4f} {r['top3_acc']:>12.4f}")

# Select model with highest combined score (weighted test_acc + top3_acc)
best_name = max(results, key=lambda n: 0.5 * results[n]["test_acc"] + 0.5 * results[n]["top3_acc"])
best_model = results[best_name]["model"]

print(f"\n✓ Best model selected: {best_name}")
print(f"  Reasoning: highest combined test accuracy + top-3 accuracy")


# ─────────────────────────────────────────────
# Feature importance (Random Forest only)
# ─────────────────────────────────────────────
if "Random Forest" in results:
    rf_model = results["Random Forest"]["model"]
    feature_names = get_feature_names(ct, le_feat)
    importances = rf_model.feature_importances_

    top_n = 15
    top_idx = np.argsort(importances)[::-1][:top_n]
    print(f"\nTop {top_n} most important features (Random Forest):")
    for rank, idx in enumerate(top_idx, 1):
        print(f"  {rank:2}. {feature_names[idx]:<45} {importances[idx]:.4f}")


# ─────────────────────────────────────────────
# Save
# ─────────────────────────────────────────────
model_path = os.path.join(MODEL_DIR, "career_model.joblib")
prep_path  = os.path.join(MODEL_DIR, "preprocessor.joblib")
meta_path  = os.path.join(MODEL_DIR, "model_meta.json")

joblib.dump(best_model, model_path)
joblib.dump({"ct": ct, "le_feat": le_feat, "le_label": le_label}, prep_path)

# Save metadata
meta = {
    "best_model_name": best_name,
    "test_accuracy":   results[best_name]["test_acc"],
    "top3_accuracy":   results[best_name]["top3_acc"],
    "cv_accuracy":     results[best_name]["cv_acc"],
    "n_classes":       n_classes,
    "classes":         list(le_label.classes_),
    "n_features":      n_features,
}
with open(meta_path, "w") as f:
    json.dump(meta, f, indent=2)

print(f"\n✓ Model saved    → {model_path}")
print(f"✓ Preprocessors  → {prep_path}")
print(f"✓ Metadata       → {meta_path}")
print("─" * 60)
