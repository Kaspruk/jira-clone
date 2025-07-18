from psycopg2 import Error
from app.schemas.dashboard import DashboardSchemes
from app.models import ResponseException


class DashboardService:
    """Сервіс для управління панеллю управління"""
    
    @staticmethod
    def get_dashboard_workspaces(user_id, connection):
        """Отримати всі workspace-и користувача з проектами та кількістю завдань"""
        try:
            with connection.cursor() as cur:
                cur.execute(DashboardSchemes.GET_DASHBOARD_WORKSPACES, (user_id,))
                result = cur.fetchone()
                
                # Якщо результат існує і workspaces_data не None, повертаємо його
                if result and result['workspaces_data']:
                    return result['workspaces_data']  # result['workspaces_data'] це workspaces_data
                else:
                    return {}  # Повертаємо порожній об'єкт якщо немає даних
                    
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e)) 
    
    @staticmethod
    def get_dashboard_workspace_by_id(workspace_id, user_id, connection):
        """Отримати workspace користувача з проектами та кількістю завдань"""
        try:
            with connection.cursor() as cur:
                cur.execute(DashboardSchemes.GET_DASHBOARD_WORKSPACE_BY_ID, (workspace_id, user_id))
                result = cur.fetchone()
                return result
        except Error as e:
            connection.rollback()
            raise ResponseException(status_code=400, message=str(e))