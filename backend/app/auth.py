from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User
from .schemas import UserCreate, UserLogin, Token
from .utils import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_token({"id": new_user.id, "email": new_user.email})
    return {"access_token": token}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()

    if not existing or not verify_password(user.password, existing.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"id": existing.id, "email": existing.email})
    return {"access_token": token}
