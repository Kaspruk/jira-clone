CREATE_TABLE_WORKSPACES = """
CREATE TABLE IF NOT EXISTS workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);
"""

CREATE_WORKSPACE = """
INSERT INTO workspaces (name, description, owner_id) VALUES (%s, %s, %s) RETURNING id
"""

GET_WORKSPACES = """
SELECT * FROM workspaces
"""

GET_WORKSPACE_BY_ID = """
SELECT * FROM workspaces WHERE id = %s
"""

UPDATE_WORKSPACE_BY_ID = """
UPDATE workspaces SET {template} WHERE id = %s
"""

DELETE_WORKSPACE_BY_ID = """
DELETE FROM workspaces WHERE id = %s
"""
