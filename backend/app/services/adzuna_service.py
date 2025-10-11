import httpx
from typing import List, Optional
from app.core.config import settings
from app.schemas.job import JobResponse, JobStats


async def search_jobs(
    skills: List[str],
    location: str = "Germany",
    max_results: int = 50
) -> List[JobResponse]:
    """Search for jobs using Adzuna API"""
    
    # For now, return mock data until we set up Adzuna API keys
    # TODO: Implement real Adzuna API integration
    
    mock_jobs = [
        {
            "job_id": "adzuna_1",
            "title": "Senior Software Engineer",
            "company": "TechCorp GmbH",
            "location": "Berlin, Germany",
            "salary_min": 70000,
            "salary_max": 95000,
            "currency": "EUR",
            "description": "We are looking for an experienced Software Engineer to join our team.",
            "required_skills": ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
            "source": "adzuna",
            "external_url": "https://example.com/job1"
        },
        {
            "job_id": "adzuna_2",
            "title": "Full Stack Developer",
            "company": "Digital Solutions AG",
            "location": "Munich, Germany",
            "salary_min": 60000,
            "salary_max": 80000,
            "currency": "EUR",
            "description": "Join our dynamic team building modern web applications.",
            "required_skills": ["React", "Node.js", "TypeScript", "MongoDB"],
            "source": "adzuna",
            "external_url": "https://example.com/job2"
        },
        {
            "job_id": "adzuna_3",
            "title": "Frontend Developer",
            "company": "StartupHub",
            "location": "Berlin, Germany",
            "salary_min": 55000,
            "salary_max": 75000,
            "currency": "EUR",
            "description": "Create beautiful user interfaces with React and TypeScript.",
            "required_skills": ["React", "TypeScript", "CSS", "JavaScript"],
            "source": "adzuna",
            "external_url": "https://example.com/job3"
        },
        {
            "job_id": "adzuna_4",
            "title": "DevOps Engineer",
            "company": "CloudTech",
            "location": "Hamburg, Germany",
            "salary_min": 65000,
            "salary_max": 90000,
            "currency": "EUR",
            "description": "Manage our cloud infrastructure and CI/CD pipelines.",
            "required_skills": ["Docker", "Kubernetes", "AWS", "Python", "Linux"],
            "source": "adzuna",
            "external_url": "https://example.com/job4"
        },
        {
            "job_id": "adzuna_5",
            "title": "Data Scientist",
            "company": "DataCorp",
            "location": "Berlin, Germany",
            "salary_min": 70000,
            "salary_max": 100000,
            "currency": "EUR",
            "description": "Analyze data and build machine learning models.",
            "required_skills": ["Python", "Machine Learning", "SQL", "TensorFlow"],
            "source": "adzuna",
            "external_url": "https://example.com/job5"
        }
    ]
    
    # Convert to JobResponse objects
    jobs = [JobResponse(**job) for job in mock_jobs]
    
    return jobs


async def get_job_stats(
    skills: List[str],
    location: str = "Germany"
) -> JobStats:
    """Get job market statistics"""
    
    # Mock statistics
    # TODO: Implement real statistics from Adzuna API
    
    return JobStats(
        total_jobs=1234,
        avg_salary=72500.0,
        top_skills=[
            {"skill": "Python", "count": 450},
            {"skill": "JavaScript", "count": 380},
            {"skill": "React", "count": 320},
            {"skill": "Docker", "count": 290},
            {"skill": "AWS", "count": 270}
        ],
        top_roles=[
            {"role": "Software Engineer", "count": 350},
            {"role": "Full Stack Developer", "count": 280},
            {"role": "Frontend Developer", "count": 220},
            {"role": "DevOps Engineer", "count": 180},
            {"role": "Data Scientist", "count": 150}
        ],
        locations=[
            {"location": "Berlin", "count": 520},
            {"location": "Munich", "count": 340},
            {"location": "Hamburg", "count": 210},
            {"location": "Frankfurt", "count": 164}
        ]
    )