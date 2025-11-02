from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum


class AssessmentTypeEnum(str, enum.Enum):
    """Тип оценки"""
    TECHNICAL = "technical"  # Технические навыки
    SOFT_SKILLS = "soft_skills"  # Мягкие навыки
    LEADERSHIP = "leadership"  # Лидерство
    GENERAL = "general"  # Общая оценка


class DifficultyEnum(str, enum.Enum):
    """Сложность вопроса"""
    JUNIOR = "junior"
    MIDDLE = "middle"
    SENIOR = "senior"
    EXPERT = "expert"


class AssessmentQuestion(Base):
    """Вопросы для assessment"""
    __tablename__ = "assessment_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Тип и категория
    assessment_type = Column(SQLEnum(AssessmentTypeEnum), default=AssessmentTypeEnum.GENERAL)
    category = Column(String, nullable=False)  # "Programming", "DevOps", "Management"
    
    # Вопрос
    question_text = Column(Text, nullable=False)
    difficulty = Column(SQLEnum(DifficultyEnum), default=DifficultyEnum.JUNIOR)
    
    # Варианты ответов (JSON)
    # [{"id": "a", "text": "Answer A", "points": 10}, ...]
    options = Column(JSON, nullable=False)
    
    # Правильный ответ и баллы
    correct_answer = Column(String, nullable=False)  # "a", "b", "c", "d"
    max_points = Column(Integer, default=10)
    
    # Объяснение правильного ответа
    explanation = Column(Text, nullable=True)
    
    # Активен ли вопрос
    is_active = Column(Integer, default=1)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class AssessmentResult(Base):
    """Результаты прохождения assessment"""
    __tablename__ = "assessment_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Тип теста
    assessment_type = Column(SQLEnum(AssessmentTypeEnum), default=AssessmentTypeEnum.GENERAL)
    
    # Результаты
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    total_score = Column(Float, default=0)  # 0-100
    
    # Определённый уровень
    determined_level = Column(String, nullable=True)  # junior, middle, senior, team_lead
    
    # Детальные результаты (JSON)
    # {"questions": [{"question_id": 1, "user_answer": "a", "correct": true, "points": 10}], ...}
    detailed_results = Column(JSON, nullable=True)
    
    # Рекомендации
    recommendations = Column(Text, nullable=True)
    
    # Слабые и сильные стороны
    strengths = Column(JSON, nullable=True)  # ["Python", "Algorithms"]
    weaknesses = Column(JSON, nullable=True)  # ["System Design", "Testing"]
    
    # Время прохождения
    time_taken_seconds = Column(Integer, nullable=True)
    
    # XP начислено
    xp_earned = Column(Integer, default=0)
    
    # Timestamps
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="assessment_results")


class UserProgress(Base):
    """Прогресс пользователя (геймификация)"""
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    
    # XP и уровень
    total_xp = Column(Integer, default=0)
    current_level = Column(Integer, default=1)  # Уровень игрока 1, 2, 3...
    xp_to_next_level = Column(Integer, default=100)
    
    # Streak (дни подряд)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(DateTime(timezone=True), nullable=True)
    
    # Достижения (JSON)
    # [{"id": "first_assessment", "name": "First Step", "earned_at": "2024-01-01"}]
    achievements = Column(JSON, default=list)
    
    # Статистика
    assessments_completed = Column(Integer, default=0)
    skills_mastered = Column(Integer, default=0)
    career_paths_completed = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="progress", uselist=False)