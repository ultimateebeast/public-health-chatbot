Phase 3 — Local dev DB & Storage

This scaffolds a local development stack using Postgres and MinIO.

Run locally:

```bash
docker compose up -d
# Wait for Postgres and MinIO to be healthy

# Set env (example):
export DATABASE_URL=postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/ph_chatbot
export S3_ENDPOINT=http://127.0.0.1:9000
export S3_ACCESS_KEY=minioadmin
export S3_SECRET_KEY=minioadmin
export S3_BUCKET=ph-chatbot

# Initialize alembic (generate migration)
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

If you are on Windows PowerShell, use `$env:VARIABLE = 'value'` to set env vars.
