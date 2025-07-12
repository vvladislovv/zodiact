from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from src.api.schemas import InfoContentResponse, InfoListItem
from config.config import API_KEY, get_db
from src.db.operations import get_info_page_by_slug, get_all_info_pages
from typing import List

router = APIRouter(prefix="/info", tags=["info"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

# @router.get("/content", response_model=InfoContentResponse)
# async def info_content(topic: str = "how_to_use", api_key: str = Depends(get_api_key), db = Depends(get_db)):
#     """
#     Получить справочные статьи.
    
#     Этот эндпоинт позволяет получить содержимое справочной статьи по заданной теме.
#     Если статья по указанной теме не найдена в базе данных, возвращается тестовая информация для некоторых предопределенных тем.
#     Поддерживаются темы, такие как "how_to_use" (как использовать бот) и "about" (о боте).
    
#     Параметры:
#     - topic: Тема справочной статьи (по умолчанию "how_to_use").
    
#     Возвращает:
#     - title: Заголовок статьи.
#     - text: Текст статьи с информацией по заданной теме.
#     """
#     from src.utils.logger import log_info, log_error
    
#     try:
#         content = await get_info_page_by_slug(db, topic)
#         if content is None:
#             if topic == "how_to_use":
#                 log_info(f"Returned test data for topic 'how_to_use'")
#                 return {"title": "Как использовать ZodiacBot", "text": "ZodiacBot помогает вам получать предсказания и расклады Таро. Просто отправьте команду /start, чтобы начать."}
#             elif topic == "about":
#                 log_info(f"Returned test data for topic 'about'")
#                 return {"title": "О ZodiacBot", "text": "ZodiacBot - это бот для получения предсказаний и информации о Таро, кофе и многом другом."}
#             else:
#                 from src.ai.client import get_ai_response
#                 prompt = f"Создай справочную статью на тему {topic} для бота ZodiacBot."
#                 generated_content = get_ai_response(prompt)
#                 log_info(f"Generated AI content for topic '{topic}'")
#                 return {"title": f"Статья о {topic}", "text": generated_content}
#             log_info(f"No content found for topic '{topic}', returned default or AI-generated content")
#         log_info(f"Retrieved content for topic '{topic}'")
#         return {"title": content.title, "text": content.text}
#     except Exception as e:
#         log_error(f"Error retrieving content for topic '{topic}': {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Ошибка при получении справочной статьи: {str(e)}")

# @router.get("/list", response_model=List[InfoListItem])
# async def info_list(api_key: str = Depends(get_api_key), db = Depends(get_db)):
#     """
#     Список доступных справочных тем.
    
#     Этот эндпоинт возвращает список всех доступных справочных тем, которые пользователь может запросить.
#     Каждая тема представлена уникальным идентификатором (slug) и заголовком (title).
#     Список сортируется по заголовку для удобства восприятия.
    
#     Параметры:
#     - Нет дополнительных параметров, кроме API-ключа для аутентификации.
    
#     Возвращает:
#     - Список объектов InfoListItem, каждый из которых содержит:
#         - slug: Уникальный идентификатор темы для запроса содержимого.
#         - title: Название темы для отображения пользователю.
#     """
#     from src.utils.logger import log_info, log_error
    
#     try:
#         topics = await get_all_info_pages(db)
#         log_info("Retrieved list of info topics")
#         return [{"slug": topic.slug, "title": topic.title} for topic in topics]
#     except Exception as e:
#         log_error(f"Error retrieving list of info topics: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Ошибка при получении списка справочных тем: {str(e)}")
