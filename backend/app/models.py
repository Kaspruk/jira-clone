from typing import Any, Dict, Optional
from datetime import datetime
from app.constants import ErrorMessages
from pydantic import BaseModel, EmailStr
from fastapi.responses import JSONResponse
from fastapi import HTTPException

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
    
class UserUpdateModel(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UserPasswordChangeModel(BaseModel):
    current_password: str
    new_password: str

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    access_token_expires_at: str
    refresh_token_expires_at: str

class AuthResponse(BaseModel):
    user: 'UserResponse'
    token_type: str
    access_token: str
    refresh_token: str
    access_token_expires_at: str
    refresh_token_expires_at: str
    
class CheckTokenRequest(BaseModel):
    access_token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

class ResponseException(Exception):
    UNKNOWN_ERROR = 0
    FAILED_TO_CREATE_USER = 1
    USER_ALREADY_EXISTS = 2
    INVALID_EMAIL = 3
    INVALID_PASSWORD = 4
    ACCESS_TOKEN_EXPIRED = 5
    
    messages = {
        UNKNOWN_ERROR: "Unknown error",
        FAILED_TO_CREATE_USER: "Failed to create user",
        USER_ALREADY_EXISTS: "User already exists",
        INVALID_EMAIL: "Cannot authenticate user by provided email",
        INVALID_PASSWORD: "Password is incorrect",
        ACCESS_TOKEN_EXPIRED: "Access token has expired",
    }
    
    def __init__(self, status_code: int = 400, code: int = UNKNOWN_ERROR, message: str = None, headers: dict = None):
        self.status_code = status_code
        self.code = code
        self.message = message or self.messages.get(code, self.messages.get(self.UNKNOWN_ERROR))
        self.headers = headers
            
        super().__init__(self.status_code, self.code, self.message, self.headers)
        
    def to_dict(self) -> Dict[str, Any]:
        return {
            "code": self.code,
            "message": self.message,
            "status_code": self.status_code,
        }
