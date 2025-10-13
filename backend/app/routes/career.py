from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.database import get_db
from app.models.user import User
from app.models.career import (
    UserSkill,
    UserExperience,
    UserCareerProfile,
    CareerPath,
    JobMatchResult,
    SkillLevelEnum,
    CareerLevelEnum,
)
from app.schemas.career import (
    UserSkillCreate,
    UserSkillUpdate,
    UserSkillResponse,
    UserExperienceCreate,
    UserExperienceUpdate,
    UserExperienceResponse,
    UserCareerProfileResponse,
    UserCareerProfileUpdate,
    CareerPathResponse,
    JobMatchResultResponse,
)
from app.api.users import get_current_user

router = APIRouter(prefix="/api/v1/career", tags=["career"])


# ============ SKILLS ENDPOINTS ============

@router.post("/skills", response_model=UserSkillResponse)
def add_skill(
    skill_data: UserSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Добавить новый навык пользователю"""
    
    # Проверяем что навыка ещё нет
    existing_skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_name == skill_data.skill_name,
    ).first()
    
    if existing_skill:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Skill '{skill_data.skill_name}' already exists",
        )
    
    # Создаём новый навык
    db_skill = UserSkill(
        user_id=current_user.id,
        skill_name=skill_data.skill_name,
        level=skill_data.level,
        years_experience=skill_data.years_experience,
        description=skill_data.description,
    )
    
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    
    return db_skill


@router.get("/skills", response_model=List[UserSkillResponse])
def get_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить все навыки пользователя"""
    
    skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id
    ).all()
    
    return skills


@router.put("/skills/{skill_id}", response_model=UserSkillResponse)
def update_skill(
    skill_id: int,
    skill_data: UserSkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Обновить навык"""
    
    db_skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id,
    ).first()
    
    if not db_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    
    # Обновляем поля если они переданы
    if skill_data.level is not None:
        db_skill.level = skill_data.level
    if skill_data.years_experience is not None:
        db_skill.years_experience = skill_data.years_experience
    if skill_data.description is not None:
        db_skill.description = skill_data.description
    
    db_skill.last_used = datetime.utcnow()
    
    db.commit()
    db.refresh(db_skill)
    
    return db_skill


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Удалить навык"""
    
    db_skill = db.query(UserSkill).filter(
        UserSkill.id == skill_id,
        UserSkill.user_id == current_user.id,
    ).first()
    
    if not db_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )
    
    db.delete(db_skill)
    db.commit()


# ============ EXPERIENCE ENDPOINTS ============

