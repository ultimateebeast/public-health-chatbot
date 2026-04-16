from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
from collections import defaultdict
import json
from .auth import get_current_user
from . import schemas, models
from .database import SessionLocal
from .rate_limiter import limiter
from .models import ChatHistory

router = APIRouter(prefix="/analytics", tags=["analytics"])


# ================= DB =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= FULL REAL DASHBOARD =================
@router.get("/full-dashboard")
def full_dashboard(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    chats = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).all()

    disease_count = defaultdict(int)
    risk_count = defaultdict(int)
    sentiment_count = defaultdict(int)
    daily_usage = defaultdict(int)

    total_queries = 0
    total_confidence = 0.0
    emergency_cases = 0
    

    for chat in chats:
        if not chat.messages:
            continue

        for msg in chat.messages:

            # 🔥 FIX 1: handle string message
            if isinstance(msg, str):
                try:
                    msg = json.loads(msg)
                except:
                    continue

            # 🔥 FIX 2: ensure dict
            if not isinstance(msg, dict):
                continue

            # only AI messages
            if msg.get("sender") != "ai":
                continue

            try:
                content = msg.get("content")

                if not content:
                    continue

                # 🔥 FIX 3: content can be string OR dict
                if isinstance(content, str):
                    data = json.loads(content)
                elif isinstance(content, dict):
                    data = content
                else:
                    continue

                # ================= EXTRACT =================
                disease = data.get("disease", "unknown")
                confidence = float(data.get("confidence", 0))
                risk = data.get("risk_level", "low")
                sentiment = data.get("sentiment", "neutral")
                emergency = data.get("emergency", False)

                # ================= COUNT =================
                disease_count[disease] += 1
                risk_count[risk] += 1
                sentiment_count[sentiment] += 1

                # ================= DATE =================
                timestamp = msg.get("timestamp")
                if timestamp:
                    date = str(timestamp)[:10]
                    daily_usage[date] += 1

                total_confidence += confidence
                total_queries += 1

                if emergency:
                    emergency_cases += 1

            except Exception as e:
                print("Analytics parse error:", e)
                continue

    # ================= CALCULATIONS =================
    avg_confidence = (
        total_confidence / total_queries if total_queries > 0 else 0
    )

    top_disease = (
        max(disease_count, key=disease_count.get)
        if disease_count else None
    )
    

    # ================= RECENT ACTIVITY =================
    recent_activity = []

    for i, chat in enumerate(sorted(chats, key=lambda x: x.updated_at, reverse=True)[:5]):
        if not chat.messages:
            continue

        messages = chat.messages

        # 🔥 HANDLE IF WHOLE MESSAGES IS STRING
        if isinstance(messages, str):
            try:
                messages = json.loads(messages)
            except:
                continue

        if not isinstance(messages, list):
            continue

        # 🔥 FIND LAST AI MESSAGE
        for msg in reversed(messages):

            if isinstance(msg, str):
                try:
                    msg = json.loads(msg)
                except:
                    continue
            print("MSG DEBUG:", msg)

            if not isinstance(msg, dict):
                continue

            if msg.get("sender") != "ai":
                continue

            try:
                content = msg.get("content")

                if isinstance(content, str):
                    data = json.loads(content)
                elif isinstance(content, dict):
                    data = content
                else:
                    continue

                recent_activity.append({
                    "id": f"Q-{i+1}",
                    "type": data.get("disease", "unknown"),
                    "risk_level": data.get("risk_level", "low"),
                    "status": "Report Generated",
                    "time": str(chat.updated_at)
                })
                print("ADDED TO RECENT:", recent_activity)

                break  # ✅ stop after first valid AI msg

            except Exception as e:
                print("Recent activity error:", e)
                continue
    
    # ================= FINAL RESPONSE =================
    return {
        "total_queries": total_queries,
        "disease_distribution": dict(disease_count),
        "risk_distribution": dict(risk_count),
        "sentiment_distribution": dict(sentiment_count),
        "daily_usage": dict(daily_usage),
        "avg_confidence": avg_confidence,
        "emergency_cases": emergency_cases,
        "top_disease": top_disease,
        "recent_activity": recent_activity
    }


# ================= OPTIONAL =================

@router.post("/record", response_model=schemas.SuccessResponse)
@limiter.limit("60/minute")
def record_analytics(request: Request, data: schemas.AnalyticsData, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_id = data.intent_distribution.get("user_id", 1)

    record = models.AnalyticsRecord(
        user_id=current_user.id,  # override with auth user id
        query_count=data.total_queries,
        emergency_cases=data.emergency_cases,
        avg_response_time_ms=data.avg_response_time_ms,
        ml_accuracy=data.ml_accuracy,
        sentiment_analysis_data=data.sentiment_analysis,
        intent_distribution=data.intent_distribution,
        recorded_date=data.recorded_date or datetime.utcnow()
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "success": True,
        "message": "Analytics recorded",
        "data": {"id": record.id}
    }


@router.get("/user", response_model=schemas.DailyAnalyticsResponse)
def get_user_analytics(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    record = db.query(models.AnalyticsRecord)\
        .filter(models.AnalyticsRecord.user_id == current_user.id)\
        .order_by(models.AnalyticsRecord.recorded_date.desc())\
        .first()

    if not record:
        raise HTTPException(status_code=404, detail="No analytics")

    return record


@router.get("/daily", response_model=List[schemas.DailyAnalyticsResponse])
def get_daily(user_id: Optional[int] = None, days: int = 7, db: Session = Depends(get_db)):
    end = datetime.utcnow()
    start = end - timedelta(days=days)

    query = db.query(models.AnalyticsRecord).filter(
        models.AnalyticsRecord.recorded_date >= start,
        models.AnalyticsRecord.recorded_date <= end
    )

    if user_id:
        query = query.filter(models.AnalyticsRecord.user_id == user_id)

    return query.all()


@router.get("/today", response_model=schemas.DailyAnalyticsResponse)
def get_today(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    today = datetime.utcnow().date()

    record = db.query(models.AnalyticsRecord).filter(
        models.AnalyticsRecord.user_id == current_user.id,
        models.AnalyticsRecord.recorded_date >= datetime.combine(today, datetime.min.time())
    ).first()

    if not record:
        return schemas.DailyAnalyticsResponse(
            date=datetime.utcnow(),
            total_queries=0,
            emergency_cases=0,
            avg_response_time_ms=0.0,
            ml_accuracy=0.0
        )

    return record