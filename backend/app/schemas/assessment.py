from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class QuestionOption(BaseModel):
    id: str
    text: str
    points: int


class AssessmentQuestionResponse(BaseModel):
    id: int
    assessment_type: str
    category: str
    question_text: str
    difficulty: str
    options: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True


class AssessmentAnswer(BaseModel):
    question_id: int
    user_answer: str  # "a", "b", "c", "d"


class AssessmentSubmission(BaseModel):
    assessment_type: str
    answers: List[AssessmentAnswer]
    time_taken_seconds: Optional[int] = None


class AssessmentResultResponse(BaseModel):
    id: int
    user_id: int
    assessment_type: str
    total_questions: int
    correct_answers: int
    total_score: float
    determined_level: Optional[str] = None
    recommendations: Optional[str] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    time_taken_seconds: Optional[int] = None
    xp_earned: int
    completed_at: datetime
    
    class Config:
        from_attributes = True


class UserProgressResponse(BaseModel):
    id: int
    user_id: int
    total_xp: int
    current_level: int
    xp_to_next_level: int
    current_streak: int
    longest_streak: int
    achievements: List[Dict[str, Any]]
    assessments_completed: int
    skills_mastered: int
    career_paths_completed: int
    
    class Config:
        from_attributes = True