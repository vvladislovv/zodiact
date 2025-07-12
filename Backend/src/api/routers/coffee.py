from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from src.api.schemas import CoffeeFortuneRequest, CoffeeFortuneResponse
from config.config import API_KEY, get_db
from src.db.operations import create_coffee_history, get_user_by_user_id, create_user
from datetime import datetime
from typing import List

router = APIRouter(prefix="/coffee", tags=["coffee"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

@router.post("/fortune", response_model=CoffeeFortuneResponse)
async def coffee_fortune(request: CoffeeFortuneRequest, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Получить предсказание по фото кофейной гущи.
    
    Этот эндпоинт позволяет пользователю получить предсказание на основе фотографии кофейной гущи.
    Пользователь отправляет изображение в формате base64 и вопрос, на который хочет получить ответ.
    В ответ возвращается интерпретация изображения, основанная на тестовых данных (в реальном приложении это может быть анализ изображения с помощью ИИ).
    Данные о предсказании сохраняются в истории пользователя в базе данных MongoDB.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, делающего запрос.
    - question: Вопрос, на который пользователь хочет получить ответ через предсказание.
    - image_base64: Изображение кофейной гущи в формате base64 для анализа.
    
    Возвращает:
    - interpretation: Текстовая интерпретация предсказания, основанная на изображении.
    - date: Дата и время выполнения предсказания.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        # Используем AI API для интерпретации на основе вопроса
        from src.ai.client import get_ai_response
        prompt = f"Интерпретируй изображение кофейной гущи в контексте вопроса: {request.question}."
        interpretation = get_ai_response(prompt)
        log_info(f"AI interpretation generated for coffee fortune with question: {request.question[:50]}...")
        
        # Save to history
        user = await get_user_by_user_id(db, request.user_id)
        if user is None:
            user = await create_user(db, request.user_id)
            log_info(f"Created new user with ID {request.user_id} for coffee fortune")
        image_id = "mock_image_id"  # In a real scenario, save the image and get an ID
        await create_coffee_history(db, int(user.user_id), image_id, request.question, interpretation)
        log_info(f"Coffee fortune completed for user {request.user_id} with question: {request.question}")
        
        return {"interpretation": interpretation, "date": datetime.now()}
    except Exception as e:
        user_id = request.user_id if hasattr(request, 'user_id') else 'unknown'
        log_error(f"Error in coffee_fortune for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при выполнении предсказания по кофейной гуще: {str(e)}")

@router.get("/history", response_model=List[dict])
async def coffee_history(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Получить историю предсказаний по кофейной гуще.
    
    Этот эндпоинт возвращает список всех предсказаний по кофейной гуще, выполненных пользователем.
    История включает дату предсказания, заданный вопрос и краткую интерпретацию.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью историю нужно получить.
    
    Возвращает:
    - Список объектов, каждый из которых содержит:
        - date: Дата и время выполнения предсказания.
        - question: Вопрос, заданный пользователем.
        - interpretation: Текстовая интерпретация предсказания.
    """
    from src.utils.logger import log_info, log_error
    from src.db.operations import get_coffee_history
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            log_info(f"No user found with ID {user_id} for coffee history")
            return []
        history = await get_coffee_history(db, int(user.user_id))
        log_info(f"Retrieved coffee history for user {user_id}")
        return history
    except Exception as e:
        log_error(f"Error retrieving coffee history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении истории предсказаний: {str(e)}")

@router.delete("/clear-history", response_model=dict)
async def clear_coffee_history(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Очистить историю предсказаний по кофейной гуще.
    
    Этот эндпоинт удаляет всю историю предсказаний по кофейной гуще для указанного пользователя.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью историю нужно очистить.
    
    Возвращает:
    - status: Статус операции (например, "success" при успешной очистке).
    - deleted_count: Количество удаленных записей.
    """
    from src.utils.logger import log_info, log_error
    from src.db.operations import delete_coffee_history
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            log_info(f"No user found with ID {user_id} for coffee history deletion")
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        deleted_count = await delete_coffee_history(db, int(user.user_id))
        log_info(f"Deleted coffee history for user {user_id}, {deleted_count} records removed")
        return {"status": "success", "deleted_count": deleted_count}
    except Exception as e:
        log_error(f"Error deleting coffee history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при очистке истории: {str(e)}")
