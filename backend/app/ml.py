from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
import os
import httpx
from typing import Optional, Dict, Any
from .users import get_current_user

router = APIRouter(prefix="/ml", tags=["ML"])

ML_MODEL_ENDPOINT = os.getenv("ML_MODEL_ENDPOINT", "http://localhost:8001")
ML_MODEL_TIMEOUT = int(os.getenv("ML_MODEL_TIMEOUT", "30"))

class InferenceRequest(BaseModel):
    message: str
    user_id: int
    language: Optional[str] = "en"
    context: Optional[Dict[str, Any]] = None

class SymptomCheckRequest(BaseModel):
    symptoms: list[str]
    age: Optional[int] = None
    gender: Optional[str] = None

@router.post("/inference")
async def ml_inference(request: InferenceRequest):
    """Proxy to external ML model inference service."""
    url = f"{ML_MODEL_ENDPOINT}/inference"
    payload = request.dict()
    try:
        async with httpx.AsyncClient(timeout=ML_MODEL_TIMEOUT) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

@router.post("/symptom-check")
async def symptom_check(request: SymptomCheckRequest):
    """Proxy symptom check to model service."""
    url = f"{ML_MODEL_ENDPOINT}/symptom-check"
    try:
        async with httpx.AsyncClient(timeout=ML_MODEL_TIMEOUT) as client:
            resp = await client.post(url, json=request.dict())
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

@router.post("/intent-recognize")
async def intent_recognize(request: InferenceRequest):
    url = f"{ML_MODEL_ENDPOINT}/intent"
    try:
        async with httpx.AsyncClient(timeout=ML_MODEL_TIMEOUT) as client:
            resp = await client.post(url, json=request.dict())
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))

@router.post("/sentiment")
async def sentiment_analyze(request: InferenceRequest):
    url = f"{ML_MODEL_ENDPOINT}/sentiment"
    try:
        async with httpx.AsyncClient(timeout=ML_MODEL_TIMEOUT) as client:
            resp = await client.post(url, json=request.dict())
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=exc.response.text)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
