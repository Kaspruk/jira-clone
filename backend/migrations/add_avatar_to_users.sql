-- Додавання поля avatar до таблиці users
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255); 