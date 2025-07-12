from fastapi import APIRouter, Depends, Security, HTTPException, Request
from fastapi.security import APIKeyHeader
from config.config import API_KEY, get_db
from src.db.operations import get_user_by_user_id
from typing import List
from pydantic import BaseModel

router = APIRouter(tags=["direct"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

# Модели для нефинансовых входных данных
class CoffeeInterpretRequest(BaseModel):
    area: str = ""
    cards: List[int] = []

class TarotRevealRequest(BaseModel):
    cards: List[int]

class PersonalForecastRequest(BaseModel):
    cards: List[int]
    category: str = ""

class RunesRevealRequest(BaseModel):
    runes: List[int]
    relationshipAspect: str = ""
    runeAspect: str = ""

class AnalyzeRequest(BaseModel):
    cards: List[int]
    category: str = ""

class SpiritualGrowthRequest(BaseModel):
    cards: List[int]

class TarotReadingRequest(BaseModel):
    type: str

@router.post("/coffee-interpret", response_model=dict)
async def coffee_interpret(request: Request, user_id: str = "unknown", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    try:
        body = await request.json()
        cards = body.get('cards', [])
        area = body.get('area', '')
        reading_type = body.get('readingType', '')
        user_id_from_request = body.get('userId', 'unknown')
        log_info(f"Received coffee-interpret request for user {user_id_from_request} with data: cards={cards}, area={area}, readingType={reading_type}")
        prompt = "Интерпретируй символы кофейной гущи. "
        if area:
            prompt += f"Область чашки: {area}. "
        if cards:
            prompt += f"Выбранные карты (индексы): {', '.join(map(str, cards))}. "
        if reading_type:
            prompt += f" Тип гадания: {reading_type}."
        interpretation = get_ai_response(prompt)
        log_info(f"Coffee interpretation generated for user {user_id_from_request}")
        return {"interpretation": interpretation}
    except Exception as e:
        log_error(f"Error in coffee interpretation for user {user_id_from_request}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при интерпретации кофейной гущи: {str(e)}")

@router.post("/tarot-reveal", response_model=dict)
async def tarot_reveal(request: Request, user_id: str = "unknown", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    try:
        body = await request.json()
        cards = body.get('cards', [])
        reading_type = body.get('readingType', '')
        time_periods = body.get('timePeriods', [])
        user_id_from_request = body.get('userId', 'unknown')
        log_info(f"Received tarot-reveal request for user {user_id_from_request} with data: cards={cards}, readingType={reading_type}, timePeriods={time_periods}")
        prompt = f"Интерпретируй карты Таро. Выбранные карты (индексы): {', '.join(map(str, cards))}."
        if reading_type:
            prompt += f" Тип расклада: {reading_type}."
        if time_periods and len(time_periods) == len(cards):
            for i, period in enumerate(time_periods):
                prompt += f" Карта {cards[i]} соответствует периоду: {period}."
        interpretation = get_ai_response(prompt)
        log_info(f"Tarot reveal interpretation generated for user {user_id_from_request}")
        return {"interpretation": interpretation}
    except Exception as e:
        log_error(f"Error in tarot reveal for user {user_id_from_request}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при раскрытии карт Таро: {str(e)}")

@router.post("/personal-forecast", response_model=dict)
async def personal_forecast(request: Request, user_id: str = "unknown", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    try:
        body = await request.json()
        cards = body.get('cards', [])
        category = body.get('category', '')
        user_id_from_request = body.get('userId', 'unknown')
        log_info(f"Received personal-forecast request for user {user_id_from_request} with data: cards={cards}, category={category}")
        prompt = f"Составь персональный прогноз на основе выбранных карт (индексы): {', '.join(map(str, cards))}."
        if category:
            prompt += f" Категория: {category}."
        forecast = get_ai_response(prompt)
        log_info(f"Personal forecast generated for user {user_id_from_request}")
        return {"forecast": forecast}
    except Exception as e:
        log_error(f"Error in personal forecast for user {user_id_from_request}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при составлении персонального прогноза: {str(e)}")

@router.post("/runes-reveal", response_model=dict)
async def runes_reveal(request: Request, user_id: str = "unknown", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    try:
        body = await request.json()
        runes = body.get('runes', [])
        relationship_aspect = body.get('relationshipAspect', '')
        rune_aspect = body.get('runeAspect', '')
        log_info(f"Received runes-reveal request for user {user_id} with data: runes={runes}, relationshipAspect={relationship_aspect}, runeAspect={rune_aspect}")
        prompt = f"Интерпретируй руны для анализа отношений. Выбранные руны (индексы): {', '.join(map(str, runes))}."
        if relationship_aspect:
            prompt += f" Аспект отношений: {relationship_aspect}."
        if rune_aspect:
            prompt += f" Аспект руны: {rune_aspect}."
        interpretation = get_ai_response(prompt)
        log_info(f"Runes reveal interpretation generated for user {user_id}")
        return {"interpretation": interpretation}
    except Exception as e:
        log_error(f"Error in runes reveal for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при интерпретации рун: {str(e)}")

@router.post("/analyze", response_model=dict)
async def analyze(request: Request, user_id: str = "unknown", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    try:
        body = await request.json()
        cards = body.get('cards', [])
        category = body.get('category', '')
        log_info(f"Received analyze request for user {user_id} with data: cards={cards}, category={category}")
        prompt = f"Проанализируй ситуацию на основе выбранных карт (индексы): {', '.join(map(str, cards))}."
        if category:
            prompt += f" Категория: {category}."
        analysis = get_ai_response(prompt)
        log_info(f"Situation analysis generated for user {user_id}")
        return {"analysis": analysis}
    except Exception as e:
        log_error(f"Error in situation analysis for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при анализе ситуации: {str(e)}")

@router.post("/spiritual-growth", response_model=dict)
async def spiritual_growth(request: Request, user_id: str = "unknown", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    try:
        body = await request.json()
        cards = body.get('cards', [])
        aspect = body.get('aspect', '')
        user_id_from_request = body.get('userId', 'unknown')
        log_info(f"Received spiritual-growth request for user {user_id_from_request} with data: cards={cards}, aspect={aspect}")
        prompt = f"Дай совет по духовному росту на основе выбранной карты (индексы): {', '.join(map(str, cards))}."
        if aspect:
            prompt += f" Аспект: {aspect}."
        advice = get_ai_response(prompt)
        log_info(f"Spiritual growth advice generated for user {user_id_from_request}")
        return {"advice": advice}
    except Exception as e:
        log_error(f"Error in spiritual growth advice for user {user_id_from_request}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при предоставлении совета по духовному росту: {str(e)}")

@router.post("/tarot-reading", response_model=dict)
async def tarot_reading(user_id: str, request: TarotReadingRequest, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    from src.utils.logger import log_info, log_error
    from src.ai.client import get_ai_response
    try:
        prompt = f"Сделай расклад Таро типа: {request.type}."
        reading = get_ai_response(prompt)
        log_info(f"Tarot reading of type {request.type} generated for user {user_id}")
        return {"reading": reading}
    except Exception as e:
        log_error(f"Error in tarot reading for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при выполнении расклада Таро: {str(e)}")
