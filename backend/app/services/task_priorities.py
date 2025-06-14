from fastapi import HTTPException
from psycopg2 import Error
from app.schemas.task_priority_relations import TaskPriorityRelationSchemes
from app.services.projects import ProjectService
from app.schemas.task_priorities import TaskPrioritySchemes
from app.models import TaskPriorityModel
from app.constants import default_priorities
from app.utils import generate_db_query

class TaskPriorityService:
    """Сервіс для управління пріоритетами завдань"""
    
    @staticmethod
    def get_task_priorities_by_workspace_id(workspace_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskPrioritySchemes.GET_TASK_PRIORITIES_BY_WORKSPACE_ID, [str(workspace_id)])
                return cur.fetchall()
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def get_task_priority_by_id(task_priority_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskPrioritySchemes.GET_TASK_PRIORITY_BY_ID, [str(task_priority_id)])
                return cur.fetchone()
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def create_task_priority(task_priority: TaskPriorityModel, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskPrioritySchemes.CREATE_TASK_PRIORITY, [
                    task_priority.name,
                    task_priority.icon,
                    task_priority.color,
                    task_priority.description,
                    str(task_priority.workspace_id)
                ])
                task_priority_id = cur.fetchone()["id"]
                connection.commit()

                return { "id": task_priority_id, **task_priority.model_dump() }
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def update_task_priority(task_priority_id: int, task_priority: TaskPriorityModel, connection):
        try:
            task_priority_dict = task_priority.model_dump()
            query = generate_db_query(TaskPrioritySchemes.UPDATE_TASK_PRIORITY_BY_ID, task_priority_dict)
            values = list(task_priority_dict.values())
            values.append(task_priority_id)

            with connection.cursor() as cur:
                cur.execute(query, values)
                connection.commit()
                return { **task_priority_dict, "id": task_priority_id }
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def delete_task_priority(task_priority_id, connection):
        try:
            task_priority = None
            task_priority_relations = []
            
            with connection.cursor() as cur:
                cur.execute(TaskPriorityRelationSchemes.GET_TASK_PRIORITY_RELATIONS_BY_TASK_PRIORITY_ID, [task_priority_id])
                task_priority = cur.fetchone()
                
                if task_priority is None:
                    raise HTTPException(status_code=404, detail="Task priority not found")
                
                cur.execute(TaskPriorityRelationSchemes.GET_TASK_PRIORITY_RELATIONS_BY_PROJECT_ID, [task_priority['project_id']])
                task_priority_relations = cur.fetchall()
            
            ProjectService.update_project_task_priorities_order(
                task_priority['project_id'], 
                task_priority['order'], 
                len(task_priority_relations) - 1, 
                connection
            )
            
            with connection.cursor() as cur:
                cur.execute(TaskPrioritySchemes.DELETE_TASK_PRIORITY_BY_ID, [task_priority_id])
                connection.commit()
                return task_priority_id
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e)) 
        
    @staticmethod
    def create_default_task_priorities(workspace_id, connection, cursor):
        try:
            for priority in default_priorities:
                cursor.execute(TaskPrioritySchemes.CREATE_TASK_PRIORITY, [
                    priority["name"],
                    priority["icon"],
                    priority["color"],
                    priority["description"],
                    workspace_id
                ])
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

 