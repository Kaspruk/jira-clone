from psycopg2 import Error
from fastapi import HTTPException
from app.shemas.projects import CREATE_PROJECT, GET_PROJECTS, GET_PROJECT_BY_ID, UPDATE_PROJECT_BY_ID, DELETE_PROJECT_BY_ID
from app.models import ProjectModel

def create_project(project: ProjectModel, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(CREATE_PROJECT, (project.name, project.description, str(project.owner_id)))
            project_id = cur.fetchone()["id"]
            connection.commit()

            return { "id": project_id, **project.model_dump() }
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
