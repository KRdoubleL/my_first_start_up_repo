from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import json

from app.db.database import get_db
from app.models.user import User
from app.models.assessment import (
    AssessmentQuestion,
    AssessmentResult,
    UserProgress,
    AssessmentTypeEnum,
)
from app.schemas.assessment import (
    AssessmentQuestionResponse,
    AssessmentSubmission,
    AssessmentResultResponse,
    UserProgressResponse,
)
from app.api.users import get_current_user

router = APIRouter(prefix="/api/v1/assessment", tags=["assessment"])


@router.get("/questions", response_model=List[AssessmentQuestionResponse])
def get_assessment_questions(
    assessment_type: str = "general",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить вопросы для assessment теста"""
    
    questions = db.query(AssessmentQuestion).filter(
        AssessmentQuestion.assessment_type == assessment_type,
        AssessmentQuestion.is_active == 1,
    ).all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")
    
    # Убираем правильные ответы из ответа
    questions_response = []
    for q in questions:
        question_dict = {
            "id": q.id,
            "assessment_type": q.assessment_type,
            "category": q.category,
            "question_text": q.question_text,
            "difficulty": q.difficulty,
            "options": q.options,  # Уже без points
        }
        questions_response.append(question_dict)
    
    return questions_response


@router.post("/submit", response_model=AssessmentResultResponse)
def submit_assessment(
    submission: AssessmentSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Отправить ответы и получить результат"""
    
    # Получаем все вопросы
    question_ids = [answer.question_id for answer in submission.answers]
    questions = db.query(AssessmentQuestion).filter(
        AssessmentQuestion.id.in_(question_ids)
    ).all()
    
    questions_dict = {q.id: q for q in questions}
    
    # Подсчитываем результаты
    total_questions = len(questions)
    correct_answers = 0
    total_points = 0
    max_possible_points = sum(q.max_points for q in questions)
    detailed_results = []
    
    category_scores = {}  # Для определения сильных/слабых сторон
    
    for answer in submission.answers:
        question = questions_dict.get(answer.question_id)
        if not question:
            continue
        
        is_correct = answer.user_answer == question.correct_answer
        points = question.max_points if is_correct else 0
        
        if is_correct:
            correct_answers += 1
        
        total_points += points
        
        # Группируем по категориям
        if question.category not in category_scores:
            category_scores[question.category] = {"correct": 0, "total": 0}
        category_scores[question.category]["total"] += 1
        if is_correct:
            category_scores[question.category]["correct"] += 1
        
        detailed_results.append({
            "question_id": question.id,
            "category": question.category,
            "user_answer": answer.user_answer,
            "correct_answer": question.correct_answer,
            "is_correct": is_correct,
            "points": points,
        })
    
    # Рассчитываем процент (0-100)
    score_percentage = (total_points / max_possible_points * 100) if max_possible_points > 0 else 0
    
    # Определяем уровень
    if score_percentage < 30:
        level = "junior"
    elif score_percentage < 60:
        level = "middle"
    elif score_percentage < 85:
        level = "senior"
    else:
        level = "team_lead"
    
    # Определяем сильные и слабые стороны
    strengths = []
    weaknesses = []
    
    for category, scores in category_scores.items():
        percentage = (scores["correct"] / scores["total"] * 100) if scores["total"] > 0 else 0
        if percentage >= 70:
            strengths.append(category)
        elif percentage < 50:
            weaknesses.append(category)
    
    # Рекомендации
    recommendations = generate_recommendations(level, weaknesses)
    
    # Начисляем XP
    xp_earned = int(score_percentage * 10)  # 0-1000 XP
    
    # Сохраняем результат
    result = AssessmentResult(
        user_id=current_user.id,
        assessment_type=submission.assessment_type,
        total_questions=total_questions,
        correct_answers=correct_answers,
        total_score=round(score_percentage, 2),
        determined_level=level,
        detailed_results=detailed_results,
        recommendations=recommendations,
        strengths=strengths,
        weaknesses=weaknesses,
        time_taken_seconds=submission.time_taken_seconds,
        xp_earned=xp_earned,
    )
    
    db.add(result)
    
    # Обновляем прогресс пользователя
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).first()
    
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
    
    progress.total_xp += xp_earned
    progress.assessments_completed += 1
    
    # Проверяем повышение уровня
    while progress.total_xp >= progress.xp_to_next_level:
        progress.current_level += 1
        progress.total_xp -= progress.xp_to_next_level
        progress.xp_to_next_level = calculate_next_level_xp(progress.current_level)
    
    # Обновляем streak
    today = datetime.utcnow().date()
    if progress.last_activity_date:
        last_activity = progress.last_activity_date.date()
        if last_activity == today:
            pass  # Уже активен сегодня
        elif last_activity == today - timedelta(days=1):
            progress.current_streak += 1
        else:
            progress.current_streak = 1
    else:
        progress.current_streak = 1
    
    progress.last_activity_date = datetime.utcnow()
    if progress.current_streak > progress.longest_streak:
        progress.longest_streak = progress.current_streak
    
    # Добавляем достижение за первый assessment
    if progress.assessments_completed == 1:
        achievements = progress.achievements or []
        achievements.append({
            "id": "first_assessment",
            "name": "First Step",
            "description": "Complete your first assessment",
            "earned_at": datetime.utcnow().isoformat(),
        })
        progress.achievements = achievements
    
    # Обновляем карьерный профиль
    from app.models.career import UserCareerProfile
    career_profile = db.query(UserCareerProfile).filter(
        UserCareerProfile.user_id == current_user.id
    ).first()
    
    if career_profile:
        career_profile.current_level = level
        career_profile.last_assessment_score = score_percentage
        career_profile.last_assessment_date = datetime.utcnow()
        career_profile.assessment_completed = True
    
    db.commit()
    db.refresh(result)
    
    return result


@router.get("/results", response_model=List[AssessmentResultResponse])
def get_assessment_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить историю assessment результатов"""
    
    results = db.query(AssessmentResult).filter(
        AssessmentResult.user_id == current_user.id
    ).order_by(AssessmentResult.completed_at.desc()).all()
    
    return results


@router.get("/progress", response_model=UserProgressResponse)
def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Получить прогресс пользователя (XP, уровень, достижения)"""
    
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).first()
    
    if not progress:
        # Создаём если не существует
        progress = UserProgress(user_id=current_user.id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    return progress


def generate_recommendations(level: str, weaknesses: List[str]) -> str:
    """Генерирует рекомендации на основе уровня и слабых сторон"""
    
    recommendations = []
    
    if level == "junior":
        recommendations.append("Focus on building strong fundamentals in programming.")
        recommendations.append("Practice coding challenges daily on platforms like LeetCode.")
    elif level == "middle":
        recommendations.append("Work on system design and architecture patterns.")
        recommendations.append("Contribute to open-source projects to gain experience.")
    elif level == "senior":
        recommendations.append("Develop leadership and mentoring skills.")
        recommendations.append("Focus on strategic thinking and technical decision-making.")
    else:  # team_lead
        recommendations.append("Enhance team management and project planning skills.")
        recommendations.append("Focus on cross-functional collaboration and stakeholder management.")
    
    if weaknesses:
        recommendations.append(f"Areas to improve: {', '.join(weaknesses)}")
    
    return " ".join(recommendations)


def calculate_next_level_xp(current_level: int) -> int:
    """Рассчитывает XP необходимый для следующего уровня"""
    # Прогрессивная формула: каждый уровень требует больше XP
    return 100 * current_level