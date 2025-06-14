from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.task_priorities import TaskPriorityService
from app.services.projects import ProjectService
from app.models import TaskPriorityModel

router = APIRouter(
    prefix="/task-priorities",
    tags=["Task priorities"],
)

@router.post("/{project_id}/", summary="Create task priority")
def create_task_priority_router(task_priority: TaskPriorityModel, project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        task_priority = TaskPriorityService.create_task_priority(task_priority, connection)
        ProjectService.update_project_task_priorities(project_id, task_priority['id'], True, connection)
        return task_priority

@router.get("/{workspace_id}/", summary="Get all task priorities by workspace id")
def get_task_priorities_by_workspace_id_router(workspace_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskPriorityService.get_task_priorities_by_workspace_id(workspace_id, connection)

@router.get("/{task_priority_id}/", summary="Get task priority by id")
def get_task_priority_by_id_router(task_priority_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskPriorityService.get_task_priority_by_id(task_priority_id, connection)

@router.put("/{task_priority_id}/", summary="Update task priority by id")
def update_task_priority_router(task_priority_id: int, task_priority: TaskPriorityModel, db=Depends(get_db_connection)):
    with db as connection:
        return TaskPriorityService.update_task_priority(task_priority_id, task_priority, connection)

@router.delete("/{task_priority_id}/", summary="Delete task priority by id")
def delete_task_priority_router(task_priority_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskPriorityService.delete_task_priority(task_priority_id, connection) 