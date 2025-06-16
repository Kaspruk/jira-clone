from app.models import WorkspaceModel
from psycopg2 import Error
from app.schemas.task_statuses import TaskStatusSchemes
from app.schemas.task_status_relations import TaskStatusRelationSchemes
from app.schemas.task_priorities import TaskPrioritySchemes
from app.schemas.task_priority_relations import TaskPriorityRelationSchemes
from app.schemas.task_types import TaskTypeSchemes
from app.schemas.task_type_relations import TaskTypeRelationSchemes
from fastapi import HTTPException
from app.schemas.workspaces import WorkspaceSchemes
from app.services.task_statuses import TaskStatusService
from app.services.task_priorities import TaskPriorityService
from app.services.task_types import TaskTypeService

# Припускаємо, що існує якась база даних або ORM для роботи з даними

class WorkspaceService:
    """Сервіс для управління робочими просторами"""
    
    @staticmethod
    def create_workspace(workspace: WorkspaceModel, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(WorkspaceSchemes.CREATE_WORKSPACE, (workspace.name, workspace.description, str(workspace.owner_id)))
                workspace_id = cur.fetchone()["id"]

                TaskStatusService.create_default_task_statuses(workspace_id, connection, cur)
                TaskPriorityService.create_default_task_priorities(workspace_id, connection, cur)
                TaskTypeService.create_default_task_types(workspace_id, connection, cur)

                connection.commit()

                return { "id": workspace_id, **workspace.model_dump() }
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_workspaces(connection):
        try:
            with connection.cursor() as cur:
                cur.execute(WorkspaceSchemes.GET_WORKSPACES)
                return cur.fetchall()
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_workspace_by_id(workspace_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(WorkspaceSchemes.GET_WORKSPACE_BY_ID, [str(workspace_id)])
                return cur.fetchone()
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_workspace(workspace_id: int, workspace: WorkspaceModel, connection):
        try:
            workspace_dict = workspace.model_dump()
            template = ", ".join([f"{key} = %s" for key in workspace_dict.keys()])
            query = WorkspaceSchemes.UPDATE_WORKSPACE_BY_ID.format(template=template)
            values = list(workspace_dict.values())
            values.append(workspace_id)

            with connection.cursor() as cur:
                cur.execute(query, values)
                connection.commit()
                return { **workspace_dict, "id": workspace_id }
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_workspace(workspace_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(WorkspaceSchemes.DELETE_WORKSPACE_BY_ID, [workspace_id])
                connection.commit()
                return workspace_id
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_workspace_statuses(workspace_id, project_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskStatusSchemes.GET_TASK_STATUSES_BY_WORKSPACE_ID, [str(workspace_id)])
                statuses = cur.fetchall()
                
                extendedStatuses = list(map(lambda status: { **status, "selected": False, "order": None }, statuses))
                
                if project_id:
                    cur.execute(TaskStatusRelationSchemes.GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, [str(project_id)])
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

    @staticmethod
    def get_workspace_priorities(workspace_id, project_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskPrioritySchemes.GET_TASK_PRIORITIES_BY_WORKSPACE_ID, [str(workspace_id)])
                priorities = cur.fetchall()
                
                extendedPriorities = list(map(lambda priority: { **priority, "selected": False, "order": None }, priorities))
                
                if project_id:
                    cur.execute(TaskPriorityRelationSchemes.GET_TASK_PRIORITY_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                    relations = cur.fetchall()
                    
                    for relation in relations:
                        for priority in extendedPriorities:
                            if priority['id'] == relation['task_priority_id']:
                                priority['order'] = relation['order']
                                priority['selected'] = True
                                
                sortedPriorities = sorted(extendedPriorities, key=lambda x: (x['order'] is None, x['order']))

                return sortedPriorities
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_workspace_types(workspace_id, project_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskTypeSchemes.GET_TASK_TYPES_BY_WORKSPACE_ID, [str(workspace_id)])
                types = cur.fetchall()
                
                extendedTypes = list(map(lambda task_type: { **task_type, "selected": False, "order": None }, types))
                
                if project_id:
                    cur.execute(TaskTypeRelationSchemes.GET_TASK_TYPE_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                    relations = cur.fetchall()
                    
                    for relation in relations:
                        for task_type in extendedTypes:
                            if task_type['id'] == relation['task_type_id']:
                                task_type['order'] = relation['order']
                                task_type['selected'] = True
                                
                sortedTypes = sorted(extendedTypes, key=lambda x: (x['order'] is None, x['order']))

                return sortedTypes
        except Error as e:
            connection.rollback()
            raise HTTPException(status_code=400, detail=str(e))


