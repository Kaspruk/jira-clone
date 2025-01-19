import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@127.0.0.1:3006/mydatabase")

@contextmanager
def get_db_connection():
    """Контекстний менеджер для підключення до бази даних."""
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    try:
        yield conn
    finally:
        conn.close()