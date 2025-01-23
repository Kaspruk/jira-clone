from psycopg2 import Error
from fastapi import HTTPException
from passlib.context import CryptContext
from app.shemas.users import CREATE_USER, GET_USERS, GET_USER_BY_ID
from app.models import UserModel

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(user: UserModel, connection):
    print('user in service', user)
    try:
        with connection.cursor() as cur:
            cur.execute(CREATE_USER, (user.username, user.email, pwd_context.hash(user.password)))
            user_id = cur.fetchone()["id"]
            connection.commit()

            created_user = user.model_dump()
            created_user.pop('password', None)

            return { "id": user_id, **created_user }
    except Error as e:
        connection.rollback()
        detail = str(e)

        if e.pgcode == "23505":
            detail = "User with this email already exist"

        raise HTTPException(status_code=400, detail=detail)


def get_users(connection):
    with connection.cursor() as cur:
        cur.execute(GET_USERS)
        users = cur.fetchall()
        return users

def get_users_by_id(id: int, connection):
    try:
        with connection.cursor() as cur:
            cur.execute(GET_USER_BY_ID, (str(id)))
            users = cur.fetchone()
            users.pop('hashed_password', None)
            return users
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))