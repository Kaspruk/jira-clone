from psycopg2 import Error
from fastapi import HTTPException
from app.shemas.task_statuses import CREATE_TASK_STATUS, GET_TASK_STATUSES_BY_PROJECT_ID, GET_TASK_STATUS_BY_ID, UPDATE_TASK_STATUS_BY_ID, DELETE_TASK_STATUS_BY_ID
from app.models import TaskStatusModel

def get_task_statuses_by_project_id(project_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_TASK_STATUSES_BY_PROJECT_ID, [str(project_id)])
            return cur.fetchall()
    except Error as e:
        print('get_task_statuses_by_project_id', e)
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def get_task_status_by_id(task_status_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_TASK_STATUS_BY_ID, [str(task_status_id)])
            return cur.fetchone()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def create_task_status(task_status: TaskStatusModel, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(CREATE_TASK_STATUS, (task_status.name, task_status.order, task_status.project_id))
            task_status_id = cur.fetchone()["id"]
            connection.commit()

            return { "id": task_status_id, **task_status.model_dump() }
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def update_task_status(task_status_id: int, task_status: TaskStatusModel, connection):
    try:
        task_status_dict = task_status.model_dump()
        template = ", ".join([f"{key} = %s" for key in task_status_dict.keys()])
        query = UPDATE_TASK_STATUS_BY_ID.format(template=template)
        values = list(task_status_dict.values())
        values.append(task_status_id)

        with connection.cursor() as cur:
            cur.execute(query, values)
            connection.commit()
            return { **task_status_dict, "id": task_status_id }
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def delete_task_status(task_status_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(DELETE_TASK_STATUS_BY_ID, [task_status_id])
            connection.commit()
            return task_status_id
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 
    
def create_default_task_statuses(project_id, connection):
    default_statuses = [
        {"name": "Backlog", "order": 1},
        {"name": "To Do", "order": 2},
        {"name": "In Progress", "order": 3},
        {"name": "In Review", "order": 4},
        {"name": "Done", "order": 5},
    ]

    try:
        with connection.cursor() as cur:
            for status in default_statuses:
                cur.execute(CREATE_TASK_STATUS, (status["name"], status["order"], project_id))
            connection.commit()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))