import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_db_connection
from app.schemas import SCHEMAS
from app.routers import users, workspaces, projects, tasks, task_statuses, task_priorities, task_types

app = FastAPI()
app.include_router(users.router)
app.include_router(workspaces.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(task_statuses.router)
app.include_router(task_priorities.router)
app.include_router(task_types.router)

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
            for schema in SCHEMAS:
                cur.execute(SCHEMAS[schema])
            conn.commit()

if __name__ == "__main__":
    uvicorn.run('main:app', reload=True)