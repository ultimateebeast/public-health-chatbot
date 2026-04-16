from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User, RefreshToken
from .schemas import (
    UserCreate, UserLogin, Token, UserProfile, 
    ForgotPasswordRequest, ResetPasswordRequest
)
from .utils import (
    hash_password, verify_password, create_token, 
    decode_token, create_refresh_token
)
from .firebase import verify_token as verify_firebase_token
import firebase_admin
from firebase_admin import auth as firebase_auth
from datetime import datetime, timedelta
import os
import requests

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============= SIGNUP ENDPOINT =============

@router.post("/signup", response_model=Token, status_code=201)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with email and password.
    Firebase Auth handles the authentication, SQLAlchemy stores user record.
    """
    try:
        # Check if email already registered
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user in Firebase Auth
        firebase_user = firebase_auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.display_name or user.email.split("@")[0]
        )

        # Store user record in database
        db_user = User(
            firebase_uid=firebase_user.uid,
            email=user.email,
            display_name=user.display_name or firebase_user.display_name,
            theme="light",
            language="en",
            created_at=datetime.utcnow()
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Create JWT tokens
        access_token = create_token({"user_id": db_user.id, "email": db_user.email, "firebase_uid": db_user.firebase_uid })
        refresh_token = create_refresh_token({"user_id": db_user.id})

        # Store refresh token
        db_refresh = RefreshToken(
            user_id=db_user.id,
            token=refresh_token,
            expires_at=datetime.utcnow() + timedelta(days=7)
        )
        db.add(db_refresh)
        db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": 1800
        }

    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists in Firebase"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}"
        )

# ============= LOGIN ENDPOINT =============
@router.post("/login", response_model=Token)
def login(data: dict, db: Session = Depends(get_db)):
    firebase_token = data.get("firebase_token")

    if not firebase_token:
        raise HTTPException(status_code=400, detail="Missing Firebase token")

    try:
        # 🔥 VERIFY FIREBASE TOKEN
        decoded = firebase_auth.verify_id_token(firebase_token)

        firebase_uid = decoded["uid"]
        email = decoded.get("email")

        # 🔥 FIND USER BY UID (NOT EMAIL)
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

        # 🔥 CREATE USER IF NOT EXISTS
        if not user:
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                created_at=datetime.utcnow()
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # 🔥 CREATE JWT
        access_token = create_token({
            "user_id": user.id,
            "email": user.email,
            "firebase_uid": user.firebase_uid
        })

        refresh_token = create_refresh_token({"user_id": user.id})

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": 1800
        }

    except Exception as e:
        print("🔥 LOGIN ERROR:", str(e))
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
# ============= REFRESH TOKEN ENDPOINT =============

@router.post("/refresh-token", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token.
    """
    try:
        # Verify refresh token
        payload = decode_token(refresh_token)
        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # Check if refresh token exists and is not revoked
        db_refresh = db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token,
            RefreshToken.is_revoked == False
        ).first()

        if not db_refresh or db_refresh.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired or revoked"
            )

        # Get user
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Create new access token
        new_access_token = create_token({"user_id": db_user.id, "email": db_user.email})

        return {
            "access_token": new_access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": 1800
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )

# ============= LOGOUT ENDPOINT =============

@router.post("/logout", status_code=200)
def logout(refresh_token: str, db: Session = Depends(get_db)):
    """
    Logout by revoking refresh token.
    """
    try:
        db_refresh = db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token
        ).first()

        if db_refresh:
            db_refresh.is_revoked = True
            db.commit()

        return {"message": "Logged out successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

# ============= FORGOT PASSWORD ENDPOINT =============

@router.post("/forgot-password", status_code=200)
def forgot_password(request: ForgotPasswordRequest):
    """
    Send password reset email to user.
    """
    try:
        # Generate password reset link using Firebase Admin SDK
        link = firebase_auth.generate_password_reset_link(request.email)
        # In production, send this link via your transactional email provider.
        return {"message": "Password reset link generated", "reset_link": link}
    except firebase_auth.UserNotFoundError:
        # Don't reveal if user exists
        return {"message": "If email exists, password reset link sent"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate reset link: {str(e)}"
        )

# ============= RESET PASSWORD ENDPOINT =============

@router.post("/reset-password", status_code=200)
def reset_password(request: ResetPasswordRequest):
    """
    Reset password using reset token from Firebase.
    """
    # Note: password reset confirmation is typically handled client-side via Firebase SDK.
    # If you need server-side confirmation, implement Firebase REST call here.
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Password reset confirmation should be handled client-side via Firebase SDK")

# ============= GET CURRENT USER ENDPOINT =============

def get_current_user(request: Request, db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = auth_header.split(" ")[1]

        payload = decode_token(token)  # ✅ MUST come before print

        print("🔥 TOKEN PAYLOAD:", payload)

        firebase_uid = payload.get("firebase_uid")

        if not firebase_uid:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        print("🔥 DB USER FOUND:", user.id, user.email)

        return user

    except Exception as e:
        print("🔥 AUTH ERROR:", str(e))
        raise HTTPException(status_code=401, detail="Invalid token")