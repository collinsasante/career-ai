FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY data/ ./data/

# Train models at build time so they're baked into the image
RUN mkdir -p models && \
    python data/generate_data.py && \
    python src/train.py && \
    python data/generate_roadmap_data.py && \
    python src/train_roadmap.py

EXPOSE 10000

CMD ["sh", "-c", "uvicorn src.api:app --host 0.0.0.0 --port ${PORT:-10000}"]
