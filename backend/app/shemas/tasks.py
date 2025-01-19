CREATE_TABLE_TASKS = """
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('new', 'in_progress', 'completed')) DEFAULT 'new',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
"""

CREATE_TASK = """
INSERT INTO tasks (title, description, status, priority, project_id, assignee_id) 
VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
"""

GET_TASKS = """
SELECT * FROM tasks
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
