from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.services.users import create_user, get_users, get_users_by_id
from app.models import UserModel

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.post("/")
def create_user_router(user: UserModel, db=Depends(get_db_connection)):
    with db as connection:
        return create_user(
            user.username, 
            user.email, 
            user.password, 
            connection
        )

@router.get("/")
def get_users_router(db=Depends(get_db_connection)):
    with db as connection:
        return get_users(connection)

@router.get("/{user_id}/")
def get_user_by_id_router(user_id: int, db=Depends(get_db_connection)):
    with db as connection:
        return get_users_by_id(user_id, connection)