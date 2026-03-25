from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from . import schemas, models
from .database import SessionLocal
from slowapi.util import get_remote_address
from .rate_limiter import limiter

router = APIRouter(prefix="/analytics", tags=["analytics"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/record", response_model=schemas.SuccessResponse)
@limiter.limit("60/minute")
def record_analytics(data: schemas.AnalyticsData, request: Request, db: Session = Depends(get_db)):
    """Record analytics for a user"""
    # Basic validation
    user = db.query(models.User).filter(models.User.id == data.intent_distribution.get("user_id", None)).first() if isinstance(data.intent_distribution, dict) else None

    # Create AnalyticsRecord
    record = models.AnalyticsRecord(
        user_id=data.intent_distribution.get("user_id") if isinstance(data.intent_distribution, dict) and data.intent_distribution.get("user_id") else None,
        query_count=data.total_queries,
        emergency_cases=data.emergency_cases,
        avg_response_time_ms=data.avg_response_time_ms,
        ml_accuracy=data.ml_accuracy,
        sentiment_analysis_data=data.sentiment_analysis,
        intent_distribution=data.intent_distribution,
        recorded_date=data.recorded_date
    )
    if not record.user_id:
        raise HTTPException(status_code=400, detail="user_id must be present inside intent_distribution as 'user_id' for persistence")

    db.add(record)
    db.commit()
    db.refresh(record)

    return {"success": True, "message": "Analytics recorded", "data": {"id": record.id}}


@router.get("/user/{user_id}", response_model=schemas.DailyAnalyticsResponse)
@limiter.limit("60/minute")
def get_latest_user_analytics(user_id: int, db: Session = Depends(get_db)):
    """Return the most recent analytics record for a user"""
    record = db.query(models.AnalyticsRecord).filter(models.AnalyticsRecord.user_id == user_id).order_by(models.AnalyticsRecord.recorded_date.desc()).first()
    if not record:
        raise HTTPException(status_code=404, detail="No analytics found for user")

    return {
        "date": record.recorded_date,
        "total_queries": record.query_count,
        "emergency_cases": record.emergency_cases,
        "avg_response_time_ms": record.avg_response_time_ms,
        "ml_accuracy": record.ml_accuracy
    }


@router.get("/daily", response_model=list[schemas.DailyAnalyticsResponse])
@limiter.limit("30/minute")
def get_daily_analytics(user_id: Optional[int] = None, days: int = 7, db: Session = Depends(get_db)):
    """Aggregate analytics by day for the past N days (default 7)"""
    end = datetime.utcnow()
    start = end - timedelta(days=days)

    query = db.query(models.AnalyticsRecord).filter(models.AnalyticsRecord.recorded_date >= start, models.AnalyticsRecord.recorded_date <= end)
    if user_id:
        query = query.filter(models.AnalyticsRecord.user_id == user_id)

    records = query.all()

    # Aggregate by date
    by_date: dict[str, dict] = {}
    for r in records:
        key = r.recorded_date.date().isoformat()
        if key not in by_date:
            by_date[key] = {
                "total_queries": 0,
                "emergency_cases": 0,
                "avg_response_time_ms": 0.0,
                "ml_accuracy": 0.0,
                "count": 0
            }
        by_date[key]["total_queries"] += r.query_count
        by_date[key]["emergency_cases"] += r.emergency_cases
        by_date[key]["avg_response_time_ms"] += r.avg_response_time_ms
        by_date[key]["ml_accuracy"] += (r.ml_accuracy or 0.0)
        by_date[key]["count"] += 1

    results = []
    for date_str, vals in sorted(by_date.items()):
        count = vals.pop("count")
        results.append({
            "date": datetime.fromisoformat(date_str),
            "total_queries": vals["total_queries"],
            "emergency_cases": vals["emergency_cases"],
            "avg_response_time_ms": vals["avg_response_time_ms"] / count if count else 0.0,
            "ml_accuracy": vals["ml_accuracy"] / count if count else 0.0
        })

    return results
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User, AnalyticsRecord
from .schemas import AnalyticsData, DailyAnalyticsResponse
from .users import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============= GET TODAY'S ANALYTICS =============

@router.get("/today", response_model=DailyAnalyticsResponse)
def get_today_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get analytics for today (total queries, emergency cases, etc.)
    """
    today = datetime.utcnow().date()
    
    analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id,
        AnalyticsRecord.recorded_date >= datetime.combine(today, datetime.min.time())
    ).first()

    if not analytics:
        return DailyAnalyticsResponse(
            date=datetime.utcnow(),
            total_queries=0,
            emergency_cases=0,
            avg_response_time_ms=0.0,
            ml_accuracy=0.0
        )

    return DailyAnalyticsResponse(
        date=analytics.recorded_date,
        total_queries=analytics.query_count,
        emergency_cases=analytics.emergency_cases,
        avg_response_time_ms=analytics.avg_response_time_ms,
        ml_accuracy=analytics.ml_accuracy
    )

# ============= GET TOTAL QUERIES =============

@router.get("/queries-today", response_model=dict)
def get_queries_today(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get total queries count for today
    """
    today = datetime.utcnow().date()
    
    analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id,
        AnalyticsRecord.recorded_date >= datetime.combine(today, datetime.min.time())
    ).first()

    query_count = analytics.query_count if analytics else 0

    return {
        "total_queries": query_count,
        "date": today
    }

# ============= GET AI ACCURACY =============

@router.get("/accuracy", response_model=dict)
def get_accuracy(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get ML model accuracy metrics
    """
    analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id
    ).order_by(AnalyticsRecord.recorded_date.desc()).first()

    accuracy = analytics.ml_accuracy if analytics else 0.0

    return {
        "accuracy": accuracy,
        "percentage": round(accuracy * 100, 2)
    }

# ============= GET ACTIVE USERS (SYSTEM) =============

@router.get("/users-active", response_model=dict)
def get_active_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get count of active users (for admin/system overview)
    """
    from .models import User as UserModel
    from datetime import datetime, timedelta
    
    # Users active in last 24 hours
    yesterday = datetime.utcnow() - timedelta(days=1)
    
    active_count = db.query(UserModel).filter(
        UserModel.last_login_at >= yesterday,
        UserModel.is_active == True
    ).count()

    return {
        "active_users": active_count,
        "timeframe": "last_24_hours"
    }

# ============= GET HEALTH REPORTS =============

@router.get("/reports", response_model=dict)
def get_reports_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get count of health reports generated
    """
    from .models import HealthReport
    
    reports_count = db.query(HealthReport).filter(
        HealthReport.user_id == current_user.id
    ).count()

    return {
        "total_reports": reports_count,
        "user_id": current_user.id
    }

# ============= GET SENTIMENT ANALYSIS =============

@router.get("/sentiment", response_model=dict)
def get_sentiment_analysis(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get sentiment analysis data
    """
    analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id
    ).order_by(AnalyticsRecord.recorded_date.desc()).first()

    if not analytics or not analytics.sentiment_analysis_data:
        return {
            "positive": 0,
            "neutral": 0,
            "negative": 0
        }

    return analytics.sentiment_analysis_data

# ============= GET INTENT DISTRIBUTION =============

@router.get("/intent-distribution", response_model=dict)
def get_intent_distribution(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get distribution of user intents (what users ask about)
    """
    analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id
    ).order_by(AnalyticsRecord.recorded_date.desc()).first()

    if not analytics or not analytics.intent_distribution:
        return {}

    return analytics.intent_distribution

# ============= GET EMERGENCY CASES =============

@router.get("/emergencies", response_model=dict)
def get_emergency_cases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get count of emergency cases detected
    """
    today = datetime.utcnow().date()
    
    analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id,
        AnalyticsRecord.recorded_date >= datetime.combine(today, datetime.min.time())
    ).first()

    emergency_count = analytics.emergency_cases if analytics else 0

    return {
        "emergency_cases_today": emergency_count,
        "date": today
    }

# ============= GET RESPONSE TIME STATS =============

@router.get("/response-time", response_model=dict)
def get_response_time(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get average response time statistics
    """
    analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id
    ).order_by(AnalyticsRecord.recorded_date.desc()).first()

    avg_time = analytics.avg_response_time_ms if analytics else 0.0

    return {
        "average_response_time_ms": avg_time,
        "average_response_time_s": round(avg_time / 1000, 2)
    }

# ============= GET COMPREHENSIVE DASHBOARD DATA =============

@router.get("/dashboard", response_model=dict)
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all dashboard data in one call (Total Queries, Accuracy, Reports, Active Users)
    """
    from .models import HealthReport
    
    today = datetime.utcnow().date()
    
    # Today's analytics
    today_analytics = db.query(AnalyticsRecord).filter(
        AnalyticsRecord.user_id == current_user.id,
        AnalyticsRecord.recorded_date >= datetime.combine(today, datetime.min.time())
    ).first()

    # Health reports count
    reports_count = db.query(HealthReport).filter(
        HealthReport.user_id == current_user.id
    ).count()

    # Active users (system-wide)
    yesterday = datetime.utcnow() - timedelta(days=1)
    from .models import User as UserModel
    active_users = db.query(UserModel).filter(
        UserModel.last_login_at >= yesterday,
        UserModel.is_active == True
    ).count()

    return {
        "total_queries": today_analytics.query_count if today_analytics else 0,
        "ai_accuracy": (today_analytics.ml_accuracy * 100) if today_analytics else 0.0,
        "health_reports": reports_count,
        "active_users": active_users,
        "emergency_cases": today_analytics.emergency_cases if today_analytics else 0,
        "avg_response_time_ms": today_analytics.avg_response_time_ms if today_analytics else 0.0
    }
