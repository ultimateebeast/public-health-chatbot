from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User
from .schemas import UserProfile, UserUpdate, UserPreferences
from .utils import verify_token_payload, decode_token
from fastapi import Header
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User Profile"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get current authenticated user from JWT token
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )

    try:
        token = authorization.split(" ")[1]  # Bearer <token>
        payload = decode_token(token)
        user_id = verify_token_payload(payload)
    except (IndexError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user

# ============= GET PROFILE =============

@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user's profile information
    """
    return UserProfile(
        id=current_user.id,
        firebase_uid=current_user.firebase_uid,
        email=current_user.email,
        display_name=current_user.display_name,
        photo_url=current_user.photo_url,
        theme=current_user.theme,
        language=current_user.language,
        created_at=current_user.created_at,
        last_login_at=current_user.last_login_at
    )

# ============= UPDATE PROFILE =============

@router.put("/profile", response_model=UserProfile)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile information
    """
    try:
        if update_data.display_name is not None:
            current_user.display_name = update_data.display_name

        if update_data.photo_url is not None:
            current_user.photo_url = update_data.photo_url

        if update_data.theme is not None:
            if update_data.theme not in ["light", "dark"]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Theme must be 'light' or 'dark'"
                )
            current_user.theme = update_data.theme

        if update_data.language is not None:
            current_user.language = update_data.language

        current_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(current_user)

        return UserProfile(
            id=current_user.id,
            firebase_uid=current_user.firebase_uid,
            email=current_user.email,
            display_name=current_user.display_name,
            photo_url=current_user.photo_url,
            theme=current_user.theme,
            language=current_user.language,
            created_at=current_user.created_at,
            last_login_at=current_user.last_login_at
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

# ============= GET PREFERENCES =============

@router.get("/preferences", response_model=UserPreferences)
def get_preferences(current_user: User = Depends(get_current_user)):
    """
    Get user's preferences (theme, language)
    """
    return UserPreferences(
        theme=current_user.theme,
        language=current_user.language
    )

# ============= UPDATE PREFERENCES =============

@router.put("/preferences", response_model=UserPreferences)
def update_preferences(
    preferences: UserPreferences,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user's preferences
    """
    try:
        if preferences.theme not in ["light", "dark"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Theme must be 'light' or 'dark'"
            )

        current_user.theme = preferences.theme
        current_user.language = preferences.language
        current_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(current_user)

        return UserPreferences(
            theme=current_user.theme,
            language=current_user.language
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update preferences: {str(e)}"
        )

# ============= DELETE ACCOUNT =============

@router.delete("/profile", status_code=204)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete user account and all associated data
    """
    try:
        db.delete(current_user)
        db.commit()
        return None

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )
