from fastapi import FastAPI, Depends
from firebase_utils import verify_token

app = FastAPI()

@app.post("/api/chat")
def chat(payload: dict, user=Depends(verify_token)):
    print("USER:", user["email"])
    return {"reply": f"Hello {user['email']} — your request is secured!"}
