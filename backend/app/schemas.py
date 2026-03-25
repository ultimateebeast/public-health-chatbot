from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ============= USER SCHEMAS =============

class UserCreate(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    password: str = Field(..., min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: int
    firebase_uid: str
    email: str
    display_name: Optional[str]
    photo_url: Optional[str]
    theme: str
    language: str
    created_at: datetime
    last_login_at: Optional[datetime]
    
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    theme: Optional[str] = None
    language: Optional[str] = None

class UserPreferences(BaseModel):
    theme: str  # light/dark
    language: str
    
    class Config:
        orm_mode = True

# ============= AUTH SCHEMAS =============

class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    user_id: int
    email: str
    exp: datetime

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

# ============= CHAT SCHEMAS =============

class ChatMessage(BaseModel):
    sender: str  # "user" or "ai"
    content: str
    timestamp: datetime
    intent: Optional[str] = None
    sentiment: Optional[str] = None
    emergency_flag: Optional[bool] = False

class ChatHistoryCreate(BaseModel):
    title: Optional[str] = None

class ChatHistoryResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str]
    messages: List[Dict[str, Any]]
    total_messages: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class ChatMessageRequest(BaseModel):
    message: str
    user_id: int
    language: Optional[str] = "en"

class ChatMessageResponse(BaseModel):
    reply: str
    intent: str
    sentiment: str
    risk_level: str
    emergency: bool
    recommendations: Optional[List[str]] = None

# ============= HEALTH REPORT SCHEMAS =============

class HealthReportCreate(BaseModel):
    symptoms: List[str]
    additional_info: Optional[str] = None

class HealthReportResponse(BaseModel):
    id: int
    user_id: int
    symptoms: List[str]
    risk_level: str
    recommendations: List[str]
    ml_diagnosis: Optional[str]
    emergency_flag: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# ============= ANALYTICS SCHEMAS =============

class AnalyticsData(BaseModel):
    total_queries: int
    emergency_cases: int
    avg_response_time_ms: float
    ml_accuracy: float
    sentiment_analysis: Dict[str, float]
    intent_distribution: Dict[str, float]
    recorded_date: datetime

class DailyAnalyticsResponse(BaseModel):
    date: datetime
    total_queries: int
    emergency_cases: int
    avg_response_time_ms: float
    ml_accuracy: float

# ============= ML INTEGRATION SCHEMAS =============

class MLInferenceRequest(BaseModel):
    message: str
    user_id: int
    language: str = "en"
    context: Optional[Dict[str, Any]] = None

class MLInferenceResponse(BaseModel):
    response: str
    intent: str
    sentiment: str
    risk_level: str
    confidence: float
    emergency: bool
    recommendations: List[str]

class SymptomCheckRequest(BaseModel):
    symptoms: List[str]
    age: Optional[int] = None
    gender: Optional[str] = None

class SymptomCheckResponse(BaseModel):
    risk_level: str
    possible_conditions: List[str]
    recommendations: List[str]
    emergency_indicators: bool

# ============= RESPONSE SCHEMAS =============

class SuccessResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class ErrorResponse(BaseModel):
    success: bool
    error: str
    status_code: int
    details: Optional[Dict[str, Any]] = None
