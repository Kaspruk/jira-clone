from psycopg2 import Error
from fastapi import HTTPException
from app.shemas.tasks import CREATE_TASK, GET_TASKS, GET_TASK_BY_ID, UPDATE_TASK_BY_ID, DELETE_TASK_BY_ID
from app.models import TaskModel

def create_task(task: TaskModel, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(CREATE_TASK, (
                task.title,
                task.description,
                task.type,
                task.status,
                task.priority,
                str(task.project_id),
                str(task.author_id),
                str(task.assignee_id),
            ))
            task_id = cur.fetchone()["id"]
            connection.commit()

            return { "id": task_id, **task.model_dump() }
    except Error as e:
        print('error', e)
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def get_tasks(connection, projectId):
    try:
        with connection.cursor() as cur:
            query = [GET_TASKS]

            if projectId:
                query.append(f"WHERE project_id = {projectId}")

            print(" ".join(query))
            cur.execute(" ".join(query))
            return cur.fetchall()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def get_task_by_id(task_id: int, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_TASK_BY_ID, (str(task_id)))
            return cur.fetchone()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def update_task(task_id: int, task: TaskModel, connection):
    try:
        task_dict = task.model_dump()
        template = ", ".join([f"{key} = %s" for key in task_dict.keys()])
        query = UPDATE_TASK_BY_ID.format(template=template)
        values = list(task_dict.values())
        values.append(task_id)

        with connection.cursor() as cur:
            cur.execute(query, values)
            connection.commit()
            return { **task_dict, "id": task_id }
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def delete_task(task_id: int, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(DELETE_TASK_BY_ID, str(task_id))
            connection.commit()
            return True
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
