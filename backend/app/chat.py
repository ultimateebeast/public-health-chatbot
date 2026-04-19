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
# from app.firestore import db
from app.firestore import save_analytics_to_firestore
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

        # ================= CLINICAL ADVICE =================
        disease_key = str(top["disease"]).lower()
        
        kb_map = {
            "tuberculosis": {
                "do": ["Wear a mask around others immediately", "Isolate in a well-ventilated room", "Contact a pulmonologist"],
                "avoid": ["Public transportation", "Coughing openly", "Smoking or passive smoke"],
                "worry": ["Coughing up blood", "Severe difficulty breathing", "Unexplained extreme weight loss"]
            },
            "gerd": {
                "do": ["Eat smaller, more frequent meals", "Sit upright for 2-3 hours after eating", "Elevate your head while sleeping"],
                "avoid": ["Spicy, high-fat, or acidic foods", "Eating right before bed", "Tight clothing around abdomen"],
                "worry": ["Chest pain reaching left arm", "Difficulty swallowing food", "Vomiting dark blood"]
            },
            "fever": {
                "do": ["Rest abundantly and stay home", "Hydrate constantly with clear fluids", "Take paracetamol if very uncomfortable"],
                "avoid": ["Heavy physical exertion", "Cold ice baths (causes shock)", "Overdressing in massive blankets"],
                "worry": ["Temperature over 103°F (39.4°C)", "Fever lasting > 3 days", "Neck stiffness or mental confusion"]
            },
            "cough": {
                "do": ["Drink warm honey-lemon water", "Use a humidifier", "Rest your voice"],
                "avoid": ["Cold beverages", "Dusty environments", "Exertion"],
                "worry": ["Coughing blood", "Wheezing heavily", "Night sweats"]
            },
            "headache": {
                 "do": ["Rest in a dark quiet room", "Hydrate", "Apply a cold/warm compress"],
                 "avoid": ["Bright screens", "Loud noises", "Skipping meals"],
                 "worry": ["'Worst headache of your life' feeling", "Vision loss", "Speech difficulty"]
            },
            "unknown": {
                 "do": ["Rest and monitor your symptoms closely", "Stay hydrated", "Log any new symptoms"],
                 "avoid": ["Strenuous activities", "Ignoring worsening pain", "Self-medicating heavily"],
                 "worry": ["Sudden severe pain", "Loss of consciousness", "Breathing difficulty"]
            }
        }
        
        # Simple string-includes fallback matcher
        advice = kb_map["unknown"]
        for k, v in kb_map.items():
            if k in disease_key:
                advice = v
                break

        # ================= AI DATA =================
        ai_data = {
            "reply": f"🦠 {top['disease'].upper()}\n📊 Confidence: {confidence:.2f}%",
            "disease": top["disease"],
            "confidence": confidence,
            "other_predictions": preds[1:],  
            "intent": "disease_prediction",
            "sentiment": "neutral",
            "risk_level": risk_level,
            "emergency": emergency,
            "recommendations": ["Consult a doctor if symptoms persist"],
            "what_to_do": advice["do"],
            "what_to_avoid": advice["avoid"],
            "when_to_worry": advice["worry"]
        }

    except Exception:
        logging.exception("ML ERROR")

        ai_data = {
            "reply": "⚠️ Symptoms Unclear",
            "disease": "Symptoms Unclear",
            "confidence": 0.0,
            "other_predictions": [],
            "intent": "fallback",
            "sentiment": "neutral",
            "risk_level": "low",
            "emergency": False,
            "recommendations": ["Could not parse exact condition from given symptoms"],
            "what_to_do": ["Provide more specific medical symptoms", "Rest and monitor your condition", "Consult a physician if symptoms worsen"],
            "what_to_avoid": ["Panic", "Self-medicating without proper diagnosis"],
            "when_to_worry": ["Breathing issues", "Severe radiating pain", "Loss of consciousness"]
        }
        # ai_data = {
        #     "reply": "Mock response: You may have mild fever",
        #     "disease": "fever",
        #     "confidence": 75,
        #     "other_predictions": [],
        #     "intent": "mock",
        #     "sentiment": "neutral",
        #     "risk_level": "medium",
        #     "emergency": False,
        #     "recommendations": ["Rest", "Drink water"]
        # }

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
    
        # ================= FIRESTORE LOGGING =================
    try:
        log = {
            "user_id": current_user.id,
            "chat_id": chat_id,
            "query": request.message,
            "response": ai_data["reply"],
            "disease": ai_data["disease"],
            "confidence": ai_data["confidence"],
            "risk_level": ai_data["risk_level"],
            "emergency": ai_data["emergency"],
            "timestamp": datetime.utcnow().isoformat()
        }

        save_analytics_to_firestore(log, "logs")

    except Exception as e:
        logging.error(f"Firestore logging failed: {str(e)}")

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
        other_predictions=ai_data["other_predictions"], 
        what_to_do=ai_data.get("what_to_do", []),
        what_to_avoid=ai_data.get("what_to_avoid", []),
        when_to_worry=ai_data.get("when_to_worry", [])
    )
    
    