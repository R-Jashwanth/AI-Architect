from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class AnalyticsMetric(Base):
    __tablename__ = "analytics_metrics"

    id = Column(Integer, primary_key=True, index=True)
    metric_type = Column(String, index=True, nullable=False)
    metric_value = Column(Integer, nullable=False)
    user_id = Column(String, index=True, nullable=True)
    project_id = Column(String, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AnalyticsSummary(Base):
    __tablename__ = "analytics_summary"

    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, unique=True, nullable=False)
    total_value = Column(Integer, default=0, nullable=False)
    monthly_growth = Column(Float, default=0.0)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ProjectAnalytics(Base):
    __tablename__ = "project_analytics"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    collaborators = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
