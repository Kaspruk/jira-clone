from psycopg2 import Error
from app.constants import ErrorCodes
from passlib.context import CryptContext
from app.schemas.users import UserSchemes
from app.models import UserModel, UserPasswordChangeModel, ResponseException

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
                    None,
                    user.username,
                    user.email,
                    UserService.get_password_hash(user.password)
                ))
                created_user = dict(cur.fetchone())
                    
                connection.commit()
                created_user.pop('hashed_password', None)

                return created_user
        except Error as e:
            connection.rollback()
            code = ErrorCodes.FAILED_TO_CREATE_USER

            if e.pgcode == "23505":
                code = ErrorCodes.USER_ALREADY_EXISTS

            raise ResponseException(code=code)

    @staticmethod
    def get_users(connection):
        with connection.cursor() as cur:
            cur.execute(UserSchemes.GET_USERS)
            users = cur.fetchall()
            return users
        
    @staticmethod
    def get_user_password(user_id: int, connection):
        """Отримати пароль користувача"""
        with connection.cursor() as cur:
            cur.execute(UserSchemes.GET_USER_PASSWORD, [user_id])
            user_password = cur.fetchone()
            return user_password

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
        
    @staticmethod
    def update_user_by_id(id: int, user_data: dict, connection):
        """Оновити дані користувача за ID"""
        try:
            # Формуємо список полів для оновлення
            update_fields = []
            values = []
            
            if 'username' in user_data:
                update_fields.append("username = %s")
                values.append(user_data['username'])
                
            if 'email' in user_data:
                update_fields.append("email = %s")
                values.append(user_data['email'])
            
            if not update_fields:
                raise ResponseException(message="Немає полів для оновлення")
            
            # Додаємо ID користувача до значень
            values.append(id)
            
            # Формуємо SQL запит
            update_query = UserSchemes.UPDATE_USER_BY_ID.format(
                template=", ".join(update_fields)
            )
            
            with connection.cursor() as cur:
                cur.execute(update_query, values)
                
                if cur.rowcount == 0:
                    raise ResponseException(message="Користувача з таким ID не знайдено")
                
                # Отримуємо оновлені дані користувача
                cur.execute(UserSchemes.GET_USER_BY_ID, [str(id)])
                updated_user = cur.fetchone()
                
                connection.commit()
                
                if updated_user and 'hashed_password' in updated_user:
                    updated_user.pop('hashed_password', None)
                
                return updated_user
                
        except Error as e:
            connection.rollback()
            
            if e.pgcode == "23505":  # Unique constraint violation
                raise ResponseException(message="Користувач з таким email вже існує")
            
            raise ResponseException(message=str(e))
        except ResponseException:
            raise
        except Exception as e:
            connection.rollback()
            raise ResponseException(message=f"Помилка при оновленні користувача: {str(e)}")
    
    @staticmethod
    def change_user_password(user_id: int, password_data: UserPasswordChangeModel, connection):
        """Змінити пароль користувача"""
        try:
            # Отримуємо поточні дані користувача            
            current_user_password = UserService.get_user_password(user_id, connection)
            
            if not current_user_password:
                raise ResponseException(message="Користувача не знайдено")
            
            # Перевіряємо поточний пароль
            if not UserService.verify_password(password_data.current_password, current_user_password['hashed_password']):
                raise ResponseException(message="Поточний пароль неправильний")
            
            # Хешуємо новий пароль
            new_hashed_password = UserService.get_password_hash(password_data.new_password)
            
            # Оновлюємо пароль
            with connection.cursor() as cur:
                cur.execute(UserSchemes.CHANGE_USER_PASSWORD, (new_hashed_password, user_id))
                
                if cur.rowcount == 0:
                    raise ResponseException(message="Користувача не знайдено")
                
                connection.commit()
                
                return {"message": "Пароль успішно змінено"}
                
        except ResponseException:
            raise
        except Exception as e:
            connection.rollback()
            raise ResponseException(message=f"Помилка при зміні пароля: {str(e)}")
    
    @staticmethod
    def update_user_avatar(user_id: int, avatar_url: str, connection):
        """Оновити аватар користувача"""
        try:
            with connection.cursor() as cur:
                cur.execute("UPDATE users SET avatar = %s WHERE id = %s", (avatar_url, user_id))
                
                if cur.rowcount == 0:
                    raise ResponseException(message="Користувача не знайдено")
                
                # Отримуємо оновлені дані користувача
                cur.execute(UserSchemes.GET_USER_BY_ID, [str(user_id)])
                updated_user = cur.fetchone()
                
                connection.commit()
                
                if updated_user and 'hashed_password' in updated_user:
                    updated_user.pop('hashed_password', None)
                
                return updated_user
                
        except ResponseException:
            raise
        except Exception as e:
            connection.rollback()
            raise ResponseException(message=f"Помилка при оновленні аватара: {str(e)}")


