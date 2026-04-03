"""
Feature preprocessing for PathWise career recommendation model.

Handles three types of input:
  - Categorical (str)  → OneHotEncoder
  - Numeric (int)      → StandardScaler
  - List (list[str])   → MultiLabelBinarizer (multi-hot vector)

Exports:
  - ListFeatureEncoder  — custom sklearn transformer for list columns
  - build_preprocessor  — returns a fitted-ready ColumnTransformer pipeline
  - load_profile_df     — loads and parses the CSV training data
"""

import json
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, MultiLabelBinarizer


# ─────────────────────────────────────────────
# Column groups
# ─────────────────────────────────────────────
LIST_COLS = ["interests", "skills", "weakAreas", "careerGoals", "industries"]
CAT_COLS  = ["workStyle", "learningMode", "availabilityPerWeek"]
NUM_COLS: list[str] = []


# ─────────────────────────────────────────────
# Custom transformer: list columns → multi-hot
# ─────────────────────────────────────────────
class ListFeatureEncoder(BaseEstimator, TransformerMixin):
    """
    Converts DataFrame columns that contain Python lists (or JSON strings)
    into stacked multi-hot (binary) feature vectors using MultiLabelBinarizer.

    One MLB per column; all outputs are hstacked into a single matrix.
    """

    def __init__(self, columns: list[str]):
        self.columns = columns

    def fit(self, X: pd.DataFrame, y=None):
        self.encoders_: dict[str, MultiLabelBinarizer] = {}
        for col in self.columns:
            mlb = MultiLabelBinarizer()
            mlb.fit(X[col].apply(self._to_list))
            self.encoders_[col] = mlb
        return self

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        parts = []
        for col in self.columns:
            encoded = self.encoders_[col].transform(X[col].apply(self._to_list))
            parts.append(encoded)
        return np.hstack(parts)

    def get_feature_names_out(self, input_features=None) -> np.ndarray:
        names = []
        for col in self.columns:
            for cls in self.encoders_[col].classes_:
                names.append(f"{col}__{cls}")
        return np.array(names)

    @staticmethod
    def _to_list(val) -> list:
        if isinstance(val, list):
            return val
        if isinstance(val, str):
            val = val.strip()
            if val.startswith("["):
                try:
                    return json.loads(val)
                except json.JSONDecodeError:
                    pass
            # Fallback: comma-separated
            return [v.strip() for v in val.split(",") if v.strip()]
        return []


# ─────────────────────────────────────────────
# Build the full preprocessor
# ─────────────────────────────────────────────
def build_preprocessor() -> tuple[ColumnTransformer, ListFeatureEncoder]:
    """
    Returns a (column_transformer, list_encoder) pair.

    We cannot embed ListFeatureEncoder directly inside ColumnTransformer because
    ColumnTransformer passes numpy arrays (not DataFrames) to sub-transformers
    for selected columns. We keep them separate and hstack in the pipeline wrapper.

    Usage:
        ct, le = build_preprocessor()
        X_std = ct.fit_transform(df)
        X_list = le.fit_transform(df)
        X = np.hstack([X_std, X_list])
    """
    column_transformer = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CAT_COLS,
            ),
        ],
        remainder="drop",
        verbose_feature_names_out=True,
    )

    list_encoder = ListFeatureEncoder(columns=LIST_COLS)

    return column_transformer, list_encoder


# ─────────────────────────────────────────────
# Utility: load CSV and parse list columns
# ─────────────────────────────────────────────
def load_profile_df(csv_path: str) -> pd.DataFrame:
    """Load the CSV dataset and parse JSON list columns into Python lists."""
    df = pd.read_csv(csv_path)

    for col in LIST_COLS:
        if col in df.columns:
            df[col] = df[col].apply(ListFeatureEncoder._to_list)

    return df


# ─────────────────────────────────────────────
# Convenience: transform a single profile dict
# ─────────────────────────────────────────────
def profile_to_df(profile: dict) -> pd.DataFrame:
    """Convert a single user profile dict to a single-row DataFrame."""
    row = {
        "workStyle":           profile.get("workStyle", "hybrid"),
        "learningMode":        profile.get("learningMode", "self_paced"),
        "availabilityPerWeek": profile.get("availabilityPerWeek", "part_time"),
        "interests":           profile.get("interests", []),
        "skills":              profile.get("skills", []),
        "weakAreas":           profile.get("weakAreas", []),
        "careerGoals":         profile.get("careerGoals", []),
        "industries":          profile.get("industries", []),
    }
    return pd.DataFrame([row])
