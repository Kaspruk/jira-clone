from typing import Optional
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

class UserModel(BaseModel):
    username: str
    email: EmailStr
    password: str

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