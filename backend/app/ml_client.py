import os
import httpx
from typing import Optional, Dict, Any

ML_MODEL_ENDPOINT = os.getenv("ML_MODEL_ENDPOINT", "http://localhost:8001")


async def call_inference(message: str, user_id: int, language: str = "en", context: Optional[Dict[str, Any]] = None, timeout: int = 10) -> Dict[str, Any]:
    url = f"{ML_MODEL_ENDPOINT.rstrip('/')}/inference"
    payload = {
        "message": message,
        "user_id": user_id,
        "language": language,
        "context": context or {}
    }
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        return resp.json()


async def call_symptom_check(symptoms: list[str], age: Optional[int] = None, gender: Optional[str] = None, timeout: int = 20) -> Dict[str, Any]:
    url = f"{ML_MODEL_ENDPOINT.rstrip('/')}/symptom-check"
    payload = {
        "symptoms": symptoms,
        "age": age,
        "gender": gender
    }
    async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        return resp.json()
