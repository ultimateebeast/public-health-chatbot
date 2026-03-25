import os
import pytest
import asyncio
import json
import respx
from httpx import Response

from backend.app import ml_client


@pytest.mark.asyncio
async def test_call_inference_success(monkeypatch):
    endpoint = os.getenv("ML_MODEL_ENDPOINT", "http://test-ml")
    monkeypatch.setenv("ML_MODEL_ENDPOINT", endpoint)

    expected = {
        "response": "Test reply",
        "intent": "test_intent",
        "sentiment": "neutral",
        "risk_level": "low",
        "confidence": 0.95,
        "emergency": False,
        "recommendations": ["See a doctor"]
    }

    with respx.mock(base_url=endpoint) as mock:
        mock.post("/inference").respond(status_code=200, json=expected)

        result = await ml_client.call_inference("hello", user_id=1)
        assert result["response"] == expected["response"]
        assert result["intent"] == expected["intent"]


@pytest.mark.asyncio
async def test_call_symptom_check_success(monkeypatch):
    endpoint = os.getenv("ML_MODEL_ENDPOINT", "http://test-ml")
    monkeypatch.setenv("ML_MODEL_ENDPOINT", endpoint)

    expected = {
        "risk_level": "medium",
        "possible_conditions": ["condition A"],
        "recommendations": ["rest"],
        "emergency_indicators": False
    }

    with respx.mock(base_url=endpoint) as mock:
        mock.post("/symptom-check").respond(status_code=200, json=expected)

        result = await ml_client.call_symptom_check(["cough"], age=30)
        assert result["risk_level"] == expected["risk_level"]
        assert "possible_conditions" in result
