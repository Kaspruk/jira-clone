from psycopg2 import Error
from app.schemas.task_status_relations import TaskStatusRelationSchemes
from app.services.projects import ProjectService
from app.schemas.task_statuses import TaskStatusSchemes
from app.models import TaskStatusModel
from app.constants import default_statuses
from app.utils import generate_db_query
from app.models import ResponseException

class TaskStatusService:
    """Сервіс для управління статусами завдань"""
    
    @staticmethod
    def get_task_statuses_by_workspace_id(workspace_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskStatusSchemes.GET_TASK_STATUSES_BY_WORKSPACE_ID, [str(workspace_id)])
                return cur.fetchall()
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def get_task_status_by_id(task_status_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskStatusSchemes.GET_TASK_STATUS_BY_ID, [str(task_status_id)])
                return cur.fetchone()
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))

    @staticmethod
    def create_task_status(task_status: TaskStatusModel, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskStatusSchemes.CREATE_TASK_STATUS, [
                    task_status.name,
                    task_status.icon,
                    task_status.color,
                    task_status.description,
                    str(task_status.workspace_id)
                ])
                task_status_id = cur.fetchone()["id"]
                connection.commit()

                return { "id": task_status_id, **task_status.model_dump() }
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def update_task_status(task_status_id: int, task_status: TaskStatusModel, connection):
        try:
            task_status_dict = task_status.model_dump()
            query = generate_db_query(TaskStatusSchemes.UPDATE_TASK_STATUS_BY_ID, task_status_dict)
            values = list(task_status_dict.values())
            values.append(task_status_id)

            with connection.cursor() as cur:
                cur.execute(query, values)
                connection.commit()
                return { **task_status_dict, "id": task_status_id }
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def delete_task_status(task_status_id, connection):
        try:
            task_status = None 
            task_status_relations = [] 
            
            with connection.cursor() as cur:
                cur.execute(TaskStatusRelationSchemes.GET_TASK_STATUS_RELATIONS_BY_TASK_STATUS_ID, [task_status_id])
                task_status = cur.fetchone()
                
                if task_status is None:
                    raise ResponseException(status_code=404, detail="Task status not found")
                
                cur.execute(TaskStatusRelationSchemes.GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, [task_status['project_id']])
                task_status_relations = cur.fetchall()
            
            ProjectService.update_project_task_statuses_order(
                task_status['project_id'], 
                task_status['order'], 
                len(task_status_relations) - 1, 
                connection
            )
            
            with connection.cursor() as cur:
                cur.execute(TaskStatusSchemes.DELETE_TASK_STATUS_BY_ID, [task_status_id])
                connection.commit()
                return task_status_id
            
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e)) 
        
    @staticmethod
    def create_default_task_statuses(workspace_id, connection, cursor):
        try:
            for status in default_statuses:
                cursor.execute(TaskStatusSchemes.CREATE_TASK_STATUS, [
                    status["name"],
                    status["icon"],
                    status["color"],
                    status["description"],
                    workspace_id
                ])
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))

