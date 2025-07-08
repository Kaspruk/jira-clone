from psycopg2 import Error
from app.schemas.task_type_relations import TaskTypeRelationSchemes
from app.services.projects import ProjectService
from app.schemas.task_types import TaskTypeSchemes
from app.models import TaskTypeModel
from app.constants import default_types
from app.utils import generate_db_query
from app.models import ResponseException

class TaskTypeService:
    """Сервіс для управління типами завдань"""
    
    @staticmethod
    def get_task_types_by_workspace_id(workspace_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskTypeSchemes.GET_TASK_TYPES_BY_WORKSPACE_ID, [str(workspace_id)])
                return cur.fetchall()
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def get_task_type_by_id(task_type_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskTypeSchemes.GET_TASK_TYPE_BY_ID, [str(task_type_id)])
                return cur.fetchone()
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))

    @staticmethod
    def create_task_type(task_type: TaskTypeModel, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskTypeSchemes.CREATE_TASK_TYPE, [
                    task_type.name,
                    task_type.icon,
                    task_type.color,
                    task_type.description,
                    str(task_type.workspace_id)
                ])
                task_type_id = cur.fetchone()["id"]
                connection.commit()

                return { "id": task_type_id, **task_type.model_dump() }
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def update_task_type(task_type_id: int, task_type: TaskTypeModel, connection):
        try:
            task_type_dict = task_type.model_dump()
            query = generate_db_query(TaskTypeSchemes.UPDATE_TASK_TYPE_BY_ID, task_type_dict)
            values = list(task_type_dict.values())
            values.append(task_type_id)

            with connection.cursor() as cur:
                cur.execute(query, values)
                connection.commit()
                return { **task_type_dict, "id": task_type_id }
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def delete_task_type(task_type_id, connection):
        try:
            task_type = None 
            task_type_relations = [] 
            
            with connection.cursor() as cur:
                cur.execute(TaskTypeRelationSchemes.GET_TASK_TYPE_RELATIONS_BY_TASK_TYPE_ID, [task_type_id])
                task_type = cur.fetchone()
                
                if task_type is None:
                    raise ResponseException(status_code=404, detail="Task type not found")
                
                cur.execute(TaskTypeRelationSchemes.GET_TASK_TYPE_RELATIONS_BY_PROJECT_ID, [task_type['project_id']])
                task_type_relations = cur.fetchall()
            
            ProjectService.update_project_task_types_order(
                task_type['project_id'], 
                task_type['order'], 
                len(task_type_relations) - 1, 
                connection
            )
            
            with connection.cursor() as cur:
                cur.execute(TaskTypeSchemes.DELETE_TASK_TYPE_BY_ID, [task_type_id])
                connection.commit()
                return task_type_id
            
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e)) 
        
    @staticmethod
    def create_default_task_types(workspace_id, connection, cursor):
        try:
            for task_type in default_types:
                cursor.execute(TaskTypeSchemes.CREATE_TASK_TYPE, [
                    task_type["name"],
                    task_type["icon"],
                    task_type["color"],
                    task_type["description"],
                    workspace_id
                ])
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e)) 