from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

# Note: These are placeholder models as the original schema didn't explicitly define User/Project tables
# beyond what was inferred from analytics. Expanding them for future use.

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Using String ID to match potential Auth0/Firebase IDs
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

