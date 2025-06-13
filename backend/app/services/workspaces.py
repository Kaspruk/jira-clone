from app.models import WorkspaceModel
from psycopg2 import Error
from app.schemas.task_statuses import GET_TASK_STATUSES_BY_WORKSPACE_ID
from app.schemas.task_status_relations import GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID
from fastapi import HTTPException
from app.schemas.workspaces import CREATE_WORKSPACE, GET_WORKSPACES, GET_WORKSPACE_BY_ID, UPDATE_WORKSPACE_BY_ID, DELETE_WORKSPACE_BY_ID
from app.services.task_statuses import create_default_task_statuses

# Припускаємо, що існує якась база даних або ORM для роботи з даними

def create_workspace(workspace: WorkspaceModel, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(CREATE_WORKSPACE, (workspace.name, workspace.description, str(workspace.owner_id)))
            workspace_id = cur.fetchone()["id"]

            create_default_task_statuses(workspace_id, connection, cur)

            connection.commit()

            return { "id": workspace_id, **workspace.model_dump() }
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def get_workspaces(connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_WORKSPACES)
            return cur.fetchall()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def get_workspace_by_id(workspace_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_WORKSPACE_BY_ID, [str(workspace_id)])
            return cur.fetchone()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def update_workspace(workspace_id: int, workspace: WorkspaceModel, connection):
    try:
        workspace_dict = workspace.model_dump()
        template = ", ".join([f"{key} = %s" for key in workspace_dict.keys()])
        query = UPDATE_WORKSPACE_BY_ID.format(template=template)
        values = list(workspace_dict.values())
        values.append(workspace_id)

        with connection.cursor() as cur:
            cur.execute(query, values)
            connection.commit()
            return { **workspace_dict, "id": workspace_id }
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def delete_workspace(workspace_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(DELETE_WORKSPACE_BY_ID, [workspace_id])
            connection.commit()
            return workspace_id
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    

def get_workspace_statuses(workspace_id, project_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_TASK_STATUSES_BY_WORKSPACE_ID, [str(workspace_id)])
            statuses = cur.fetchall()
            
            extendedStatuses = list(map(lambda status: { **status, "selected": False, "order": None }, statuses))
            
            if project_id:
                cur.execute(GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                relations = cur.fetchall()
                
                for relation in relations:
                    for status in extendedStatuses:
                        if status['id'] == relation['task_status_id']:
                            status['order'] = relation['order']
                            status['selected'] = True
                            
            sortedStatuses = sorted(extendedStatuses, key=lambda x: (x['order'] is None, x['order']))

            return sortedStatuses
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
