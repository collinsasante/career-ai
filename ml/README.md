# PathWise ML Pipeline

scikit-learn career recommendation model + FastAPI backend.

## Setup

```bash
cd ml
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run (in order)

```bash
# 1. Generate synthetic training data
python data/generate_data.py

# 2. Train + evaluate all models, save best
python src/train.py

# 3. Smoke test the prediction function
python src/predict.py

# 4. Start the API server
uvicorn src.api:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

## Integration with Next.js

Call from your Next.js API route or server action:

```typescript
const res = await fetch("http://localhost:8000/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(studentProfile),
});
const { top_predictions } = await res.json();
// top_predictions: [{ career, score, reasoning }]
```
