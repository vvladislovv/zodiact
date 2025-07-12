from loguru import logger
import os
from datetime import datetime
from collections import deque

# Настройка логгера
logger.add(
    f"logs/app_{datetime.now().strftime('%Y-%m-%d')}.log",
    rotation="1 day",
    retention="7 days",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
)

# Очередь для асинхронного логирования в базу данных
log_queue = deque(maxlen=1000)  # Ограничиваем размер очереди, чтобы избежать переполнения памяти

def add_to_queue(level: str, message: str):
    """
    Добавление лога в очередь для последующей записи в базу данных.
    
    Args:
        level (str): Уровень логирования.
        message (str): Сообщение для логирования.
    """
    log_queue.append({"level": level, "message": message, "timestamp": datetime.now()})

def get_log_queue():
    """
    Получение очереди логов для обработки.
    
    Returns:
        deque: Очередь логов.
    """
    return log_queue

def log_info(message: str):
    """
    Логирование информационного сообщения.
    
    Args:
        message (str): Сообщение для логирования.
    """
    logger.info(message)
    add_to_queue("INFO", message)

def log_error(message: str):
    """
    Логирование сообщения об ошибке.
    
    Args:
        message (str): Сообщение об ошибке для логирования.
    """
    logger.error(message)
    add_to_queue("ERROR", message)

def log_warning(message: str):
    """
    Логирование предупреждающего сообщения.
    
    Args:
        message (str): Предупреждающее сообщение для логирования.
    """
    logger.warning(message)
    add_to_queue("WARNING", message)
