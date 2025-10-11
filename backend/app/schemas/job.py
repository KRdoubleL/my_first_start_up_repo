from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class JobBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    required_skills: List[str] = []


class JobCreate(JobBase):
    job_id: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    currency: str = "EUR"
    source: Optional[str] = None
    external_url: Optional[str] = None


class JobSearch(BaseModel):
    skills: List[str]
    location: Optional[str] = "Germany"
    min_match_percentage: int = 0


class JobResponse(JobBase):
    job_id: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    currency: str = "EUR"
    match_percentage: Optional[int] = None
    source: Optional[str] = None
    external_url: Optional[str] = None


class SavedJobResponse(JobResponse):
    id: int
    saved_at: datetime
    
    class Config:
        from_attributes = True


class JobStats(BaseModel):
    total_jobs: int
    avg_salary: Optional[float] = None
    top_skills: List[dict] = []
    top_roles: List[dict] = []
    locations: List[dict] = []