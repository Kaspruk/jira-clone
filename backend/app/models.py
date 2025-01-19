from typing import Literal
from pydantic import BaseModel, EmailStr

class ProjectModel(BaseModel):
    name: str
    description: str
    owner_id: int

class TaskModel(BaseModel):
    title: str
    description: str
    status: Literal['new', 'in_progress', 'completed']
    priority: Literal['low', 'medium', 'high']
    project_id: int
    assignee_id: int

class UserModel(BaseModel):
    username: str
    email: EmailStr
    password: str