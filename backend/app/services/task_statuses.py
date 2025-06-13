from fastapi import HTTPException
from psycopg2 import Error
from app.schemas.task_status_relations import GET_TASK_STATUS_RELATIONS_BY_TASK_STATUS_ID
from app.services.projects import update_project_statuses_order
from app.schemas.task_statuses import CREATE_TASK_STATUS, GET_TASK_STATUSES_BY_WORKSPACE_ID, GET_TASK_STATUS_BY_ID, UPDATE_TASK_STATUS_BY_ID, DELETE_TASK_STATUS_BY_ID
from app.models import TaskStatusModel
from app.constants import default_statuses
from app.utils import generate_db_query

def get_task_statuses_by_workspace_id(workspace_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_TASK_STATUSES_BY_WORKSPACE_ID, [str(workspace_id)])
            return cur.fetchall()
    except Error as e:
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
            cur.execute(CREATE_TASK_STATUS, [
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
        raise HTTPException(status_code=400, detail=str(e))
    
def update_task_status(task_status_id: int, task_status: TaskStatusModel, connection):
    try:
        task_status_dict = task_status.model_dump()
        query = generate_db_query(UPDATE_TASK_STATUS_BY_ID, task_status_dict)
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
        task_status_relations = [] 
        
        with connection.cursor() as cur:
            cur.execute(GET_TASK_STATUS_RELATIONS_BY_TASK_STATUS_ID, [task_status_id])
            task_status_relations = cur.fetchall()
        
        with connection.cursor() as cur:
            for task_status_relation in task_status_relations:
                update_project_statuses_order(
                    task_status_relation['project_id'], 
                    task_status_relation['order'], 
                    -1, 
                    connection
                )
        
        with connection.cursor() as cur:
            cur.execute(DELETE_TASK_STATUS_BY_ID, [task_status_id])
            connection.commit()
            return task_status_id
        
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e)) 
    
def create_default_task_statuses(workspace_id, connection, cursor):
    try:
        for status in default_statuses:
            cursor.execute(CREATE_TASK_STATUS, [
                status["name"],
                status["icon"],
                status["color"],
                status["description"],
                workspace_id
            ])
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))