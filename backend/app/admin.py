from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.firestore import get_firestore_client
from app.admin_auth import require_admin
from app.database import SessionLocal
from app.models import User
from collections import defaultdict

router = APIRouter(prefix="/admin", tags=["Admin"])

fs_db = get_firestore_client()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 Helper: format document
def format_doc(doc, pg_db: Session = None):
    data = doc.to_dict()
    user_id = data.get("user_id")
    user_name = "Anonymous"
    
    # Try resolving user
    if user_id and pg_db:
        user_record = pg_db.query(User).filter(User.id == user_id).first()
        if user_record:
            user_name = user_record.display_name or user_record.email.split('@')[0]

    return {
        "id": doc.id,
        "query": data.get("query"),
        "disease": data.get("disease"),
        "risk_level": data.get("risk_level"),
        "confidence": data.get("confidence"),
        "emergency": data.get("emergency"),
        "timestamp": data.get("timestamp"),
        "user_id": user_id,
        "user_name": user_name
    }

# 🔹 Get all logs
@router.get("/logs")
def get_logs(user=Depends(require_admin), db: Session = Depends(get_db)):
    docs = fs_db.collection("logs").stream()
    all_logs = [format_doc(doc, pg_db=db) for doc in docs]
    return [log for log in all_logs if str(log.get("disease")).lower() != "unknown"]

# 🔹 Stats
@router.get("/stats")
def get_stats(user=Depends(require_admin)):
    docs = list(fs_db.collection("logs").stream())

    high = 0
    medium = 0
    low = 0
    valid_total = 0
    disease_counts = defaultdict(int)

    for d in docs:
        data = d.to_dict()
        if str(data.get("disease")).lower() == "unknown":
            continue
            
        valid_total += 1
        risk = data.get("risk_level")
        disease_counts[data.get("disease", "Unknown")] += 1

        if risk == "high":
            high += 1
        elif risk == "medium":
            medium += 1
        elif risk == "low":
            low += 1

    return {
        "total_queries": valid_total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "disease_distribution": dict(disease_counts)
    }

# 🔹 Get high risk logs
@router.get("/high-risk")
def get_high_risk(user=Depends(require_admin), db: Session = Depends(get_db)):
    docs = fs_db.collection("logs").where("risk_level", "==", "high").stream()
    return [format_doc(doc, pg_db=db) for doc in docs]


# 🔹 User Drill-Down Analytics
@router.get("/user/{target_user_id}/analysis")
def get_user_analysis(target_user_id: int, user=Depends(require_admin), db: Session = Depends(get_db)):
    # Verify user exists
    target_user = db.query(User).filter(User.id == target_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Get user's logs from firebase
    docs = fs_db.collection("logs").where("user_id", "==", target_user_id).stream()
    
    total_queries = 0
    high_risk_cases = 0
    diseases = defaultdict(int)
    risk_dist = {"high": 0, "medium": 0, "low": 0}
    logs = []
    
    for doc in docs:
        data = doc.to_dict()
        disease = str(data.get("disease", "")).lower()
        
        if disease == "unknown":
            continue
            
        total_queries += 1
        risk = data.get("risk_level", "low")
        risk_dist[risk] = risk_dist.get(risk, 0) + 1
        
        if risk == "high":
            high_risk_cases += 1
            
        diseases[data.get("disease", "Unknown")] += 1
        
        logs.append({
            "query": data.get("query"),
            "disease": data.get("disease"),
            "risk_level": risk,
            "timestamp": data.get("timestamp")
        })

    logs.sort(key=lambda x: x["timestamp"], reverse=True)

    return {
        "user_name": target_user.display_name or target_user.email.split('@')[0],
        "user_email": target_user.email,
        "account_created": target_user.created_at,
        "total_valid_queries": total_queries,
        "high_risk_cases": high_risk_cases,
        "disease_distribution": dict(diseases),
        "risk_distribution": risk_dist,
        "recent_logs": logs[:15]
    }