CREATE_TABLE_PROJECTS = """
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
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
INSERT INTO projects (name, description, owner_id) VALUES (%s, %s, %s) RETURNING id
"""

GET_PROJECTS = """
SELECT * FROM projects
"""

GET_PROJECT_BY_ID = """
SELECT * FROM projects WHERE id = %s
"""

UPDATE_PROJECT_BY_ID = """
UPDATE projects SET {template} WHERE id = %s
"""

DELETE_PROJECT_BY_ID = """
DELETE FROM projects WHERE id = %s
"""