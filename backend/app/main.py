from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Public Health Chatbot API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Public Health Chatbot API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Test endpoint
@app.post("/api/chat")
def chat(payload: dict):
    """Simple test endpoint for chat"""
    return {
        "reply": f"Hello! You said: {payload.get('message', 'nothing')}",
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
