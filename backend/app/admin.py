from fastapi import APIRouter, Depends
from app.firestore import get_firestore_client
from app.admin_auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

db = get_firestore_client()


# 🔹 Helper: format document
def format_doc(doc):
    data = doc.to_dict()
    return {
        "id": doc.id,
        "query": data.get("query"),
        "disease": data.get("disease"),
        "risk_level": data.get("risk_level"),
        "confidence": data.get("confidence"),
        "emergency": data.get("emergency"),
        "timestamp": data.get("timestamp"),
        "user_id": data.get("user_id"),
    }


# 🔹 Get all logs
@router.get("/logs")
def get_logs(user=Depends(require_admin)):
    docs = db.collection("logs").stream()
    return [format_doc(doc) for doc in docs]


# 🔹 Get high risk logs
@router.get("/high-risk")
def get_high_risk(user=Depends(require_admin)):
    docs = db.collection("logs").where("risk_level", "==", "high").stream()
    return [format_doc(doc) for doc in docs]


# 🔹 Stats (FIXED)
@router.get("/stats")
def get_stats(user=Depends(require_admin)):
    docs = list(db.collection("logs").stream())

    total = len(docs)
    high = 0
    medium = 0
    low = 0

    for d in docs:
        risk = d.to_dict().get("risk_level")

        if risk == "high":
            high += 1
        elif risk == "medium":
            medium += 1
        elif risk == "low":
            low += 1

    return {
        "total_queries": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
    }