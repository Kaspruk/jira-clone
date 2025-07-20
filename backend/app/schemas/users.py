CREATE_TABLE_USERS = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    avatar VARCHAR(255),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
"""

CREATE_USER = """
INSERT INTO users (avatar, username, email, hashed_password) VALUES (%s, %s, %s, %s) RETURNING *
"""

GET_USERS = """
SELECT * from users
"""

GET_USER_BY_EMAIL = """
SELECT * from users WHERE email = %s;
"""

GET_USER_BY_ID = """
SELECT * FROM users WHERE id = %s;
"""

GET_USER_PASSWORD = """
SELECT hashed_password FROM users WHERE id = %s;
"""

UPDATE_USER_BY_ID = """
UPDATE users SET {template} WHERE id = %s
"""

DELETE_USER_BY_ID = """
DELETE FROM users WHERE id = %s
"""

CHANGE_USER_PASSWORD = """
UPDATE users SET hashed_password = %s WHERE id = %s
"""

class UserSchemes:
    """Клас для організації всіх SQL схем користувачів"""
    CREATE_TABLE_USERS = CREATE_TABLE_USERS
    CREATE_USER = CREATE_USER
    GET_USERS = GET_USERS
    GET_USER_BY_EMAIL = GET_USER_BY_EMAIL
    GET_USER_BY_ID = GET_USER_BY_ID
    GET_USER_PASSWORD = GET_USER_PASSWORD
    UPDATE_USER_BY_ID = UPDATE_USER_BY_ID
    DELETE_USER_BY_ID = DELETE_USER_BY_ID
    CHANGE_USER_PASSWORD = CHANGE_USER_PASSWORD