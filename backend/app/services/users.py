from psycopg2 import Error
from app.constants import ErrorCodes
from passlib.context import CryptContext
from app.schemas.users import UserSchemes
from app.models import UserModel
from app.models import ResponseException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    """Сервіс для управління користувачами"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Перевірити пароль"""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Отримати хеш паролю"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_user(user: UserModel, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(UserSchemes.CREATE_USER, (
                    user.username,
                    user.email,
                    UserService.get_password_hash(user.password)
                ))
                created_user = dict(cur.fetchone())
                    
                connection.commit()
                created_user.pop('hashed_password', None)

                return created_user
        except Error as e:
            print(e)
            
            connection.rollback()
            code = ErrorCodes.FAILED_TO_CREATE_USER

            if e.pgcode == "23505":
                code = ErrorCodes.USER_ALREADY_EXISTS

            raise ResponseException(message=str(e))

    @staticmethod
    def get_users(connection):
        with connection.cursor() as cur:
            cur.execute(UserSchemes.GET_USERS)
            users = cur.fetchall()
            print('--------------------------------')
            print('users', users)
            print('--------------------------------')
            return users

    @staticmethod
    def get_users_by_id(id: int, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(UserSchemes.GET_USER_BY_ID, [str(id)])
                users = cur.fetchone()
                users.pop('hashed_password', None)
                return users
        except Error as e:
            raise ResponseException(message=str(e))

    @staticmethod
    def get_user_by_email(email: str, connection):
        try:
            with connection.cursor() as cur:
                cur.execute(UserSchemes.GET_USER_BY_EMAIL, [email])
                user = cur.fetchone()
                if user and 'hashed_password' in user:
                    user.pop('hashed_password', None)
                return user
        except Error as e:
            raise ResponseException(status_code=400, detail=str(e))

