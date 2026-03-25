from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User, ChatHistory
from .schemas import (
    ChatHistoryCreate, ChatHistoryResponse, ChatMessageRequest, 
    ChatMessageResponse, ChatMessage
)
from .users import get_current_user
from datetime import datetime
import httpx
import io
import logging
from .ml_client import call_inference
from .storage import upload_fileobj, ensure_bucket_exists

router = APIRouter(prefix="/chat", tags=["Chat"])

ML_MODEL_ENDPOINT = "http://localhost:8001"  # Will be updated from .env

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============= CREATE CHAT SESSION =============

@router.post("/create", response_model=ChatHistoryResponse)
def create_chat_session(
    request: ChatHistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new chat session
    """
    try:
        chat = ChatHistory(
            user_id=current_user.id,
            title=request.title or "New Chat",
            messages=[],
            total_messages=0
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)

        return ChatHistoryResponse(
            id=chat.id,
            user_id=chat.user_id,
            title=chat.title,
            messages=chat.messages,
            total_messages=chat.total_messages,
            created_at=chat.created_at,
            updated_at=chat.updated_at
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create chat: {str(e)}"
        )

# ============= GET CHAT HISTORY =============

@router.get("/history/{chat_id}", response_model=ChatHistoryResponse)
def get_chat_history(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get specific chat history
    """
    chat = db.query(ChatHistory).filter(
        ChatHistory.id == chat_id,
        ChatHistory.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    return ChatHistoryResponse(
        id=chat.id,
        user_id=chat.user_id,
        title=chat.title,
        messages=chat.messages,
        total_messages=chat.total_messages,
        created_at=chat.created_at,
        updated_at=chat.updated_at
    )

# ============= GET ALL CHATS FOR USER =============

@router.get("/history", response_model=list[ChatHistoryResponse])
def get_all_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all chat histories for current user
    """
    chats = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id
    ).order_by(ChatHistory.created_at.desc()).all()

    return [
        ChatHistoryResponse(
            id=chat.id,
            user_id=chat.user_id,
            title=chat.title,
            messages=chat.messages,
            total_messages=chat.total_messages,
            created_at=chat.created_at,
            updated_at=chat.updated_at
        )
        for chat in chats
    ]

# ============= SEND MESSAGE (MAIN CHAT ENDPOINT) =============

@router.post("/{chat_id}/message", response_model=ChatMessageResponse)
async def send_message(
    chat_id: int,
    request: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send message to chatbot and get AI response.
    Integrates with ML model for inference.
    """
    try:
        # Verify chat belongs to user
        chat = db.query(ChatHistory).filter(
            ChatHistory.id == chat_id,
            ChatHistory.user_id == current_user.id
        ).first()

        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )

        # Add user message to history
        user_message = ChatMessage(
            sender="user",
            content=request.message,
            timestamp=datetime.utcnow(),
            intent=None,
            sentiment=None
        )

        if chat.messages is None:
            chat.messages = []

        chat.messages.append(user_message.dict())

        # Call ML model for inference via ml_client
        try:
            ml_result = await call_inference(request.message, user_id=current_user.id, language=request.language)
            ai_response = {
                "reply": ml_result.get("response", ""),
                "intent": ml_result.get("intent", "unknown"),
                "sentiment": ml_result.get("sentiment", "unknown"),
                "risk_level": ml_result.get("risk_level", "low"),
                "emergency": ml_result.get("emergency", False),
                "recommendations": ml_result.get("recommendations", [])
            }
        except Exception as e:
            logging.exception("ML inference failed, falling back to mock response")
            ai_response = {
                "reply": f"Thank you for your message: '{request.message}'. This is a fallback response.",
                "intent": "general_health_question",
                "sentiment": "neutral",
                "risk_level": "low",
                "emergency": False,
                "recommendations": ["Consult a healthcare provider", "Get more rest"]
            }

        # Add AI response to history
        ai_message = ChatMessage(
            sender="ai",
            content=ai_response["reply"],
            timestamp=datetime.utcnow(),
            intent=ai_response.get("intent"),
            sentiment=ai_response.get("sentiment")
        )

        chat.messages.append(ai_message.dict())
        chat.total_messages += 2
        chat.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(chat)

        return ChatMessageResponse(
            reply=ai_response["reply"],
            intent=ai_response.get("intent", "unknown"),
            sentiment=ai_response.get("sentiment", "unknown"),
            risk_level=ai_response.get("risk_level", "low"),
            emergency=ai_response.get("emergency", False),
            recommendations=ai_response.get("recommendations", [])
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send message: {str(e)}"
        )

# ============= DELETE CHAT =============

@router.delete("/{chat_id}", status_code=204)
def delete_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a chat history
    """
    try:
        chat = db.query(ChatHistory).filter(
            ChatHistory.id == chat_id,
            ChatHistory.user_id == current_user.id
        ).first()

        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )

        db.delete(chat)
        db.commit()
        return None

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete chat: {str(e)}"
        )

# ============= EXPORT CHAT =============

@router.get("/{chat_id}/export")
def export_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Export chat history as JSON
    """
    chat = db.query(ChatHistory).filter(
        ChatHistory.id == chat_id,
        ChatHistory.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    export_obj = {
        "id": chat.id,
        "title": chat.title,
        "created_at": chat.created_at.isoformat() if chat.created_at else None,
        "messages": chat.messages
    }

    # Save export to object storage (S3 / MinIO) and return presigned URL
    try:
        ensure_bucket_exists()
        import json as _json
        data = _json.dumps(export_obj, default=str).encode("utf-8")
        bio = io.BytesIO(data)
        key = f"exports/chat_{chat.id}_{int(datetime.utcnow().timestamp())}.json"
        upload_fileobj(bio, key)
        url = None
        try:
            from .storage import generate_presigned_url
            url = generate_presigned_url(key)
        except Exception:
            url = None

        return {"export_key": key, "presigned_url": url}
    except Exception as e:
        logging.exception("Failed to export chat to storage")
        # fallback to returning JSON directly
        return export_obj

# ============= CLEAR ALL CHATS =============

@router.delete("/", status_code=204)
def clear_all_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete all chat histories for user (WARNING: Irreversible)
    """
    try:
        db.query(ChatHistory).filter(
            ChatHistory.user_id == current_user.id
        ).delete()
        db.commit()
        return None

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear chats: {str(e)}"
        )
