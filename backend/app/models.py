from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, JSON, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

# ============= USER MODELS =============

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    display_name = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    theme = Column(String, default="light")  # light/dark
    language = Column(String, default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    
    # Relationships
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    analytics = relationship("AnalyticsRecord", back_populates="user", cascade="all, delete-orphan")

# ============= CHAT MODELS =============

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    messages = Column(JSON, default=[])  # List of message objects
    title = Column(String, nullable=True)  # Chat title/summary
    total_messages = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="chat_histories")

# ============= ANALYTICS MODELS =============

class AnalyticsRecord(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    query_count = Column(Integer, default=0)
    emergency_cases = Column(Integer, default=0)
    avg_response_time_ms = Column(Float, default=0.0)
    ml_accuracy = Column(Float, default=0.0)
    sentiment_analysis_data = Column(JSON, default={})  # Store sentiment percentages
    intent_distribution = Column(JSON, default={})  # Store intent distribution
    recorded_date = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="analytics")

# ============= HEALTH REPORT MODELS =============

class HealthReport(Base):
    __tablename__ = "health_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    symptoms = Column(JSON)  # List of reported symptoms
    risk_level = Column(String)  # low/medium/high/critical
    recommendations = Column(JSON)  # List of recommendations
    ml_diagnosis = Column(Text, nullable=True)  # ML model output
    emergency_flag = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ============= SESSION/TOKEN MODELS =============

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String, unique=True, nullable=False, index=True)
    is_revoked = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
