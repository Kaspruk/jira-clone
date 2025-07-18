-- Міграція для виправлення унікального обмеження в таблиці task_statuses
-- Проблема: обмеження UNIQUE (name) має бути UNIQUE (name, workspace_id)

-- Спочатку видаляємо старе обмеження
ALTER TABLE task_statuses DROP CONSTRAINT IF EXISTS task_statuses_name_key;

-- Додаємо нове правильне обмеження
ALTER TABLE task_statuses ADD CONSTRAINT task_statuses_name_workspace_unique UNIQUE (name, workspace_id);

-- Перевіряємо результат
\d task_statuses; 