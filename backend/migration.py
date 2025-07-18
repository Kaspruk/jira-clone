#!/usr/bin/env python3
"""
Міграційний скрипт для виправлення унікального обмеження в таблиці task_statuses
"""
import sys
import os

# Оскільки ми тепер в папці backend, імпортуємо напряму
from app.database import get_db_connection

def run_migration():
    """Виконує міграцію для виправлення унікального обмеження task_statuses"""
    
    migration_sql = """
    -- Видаляємо старе обмеження
    ALTER TABLE task_statuses DROP CONSTRAINT IF EXISTS task_statuses_name_key;
    
    -- Додаємо нове правильне обмеження
    ALTER TABLE task_statuses ADD CONSTRAINT task_statuses_name_workspace_unique UNIQUE (name, workspace_id);
    """
    
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                print("🔄 Виконуємо міграцію task_statuses...")
                
                # Виконуємо міграцію
                cursor.execute(migration_sql)
                connection.commit()
                
                print("✅ Міграція успішно виконана!")
                
                # Перевіряємо результат
                cursor.execute("""
                SELECT constraint_name, constraint_type 
                FROM information_schema.table_constraints 
                WHERE table_name = 'task_statuses' AND constraint_type = 'UNIQUE'
                """)
                constraints = cursor.fetchall()
                
                print("\n📋 Поточні унікальні обмеження task_statuses:")
                for constraint in constraints:
                    print(f"  - {constraint['constraint_name']} ({constraint['constraint_type']})")
                    
    except Exception as e:
        print(f"❌ Помилка при виконанні міграції: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Запуск міграції для таблиці task_statuses")
    success = run_migration()
    
    if success:
        print("\n🎉 Міграція завершена! Тепер ви можете створювати workspace без помилок.")
    else:
        print("\n💥 Міграція не вдалася. Перевірте помилки вище.")
        sys.exit(1) 