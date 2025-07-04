import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_db_connection
from app.schemas import SCHEMAS
from app.routers import users, workspaces, projects, tasks, task_statuses, task_priorities, task_types, dashboard, auth

app = FastAPI()
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(workspaces.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(task_statuses.router)
app.include_router(task_priorities.router)
app.include_router(task_types.router)
app.include_router(dashboard.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.68.102:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ],
    expose_headers=["*"],
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