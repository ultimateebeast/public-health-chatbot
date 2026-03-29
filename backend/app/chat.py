from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import ChatHistory
from .schemas import (
    ChatHistoryCreate,
    ChatHistoryResponse,
    ChatMessageRequest,
    ChatMessageResponse,
    ChatMessage,
)
from datetime import datetime
import logging
from .ml_client import call_inference

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
def create_chat(
    request: ChatHistoryCreate,
    db: Session = Depends(get_db),   # ✅ IMPORTANT POSITION
):
    chat = ChatHistory(
        user_id=1,
        title=request.title or "New Chat",
        messages=[],
        total_messages=0,
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return chat


# ================= SEND MESSAGE =================
@router.post("/{chat_id}/message", response_model=ChatMessageResponse)
async def send_message(
    chat_id: int,
    request: ChatMessageRequest,
    db: Session = Depends(get_db),   # ✅ FIXED
):
    chat = db.query(ChatHistory).filter(ChatHistory.id == chat_id).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # USER MESSAGE
    user_msg = ChatMessage(
        sender="user",
        content=request.message,
        timestamp=datetime.utcnow(),
        intent=None,
        sentiment=None,
    )

    if chat.messages is None:
        chat.messages = []

    chat.messages.append(user_msg.dict())

    # ================= ML =================
    try:
        ml_result = await call_inference(
            request.message,
            user_id=1,
            language=request.language,
        )

        if ml_result and "top_3_predictions" in ml_result:
            preds = ml_result["top_3_predictions"]
            top = preds[0]

            reply = f"🦠 Most Likely Disease: {top['disease']}\n"
            reply += f"📊 Confidence: {top['confidence']}%\n\n"
            reply += "🔍 Other Possibilities:\n"

            for p in preds[1:]:
                reply += f"- {p['disease']} ({p['confidence']}%)\n"

            ai_data = {
                "reply": reply,
                "intent": "disease_prediction",
                "sentiment": "neutral",
                "risk_level": "medium",
                "emergency": False,
                "recommendations": ["Consult a doctor"],
            }

        else:
            raise Exception("Invalid ML response")

    except Exception:
        logging.exception("ML error")

        ai_data = {
            "reply": "⚠️ AI unavailable",
            "intent": "fallback",
            "sentiment": "neutral",
            "risk_level": "low",
            "emergency": False,
            "recommendations": [],
        }

    # SAVE AI MESSAGE
    ai_msg = ChatMessage(
        sender="ai",
        content=ai_data["reply"],
        timestamp=datetime.utcnow(),
        intent=ai_data["intent"],
        sentiment=ai_data["sentiment"],
    )

    chat.messages.append(ai_msg.dict())
    chat.total_messages += 2
    chat.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(chat)

    return ChatMessageResponse(**ai_data)