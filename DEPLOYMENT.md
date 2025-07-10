# Інструкції для деплою Jira Clone на Render.com

## Передумови

1. Обліковий запис на [Render.com](https://render.com)
2. Ваш проект на GitHub/GitLab/Bitbucket

## Кроки для деплою

### 1. Підготовка репозиторію

Переконайтеся, що у вашому репозиторії є файл `render.yaml` в корені проекту.

### 2. Налаштування на Render

1. Увійдіть в ваш обліковий запис Render.com
2. Натисніть кнопку "New +" та оберіть "Blueprint"
3. Підключіть ваш Git репозиторій
4. Render автоматично знайде файл `render.yaml` та створить всі сервіси

### 3. Environment Variables

Наступні змінні будуть автоматично налаштовані:

**Backend:**
- `DATABASE_URL` - автоматично з PostgreSQL
- `SECRET_KEY` - генерується автоматично
- `ALGORITHM` - HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES` - 30 хвилин
- `FRONTEND_URL` - автоматично з frontend сервісу

**Frontend:**
- `NEXT_PUBLIC_BASE_URL` - автоматично з backend сервісу
- `NEXTAUTH_SECRET` - генерується автоматично
- `NEXTAUTH_URL` - автоматично з frontend сервісу

### 4. Структура деплою

Файл `render.yaml` створює:

1. **PostgreSQL Database** (`jira-clone-db`)
   - Free tier
   - Автоматичне підключення до backend

2. **Backend Service** (`jira-clone-backend`)
   - Python runtime
   - FastAPI додаток
   - Health check: `/docs`
   - Port: автоматично призначається Render

3. **Frontend Service** (`jira-clone-frontend`)
   - Node.js runtime
   - Next.js додаток
   - Збірка з pnpm

### 5. Після деплою

1. Відкрийте frontend URL (буде показаний в Render dashboard)
2. Перевірте що API працює, відвідавши `<backend-url>/docs`
3. Спробуйте зареєструватися та увійти в систему

### 6. Моніторинг

- Логи кожного сервісу доступні в Render dashboard
- Health checks автоматично перевіряють стан сервісів
- Free tier має обмеження по ресурсах та може "засинати" після періоду неактивності

### 7. Оновлення

При пуші змін в репозиторій, Render автоматично перезбудує та передеплоїть сервіси.

## Налаштування локальної розробки

Для локальної розробки створіть файл `.env` в папці `backend/`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/jira_clone
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Та файл `.env.local` в папці `frontend/`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Troubleshooting

### Backend не запускається
- Перевірте логи в Render dashboard
- Переконайтеся що всі залежності в `requirements.txt`
- Перевірте DATABASE_URL

### Frontend не може підключитися до API
- Перевірте `NEXT_PUBLIC_BASE_URL` environment variable
- Переконайтеся що CORS налаштований правильно в backend
- Перевірте що backend доступний за вказаним URL

### Database помилки
- Перевірте що PostgreSQL сервіс запущений
- Переконайтеся що DATABASE_URL правильний
- Перевірте що таблиці створилися правильно (дивіться backend логи)

## Контакти

Якщо виникають проблеми з деплоєм, перевірте:
1. Логи сервісів в Render dashboard
2. Environment variables
3. Build та start команди в `render.yaml` 