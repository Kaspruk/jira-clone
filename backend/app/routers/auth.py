from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Cookie
from fastapi.security import HTTPAuthorizationCredentials
from typing import Optional
from app.database import get_db_connection
from app.services.auth import AuthService
from app.models import UserModel, UserLoginModel, UserResponse, AuthResponse, RefreshTokenRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post("/register", response_model=UserResponse, summary="Реєстрація нового користувача")
def register(user_data: UserModel, db=Depends(get_db_connection)):
    with db as connection:
        return AuthService.register_user(user_data, connection)

@router.post("/login", response_model=AuthResponse, summary="Вхід в систему")
def login(
    user_data: UserLoginModel, 
    response: Response,
    db=Depends(get_db_connection)
):
    with db as connection:
        return AuthService.login_user(user_data, connection, response)

@router.get("/me", response_model=UserResponse, summary="Отримати поточного користувача")
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(AuthService.security),
    db=Depends(get_db_connection)
):
    """
    Отримати інформацію про поточного авторизованого користувача
    
    Потрібен Bearer JWT токен в заголовку Authorization
    """
    with db as connection:
        return AuthService.get_current_user(credentials, connection)

@router.post("/refresh", summary="Оновити access токен")
def refresh_token(
    response: Response,
    refresh_data: RefreshTokenRequest = None,
    refresh_token_cookie: Optional[str] = Cookie(None, alias="refresh_token"),
    db=Depends(get_db_connection)
):
    """
    Оновити access токен за допомогою refresh токену
    
    Можна передати refresh токен через:
    1. JSON body: {"refresh_token": "token"}
    2. Cookie (автоматично з login)
    """
    # Визначаємо джерело refresh токену
    refresh_token = None
    if refresh_data and refresh_data.refresh_token:
        refresh_token = refresh_data.refresh_token
    elif refresh_token_cookie:
        refresh_token = refresh_token_cookie
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh токен не знайдено"
        )
    
    with db as connection:
        result = AuthService.refresh_access_token(refresh_token, connection)
        
        # Встановлюємо оновлені токени в cookies
        from app.services.auth import REFRESH_TOKEN_EXPIRE_DAYS, ACCESS_TOKEN_EXPIRE_MINUTES
        
        # Оновлюємо access_token в куках
        response.set_cookie(
            key="access_token",
            value=result["access_token"],
            httponly=False,  # Доступно для JavaScript для перевірки
            secure=False,  # False для localhost, True для production
            # samesite не встановлюємо для localhost розробки
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60  # в секундах
        )
        
        # Оновлюємо refresh_token в куках
        # response.set_cookie(
        #     key="refresh_token",
        #     value=result["refresh_token"],
        #     httponly=True,  # Захищено від XSS атак
        #     secure=False,  # False для localhost, True для production
        #     samesite="lax",  # Змінив з strict на lax
        #     max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60  # в секундах
        # )
        
        return result

@router.post("/logout", summary="Вихід з системи")
def logout(
    response: Response,
    credentials: HTTPAuthorizationCredentials = Depends(AuthService.security),
):
    """
    Вийти з поточної сесії
    
    З JWT токенами це видаляє refresh токен з cookies
    """
    result = AuthService.logout_user()
    
    # Видаляємо refresh токен з cookies
    response.delete_cookie(key="refresh_token")
        
    return result

@router.get("/validate", summary="Перевірити токен")
def validate_token(
    credentials: HTTPAuthorizationCredentials = Depends(AuthService.security),
):
    """
    Перевірити чи дійсний поточний JWT токен
    
    Повертає true якщо токен валідний
    """
    is_valid = AuthService.validate_token(credentials.credentials)
    
    return {"valid": is_valid} 