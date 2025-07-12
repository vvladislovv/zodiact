from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from src.api.schemas import CardMeaning
from config.config import API_KEY, get_db
from src.db.operations import get_all_card_meanings
from typing import List

router = APIRouter(prefix="/cards", tags=["cards"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

@router.get("/list", response_model=List[CardMeaning])
async def cards_list(api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Список всех карт с краткими значениями.
    
    Этот эндпоинт возвращает список всех доступных карт (например, карт Таро) с их краткими значениями.
    Для каждой карты указаны положительные и отрицательные аспекты, которые могут быть использованы для интерпретации.
    Если данные в базе данных отсутствуют, возвращаются тестовые данные с несколькими картами.
    
    Параметры:
    - Нет дополнительных параметров, кроме API-ключа для аутентификации.
    
    Возвращает:
    - Список объектов CardMeaning, каждый из которых содержит:
        - name: Название карты (например, "The Fool").
        - positive: Положительное значение или интерпретация карты.
        - negative: Отрицательное значение или интерпретация карты.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        cards = await get_all_card_meanings(db)
        if not cards:
            # Тестовые данные, если база данных пуста
            cards = [
                CardMeaning(name="The Fool", positive="Новый старт, приключения", negative="Безрассудство, страх перед изменениями"),
                CardMeaning(name="The Magician", positive="Мастерство, творчество", negative="Манипуляция, неиспользованный потенциал"),
                CardMeaning(name="The High Priestess", positive="Интуиция, тайны", negative="Скрытые мотивы, отстраненность")
            ]
            log_info("Returned test data for card meanings as database is empty")
        else:
            log_info("Retrieved card meanings from database")
        # Добавляем краткую AI-интерпретацию для первых трех карт
        try:
            from src.ai.client import get_ai_response
            for card in cards[:3]:  # Ограничиваем до первых трех карт
                prompt = f"Дай краткую интерпретацию карты {card.name} в общем контексте."
                card.ai_summary = get_ai_response(prompt)
                log_info(f"AI summary generated for card {card.name}")
        except Exception as ai_error:
            log_error(f"AI summary failed for card list: {str(ai_error)}")
        return cards
    except Exception as e:
        log_error(f"Error retrieving card meanings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении списка карт: {str(e)}")

@router.get("/interpret/{card_name}", response_model=dict)
async def interpret_card(card_name: str, question: str = "", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Получить детальную интерпретацию карты с помощью AI.
    
    Этот эндпоинт позволяет получить детальную интерпретацию конкретной карты в контексте заданного вопроса.
    Используется AI для анализа карты и предоставления персонализированного ответа.
    
    Параметры:
    - card_name: Название карты для интерпретации.
    - question: Вопрос или контекст для интерпретации (опционально).
    
    Возвращает:
    - interpretation: Детальная интерпретация карты от AI.
    """
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    
    try:
        prompt = f"Интерпретируй карту {card_name} в контексте вопроса: {question if question else 'Общая интерпретация'}."
        interpretation = get_ai_response(prompt)
        log_info(f"AI interpretation requested for card {card_name} with question: {question[:50]}...")
        return {"interpretation": interpretation}
    except Exception as e:
        log_error(f"Error in AI interpretation for card {card_name}: {str(e)}")
        return {"interpretation": "К сожалению, произошла ошибка при получении интерпретации карты от AI. Пожалуйста, попробуйте снова через некоторое время или задайте другой вопрос."}
