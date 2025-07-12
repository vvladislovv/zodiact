from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from src.api.schemas import TarotDrawRequest, TarotDrawResponse, TarotHistoryItem
from config.config import API_KEY, get_db
from src.db.operations import create_tarot_history, get_tarot_history, get_user_by_user_id, create_user, delete_user_history
from datetime import datetime
from typing import List
import random

router = APIRouter(prefix="/tarot", tags=["tarot"])

# Mock data for Tarot cards
TAROT_CARDS = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World", "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands", "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands", "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups", "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups", "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords", "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords", "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles", "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles", "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"]

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

@router.post("/draw", response_model=TarotDrawResponse)
async def tarot_draw(request: TarotDrawRequest, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Получить расклад ТАРО и его трактовку.
    
    Этот эндпоинт позволяет пользователю получить расклад карт Таро на основе заданного вопроса и типа расклада.
    Поддерживаются различные типы раскладов, например, "3_cards" для расклада из трех карт.
    В ответ возвращается список выбранных карт и их интерпретация.
    Данные о раскладе сохраняются в истории пользователя в базе данных MongoDB.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, делающего запрос (строка).
    - question: Вопрос, на который пользователь хочет получить ответ через расклад Таро (строка).
    - spread_type: Тип расклада, используйте "3_cards" для расклада из трех карт, любой другой текст вернет одну карту.
    
    Возвращает:
    - cards: Список названий карт, выбранных для расклада.
    - interpretation: Текстовая интерпретация расклада, основанная на выбранных картах.
    - date: Дата и время выполнения расклада.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        # Mock card draw based on spread type
        if request.spread_type == "3_cards":
            cards = random.sample(TAROT_CARDS, 3)
        else:
            cards = random.sample(TAROT_CARDS, 1)  # Default to 1 card if spread type is unknown
        
        # Используем AI API для более глубокой интерпретации карт
        from src.ai.client import get_ai_response
        prompt = f"Интерпретируй карты Таро в контексте вопроса: {request.question}. Карты: {', '.join(cards)}."
        interpretation = get_ai_response(prompt)
        log_info(f"AI interpretation generated for tarot draw with question: {request.question[:50]}...")
        
        # Save to history
        user = await get_user_by_user_id(db, request.user_id)
        if user is None:
            user = await create_user(db, request.user_id)
            log_info(f"Created new user with ID {request.user_id} for tarot draw")
        await create_tarot_history(db, int(user.user_id), request.question, ",".join(cards), interpretation)
        log_info(f"Tarot draw completed for user {request.user_id} with question: {request.question}")
        
        return {"cards": cards, "interpretation": interpretation, "date": datetime.now()}
    except Exception as e:
        log_error(f"Error in tarot_draw for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при выполнении расклада Таро: {str(e)}")

@router.get("/user/history", response_model=dict)
async def tarot_history(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Получить историю раскладов пользователя.
    
    Этот эндпоинт возвращает список всех раскладов Таро, выполненных пользователем.
    История включает идентификатор записи, дату расклада, выбранные карты и интерпретацию.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью историю нужно получить.
    
    Возвращает:
    - status: Статус операции.
    - history: Список записей истории, каждая из которых содержит:
        - id: Идентификатор записи.
        - date: Дата и время выполнения расклада в формате строки.
        - cards: Список карт, выбранных в раскладе, в виде строки.
        - interpretation: Интерпретация расклада.
    """
    from src.utils.logger import log_info, log_error
    from datetime import datetime
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            log_info(f"No user found with ID {user_id} for tarot history")
            return {"status": "success", "history": []}
        history = await get_tarot_history(db, int(user.user_id))
        log_info(f"Retrieved tarot history for user {user_id}")
        
        formatted_history = []
        for item in history:
            formatted_history.append({
                "id": str(item.id) if hasattr(item, 'id') else "N/A",
                "date": item.date.strftime("%d %B %Y г. в %H:%M") if isinstance(item.date, datetime) else str(item.date),
                "cards": ", ".join(item.cards) if isinstance(item.cards, list) else item.cards,
                "interpretation": item.summary if hasattr(item, 'summary') else "Нет описания"
            })
        
        return {"status": "success", "history": formatted_history}
    except Exception as e:
        log_error(f"Error retrieving tarot history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении истории раскладов: {str(e)}")

@router.delete("/clear-history", response_model=dict)
async def clear_tarot_history(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Очистить всю историю раскладов и предсказаний пользователя.
    
    Этот эндпоинт удаляет всю историю раскладов Таро и предсказаний по кофейной гуще для указанного пользователя.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью историю нужно очистить.
    
    Возвращает:
    - status: Статус операции (например, "success" при успешной очистке).
    - deleted_count: Количество удаленных записей.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            log_info(f"No user found with ID {user_id} for history deletion")
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        deleted_count = await delete_user_history(db, int(user.user_id))
        log_info(f"Deleted history for user {user_id}, {deleted_count} records removed")
        return {"status": "success", "deleted_count": deleted_count}
    except Exception as e:
        log_error(f"Error deleting history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при очистке истории: {str(e)}")

@router.put("/update-entry", response_model=dict)
async def update_tarot_entry(user_id: str, entry_id: str, notes: str = "", summary: str = "", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Обновить запись расклада Таро.
    
    Этот эндпоинт позволяет обновить конкретную запись расклада Таро, добавляя пользовательские заметки или изменяя краткое описание.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью запись нужно обновить.
    - entry_id: Уникальный идентификатор записи расклада Таро.
    - notes: Пользовательские заметки для добавления к записи (опционально).
    - summary: Обновленное краткое описание расклада (опционально).
    
    Возвращает:
    - status: Статус операции (например, "success" при успешном обновлении).
    - message: Сообщение о результате операции.
    """
    from src.utils.logger import log_info, log_error
    from src.db.operations import update_tarot_history_entry
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            log_info(f"No user found with ID {user_id} for tarot entry update")
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        updates = {}
        if notes:
            updates["notes"] = notes
        if summary:
            updates["summary"] = summary
            
        if not updates:
            log_info(f"No updates provided for tarot entry {entry_id} for user {user_id}")
            return {"status": "error", "message": "Не предоставлены данные для обновления"}
            
        result = await update_tarot_history_entry(db, int(user.user_id), entry_id, updates)
        if result:
            log_info(f"Tarot entry updated for user {user_id}, entry {entry_id}")
            return {"status": "success", "message": "Запись успешно обновлена"}
        else:
            log_info(f"Tarot entry {entry_id} not found for user {user_id}")
            raise HTTPException(status_code=404, detail="Запись не найдена")
    except Exception as e:
        log_error(f"Error updating tarot entry {entry_id} for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении записи: {str(e)}")

@router.delete("/delete-entry/{entry_id}", response_model=dict)
async def delete_tarot_entry(user_id: str, entry_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Удалить конкретную запись расклада Таро из истории.
    
    Этот эндпоинт позволяет удалить конкретную запись расклада Таро из истории пользователя по её ID.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью запись нужно удалить.
    - entry_id: Уникальный идентификатор записи расклада Таро, которую нужно удалить.
    
    Возвращает:
    - status: Статус операции (например, "success" при успешном удалении).
    - message: Сообщение о результате операции.
    """
    from src.utils.logger import log_info, log_error
    from src.db.operations import delete_tarot_history_entry
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            log_info(f"No user found with ID {user_id} for tarot entry deletion")
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        # Примечание: Функция delete_tarot_history_entry должна быть реализована в src/db/operations.py
        result = await delete_tarot_history_entry(db, int(user.user_id), entry_id)
        if result:
            log_info(f"Tarot entry deleted for user {user_id}, entry {entry_id}")
            return {"status": "success", "message": "Запись успешно удалена"}
        else:
            log_info(f"Tarot entry {entry_id} not found for user {user_id}")
            raise HTTPException(status_code=404, detail="Запись не найдена")
    except Exception as e:
        log_error(f"Error deleting tarot entry {entry_id} for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении записи: {str(e)}")
