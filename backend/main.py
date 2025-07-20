from typing import Callable
from urllib.request import Request
import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import get_db_connection
from app.schemas import SCHEMAS
from app.routers import users, workspaces, projects, tasks, task_statuses, task_priorities, task_types, dashboard, auth
from app.models import ResponseException

def setup_database():
    """Ініціалізація бази даних при запуску сервера."""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            for schema in SCHEMAS:
                cur.execute(SCHEMAS[schema])
            conn.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_database()
    yield
    # Shutdown - тут можна додати логіку очищення ресурсів

app = FastAPI(lifespan=lifespan)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(workspaces.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(task_statuses.router)
app.include_router(task_priorities.router)
app.include_router(task_types.router)
app.include_router(dashboard.router)

# Статичні файли для аватарів
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS налаштування для розробки та production
allowed_origins = [
    "http://localhost:3000",
    "http://192.168.68.102:3000",
]

# Додаємо production frontend URL якщо він існує
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

def creaate_exception_handler() -> Callable[[Request, ResponseException], JSONResponse]:
    content = {
        "code": ResponseException.UNKNOWN_ERROR,
        "message": ResponseException.messages[ResponseException.UNKNOWN_ERROR],
    }

    async def custom_exception_handler(_: Request, exc: ResponseException) -> JSONResponse:
        if exc.message:
            content["message"] = exc.message
            
        if exc.code:
            content["code"] = exc.code

        return JSONResponse(status_code=exc.status_code, headers=exc.headers, content=content)
    
    return custom_exception_handler

app.add_exception_handler(
    exc_class_or_status_code=ResponseException,
    handler=creaate_exception_handler()
)

if __name__ == "__main__":
    uvicorn.run('main:app', reload=True)