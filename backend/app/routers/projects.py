from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.projects import create_project, get_projects, get_project_by_id, update_project, delete_project
from app.models import ProjectModel

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)

@router.post("/", summary="Create project")
def create_project_router(project: ProjectModel, db=Depends(get_db_connection)):
    print('project', project)
    with db as connection:
        return create_project(project, connection)

@router.get("/",  summary="Get all projects")
def get_projects_router(db=Depends(get_db_connection)):
    with db as connection:
        return get_projects(connection)

@router.get("/{project_id}/", summary="Get project by id")
def get_project_by_id_router(project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return get_project_by_id(project_id, connection)

@router.put("/{project_id}/", summary="Update project by id")
def update_project_router(project: ProjectModel, project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return update_project(project_id, project, connection)

@router.delete("/{project_id}/", summary="Delete project by id")
def update_project_router(project_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return delete_project(project_id, connection)