@router.post("/experience", response_model=UserExperienceResponse)
def add_experience(
    exp_data: UserExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Добавить опыт работы"""
    
    db_experience = UserExperience(
        user_id=current_user.id,
        company=exp_data.company,
        position=exp_data.position,
        description=exp_data.description,
        start_date=exp_data.start_date,
        end_date=exp_data.end_date,
        level_at_position=exp_data.level_at_position,
        technologies=exp_data.technologies,
    )
    
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    
    return db_experience


@router.get("/experience", response_model=List[UserExperienceResponse])
def get_experience(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить весь опыт работы пользователя"""
    
    experience = db.query(UserExperience).filter(
        UserExperience.user_id == current_user.id
    ).order_by(UserExperience.start_date.desc()).all()
    
    return experience


@router.put("/experience/{exp_id}", response_model=UserExperienceResponse)
def update_experience(
    exp_id: int,
    exp_data: UserExperienceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Обновить опыт работы"""
    
    db_exp = db.query(UserExperience).filter(
        UserExperience.id == exp_id,
        UserExperience.user_id == current_user.id,
    ).first()
    
    if not db_exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )
    
    # Обновляем поля если они переданы
    if exp_data.company is not None:
        db_exp.company = exp_data.company
    if exp_data.position is not None:
        db_exp.position = exp_data.position
    if exp_data.description is not None:
        db_exp.description = exp_data.description
    if exp_data.start_date is not None:
        db_exp.start_date = exp_data.start_date
    if exp_data.end_date is not None:
        db_exp.end_date = exp_data.end_date
    if exp_data.level_at_position is not None:
        db_exp.level_at_position = exp_data.level_at_position
    if exp_data.technologies is not None:
        db_exp.technologies = exp_data.technologies
    
    db.commit()
    db.refresh(db_exp)
    
    return db_exp


@router.delete("/experience/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    exp_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Удалить опыт работы"""
    
    db_exp = db.query(UserExperience).filter(
        UserExperience.id == exp_id,
        UserExperience.user_id == current_user.id,
    ).first()
    
    if not db_exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found",
        )
    
    db.delete(db_exp)
    db.commit()


# ============ CAREER PROFILE ENDPOINTS ============

@router.get("/profile", response_model=UserCareerProfileResponse)
def get_career_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить карьерный профиль пользователя"""
    
    profile = db.query(UserCareerProfile).filter(
        UserCareerProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        # Создаём профиль если его ещё нет
        profile = UserCareerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    return profile


@router.put("/profile", response_model=UserCareerProfileResponse)
def update_career_profile(
    profile_data: UserCareerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Обновить карьерный профиль"""
    
    profile = db.query(UserCareerProfile).filter(
        UserCareerProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        # Создаём если не существует
        profile = UserCareerProfile(user_id=current_user.id)
        db.add(profile)
    
    # Обновляем поля
    if profile_data.current_level is not None:
        profile.current_level = profile_data.current_level
    if profile_data.target_level is not None:
        profile.target_level = profile_data.target_level
    if profile_data.years_total_experience is not None:
        profile.years_total_experience = profile_data.years_total_experience
    if profile_data.specialization is not None:
        profile.specialization = profile_data.specialization
    if profile_data.primary_profession is not None:
        profile.primary_profession = profile_data.primary_profession
    
    db.commit()
    db.refresh(profile)
    
    return profile


@router.post("/profile/assessment")
def complete_assessment(
    score: float,  # 0-100
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Сохранить результат assessment и определить уровень"""
    
    profile = db.query(UserCareerProfile).filter(
        UserCareerProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        profile = UserCareerProfile(user_id=current_user.id)
        db.add(profile)
    
    # Определяем уровень по score
    if score < 30:
        level = CareerLevelEnum.JUNIOR
    elif score < 60:
        level = CareerLevelEnum.MIDDLE
    elif score < 85:
        level = CareerLevelEnum.SENIOR
    else:
        level = CareerLevelEnum.TEAM_LEAD
    
    profile.current_level = level
    profile.last_assessment_score = score
    profile.last_assessment_date = datetime.utcnow()
    profile.assessment_completed = True
    
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Assessment completed",
        "score": score,
        "level": level,
        "xp_earned": int(score * 10),  # Начисляем XP
    }


# ============ CAREER PATH ENDPOINTS ============

@router.get("/paths", response_model=List[CareerPathResponse])
def get_career_paths(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить все планы развития пользователя"""
    
    paths = db.query(CareerPath).filter(
        CareerPath.user_id == current_user.id,
        CareerPath.status == "active",
    ).all()
    
    return paths


@router.post("/paths", response_model=CareerPathResponse)
def create_career_path(
    path_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Создать план развития (от AI или консультанта)
    
    JSON параметры:
    {
        "from_level": "junior",
        "to_level": "middle",
        "plan": "Подробный текст плана...",
        "milestones": "[milestone1, milestone2]",
        "required_skills": "[skill1, skill2]",
        "created_by": "ai" или "consultant"
    }
    """
    
    # Проверяем что такого плана ещё нет
    existing = db.query(CareerPath).filter(
        CareerPath.user_id == current_user.id,
        CareerPath.from_level == path_data.get("from_level"),
        CareerPath.to_level == path_data.get("to_level"),
        CareerPath.status == "active",
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Career path already exists for this transition",
        )
    
    db_path = CareerPath(
        user_id=current_user.id,
        from_level=path_data.get("from_level"),
        to_level=path_data.get("to_level"),
        plan=path_data.get("plan", ""),
        milestones=path_data.get("milestones"),
        required_skills=path_data.get("required_skills"),
        created_by=path_data.get("created_by", "ai"),
    )
    
    db.add(db_path)
    db.commit()
    db.refresh(db_path)
    
    return db_path


@router.get("/paths/{path_id}", response_model=CareerPathResponse)
def get_career_path(
    path_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить конкретный план развития"""
    
    path = db.query(CareerPath).filter(
        CareerPath.id == path_id,
        CareerPath.user_id == current_user.id,
    ).first()
    
    if not path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career path not found",
        )
    
    return path


@router.put("/paths/{path_id}", response_model=CareerPathResponse)
def update_career_path(
    path_id: int,
    path_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Обновить план развития"""
    
    db_path = db.query(CareerPath).filter(
        CareerPath.id == path_id,
        CareerPath.user_id == current_user.id,
    ).first()
    
    if not db_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career path not found",
        )
    
    if "plan" in path_data:
        db_path.plan = path_data["plan"]
    if "status" in path_data:
        db_path.status = path_data["status"]
    if "version" in path_data:
        db_path.version = path_data["version"]
    
    db.commit()
    db.refresh(db_path)
    
    return db_path


# ============ JOB MATCHING ENDPOINTS ============

@router.post("/job-match")
def analyze_job_match(
    job_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Проанализировать совпадение с вакансией
    
    JSON параметры:
    {
        "job_id": "hh_123456",
        "job_title": "Senior Python Developer",
        "company": "Tech Company",
        "required_skills": ["Python", "Django", "PostgreSQL"],
        "job_level": "senior"
    }
    """
    
    # Получаем навыки пользователя
    user_skills = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id
    ).all()
    
    user_skill_names = {skill.skill_name.lower(): skill for skill in user_skills}
    required_skills = [s.lower() for s in job_data.get("required_skills", [])]
    
    # Считаем совпадения
    matched_skills = [s for s in required_skills if s in user_skill_names]
    missing_skills = [s for s in required_skills if s not in user_skill_names]
    
    # Рассчитываем процент
    if required_skills:
        match_percentage = (len(matched_skills) / len(required_skills)) * 100
    else:
        match_percentage = 100
    
    # Определяем рекомендацию
    if match_percentage >= 80:
        recommendation = "apply"
    elif match_percentage >= 60:
        recommendation = "prepare"
    else:
        recommendation = "skip"
    
    # Сохраняем результат
    db_match = JobMatchResult(
        user_id=current_user.id,
        job_id=job_data.get("job_id", ""),
        job_title=job_data.get("job_title", ""),
        company=job_data.get("company", ""),
        match_percentage=round(match_percentage, 2),
        matched_skills=str(matched_skills),
        missing_skills=str(missing_skills),
        job_level=job_data.get("job_level"),
        recommendation=recommendation,
    )
    
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    
    return {
        "match_percentage": round(match_percentage, 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendation": recommendation,
        "suggestions": f"You need to learn: {', '.join(missing_skills)}" if missing_skills else "You're ready to apply!",
    }


@router.get("/job-matches", response_model=List[JobMatchResultResponse])
def get_job_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить историю анализа вакансий"""
    
    matches = db.query(JobMatchResult).filter(
        JobMatchResult.user_id == current_user.id
    ).order_by(JobMatchResult.created_at.desc()).all()
    
    return matches