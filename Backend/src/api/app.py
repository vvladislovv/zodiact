from fastapi import FastAPI, HTTPException, Depends, Security, BackgroundTasks
from fastapi.security import APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from config.config import API_KEY, get_db
from src.api.routers import tarot, coffee, user, info, ai, feedback, cards, payment
from src.db.operations import create_log
from src.utils.logger import get_log_queue

app = FastAPI(title="ZodiacBot API", description="API for ZodiacBot functionalities")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить запросы со всех источников для отладки
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

@app.on_event("startup")
async def startup_event():
    """
    Событие при старте приложения для обработки очереди логов.
    """
    from src.utils.logger import get_log_queue
    from src.db.operations import create_log
    import asyncio
    
    async def background_log_processor(db=Depends(get_db)):
        log_queue = get_log_queue()
        while True:
            if log_queue:
                log_entry = log_queue.popleft()
                await create_log(db, log_entry["level"], log_entry["message"])
            await asyncio.sleep(1)  # Проверять очередь каждую секунду
    
    # Запуск фоновой задачи для обработки логов
    # Это временное решение, может потребоваться более надежный способ
    # asyncio.create_task(background_log_processor())

# API Key security
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

@app.get("/health", tags=["health"])
async def health_check(background_tasks: BackgroundTasks, api_key: str = Depends(get_api_key), db=Depends(get_db)):
    """
    Проверка состояния API.
    
    Этот эндпоинт используется для проверки доступности и работоспособности API.
    Он возвращает простой статус, чтобы подтвердить, что API работает корректно.
    Требуется API-ключ для аутентификации запроса.
    
    Параметры:
    - Нет дополнительных параметров, кроме API-ключа для аутентификации.
    
    Возвращает:
    - status: Статус API (например, "ok", если API работает корректно).
    """
    from src.utils.logger import log_info
    
    log_info("Health check requested")
    
    # Добавляем фоновую задачу для обработки очереди логов
    background_tasks.add_task(process_log_queue, db)
    return {"status": "ok"}

async def process_log_queue(db):
    """
    Обработка очереди логов и запись их в базу данных.
    
    Args:
        db: Объект базы данных.
    """
    log_queue = get_log_queue()
    while log_queue:
        log_entry = log_queue.popleft()
        await create_log(db, log_entry["level"], log_entry["message"])

# Удален базовый эндпоинт /info по запросу пользователя
# @app.get("/info", tags=["info"])
# async def get_info(api_key: str = Depends(get_api_key)):
#     """
#     Получение информации о боте или приложении.
#     """
#     return {"message": "ZodiacBot API v1.0"}

# Include routers
app.include_router(tarot.router)
app.include_router(coffee.router)
app.include_router(user.router)
app.include_router(info.router)
app.include_router(ai.router)
app.include_router(feedback.router)
app.include_router(cards.router)
app.include_router(payment.router)
from src.api.routers import direct
app.include_router(direct.router)
