#!/usr/bin/env python3
"""
Міграційний скрипт для додавання поля avatar до таблиці users
"""
import sys
import os

# Оскільки ми тепер в папці backend, імпортуємо напряму
from app.database import get_db_connection

def run_migration():
    """Виконує міграцію для додавання поля avatar до таблиці users"""
    
    migration_sql = """
    -- Додавання поля avatar до таблиці users
    ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255); 
    """
    
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                print("🔄 Виконуємо міграцію для додавання поля avatar...")
                
                # Виконуємо SQL міграцію
                cursor.execute(migration_sql)
                connection.commit()
                
                print("✅ Міграція успішно виконана!")
                    
    except Exception as e:
        print(f"❌ Помилка при виконанні міграції: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Запуск міграції для додавання поля avatar до таблиці users")
    success = run_migration()
    
    if success:
        print("\n🎉 Міграція завершена! Поле avatar додано до таблиці users.")
    else:
        print("\n💥 Міграція не вдалася. Перевірте помилки вище.")
        sys.exit(1) 