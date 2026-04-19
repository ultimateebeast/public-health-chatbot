from fastapi import HTTPException, Depends
from app.auth import get_current_user

ADMIN_EMAIL = "pratyushjain1000@gmail.com"

def require_admin(current_user=Depends(get_current_user)):
    if current_user.email != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user