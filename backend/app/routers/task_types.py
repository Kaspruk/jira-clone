from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.task_types import TaskTypeService
from app.services.projects import ProjectService
from app.models import TaskTypeModel
from app.services.auth import AuthService

router = APIRouter(
    prefix="/task-types",
    tags=["Task types"],
    dependencies=[Depends(AuthService.get_current_user)]
)

@router.post("/{project_id}/", summary="Create task type")
def create_task_type_router(task_type: TaskTypeModel, project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        task_type = TaskTypeService.create_task_type(task_type, connection)
        ProjectService.update_project_task_types(project_id, task_type['id'], True, connection)
        return task_type

@router.get("/{workspace_id}/", summary="Get all task types by workspace id")
def get_task_types_by_workspace_id_router(workspace_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskTypeService.get_task_types_by_workspace_id(workspace_id, connection)

@router.get("/{task_type_id}/", summary="Get task type by id")
def get_task_type_by_id_router(task_type_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskTypeService.get_task_type_by_id(task_type_id, connection)

@router.put("/{task_type_id}/", summary="Update task type by id")
def update_task_type_router(task_type_id: int, task_type: TaskTypeModel, db=Depends(get_db_connection)):
    with db as connection:
        return TaskTypeService.update_task_type(task_type_id, task_type, connection)

@router.delete("/{task_type_id}/", summary="Delete task type by id")
def delete_task_type_router(task_type_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return TaskTypeService.delete_task_type(task_type_id, connection) 