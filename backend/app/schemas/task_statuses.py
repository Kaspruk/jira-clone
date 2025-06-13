CREATE_TABLE_TASK_STATUSES = """
CREATE TABLE IF NOT EXISTS task_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    workspace_id INT REFERENCES workspaces(id) ON DELETE CASCADE,
    UNIQUE (name)
);
"""

CREATE_TASK_STATUS = """
INSERT INTO task_statuses (name, icon, color, description, workspace_id) VALUES (%s, %s, %s, %s, %s) RETURNING id
"""

GET_TASK_STATUSES_BY_WORKSPACE_ID = """
SELECT * FROM task_statuses WHERE workspace_id = %s
"""

GET_TASK_STATUS_BY_ID = """
SELECT * FROM task_statuses WHERE id = %s
"""

UPDATE_TASK_STATUS_BY_ID = """
UPDATE task_statuses SET {template} WHERE id = %s
"""

DELETE_TASK_STATUS_BY_ID = """
DELETE FROM task_statuses WHERE id = %s
"""

class TaskStatusSchemes:
    """Клас для організації всіх SQL схем статусів завдань"""
    CREATE_TABLE_TASK_STATUSES = CREATE_TABLE_TASK_STATUSES
    CREATE_TASK_STATUS = CREATE_TASK_STATUS
    GET_TASK_STATUSES_BY_WORKSPACE_ID = GET_TASK_STATUSES_BY_WORKSPACE_ID
    GET_TASK_STATUS_BY_ID = GET_TASK_STATUS_BY_ID
    UPDATE_TASK_STATUS_BY_ID = UPDATE_TASK_STATUS_BY_ID
    DELETE_TASK_STATUS_BY_ID = DELETE_TASK_STATUS_BY_ID