from .workspaces import WorkspaceSchemes
from .projects import ProjectSchemes  
from .tasks import TaskSchemes
from .users import UserSchemes
from .task_statuses import TaskStatusSchemes
from .task_status_relations import TaskStatusRelationSchemes
from .task_priorities import TaskPrioritySchemes
from .task_priority_relations import TaskPriorityRelationSchemes
from .task_type_relations import TaskTypeRelationSchemes
from .task_types import TaskTypeSchemes

# Порядок створення таблиць важливий через зовнішні ключі
SCHEMAS = {
    # Спочатку базові таблиці без залежностей
    "CREATE_TABLE_USERS": UserSchemes.CREATE_TABLE_USERS,
    "CREATE_TABLE_WORKSPACES": WorkspaceSchemes.CREATE_TABLE_WORKSPACES,
    
    # Таблиці що залежать від workspaces та users
    "CREATE_TABLE_PROJECTS": ProjectSchemes.CREATE_TABLE_PROJECTS,
    "CREATE_TABLE_PROJECTS_MEMBERS": ProjectSchemes.CREATE_TABLE_PROJECTS_MEMBERS,
    
    # Довідкові таблиці що залежать від workspaces
    "CREATE_TABLE_TASK_TYPES": TaskTypeSchemes.CREATE_TABLE_TASK_TYPES,
    "CREATE_TABLE_TASK_STATUSES": TaskStatusSchemes.CREATE_TABLE_TASK_STATUSES,
    "CREATE_TABLE_TASK_PRIORITIES": TaskPrioritySchemes.CREATE_TABLE_TASK_PRIORITIES,
    
    # Таблиця tasks що залежить від всіх попередніх
    "CREATE_TABLE_TASKS": TaskSchemes.CREATE_TABLE_TASKS,
    
    # Таблиці зв'язків створюються в кінці
    "CREATE_TABLE_TASK_STATUS_RELATIONS": TaskStatusRelationSchemes.CREATE_TABLE_TASK_STATUS_RELATIONS,
    "CREATE_TABLE_TASK_PRIORITY_RELATIONS": TaskPriorityRelationSchemes.CREATE_TABLE_TASK_PRIORITY_RELATIONS,
    "CREATE_TABLE_TASK_TYPE_RELATIONS": TaskTypeRelationSchemes.CREATE_TABLE_TASK_TYPE_RELATIONS,
}

__all__ = ["SCHEMAS"]