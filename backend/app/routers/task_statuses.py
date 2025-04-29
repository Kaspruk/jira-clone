from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.task_statuses import create_task_status, get_task_statuses_by_workspace_id, get_task_status_by_id, update_task_status, delete_task_status
from app.models import TaskStatusModel

router = APIRouter(
    prefix="/task-statuses",
    tags=["Task statuses"],
)

@router.post("/", summary="Create task status")
def create_task_status_router(task_status: TaskStatusModel, db=Depends(get_db_connection)):
    with db as connection:
        return create_task_status(task_status, connection)

@router.get("/{workspace_id}/",  summary="Get all tasks statuses by workspace id")
def get_tasks_statuses_by_workspace_id_router(workspace_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return get_task_statuses_by_workspace_id(workspace_id, connection)

@router.get("/{task_status_id}/", summary="Get task status by id")
def get_task_status_by_id_router(task_status_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return get_task_status_by_id(task_status_id, connection)

@router.put("/{task_status_id}/", summary="Update task status by id")
def update_task_status_router(task_status: TaskStatusModel, task_status_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return update_task_status(task_status_id, task_status, connection)

@router.delete("/{task_status_id}/", summary="Delete task status by id")
def delete_task_status_router(task_status_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return delete_task_status(task_status_id, connection)