from psycopg2 import Error
from fastapi import HTTPException
from app.schemas.tasks import TaskSchemes
from app.models import TaskModel

class TaskService:
    """Сервіс для управління завданнями"""
    
    @staticmethod
    def create_task(task: TaskModel, connection):
        print('task', task)
        try:
            with connection.cursor() as cur:
                cur.execute(TaskSchemes.CREATE_TASK, (
                    task.title,
                    task.description,
                    task.type_id,
                    task.status_id,
                    task.priority_id,
                    str(task.project_id),
                    str(task.workspace_id),
                    str(task.author_id),
                    str(task.assignee_id),
                ))
                task_id = cur.fetchone()["id"]
                connection.commit()
                
                
                cur.execute(TaskSchemes.GET_TASK_BY_ID, [str(task_id)])
                return cur.fetchone()
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def get_tasks(connection, projectId):
        try:
            with connection.cursor() as cur:
                query = [TaskSchemes.GET_TASKS]

                if projectId:
                    query.append(f"WHERE project_id = {projectId}")

                cur.execute(" ".join(query))
                return cur.fetchall()
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def get_task_by_id(task_id: int, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskSchemes.GET_TASK_BY_ID, [str(task_id)])
                return cur.fetchone()
        except Error as e:
            print('get_task_by_id error', e)
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def update_task(task_id: int, task: TaskModel, connection):
        try:
            task_dict = task.model_dump()
            template = ", ".join([f"{key} = %s" for key in task_dict.keys()])
            query = TaskSchemes.UPDATE_TASK_BY_ID.format(template=template)
            values = list(task_dict.values())
            values.append(task_id)

            with connection.cursor() as cur:
                cur.execute(query, values)
                connection.commit()
                return { **task_dict, "id": task_id }
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    @staticmethod
    def delete_task(task_id: int, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskSchemes.DELETE_TASK_BY_ID, [str(task_id)])
                connection.commit()
                return True
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))


