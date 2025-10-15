from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.api import auth, users, jobs
from app.routes import career
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://my-first-start-up-repo.vercel.app/",  # your actual frontend domain
        "http://localhost:5173",           # for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_V1_PREFIX}/users", tags=["users"])
app.include_router(jobs.router, prefix=f"{settings.API_V1_PREFIX}/jobs", tags=["jobs"])
app.include_router(career.router)


@app.get("/")
async def root():
    return {
        "message": "Career Hack API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}