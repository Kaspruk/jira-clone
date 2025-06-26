from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.dashboard import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

@router.get("/workspaces", summary="Get all dashboard workspaces")
def get_dashboard_workspaces_router(db=Depends(get_db_connection)):
    """
    Отримати всі workspace-и з проектами та кількістю завдань для dashboard
    """
    with db as connection:
        return DashboardService.get_dashboard_workspaces(connection)

@router.get("/workspaces/{workspace_id}", summary="Get dashboard workspace")
def get_dashboard_workspace_router(workspace_id: int, db=Depends(get_db_connection)):
    """
    Отримати всі workspace-и з проектами та кількістю завдань для dashboard
    """
    with db as connection:
        return DashboardService.get_dashboard_workspace_by_id(workspace_id, connection)

