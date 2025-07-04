from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

class WorkspaceModel(BaseModel):
    name: str
    description: str
    owner_id: int

class ProjectModel(BaseModel):
    name: str
    description: str
    workspace_id: int
    owner_id: int

class TaskModel(BaseModel):
    title: str
    description: str
    type_id: Optional[int] = None
    status_id: Optional[int] = None
    priority_id: Optional[int] = None
    project_id: int
    workspace_id: int
    author_id: int
    assignee_id: int

class TaskStatusModel(BaseModel):
    name: str
    icon: str
    color: str
    description: str
    workspace_id: int

class TaskPriorityModel(BaseModel):
    name: str
    icon: str
    color: str
    description: str
    workspace_id: int

class TaskTypeModel(BaseModel):
    name: str
    icon: str
    color: str
    description: str
    workspace_id: int

# Auth models
class UserModel(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLoginModel(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
    
class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    access_token_expires_at: str
    refresh_token_expires_at: str

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: 'UserResponse'

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None