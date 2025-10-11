from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class SavedJob(Base):
    __tablename__ = "saved_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Job details
    job_id = Column(String, nullable=False)  # External job ID from API
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=True)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    currency = Column(String, default="EUR")
    description = Column(Text, nullable=True)
    required_skills = Column(JSON, default=list)
    
    # Matching info
    match_percentage = Column(Integer, nullable=True)
    
    # Metadata
    source = Column(String, nullable=True)  # "adzuna", "linkedin", etc.
    external_url = Column(String, nullable=True)
    
    # Timestamps
    saved_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="saved_jobs")