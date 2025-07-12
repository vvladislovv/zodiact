from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from src.api.schemas import FeedbackRequest
from config.config import API_KEY, get_db
from src.db.operations import create_feedback, get_user_by_user_id, create_user
from datetime import datetime

router = APIRouter(prefix="/feedback", tags=["feedback"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

# @router.post("/send")
# async def feedback_send(request: FeedbackRequest, api_key: str = Depends(get_api_key), db = Depends(get_db)):
#     """
#     Отправить отзыв от пользователя.
    
#     Этот эндпоинт позволяет пользователю отправить отзыв или сообщение разработчикам бота.
#     Отзыв сохраняется в базе данных MongoDB вместе с идентификатором пользователя и датой отправки.
#     Это полезно для сбора обратной связи и улучшения функциональности бота.
    
#     Параметры:
#     - user_id: Уникальный идентификатор пользователя, отправляющего отзыв.
#     - message: Текст отзыва или сообщения от пользователя.
    
#     Возвращает:
#     - status: Статус операции (например, "success" при успешной отправке).
#     """
#     from src.utils.logger import log_info, log_error
    
#     try:
#         user = await get_user_by_user_id(db, request.user_id)
#         if user is None:
#             user = await create_user(db, request.user_id)
#             log_info(f"Created new user with ID {request.user_id} for feedback")
#         await create_feedback(db, user.id, request.message)
#         log_info(f"Feedback received: UserID={request.user_id}, MessageLength={len(request.message)}")
        
#         try:
#             from src.ai.client import get_ai_response
#             prompt = f"Проанализируй этот отзыв и определи его тональность: {request.message}."
#             analysis = get_ai_response(prompt)
#             log_info(f"AI analysis completed: UserID={request.user_id}, AnalysisLength={len(analysis)}")
#         except Exception as ai_error:
#             analysis = "Ошибка при получении ответа от ИИ."
#             log_error(f"AI analysis failed: UserID={request.user_id}, Error={str(ai_error)}")
        
#         # Запись логов в базу данных
#         from src.db.operations import create_log
#         await create_log(db, "Feedback", f"UserID={request.user_id}", "Received feedback and performed AI analysis")
        
#         return {"status": "success", "analysis": analysis}
#     except Exception as e:
#         log_error(f"Error saving feedback for user {request.user_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Ошибка при отправке отзыва: {str(e)}")
