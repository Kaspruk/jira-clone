CREATE_TABLE_PROJECTS = """
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    workspace_id INT REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);
"""

CREATE_TABLE_PROJECTS_MEMBERS = """
CREATE TABLE IF NOT EXISTS project_members (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('owner', 'member')) DEFAULT 'member',
    UNIQUE (user_id, project_id)
);
"""

CREATE_PROJECT = """
INSERT INTO projects (name, description, owner_id, workspace_id) VALUES (%s, %s, %s, %s) RETURNING id
"""

GET_PROJECTS = """
SELECT * FROM projects
"""

GET_PROJECTS_BY_WORKSPACE_ID = """
SELECT * FROM projects WHERE workspace_id = %s
"""

GET_PROJECT_BY_ID = """
SELECT 
    projects.*,
    COALESCE(statuses_agg.statuses, '[]'::json) AS statuses,
    COALESCE(priorities_agg.priorities, '[]'::json) AS priorities,
    COALESCE(types_agg.types, '[]'::json) AS types
FROM 
    projects
LEFT JOIN (
    SELECT 
        project_id,
        json_agg(json_build_object(
            'id', task_statuses.id,
            'name', task_statuses.name,
            'icon', task_statuses.icon,
            'color', task_statuses.color,
            'order', task_status_relations.order
        ) ORDER BY task_status_relations.order) AS statuses
    FROM task_status_relations
    LEFT JOIN task_statuses ON task_status_relations.task_status_id = task_statuses.id
    GROUP BY project_id
) statuses_agg ON projects.id = statuses_agg.project_id
LEFT JOIN (
    SELECT 
        project_id,
        json_agg(json_build_object(
            'id', task_priorities.id,
            'name', task_priorities.name,
            'icon', task_priorities.icon,
            'color', task_priorities.color,
            'order', task_priority_relations.order
        ) ORDER BY task_priority_relations.order) AS priorities
    FROM task_priority_relations
    LEFT JOIN task_priorities ON task_priority_relations.task_priority_id = task_priorities.id
    GROUP BY project_id
) priorities_agg ON projects.id = priorities_agg.project_id
LEFT JOIN (
    SELECT 
        project_id,
        json_agg(json_build_object(
            'id', task_types.id,
            'name', task_types.name,
            'icon', task_types.icon,
            'color', task_types.color,
            'order', task_type_relations.order
        ) ORDER BY task_type_relations.order) AS types
    FROM task_type_relations
    LEFT JOIN task_types ON task_type_relations.task_type_id = task_types.id
    GROUP BY project_id
) types_agg ON projects.id = types_agg.project_id
WHERE 
    projects.id = %s
"""

UPDATE_PROJECT_BY_ID = """
UPDATE projects SET {template} WHERE id = %s
"""

DELETE_PROJECT_BY_ID = """
DELETE FROM projects WHERE id = %s
"""


class ProjectSchemes:
    """Клас для організації всіх SQL схем проєктів"""
    CREATE_TABLE_PROJECTS = CREATE_TABLE_PROJECTS
    CREATE_TABLE_PROJECTS_MEMBERS = CREATE_TABLE_PROJECTS_MEMBERS
    CREATE_PROJECT = CREATE_PROJECT
    GET_PROJECTS = GET_PROJECTS
    GET_PROJECTS_BY_WORKSPACE_ID = GET_PROJECTS_BY_WORKSPACE_ID
    GET_PROJECT_BY_ID = GET_PROJECT_BY_ID
    UPDATE_PROJECT_BY_ID = UPDATE_PROJECT_BY_ID
    DELETE_PROJECT_BY_ID = DELETE_PROJECT_BY_ID