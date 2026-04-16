from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import ChatHistory
from .schemas import (
    ChatHistoryCreate,
    ChatHistoryResponse,
    ChatMessageRequest,
    ChatMessageResponse,
)
from datetime import datetime
import logging
import json
from .ml_client import call_inference
from .auth import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])


# ================= DB =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= CREATE CHAT =================
@router.post("/create", response_model=ChatHistoryResponse)
def create_chat(request: ChatHistoryCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    chat = ChatHistory(
        user_id=current_user.id,  # replace later with auth
        title=request.title or "New Chat",
        messages=[],
        total_messages=0,
        updated_at=datetime.utcnow(),  # ✅ FIX
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


# ================= SEND MESSAGE =================
@router.post("/{chat_id}/message", response_model=ChatMessageResponse)
async def send_message(chat_id: int, request: ChatMessageRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    chat = db.query(ChatHistory).filter(ChatHistory.id == chat_id, ChatHistory.user_id == current_user.id).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # ================= USER MESSAGE =================
    user_msg = {
        "sender": "user",
        "content": request.message,
        "timestamp": datetime.utcnow().isoformat(),  # ✅ FIX
        "intent": None,
        "sentiment": None,
        "emergency_flag": False,
    }

    chat.messages = (chat.messages or []) + [user_msg]

    # ================= ML =================
    try:
        ml_result = await call_inference(
            request.message,
            user_id=current_user.id,
            language=request.language,
        )

        if not ml_result or "top_3_predictions" not in ml_result:
            raise ValueError("Invalid ML response")

        preds = ml_result["top_3_predictions"]
        top = preds[0]

        confidence = float(top.get("confidence", 0))

        # ================= RISK =================
        if confidence > 80:
            risk_level = "high"
        elif confidence > 50:
            risk_level = "medium"
        else:
            risk_level = "low"

        # ================= EMERGENCY =================
        emergency_keywords = ["chest pain", "breathing", "unconscious", "severe"]
        emergency = any(k in request.message.lower() for k in emergency_keywords)

        # ================= AI DATA =================
        ai_data = {
            "reply": f"🦠 {top['disease'].upper()}\n📊 Confidence: {confidence:.2f}%",
            "disease": top["disease"],
            "confidence": confidence,
            "other_predictions": preds[1:],  # ✅ important
            "intent": "disease_prediction",
            "sentiment": "neutral",
            "risk_level": risk_level,
            "emergency": emergency,
            "recommendations": [
                "Consult a doctor if symptoms persist",
                "Stay hydrated",
            ],
        }

    except Exception:
        logging.exception("ML ERROR")

        ai_data = {
            "reply": "⚠️ AI service temporarily unavailable",
            "disease": "unknown",
            "confidence": 0.0,
            "other_predictions": [],
            "intent": "fallback",
            "sentiment": "neutral",
            "risk_level": "low",
            "emergency": False,
            "recommendations": ["Please try again later"],
        }

    # ================= AI MESSAGE =================
    ai_msg = {
        "sender": "ai",
        "content": json.dumps(ai_data),  # stored as string
        "timestamp": datetime.utcnow().isoformat(),  # ✅ FIX
        "intent": ai_data["intent"],
        "sentiment": ai_data["sentiment"],
        "emergency_flag": ai_data["emergency"],
    }

    chat.messages = chat.messages + [ai_msg]

    # ================= META =================
    chat.total_messages += 2
    chat.updated_at = datetime.utcnow()  # ✅ FIX

    db.commit()
    db.refresh(chat)

    # ================= RESPONSE =================
    return ChatMessageResponse(
        reply=ai_data["reply"],
        intent=ai_data["intent"],
        sentiment=ai_data["sentiment"],
        risk_level=ai_data["risk_level"],
        emergency=ai_data["emergency"],
        confidence=ai_data["confidence"],
        recommendations=ai_data["recommendations"],
        other_predictions=ai_data["other_predictions"],  # ✅ FIX
    )
    
    