import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
import os
  
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://jiraclonedb_user:sGBY1QpPylSbBPEJVAAas8t4ifybBM1n@dpg-d1o0m663jp1c73dab6lg-a.frankfurt-postgres.render.com/jiraclonedb")

@contextmanager
def get_db_connection():
    """Контекстний менеджер для підключення до бази даних."""
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    try:
        yield conn
    finally:
        conn.close()