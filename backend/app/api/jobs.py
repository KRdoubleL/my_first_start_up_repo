from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.user import User
from app.models.saved_job import SavedJob
from app.schemas.job import JobSearch, JobResponse, JobCreate, SavedJobResponse, JobStats
from app.api.users import get_current_user
from app.services.adzuna_service import search_jobs, get_job_stats

router = APIRouter()


@router.post("/search", response_model=List[JobResponse])
async def search_jobs_endpoint(
    search_params: JobSearch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search for jobs based on skills"""
    
    # Search jobs using Adzuna API
    jobs = await search_jobs(
        skills=search_params.skills,
        location=search_params.location
    )
    
    # Calculate match percentage for each job
    user_skills_lower = [s.lower() for s in search_params.skills]
    
    for job in jobs:
        job_skills_lower = [s.lower() for s in job.required_skills]
        matching_skills = [s for s in job_skills_lower if s in user_skills_lower]
        
        if len(job.required_skills) > 0:
            job.match_percentage = round((len(matching_skills) / len(job.required_skills)) * 100)
        else:
            job.match_percentage = 0
    
    # Filter by minimum match percentage
    filtered_jobs = [
        job for job in jobs 
        if job.match_percentage >= search_params.min_match_percentage
    ]
    
    # Sort by match percentage (descending)
    filtered_jobs.sort(key=lambda x: x.match_percentage, reverse=True)
    
    return filtered_jobs


@router.post("/saved", response_model=SavedJobResponse, status_code=status.HTTP_201_CREATED)
async def save_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a job to user's favorites"""
    
    # Check if job already saved
    existing = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_data.job_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job already saved"
        )
    
    # Calculate match percentage
    user_skills_lower = [s.lower() for s in current_user.skills]
    job_skills_lower = [s.lower() for s in job_data.required_skills]
    matching_skills = [s for s in job_skills_lower if s in user_skills_lower]
    
    match_percentage = 0
    if len(job_data.required_skills) > 0:
        match_percentage = round((len(matching_skills) / len(job_data.required_skills)) * 100)
    
    # Create saved job
    saved_job = SavedJob(
        user_id=current_user.id,
        job_id=job_data.job_id,
        title=job_data.title,
        company=job_data.company,
        location=job_data.location,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        currency=job_data.currency,
        description=job_data.description,
        required_skills=job_data.required_skills,
        match_percentage=match_percentage,
        source=job_data.source,
        external_url=job_data.external_url
    )
    
    db.add(saved_job)
    db.commit()
    db.refresh(saved_job)
    
    return saved_job


@router.get("/saved", response_model=List[SavedJobResponse])
async def get_saved_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all saved jobs for current user"""
    saved_jobs = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id
    ).order_by(SavedJob.saved_at.desc()).all()
    
    return saved_jobs


@router.delete("/saved/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a job from saved jobs"""
    saved_job = db.query(SavedJob).filter(
        SavedJob.id == job_id,
        SavedJob.user_id == current_user.id
    ).first()
    
    if not saved_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved job not found"
        )
    
    db.delete(saved_job)
    db.commit()
    
    return None


@router.get("/stats", response_model=JobStats)
async def get_statistics(
    skills: List[str] = Query(...),
    location: Optional[str] = "Germany",
    current_user: User = Depends(get_current_user)
):
    """Get job market statistics for given skills"""
    stats = await get_job_stats(skills=skills, location=location)
    return stats