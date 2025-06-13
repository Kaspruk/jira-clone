from psycopg2 import Error
from fastapi import HTTPException
from app.schemas.projects import CREATE_PROJECT, GET_PROJECTS, GET_PROJECT_BY_ID, UPDATE_PROJECT_BY_ID, DELETE_PROJECT_BY_ID
from app.models import ProjectModel
from app.schemas.task_statuses import GET_TASK_STATUSES_BY_WORKSPACE_ID
from app.schemas.task_status_relations import CREATE_TASK_STATUS_RELATION, DELETE_TASK_STATUS_RELATION_BY_ID, GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, UPDATE_TASK_STATUS_RELATION_BY_ID
from app.constants import default_statuses

def create_project(project: ProjectModel, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(CREATE_PROJECT, (project.name, project.description, str(project.owner_id)))
            project_id = cur.fetchone()["id"]
            connection.commit()

            # Отримати всі дефолтні статуси
            cur.execute(GET_TASK_STATUSES_BY_WORKSPACE_ID, (str(project.workspace_id)))
            workspace_statuses = cur.fetchall()

            # # Перевірити наявність дефолтних статусів
            filtered_statuses = [item for item in workspace_statuses if item['name'] in {entry['name'] for entry in default_statuses}]
            
            # Створити записи в task_statuses_relations
            order = 0
            for status in filtered_statuses:
                cur.execute(CREATE_TASK_STATUS_RELATION, [status['id'], project_id, order])
                order = order + 1
            connection.commit()

            return { "id": 1, **project.model_dump() }
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def get_projects(connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_PROJECTS)
            return cur.fetchall()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def get_project_by_id(project_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_PROJECT_BY_ID, [str(project_id)])
            return cur.fetchone()
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def update_project(project_id: int, project: ProjectModel, connection):
    try:
        project_dict = project.model_dump()
        template = ", ".join([f"{key} = %s" for key in project_dict.keys()])
        query = UPDATE_PROJECT_BY_ID.format(template=template)
        values = list(project_dict.values())
        values.append(project_id)

        with connection.cursor() as cur:
            cur.execute(query, values)
            connection.commit()
            return { **project_dict, "id": project_id }
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def delete_project(project_id, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(DELETE_PROJECT_BY_ID, [project_id])
            connection.commit()
            return project_id
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def update_project_statuses(project_id: int, status_id: int, value: bool, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, [str(project_id)])
            statuses = cur.fetchall()
            
            if value:
                cur.execute(CREATE_TASK_STATUS_RELATION, [status_id, project_id, len(statuses)])
            else:
                status_index = next((index for index, status in enumerate(statuses) if status['task_status_id'] == status_id), None)
                
                if status_index is None:
                    raise HTTPException(status_code=400, detail="Cannot find status index")
                
                cur.execute(DELETE_TASK_STATUS_RELATION_BY_ID, [str(statuses[status_index]['id'])])

                queryForUpdate = UPDATE_TASK_STATUS_RELATION_BY_ID.format(template=f'"order" = %s')
                statuses_to_update_range = range(status_index + 1, len(statuses))
                
                for index in statuses_to_update_range:
                    cur.execute(queryForUpdate, [index - 1, statuses[index]['id']])
            
            connection.commit()
            return value
    except Error as e:
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def update_project_statuses_order(project_id: int, oldIndex: int, newIndex: int, connection):
    try:
        with connection.cursor() as cur:
            isPositive = newIndex > oldIndex
            
            cur.execute(GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, [str(project_id)])
            statuses = cur.fetchall()
            queryForUpdate = UPDATE_TASK_STATUS_RELATION_BY_ID.format(template=f'"order" = %s')
            
            currentStatus = statuses[oldIndex]
            cur.execute(queryForUpdate, [newIndex, currentStatus['id']])
                 
            rangeValue = None
            if isPositive: rangeValue = range(oldIndex + 1, newIndex + 1)
            else: rangeValue = range(oldIndex - 1, newIndex - 1, -1)

            for index in rangeValue:
                if isPositive:
                    cur.execute(queryForUpdate, [index - 1, statuses[index]['id']])
                else:
                    cur.execute(queryForUpdate, [index + 1, statuses[index]['id']])
                    
            connection.commit()
    except Error as e:
        print('Error', e)
        connection.rollback()
        raise HTTPException(status_code=400, detail=str(e))