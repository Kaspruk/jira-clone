from typing import Dict
from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.projects import ProjectService
from app.models import ProjectModel

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)

@router.post("/", summary="Create project")
def create_project_router(project: ProjectModel, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.create_project(project, connection)

@router.get("/",  summary="Get all projects")
def get_projects_router(workspace_id: int = None, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.get_projects(connection, workspace_id)

@router.get("/{project_id}/", summary="Get project by id")
def get_project_by_id_router(project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.get_project_by_id(project_id, connection)

@router.put("/{project_id}/", summary="Update project by id")
def update_project_router(project: ProjectModel, project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.update_project(project_id, project, connection)

@router.delete("/{project_id}/", summary="Delete project by id")
def update_project_router(project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.delete_project(project_id, connection)
    
@router.put("/{project_id}/statuses/select", summary="Select project status")
def update_project_task_statuses_select_router(data: Dict[str, int], project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.update_project_task_statuses(project_id, data['status_id'], data['value'], connection)
    
@router.put("/{project_id}/statuses/order", summary="Update project statuses order")
def update_project_task_statuses_order_router(data: Dict[str, int], project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.update_project_task_statuses_order(project_id, data['oldIndex'], data['newIndex'], connection)

@router.put("/{project_id}/priorities/select", summary="Select project priority")
def update_project_task_priorities_select_router(data: Dict[str, int], project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.update_project_task_priorities(project_id, data['priority_id'], data['value'], connection)
    
@router.put("/{project_id}/priorities/order", summary="Update project priorities order")
def update_project_task_priorities_order_router(data: Dict[str, int], project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.update_project_task_priorities_order(project_id, data['oldIndex'], data['newIndex'], connection)

@router.put("/{project_id}/types/select", summary="Select project type")
def update_project_task_types_select_router(data: Dict[str, int], project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.update_project_task_types(project_id, data['type_id'], data['value'], connection)
    
@router.put("/{project_id}/types/order", summary="Update project types order")
def update_project_task_types_order_router(data: Dict[str, int], project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return ProjectService.update_project_task_types_order(project_id, data['oldIndex'], data['newIndex'], connection)