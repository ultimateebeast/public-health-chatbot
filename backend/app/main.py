from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import logging
from .auth import router as auth_router
from .users import router as users_router
from .chat import router as chat_router
from .analytics import router as analytics_router
from .rate_limiter import limiter
from .database import engine, Base
from app.admin import router as admin_router

load_dotenv()

logging.basicConfig(level=logging.INFO)

# ============= FASTAPI APP INITIALIZATION =============

app = FastAPI(
    title="Public Health Chatbot API",
    description="AI-powered health chatbot with Firebase Auth and ML integration",
    version="1.0.0"
)

# ============= DATABASE INITIALIZATION =============

# Create all database tables
Base.metadata.create_all(bind=engine)

# ============= CORS CONFIGURATION =============

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "http://localhost:5173")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register slowapi limiter middleware
try:
    from slowapi.middleware import SlowAPIMiddleware
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)
except Exception:
    # slowapi optional; continue without global middleware if unavailable
    pass

# ============= GLOBAL ERROR HANDLERS =============

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions with proper response format"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "status_code": 500
        }
    )

# ============= HEALTH CHECK ENDPOINTS =============

@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Public Health Chatbot API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# ============= REGISTER ROUTERS =============

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(chat_router)
app.include_router(analytics_router)
app.include_router(admin_router)

# ============= TEST ENDPOINT =============

@app.post("/api/test-chat")
def test_chat(payload: dict):
    """Test endpoint for quick testing"""
    return {
        "reply": f"Echo: {payload.get('message', 'no message')}",
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("API_HOST", "127.0.0.1"),
        port=int(os.getenv("API_PORT", "8000")),
        reload=os.getenv("ENV", "development") == "development"
    )
