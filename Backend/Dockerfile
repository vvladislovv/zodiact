# Базовый образ с Python
FROM python:3.9-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Установка рабочей директории
WORKDIR /app

# Копируем только файлы зависимостей для кеширования
COPY pyproject.toml ./

# Устанавливаем зависимости (этот слой будет кешироваться)
RUN pip install --no-cache-dir .

# Копируем остальной код
COPY . .

# Открываем порт
EXPOSE 8000

# Запускаем приложение
CMD ["python", "main.py"]
