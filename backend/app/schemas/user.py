from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    skills: Optional[List[str]] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    education: Optional[List[dict]] = None
    experience: Optional[List[dict]] = None


class UserProfile(UserBase):
    id: int
    skills: List[str] = []
    bio: Optional[str] = None
    location: Optional[str] = None
    education: List[dict] = []
    experience: List[dict] = []
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None