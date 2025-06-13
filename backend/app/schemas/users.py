CREATE_TABLE_USERS = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
"""

CREATE_USER = """
INSERT INTO users (username, email, hashed_password) VALUES (%s, %s, %s) RETURNING id
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

class UserSchemes:
    """Клас для організації всіх SQL схем користувачів"""
    CREATE_TABLE_USERS = CREATE_TABLE_USERS
    CREATE_USER = CREATE_USER
    GET_USERS = GET_USERS
    GET_USER_BY_EMAIL = GET_USER_BY_EMAIL
    GET_USER_BY_ID = GET_USER_BY_ID