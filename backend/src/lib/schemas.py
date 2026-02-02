from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional
from uuid import UUID

# Base Schema
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    username: EmailStr  # We use email as username
    password: str

class UserResponse(BaseSchema):
    id: UUID
    email: EmailStr
    name: str

class Token(BaseModel):
    access_token: str
    token_type: str

# TODO Schemas
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

class TodoResponse(TodoBase, BaseSchema):
    id: UUID
    is_completed: bool
    created_at: datetime
