CREATE_TABLE_TASKS = """
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type_id INT NULL REFERENCES task_types(id),
    status_id INT NULL REFERENCES task_statuses(id),
    priority_id INT NULL REFERENCES task_priorities(id),
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    workspace_id INT REFERENCES workspaces(id) ON DELETE CASCADE,
    author_id INT REFERENCES users(id),
    assignee_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
"""

CREATE_TASK = """
INSERT INTO tasks (title, description, type_id, status_id, priority_id, project_id, workspace_id, author_id, assignee_id) 
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
"""

GET_TASKS = """
SELECT * FROM tasks
"""

GET_TASKS_BY_WORKSPACE_ID = """
SELECT * FROM tasks WHERE workspace_id = %s
"""

GET_TASK_BY_ID = """
SELECT * FROM tasks WHERE id = %s
"""

UPDATE_TASK_BY_ID = """
UPDATE tasks SET {template} WHERE id = %s
"""

DELETE_TASK_BY_ID = """
DELETE FROM tasks WHERE id = %s
"""

class TaskSchemes:
    """Клас для організації всіх SQL схем завдань"""
    CREATE_TABLE_TASKS = CREATE_TABLE_TASKS
    CREATE_TASK = CREATE_TASK
    GET_TASKS = GET_TASKS
    GET_TASKS_BY_WORKSPACE_ID = GET_TASKS_BY_WORKSPACE_ID
    GET_TASK_BY_ID = GET_TASK_BY_ID
    UPDATE_TASK_BY_ID = UPDATE_TASK_BY_ID
    DELETE_TASK_BY_ID = DELETE_TASK_BY_ID
