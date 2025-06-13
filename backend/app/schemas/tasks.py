CREATE_TABLE_TASKS = """
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('TASK', 'HISTORY', 'ISSUE', 'EPIC', 'ENHANCEMENT', 'DEFECT')) DEFAULT 'TASK',
    status VARCHAR(20) CHECK (status IN ('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE')) DEFAULT 'BACKLOG',
    priority VARCHAR(20) CHECK (priority IN ('LOW', 'MEDIUM', 'HIGHT')) DEFAULT 'LOW',
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    author_id INT REFERENCES users(id),
    assignee_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
"""

CREATE_TASK = """
INSERT INTO tasks (title, description, type, status, priority, project_id, author_id, assignee_id) 
VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
"""

GET_TASKS = """SELECT * FROM tasks"""

GET_TASK_BY_ID = """
SELECT * FROM tasks WHERE id = %s
"""

UPDATE_TASK_BY_ID = """
UPDATE tasks SET {template} WHERE id = %s
"""

DELETE_TASK_BY_ID = """
DELETE FROM tasks WHERE id = %s
"""
