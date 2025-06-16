CREATE_TABLE_TASK_TYPES = """
CREATE TABLE IF NOT EXISTS task_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    workspace_id INT REFERENCES workspaces(id) ON DELETE CASCADE,
    UNIQUE (name, workspace_id)
);
"""

CREATE_TASK_TYPE = """
INSERT INTO task_types (name, icon, color, description, workspace_id) VALUES (%s, %s, %s, %s, %s) RETURNING id
"""

GET_TASK_TYPES_BY_WORKSPACE_ID = """
SELECT * FROM task_types WHERE workspace_id = %s ORDER BY name
"""

GET_TASK_TYPE_BY_ID = """
SELECT * FROM task_types WHERE id = %s
"""

UPDATE_TASK_TYPE_BY_ID = """
UPDATE task_types SET {template} WHERE id = %s
"""

DELETE_TASK_TYPE_BY_ID = """
DELETE FROM task_types WHERE id = %s
"""

class TaskTypeSchemes:
    """Клас для організації всіх SQL схем типів завдань"""
    CREATE_TABLE_TASK_TYPES = CREATE_TABLE_TASK_TYPES
    CREATE_TASK_TYPE = CREATE_TASK_TYPE
    GET_TASK_TYPES_BY_WORKSPACE_ID = GET_TASK_TYPES_BY_WORKSPACE_ID
    GET_TASK_TYPE_BY_ID = GET_TASK_TYPE_BY_ID
    UPDATE_TASK_TYPE_BY_ID = UPDATE_TASK_TYPE_BY_ID
    DELETE_TASK_TYPE_BY_ID = DELETE_TASK_TYPE_BY_ID 