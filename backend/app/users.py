from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User
from .schemas import UserProfile, UserUpdate, UserPreferences
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User Profile"])


# ================= DB =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= FAKE USER =================
def get_fake_user(db: Session):
    user = db.query(User).first()

    if not user:
        user = User(
            email="test@example.com",
            firebase_uid="dummy",
            display_name="Test User",
            theme="dark",
            language="en"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


# ================= GET PROFILE =================
@router.get("/profile", response_model=UserProfile)
def get_profile(db: Session = Depends(get_db)):
    user = get_fake_user(db)
    return user


# ================= UPDATE PROFILE =================
@router.put("/profile", response_model=UserProfile)
def update_profile(update_data: UserUpdate, db: Session = Depends(get_db)):
    user = get_fake_user(db)

    if update_data.display_name:
        user.display_name = update_data.display_name

    if update_data.photo_url:
        user.photo_url = update_data.photo_url

    if update_data.theme:
        user.theme = update_data.theme

    if update_data.language:
        user.language = update_data.language

    user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return user


# ================= GET PREFERENCES =================
@router.get("/preferences", response_model=UserPreferences)
def get_preferences(db: Session = Depends(get_db)):
    user = get_fake_user(db)

    return UserPreferences(
        theme=user.theme,
        language=user.language
    )


# ================= UPDATE PREFERENCES =================
@router.put("/preferences", response_model=UserPreferences)
def update_preferences(preferences: UserPreferences, db: Session = Depends(get_db)):
    user = get_fake_user(db)

    user.theme = preferences.theme
    user.language = preferences.language
    user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return preferences


# ================= DELETE =================
@router.delete("/profile", status_code=204)
def delete_account(db: Session = Depends(get_db)):
    user = get_fake_user(db)

    db.delete(user)
    db.commit()

    return None