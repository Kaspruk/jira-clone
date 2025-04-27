from typing import Literal
from pydantic import BaseModel, EmailStr

class ProjectModel(BaseModel):
    name: str
    description: str
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
    order: int
    project_id: int
