from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db_connection
from app.services.workspaces import create_workspace, get_workspace_statuses, get_workspaces, get_workspace_by_id, update_workspace, delete_workspace
from app.models import WorkspaceModel
from typing import List

router = APIRouter(
    prefix="/workspaces",
    tags=["workspaces"]
)

@router.get("/")
def get_workspaces_route(db=Depends(get_db_connection)):
    # Логіка для отримання списку всіх робочих просторів
    with db as connection:
        return get_workspaces(connection) 

@router.post("/")
def create_workspace_route(workspace: WorkspaceModel, db=Depends(get_db_connection)):
    # Логіка для створення нового робочого простору
    with db as connection:  
        return create_workspace(workspace, connection)

@router.get("/{workspace_id}")
def get_workspace_by_id_route(workspace_id: int, db=Depends(get_db_connection)):
    # Логіка для отримання робочого простору за ID
    with db as connection:
        workspace = get_workspace_by_id(workspace_id, connection)
        if not workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
        return workspace

@router.put("/{workspace_id}")
def update_workspace_route(workspace_id: int, workspace: WorkspaceModel, db=Depends(get_db_connection)):
    # Логіка для оновлення існуючого робочого простору
    with db as connection:
        updated_workspace = update_workspace(workspace_id, workspace, connection)
        if not updated_workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
        return updated_workspace

@router.delete("/{workspace_id}")
def delete_workspace_route(workspace_id: int, db=Depends(get_db_connection)):
    # Логіка для видалення робочого простору
    with db as connection:
        success = delete_workspace(workspace_id, connection)
        if not success:
            raise HTTPException(status_code=404, detail="Workspace not found")
        return {"detail": "Workspace deleted"}


@router.get("/{workspace_id}/statuses")
def get_workspaces_statutest(workspace_id: int, project_id: int | None = None, db=Depends(get_db_connection)):
    with db as connection:
        return get_workspace_statuses(workspace_id, project_id, connection) 