from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum


class SkillLevelEnum(str, enum.Enum):
    """Уровень владения навыком: 1-5"""
    BEGINNER = "beginner"      # 1 - начинающий
    ELEMENTARY = "elementary"  # 2 - начальный
    INTERMEDIATE = "intermediate"  # 3 - средний
    ADVANCED = "advanced"      # 4 - продвинутый
    EXPERT = "expert"          # 5 - эксперт


class CareerLevelEnum(str, enum.Enum):
    """Уровень карьеры"""
    JUNIOR = "junior"
    MIDDLE = "middle"
    SENIOR = "senior"
    TEAM_LEAD = "team_lead"


class UserSkill(Base):
    """Таблица навыков пользователя"""
    __tablename__ = "user_skills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Навык
    skill_name = Column(String, nullable=False)  # "Python", "React", "Docker"
    
    # Уровень владения (1-5)
    level = Column(SQLEnum(SkillLevelEnum), default=SkillLevelEnum.BEGINNER)
    
    # Опыт в годах
    years_experience = Column(Float, default=0)
    
    # Описание (где использовал, примеры)
    description = Column(Text, nullable=True)
    
    # Когда последний раз использовал
    last_used = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="skills_detailed")
    
    class Config:
        from_attributes = True


class UserExperience(Base):
    """Таблица опыта работы"""
    __tablename__ = "user_experience"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Информация о работе
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)  # "Junior Developer", "Senior Engineer"
    description = Column(Text, nullable=True)
    
    # Даты
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)  # NULL если работает сейчас
    
    # Уровень который был на этой позиции
    level_at_position = Column(SQLEnum(CareerLevelEnum), nullable=True)
    
    # Используемые технологии (JSON)
    technologies = Column(String, nullable=True)  # "Python, Django, PostgreSQL"
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="experience_detailed")
    
    class Config:
        from_attributes = True


class UserCareerProfile(Base):
    """Таблица карьерного профиля"""
    __tablename__ = "user_career_profile"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    
    # Текущий уровень (определяется на основе assessment)
    current_level = Column(SQLEnum(CareerLevelEnum), default=CareerLevelEnum.JUNIOR)
    
    # Целевой уровень
    target_level = Column(SQLEnum(CareerLevelEnum), nullable=True)
    
    # Общий опыт в годах
    years_total_experience = Column(Float, default=0)
    
    # Специализация (напр. "Backend Developer", "Frontend Developer", "DevOps")
    specialization = Column(String, nullable=True)
    
    # Главная профессия (для рекомендаций смежных)
    primary_profession = Column(String, nullable=True)  # "Backend Developer"
    
    # Готовность к смене профессии (% вероятности)
    career_switch_readiness = Column(Float, default=0)  # 0-100
    
    # Assessment пройден?
    assessment_completed = Column(Boolean, default=False)
    
    # Результат last assessment
    last_assessment_score = Column(Float, nullable=True)  # 0-100
    last_assessment_date = Column(DateTime(timezone=True), nullable=True)
    
    # XP система (геймификация)
    total_xp = Column(Integer, default=0)
    current_level_xp = Column(Integer, default=0)  # XP в текущем уровне
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="career_profile", uselist=False)
    
    class Config:
        from_attributes = True


class CareerPath(Base):
    """Таблица плана развития (сгенерирован AI)"""
    __tablename__ = "career_paths"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # От какого уровня к какому
    from_level = Column(SQLEnum(CareerLevelEnum), nullable=False)
    to_level = Column(SQLEnum(CareerLevelEnum), nullable=False)
    
    # План (JSON или Text с маркдауном)
    plan = Column(Text, nullable=False)  # Подробный план развития
    
    # Ключевые вехи (JSON)
    milestones = Column(String, nullable=True)  # JSON с этапами
    
    # Навыки которые нужно прокачать
    required_skills = Column(String, nullable=True)  # JSON список
    
    # Рекомендуемые проекты для портфолио
    recommended_projects = Column(Text, nullable=True)
    
    # Кто создал план (AI или консультант)
    created_by = Column(String, default="ai")  # "ai" или "consultant"
    
    # Статус
    status = Column(String, default="active")  # "active", "completed", "archived"
    
    # Версия плана
    version = Column(Integer, default=1)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="career_paths")
    
    class Config:
        from_attributes = True


class JobMatchResult(Base):
    """Таблица результатов матчинга вакансий"""
    __tablename__ = "job_match_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Вакансия
    job_id = Column(String, nullable=False)  # ID из HH или других платформ
    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    
    # Процент совпадения
    match_percentage = Column(Float, nullable=False)  # 0-100
    
    # Анализ
    matched_skills = Column(String, nullable=True)  # JSON список совпадающих навыков
    missing_skills = Column(String, nullable=True)  # JSON список недостающих навыков
    recommendations = Column(Text, nullable=True)  # Что нужно подучить
    
    # Уровень
    job_level = Column(SQLEnum(CareerLevelEnum), nullable=True)
    level_match = Column(Boolean, default=True)  # Совпадает ли уровень
    
    # Рекомендация
    recommendation = Column(String, nullable=True)  # "apply", "prepare", "skip"
    # "apply" = >80%, "prepare" = 60-80%, "skip" = <60%
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="job_matches")
    
    class Config:
        from_attributes = True