from fastapi import APIRouter, Depends
from .firebase import verify_token

router = APIRouter()

@router.post("/api/chat")
def chat_api(data: dict, user=Depends(verify_token)):
    print("User Logged In:", user["email"])
    return {"reply": "Hello from secured backend!"}
