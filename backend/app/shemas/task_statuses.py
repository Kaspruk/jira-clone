CREATE_TABLE_TASK_STATUSES = """
CREATE TABLE IF NOT EXISTS task_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    "order" INT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    iconColor VARCHAR(50) NOT NULL,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    UNIQUE (name, project_id)
);
"""

CREATE_TASK_STATUS = """
INSERT INTO task_statuses (name, order, icon, iconColor, project_id) VALUES (%s, %s, %s, %s, %s) RETURNING id
"""

GET_TASK_STATUSES_BY_PROJECT_ID = """
SELECT * FROM task_statuses WHERE project_id = %s ORDER BY "order"
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