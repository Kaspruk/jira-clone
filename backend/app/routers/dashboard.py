from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.auth import AuthService
from app.services.dashboard import DashboardService
from app.models import TokenData, ResponseException

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/workspaces", summary="Get all dashboard workspaces")
def get_dashboard_workspaces_router(
    current_user: TokenData = Depends(AuthService.get_current_user),
    db=Depends(get_db_connection)
):
    """
    Отримати всі workspace-и користувача з проектами та кількістю завдань для dashboard
    """
    try:
        with db as connection:
            return DashboardService.get_dashboard_workspaces(current_user.user_id, connection)
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при отриманні dashboard workspace: {str(e)}")

@router.get("/workspaces/{workspace_id}", summary="Get dashboard workspace")
def get_dashboard_workspace_router(
    workspace_id: int, 
    current_user: TokenData = Depends(AuthService.get_current_user),
    db=Depends(get_db_connection)
):
    """
    Отримати workspace користувача з проектами та кількістю завдань для dashboard
    """
    try:
        with db as connection:
            return DashboardService.get_dashboard_workspace_by_id(workspace_id, current_user.user_id, connection)
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при отриманні dashboard workspace: {str(e)}")

