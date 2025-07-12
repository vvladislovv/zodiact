# Базовый образ с Python
FROM python:3.9-slim

# Установка необходимых пакетов
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Установка рабочей директории
WORKDIR /app

# Копирование файлов проекта
COPY pyproject.toml ./
COPY . .

# Установка зависимостей через pip
RUN pip install --no-cache-dir -r pyproject.toml || pip install --no-cache-dir .

# Открытие порта для FastAPI
EXPOSE 8000

# Команда для запуска приложения
CMD ["python", "main.py"]
