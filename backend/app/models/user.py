from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    
    # Profile fields
    skills = Column(JSON, default=list)  # ["Python", "React", "Docker"]
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)  # "Berlin, Germany"
    education = Column(JSON, default=list)  # [{"school": "...", "degree": "...", "year": 2020}]
    experience = Column(JSON, default=list)  # [{"company": "...", "role": "...", "years": 2}]
    
    # Account settings
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")