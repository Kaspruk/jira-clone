from fastapi import APIRouter, Depends
from typing import Dict
from app.database import get_db_connection
from app.services.task_priorities import TaskPriorityService
from app.services.projects import ProjectService
from app.models import TaskPriorityModel

router = APIRouter()

@router.get("/workspace/{workspace_id}")
def get_task_priorities_by_workspace_id_router(workspace_id: int, db=Depends(get_db_connection)):
    connection = db['connection']
    return TaskPriorityService.get_task_priorities_by_workspace_id(workspace_id, connection)

@router.get("/{task_priority_id}")
def get_task_priority_by_id_router(task_priority_id: int, db=Depends(get_db_connection)):
    connection = db['connection']
    return TaskPriorityService.get_task_priority_by_id(task_priority_id, connection)

@router.post("/")
def create_task_priority_router(task_priority: TaskPriorityModel, db=Depends(get_db_connection)):
    connection = db['connection']
    return TaskPriorityService.create_task_priority(task_priority, connection)

@router.put("/{task_priority_id}")
def update_task_priority_router(task_priority_id: int, task_priority: TaskPriorityModel, db=Depends(get_db_connection)):
    connection = db['connection']
    return TaskPriorityService.update_task_priority(task_priority_id, task_priority, connection)

@router.delete("/{task_priority_id}")
def delete_task_priority_router(task_priority_id: int, db=Depends(get_db_connection)):
    connection = db['connection']
    return TaskPriorityService.delete_task_priority(task_priority_id, connection)

@router.patch("/project/{project_id}")
def update_project_priorities_router(project_id: int, data: Dict[str, any], db=Depends(get_db_connection)):
    connection = db['connection']
    return ProjectService.update_project_priorities(project_id, data['priorityId'], data['value'], connection)

@router.patch("/project/{project_id}/order")    
def update_project_priorities_order_router(data: Dict[str, int], project_id: int, db=Depends(get_db_connection)):
    connection = db['connection']
    return ProjectService.update_project_priorities_order(project_id, data['oldIndex'], data['newIndex'], connection) 