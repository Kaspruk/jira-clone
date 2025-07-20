from fastapi import APIRouter, Depends, UploadFile, File
from app.database import get_db_connection
from app.services.users import UserService
from app.models import UserModel, UserUpdateModel, UserPasswordChangeModel, ResponseException
from app.services.auth import AuthService
import os
import shutil
from pathlib import Path

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(AuthService.get_current_user)]
)

# Створюємо папку для зображень якщо її немає
UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/")
def create_user_router(user: UserModel, db=Depends(get_db_connection)):
    try:
        with db as connection:
            return UserService.create_user(user, connection)
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при створенні користувача: {str(e)}")

@router.get("/")
def get_users_router(db=Depends(get_db_connection)):
    try:
        with db as connection:
            return UserService.get_users(connection)
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при отриманні користувачів: {str(e)}")

@router.get("/{user_id}/")
def get_user_by_id_router(user_id: int, db=Depends(get_db_connection)):
    try:
        with db as connection:
            return UserService.get_users_by_id(user_id, connection)
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при отриманні користувача: {str(e)}")

@router.put("/{user_id}/")
def update_user_router(user_id: int, user_data: UserUpdateModel, db=Depends(get_db_connection)):
    try:
        with db as connection:
            return UserService.update_user_by_id(user_id, user_data.model_dump(exclude_unset=True), connection)
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при оновленні користувача: {str(e)}")

@router.put("/{user_id}/password/")
def change_password_router(user_id: int, password_data: UserPasswordChangeModel, db=Depends(get_db_connection)):
    try:
        with db as connection:
            return UserService.change_user_password(user_id, password_data, connection)
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при зміні пароля: {str(e)}")

@router.post("/{user_id}/avatar/")
async def upload_avatar_router(user_id: int, file: UploadFile = File(...), db=Depends(get_db_connection)):
    """Завантажити аватар користувача"""
    try:
        # Перевіряємо тип файлу
        if not file.content_type.startswith('image/'):
            raise ResponseException(message="Файл повинен бути зображенням")
        
        # Перевіряємо розмір файлу (максимум 5MB)
        if file.size and file.size > 5 * 1024 * 1024:
            raise ResponseException(message="Розмір файлу не може перевищувати 5MB")
        
        # Генеруємо унікальне ім'я файлу
        file_extension = Path(file.filename).suffix
        filename = f"avatar_{user_id}{file_extension}"
        file_path = UPLOAD_DIR / filename
        
        # Зберігаємо файл
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Оновлюємо URL аватара в базі даних
        avatar_url = f"/uploads/avatars/{filename}"
        with db as connection:
            return UserService.update_user_avatar(user_id, avatar_url, connection)
            
    except ResponseException:
        raise
    except Exception as e:
        raise ResponseException(message=f"Помилка при завантаженні аватара: {str(e)}")