from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"), index=True)
    message_data = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class VisionCache(Base):
    __tablename__ = "vision_cache"

    id = Column(Integer, primary_key=True, index=True)
    image_hash = Column(String, unique=True, index=True, nullable=False)
    analysis_result = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ImageCache(Base):
    __tablename__ = "image_cache"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String, nullable=False)
    query = Column(String, nullable=False)
    page = Column(Integer, nullable=False)
    data = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
