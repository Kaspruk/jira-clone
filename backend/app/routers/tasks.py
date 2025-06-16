from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.tasks import TaskService
from app.models import TaskModel

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)

@router.post("/", summary="Create task")
def create_ptask_router(task: TaskModel, db=Depends(get_db_connection)):
    with db as connection:
        return TaskService.create_task(task, connection)
    
@router.get("/",  summary="Get all tasks")
def get_tasks_router(db=Depends(get_db_connection), projectId: str | None = None):
    with db as connection:
        return TaskService.get_tasks(connection, projectId)

@router.get("/{task_id}/", summary="Get task by id")
def get_task_by_id_router(task_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskService.get_task_by_id(task_id, connection)

@router.put("/{task_id}/", summary="Update task by id")
def update_task_router(task: TaskModel, task_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskService.update_task(task_id, task, connection)

@router.delete("/{task_id}/", summary="Delete task by id")
def update_task_router(task_id: int, db=Depends(get_db_connection)):
    print('task_id', task_id)
    with db as connection:
        return TaskService.delete_task(task_id, connection)