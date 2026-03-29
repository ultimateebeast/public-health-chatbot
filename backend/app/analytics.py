from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
from . import schemas, models
from .database import SessionLocal
from .rate_limiter import limiter

router = APIRouter(prefix="/analytics", tags=["analytics"])


# ================= DB =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= RECORD =================
@router.post("/record", response_model=schemas.SuccessResponse)
@limiter.limit("60/minute")
def record_analytics(request: Request, data: schemas.AnalyticsData, db: Session = Depends(get_db)):
    user_id = data.intent_distribution.get("user_id", 1)

    record = models.AnalyticsRecord(
        user_id=user_id,
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


# ================= USER ANALYTICS =================
@router.get("/user/{user_id}", response_model=schemas.DailyAnalyticsResponse)
def get_user_analytics(user_id: int, db: Session = Depends(get_db)):
    record = db.query(models.AnalyticsRecord)\
        .filter(models.AnalyticsRecord.user_id == user_id)\
        .order_by(models.AnalyticsRecord.recorded_date.desc())\
        .first()

    if not record:
        raise HTTPException(status_code=404, detail="No analytics")

    return record


# ================= DAILY =================
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


# ================= TODAY =================
@router.get("/today", response_model=schemas.DailyAnalyticsResponse)
def get_today(db: Session = Depends(get_db)):
    user_id = 1

    today = datetime.utcnow().date()

    record = db.query(models.AnalyticsRecord).filter(
        models.AnalyticsRecord.user_id == user_id,
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


# ================= DASHBOARD =================
@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    user_id = 1

    today = datetime.utcnow().date()

    record = db.query(models.AnalyticsRecord).filter(
        models.AnalyticsRecord.user_id == user_id,
        models.AnalyticsRecord.recorded_date >= datetime.combine(today, datetime.min.time())
    ).first()

    return {
        "total_queries": record.query_count if record else 0,
        "ai_accuracy": (record.ml_accuracy * 100) if record else 0,
        "emergency_cases": record.emergency_cases if record else 0,
        "avg_response_time_ms": record.avg_response_time_ms if record else 0
    }