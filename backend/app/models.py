from typing import Literal, Dict
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
    type: Literal['TASK', 'HISTORY', 'ISSUE', 'EPIC', 'ENHANCEMENT', 'DEFECT']
    status: Literal['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']
    priority: Literal['LOW', 'MEDIUM', 'HIGHT']
    project_id: int
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