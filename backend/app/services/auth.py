from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from psycopg2 import Error
from app.schemas.users import UserSchemes
from app.models import UserModel, UserLoginModel, AuthResponse, TokenPair, UserResponse, TokenData
from app.services.users import UserService

# Конфігурація
SECRET_KEY = "your-secret-key-here-change-in-production"  # Змініть на production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    security = HTTPBearer()
    """Сервіс для управління авторизацією та аутентифікацією з JWT токенами"""

    @staticmethod
    def create_jwt_token(data: dict, token_type: str = "access", expires_delta: Optional[timedelta] = None):
        """Створити JWT токен певного типу ('access' або 'refresh')"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            if token_type == "access":
                expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            else:
                expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": token_type})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def create_token_pair(user_data: UserModel):
        """Створити пару access + refresh JWT токенів"""
        token_data = {
            "user_id": user_data["id"],
        }
        access_token = AuthService.create_jwt_token(token_data, token_type="access")
        refresh_token = AuthService.create_jwt_token(token_data, token_type="refresh")
        access_expires = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_expires = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        return TokenPair(
            access_token=access_token,
            refresh_token=refresh_token,
            access_token_expires_at=access_expires.isoformat(),
            refresh_token_expires_at=refresh_expires.isoformat()
        )

    @staticmethod
    def verify_jwt_token(token: str, token_type: str = "access") -> TokenData:
        """Перевірити JWT токен"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            
            print('--------------------------------')
            print('payload', payload)
            print('--------------------------------')
            
            # Перевіряємо тип токену
            if payload.get("type") != token_type:
                return None
        
            user_id: int = payload.get("user_id")
            
            if user_id is None:
                return None
                
            return TokenData(user_id=int(user_id))
        except JWTError:
            return None

    @staticmethod
    def authenticate_user(email: str, password: str, connection):
        """Аутентифікувати користувача"""
        try:
            user = None
            
            with connection.cursor() as cur:
                cur.execute(UserSchemes.GET_USER_BY_EMAIL, [email])
                user = cur.fetchone()
                
            if not user:
                return False
            
            if not UserService.verify_password(password, user['hashed_password']):
                return False
            
            return user
        except Error:
            return False

    @staticmethod
    def register_user(user_data: UserModel, connection):
        """Зареєструвати нового користувача"""
        return UserService.create_user(user_data, connection)

    @staticmethod
    def login_user(user_data: UserLoginModel, connection, response: Response = None):
        """Увійти в систему з створенням JWT токенів"""
        user = AuthService.authenticate_user(user_data.email, user_data.password, connection)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неправильний email або пароль",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Створюємо JWT токени
        tokens = AuthService.create_token_pair(user)
        
        # Гібридний підхід: access_token доступний для JS, refresh_token httpOnly для безпеки
        if response:
            response.set_cookie(
                key="access_token",
                value=tokens.access_token,
                httponly=True,  # Доступно для JavaScript для перевірки
                secure=False,  # False для localhost, True для production
                samesite="none",
                # samesite не встановлюємо для localhost розробки
                max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # в секундах
            )
            # response.set_cookie(
            #     key="refresh_token",
            #     value=tokens.refresh_token,
            #     httponly=True,  # Захищено від XSS атак
            #     secure=True,  # HTTPS only в production
            #     samesite="strict",
            #     max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # в секундах
            # )
            
        user_dict = dict(user)
        user_dict.pop('hashed_password', None)
        print('--------------------------------')
        print('reuser_dictsponse', user_dict)
        print('--------------------------------')
        
        return AuthResponse(
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
            token_type="bearer",
            user=user_dict
        )

    @staticmethod
    def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), connection = None):
        """Отримати поточного користувача через JWT токен"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не вдалося підтвердити облікові дані",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        token_data = AuthService.verify_jwt_token(credentials.credentials, "access")
        
        if not token_data:
            raise credentials_exception
        # Отримуємо актуальні дані користувача через UserService
        
        user = UserService.get_users_by_id(token_data.user_id, connection)
        if not user:
            raise credentials_exception
        
        return UserResponse(
            id=user['id'],
            username=user['username'],
            email=user['email'],
            created_at=str(user['created_at'])
        )

    @staticmethod
    def refresh_access_token(refresh_token: str, connection):
        """Оновити access токен за JWT refresh токеном"""
        token_data = AuthService.verify_jwt_token(refresh_token, "refresh")
        if not token_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Недійсний refresh токен"
            )
        # Отримуємо актуальні дані користувача через UserService
        user = UserService.get_user_by_email(token_data.email, connection)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Користувач не знайдений"
            )
        new_tokens = AuthService.create_token_pair(user)
        return {
            "access_token": new_tokens.access_token,
            "refresh_token": new_tokens.refresh_token,
            "token_type": "bearer",
            "user": UserResponse(
                id=user['id'],
                username=user['username'],
                email=user['email'],
                created_at=str(user['created_at'])
            )
        }

    @staticmethod
    def logout_user(token: str = None):
        """Вийти з системи (з JWT це просто повертає успіх)"""
        # З JWT токенами logout - це просто видалення токену на клієнті
        # Сервер не може "відкликати" JWT токен до закінчення його терміну дії
        return {"message": "Успішно вийшли з системи"}

    @staticmethod
    def validate_token(token: str):
        """Перевірити JWT токен"""
        token_data = AuthService.verify_jwt_token(token, "access")
        return token_data is not None
