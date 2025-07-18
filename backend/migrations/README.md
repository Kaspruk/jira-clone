# Міграції бази даних

Ця папка містить SQL та Python скрипти для міграцій бази даних.

## Структура

- `*.sql` - SQL скрипти для прямих змін в базі даних
- `*.py` - Python скрипти для складних міграцій з логікою

## Як запустити міграцію

### Python міграції
```bash
cd backend
python migrate_task_statuses.py
```

### SQL міграції
```bash
psql -d your_database -f migrations/fix_task_statuses_constraint.sql
```

## Поточні міграції

- `fix_task_statuses_constraint.sql` - Виправлення унікального обмеження в таблиці task_statuses
- `migrate_task_statuses.py` - Python скрипт для автоматичного виконання міграції task_statuses 