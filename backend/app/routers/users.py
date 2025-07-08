from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.users import UserService
from app.models import UserModel
from app.services.auth import AuthService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(AuthService.get_current_user)]
)

@router.post("/")
def create_user_router(user: UserModel, db=Depends(get_db_connection)):
    with db as connection:
        return UserService.create_user(user, connection)

@router.get("/")
def get_users_router(db=Depends(get_db_connection)):
    with db as connection:
        return UserService.get_users(connection)

@router.get("/{user_id}/")
def get_user_by_id_router(user_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return UserService.get_users_by_id(user_id, connection)