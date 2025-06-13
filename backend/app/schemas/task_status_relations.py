CREATE_TABLE_TASK_STATUS_RELATIONS = """
CREATE TABLE IF NOT EXISTS task_status_relations (
    id SERIAL PRIMARY KEY,
    task_status_id INT REFERENCES task_statuses(id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    "order" INT NOT NULL,
    UNIQUE (task_status_id, project_id)
);
"""

CREATE_TASK_STATUS_RELATION = """
INSERT INTO task_status_relations (task_status_id, project_id, "order") VALUES (%s, %s, %s) RETURNING id
"""

GET_TASK_STATUS_RELATIONS_BY_PROJECT_ID = """
SELECT * FROM task_status_relations WHERE project_id = %s ORDER BY "order"
"""

GET_TASK_STATUS_RELATIONS_BY_TASK_STATUS_ID = """
SELECT * FROM task_status_relations WHERE task_status_id = %s ORDER BY "order"
"""

GET_TASK_STATUS_RELATION_BY_ID = """
SELECT * FROM task_status_relations WHERE id = %s
"""

UPDATE_TASK_STATUS_RELATION_BY_ID = """
UPDATE task_status_relations SET {template} WHERE id = %s
"""

DELETE_TASK_STATUS_RELATION_BY_ID = """
DELETE FROM task_status_relations WHERE id = %s
""" 