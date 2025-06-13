CREATE_TABLE_TASK_PRIORITIES = """
CREATE TABLE IF NOT EXISTS task_priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    workspace_id INT REFERENCES workspaces(id) ON DELETE CASCADE,
    UNIQUE (name, workspace_id)
);
"""

CREATE_TASK_PRIORITY = """
INSERT INTO task_priorities (name, icon, color, description, workspace_id) VALUES (%s, %s, %s, %s, %s) RETURNING id
"""

GET_TASK_PRIORITIES_BY_WORKSPACE_ID = """
SELECT * FROM task_priorities WHERE workspace_id = %s ORDER BY name
"""

GET_TASK_PRIORITY_BY_ID = """
SELECT * FROM task_priorities WHERE id = %s
"""

UPDATE_TASK_PRIORITY_BY_ID = """
UPDATE task_priorities SET {template} WHERE id = %s
"""

DELETE_TASK_PRIORITY_BY_ID = """
DELETE FROM task_priorities WHERE id = %s
"""

class TaskPrioritySchemes:
    """Клас для організації всіх SQL схем пріоритетів завдань"""
    CREATE_TABLE_TASK_PRIORITIES = CREATE_TABLE_TASK_PRIORITIES
    CREATE_TASK_PRIORITY = CREATE_TASK_PRIORITY
    GET_TASK_PRIORITIES_BY_WORKSPACE_ID = GET_TASK_PRIORITIES_BY_WORKSPACE_ID
    GET_TASK_PRIORITY_BY_ID = GET_TASK_PRIORITY_BY_ID
    UPDATE_TASK_PRIORITY_BY_ID = UPDATE_TASK_PRIORITY_BY_ID
    DELETE_TASK_PRIORITY_BY_ID = DELETE_TASK_PRIORITY_BY_ID 