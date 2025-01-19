import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_db_connection
from app.shemas import CREATE_TABLE_USERS, CREATE_TABLE_TASKS, CREATE_TABLE_PROJECTS, CREATE_TABLE_PROJECTS_MEMBERS
from app.routers import users, projects, tasks

app = FastAPI()
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def setup_database():
    """Ініціалізація бази даних при запуску сервера."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(CREATE_TABLE_USERS)
            cur.execute(CREATE_TABLE_PROJECTS)
            cur.execute(CREATE_TABLE_TASKS)
            cur.execute(CREATE_TABLE_PROJECTS_MEMBERS)
            conn.commit()

if __name__ == "__main__":
    uvicorn.run('main:app', reload=True)