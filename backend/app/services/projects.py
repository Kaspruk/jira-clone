from psycopg2 import Error
from app.schemas.projects import ProjectSchemes
from app.models import ProjectModel
from app.schemas.task_statuses import TaskStatusSchemes
from app.schemas.task_status_relations import TaskStatusRelationSchemes
from app.schemas.task_priorities import TaskPrioritySchemes
from app.schemas.task_priority_relations import TaskPriorityRelationSchemes
from app.schemas.task_types import TaskTypeSchemes
from app.schemas.task_type_relations import TaskTypeRelationSchemes
from app.constants import default_statuses, default_priorities, default_types
from app.utils import update_order_map
from app.models import ResponseException

class ProjectService:
    """Сервіс для управління проєктами"""
    
    @staticmethod
    def create_project(project: ProjectModel, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(ProjectSchemes.CREATE_PROJECT, (
                    project.name,
                    project.description,
                    str(project.owner_id),
                    str(project.workspace_id)
                ))
                project_id = cur.fetchone()["id"]
                connection.commit()

                # Отримати всі дефолтні статуси
                cur.execute(TaskStatusSchemes.GET_TASK_STATUSES_BY_WORKSPACE_ID, [str(project.workspace_id)])
                workspace_statuses = cur.fetchall()

                # Перевірити наявність дефолтних статусів
                filtered_statuses = [item for item in workspace_statuses if item['name'] in {entry['name'] for entry in default_statuses}]
                
                # Створити записи в task_statuses_relations
                order = 0
                for status in filtered_statuses:
                    cur.execute(TaskStatusRelationSchemes.CREATE_TASK_STATUS_RELATION, [status['id'], project_id, order])
                    order = order + 1

                # Отримати всі дефолтні пріоритети
                cur.execute(TaskPrioritySchemes.GET_TASK_PRIORITIES_BY_WORKSPACE_ID, [str(project.workspace_id)])
                workspace_priorities = cur.fetchall()

                # Перевірити наявність дефолтних пріоритетів
                filtered_priorities = [item for item in workspace_priorities if item['name'] in {entry['name'] for entry in default_priorities}]
                
                # Створити записи в task_priority_relations
                order = 0
                for priority in filtered_priorities:
                    cur.execute(TaskPriorityRelationSchemes.CREATE_TASK_PRIORITY_RELATION, [priority['id'], project_id, order])
                    order = order + 1

                # Отримати всі дефолтні типи
                cur.execute(TaskTypeSchemes.GET_TASK_TYPES_BY_WORKSPACE_ID, [str(project.workspace_id)])
                workspace_types = cur.fetchall()

                # Перевірити наявність дефолтних типів
                filtered_types = [item for item in workspace_types if item['name'] in {entry['name'] for entry in default_types}]
                
                # Створити записи в task_type_relations
                order = 0
                for task_type in filtered_types:
                    cur.execute(TaskTypeRelationSchemes.CREATE_TASK_TYPE_RELATION, [task_type['id'], project_id, order])
                    order = order + 1

                connection.commit()

                return { "id": project_id, **project.model_dump() }
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def get_projects(connection, workspace_id=None):
        try:
            with connection.cursor() as cur:
                if workspace_id:
                    cur.execute(ProjectSchemes.GET_PROJECTS_BY_WORKSPACE_ID, [workspace_id])
                else:
                    cur.execute(ProjectSchemes.GET_PROJECTS)
                return cur.fetchall()
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def get_project_by_id(project_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(ProjectSchemes.GET_PROJECT_BY_ID, [str(project_id)])
                return cur.fetchone()
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def update_project(project_id: int, project: ProjectModel, connection):
        try:
            project_dict = project.model_dump()
            template = ", ".join([f"{key} = %s" for key in project_dict.keys()])
            query = ProjectSchemes.UPDATE_PROJECT_BY_ID.format(template=template)
            values = list(project_dict.values())
            values.append(project_id)

            with connection.cursor() as cur:
                cur.execute(query, values)
                connection.commit()
                return { **project_dict, "id": project_id }
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def delete_project(project_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(ProjectSchemes.DELETE_PROJECT_BY_ID, [project_id])
                connection.commit()
                return project_id
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def get_project_task_types(project_id, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(ProjectSchemes.GET_PROJECT_TYPES, [str(project_id)])
                return cur.fetchall()
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def update_project_task_statuses(project_id: int, status_id: int, value: bool, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskStatusRelationSchemes.GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                statuses = cur.fetchall()
                
                if value:
                    cur.execute(TaskStatusRelationSchemes.CREATE_TASK_STATUS_RELATION, [status_id, project_id, len(statuses)])
                else:
                    status_index = next((index for index, status in enumerate(statuses) if status['task_status_id'] == status_id), None)
                    
                    if status_index is None:
                        raise ResponseException(message="Cannot find status index")
                    
                    cur.execute(TaskStatusRelationSchemes.DELETE_TASK_STATUS_RELATION_BY_ID, [str(statuses[status_index]['id'])])

                    queryForUpdate = TaskStatusRelationSchemes.UPDATE_TASK_STATUS_RELATION_BY_ID.format(template=f'"order" = %s')
                    statuses_to_update_range = range(status_index + 1, len(statuses))
                    
                    for index in statuses_to_update_range:
                        cur.execute(queryForUpdate, [index - 1, statuses[index]['id']])
                
                connection.commit()
                return value
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))
        
    @staticmethod
    def update_project_task_statuses_order(project_id: int, oldIndex: int, newIndex: int, connection):
        try:
            with connection.cursor() as cur:                
                cur.execute(TaskStatusRelationSchemes.GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                statuses = cur.fetchall()
                queryForUpdate = TaskStatusRelationSchemes.UPDATE_TASK_STATUS_RELATION_BY_ID.format(template=f'"order" = %s')
                
                currentStatus = statuses[oldIndex]
                cur.execute(queryForUpdate, [newIndex, currentStatus['id']])
                
                update_order_map(
                    oldIndex, 
                    newIndex, 
                    lambda index, index_to_update: cur.execute(
                        queryForUpdate, [index_to_update, statuses[index]['id']]
                    )
                )
                                       
                connection.commit()
        except Error as e:
            print('Error', e)
            connection.rollback()
            raise ResponseException(message=str(e))

    @staticmethod
    def update_project_task_priorities(project_id: int, priority_id: int, value: bool, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskPriorityRelationSchemes.GET_TASK_PRIORITY_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                priorities = cur.fetchall()
                
                if value:
                    cur.execute(TaskPriorityRelationSchemes.CREATE_TASK_PRIORITY_RELATION, [priority_id, project_id, len(priorities)])
                else:
                    priority_index = next((index for index, priority in enumerate(priorities) if priority['task_priority_id'] == priority_id), None)
                    
                    if priority_index is None:
                        raise ResponseException(message="Cannot find priority index")
                    
                    cur.execute(TaskPriorityRelationSchemes.DELETE_TASK_PRIORITY_RELATION_BY_ID, [str(priorities[priority_index]['id'])])

                    queryForUpdate = TaskPriorityRelationSchemes.UPDATE_TASK_PRIORITY_RELATION_BY_ID.format(template=f'"order" = %s')
                    priorities_to_update_range = range(priority_index + 1, len(priorities))
                    
                    for index in priorities_to_update_range:
                        cur.execute(queryForUpdate, [index - 1, priorities[index]['id']])
                
                connection.commit()
                return value
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))

    @staticmethod
    def update_project_task_priorities_order(project_id: int, oldIndex: int, newIndex: int, connection):
        try:
            with connection.cursor() as cur:                
                cur.execute(TaskPriorityRelationSchemes.GET_TASK_PRIORITY_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                priorities = cur.fetchall()
                queryForUpdate = TaskPriorityRelationSchemes.UPDATE_TASK_PRIORITY_RELATION_BY_ID.format(template=f'"order" = %s')
                
                currentPriority = priorities[oldIndex]
                cur.execute(queryForUpdate, [newIndex, currentPriority['id']])
                
                print(oldIndex, newIndex)
                
                update_order_map(
                    oldIndex, 
                    newIndex,  
                    lambda index, index_to_update: cur.execute(
                        queryForUpdate, 
                        [index_to_update, priorities[index]['id']]
                    )
                )

                connection.commit()
        except Error as e:
            print('Error', e)
            connection.rollback()
            raise ResponseException(message=str(e))

    @staticmethod
    def update_project_task_types(project_id: int, type_id: int, value: bool, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(TaskTypeRelationSchemes.GET_TASK_TYPE_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                types = cur.fetchall()
                
                if value:
                    cur.execute(TaskTypeRelationSchemes.CREATE_TASK_TYPE_RELATION, [type_id, project_id, len(types)])
                else:
                    type_index = next((index for index, task_type in enumerate(types) if task_type['task_type_id'] == type_id), None)
                    
                    if type_index is None:
                        raise ResponseException(message="Cannot find type index")
                    
                    cur.execute(TaskTypeRelationSchemes.DELETE_TASK_TYPE_RELATION_BY_ID, [str(types[type_index]['id'])])

                    queryForUpdate = TaskTypeRelationSchemes.UPDATE_TASK_TYPE_RELATION_BY_ID.format(template=f'"order" = %s')
                    types_to_update_range = range(type_index + 1, len(types))
                    
                    for index in types_to_update_range:
                        cur.execute(queryForUpdate, [index - 1, types[index]['id']])
                
                connection.commit()
                return value
        except Error as e:
            connection.rollback()
            raise ResponseException(message=str(e))

    @staticmethod
    def update_project_task_types_order(project_id: int, oldIndex: int, newIndex: int, connection):
        try:
            with connection.cursor() as cur:                
                cur.execute(TaskTypeRelationSchemes.GET_TASK_TYPE_RELATIONS_BY_PROJECT_ID, [str(project_id)])
                types = cur.fetchall()
                queryForUpdate = TaskTypeRelationSchemes.UPDATE_TASK_TYPE_RELATION_BY_ID.format(template=f'"order" = %s')
                
                currentType = types[oldIndex]
                cur.execute(queryForUpdate, [newIndex, currentType['id']])
                
                update_order_map(
                    oldIndex, 
                    newIndex,  
                    lambda index, index_to_update: cur.execute(
                        queryForUpdate, 
                        [index_to_update, types[index]['id']]
                    )
                )

                connection.commit()
        except Error as e:
            print('Error', e)
            connection.rollback()
            raise ResponseException(message=str(e))

