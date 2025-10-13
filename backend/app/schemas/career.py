from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class SkillLevelEnum(str, Enum):
    BEGINNER = "beginner"
    ELEMENTARY = "elementary"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class CareerLevelEnum(str, Enum):
    JUNIOR = "junior"
    MIDDLE = "middle"
    SENIOR = "senior"
    TEAM_LEAD = "team_lead"


# ============ SKILLS SCHEMAS ============

class UserSkillCreate(BaseModel):
    skill_name: str
    level: SkillLevelEnum = SkillLevelEnum.BEGINNER
    years_experience: float = 0
    description: Optional[str] = None


class UserSkillUpdate(BaseModel):
    level: Optional[SkillLevelEnum] = None
    years_experience: Optional[float] = None
    description: Optional[str] = None


class UserSkillResponse(BaseModel):
    id: int
    skill_name: str
    level: SkillLevelEnum
    years_experience: float
    description: Optional[str] = None
    last_used: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ EXPERIENCE SCHEMAS ============

class UserExperienceCreate(BaseModel):
    company: str
    position: str
    description: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    level_at_position: Optional[CareerLevelEnum] = None
    technologies: Optional[str] = None


class UserExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    level_at_position: Optional[CareerLevelEnum] = None
    technologies: Optional[str] = None


class UserExperienceResponse(BaseModel):
    id: int
    company: str
    position: str
    description: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    level_at_position: Optional[CareerLevelEnum] = None
    technologies: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ CAREER PROFILE SCHEMAS ============

class UserCareerProfileUpdate(BaseModel):
    current_level: Optional[CareerLevelEnum] = None
    target_level: Optional[CareerLevelEnum] = None
    years_total_experience: Optional[float] = None
    specialization: Optional[str] = None
    primary_profession: Optional[str] = None


class UserCareerProfileResponse(BaseModel):
    id: int
    user_id: int
    current_level: CareerLevelEnum
    target_level: Optional[CareerLevelEnum] = None
    years_total_experience: float
    specialization: Optional[str] = None
    primary_profession: Optional[str] = None
    career_switch_readiness: float = 0
    assessment_completed: bool
    last_assessment_score: Optional[float] = None
    last_assessment_date: Optional[datetime] = None
    total_xp: int
    current_level_xp: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============ CAREER PATH SCHEMAS ============

class CareerPathResponse(BaseModel):
    id: int
    user_id: int
    from_level: CareerLevelEnum
    to_level: CareerLevelEnum
    plan: str
    milestones: Optional[str] = None
    required_skills: Optional[str] = None
    recommended_projects: Optional[str] = None
    created_by: str
    status: str
    version: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============ JOB MATCH SCHEMAS ============

class JobMatchResultResponse(BaseModel):
    id: int
    user_id: int
    job_id: str
    job_title: str
    company: str
    match_percentage: float
    matched_skills: Optional[str] = None
    missing_skills: Optional[str] = None
    recommendations: Optional[str] = None
    job_level: Optional[CareerLevelEnum] = None
    level_match: bool
    recommendation: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True