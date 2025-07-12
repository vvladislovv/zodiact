from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from src.api.schemas import AIPromptRequest, AIPromptResponse
from config.config import API_KEY

router = APIRouter(prefix="/ai", tags=["ai"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

@router.post("/prompt", response_model=AIPromptResponse)
async def ai_prompt(request: AIPromptRequest, api_key: str = Depends(get_api_key)):
    """
    Получить ИИ-интерпретацию на основе промпта.
    
    Этот эндпоинт позволяет пользователю отправить запрос к ИИ (например, OpenAI API) для получения интерпретации или ответа на вопрос.
    Запрос отправляется к внешнему API с использованием модели "gpt-4o" и ограничением на максимальное количество токенов.
    В случае ошибки при запросе к API возвращается сообщение об ошибке.
    
    Параметры:
    - question: Текст вопроса или промпта, который пользователь хочет отправить ИИ.
    - mode: Режим интерпретации (например, "tarot" для интерпретации карт Таро), если применимо.
    - context: Дополнительный контекст для ИИ (например, список карт для интерпретации), если применимо.
    
    Возвращает:
    - response: Ответ от ИИ в виде текста или сообщение об ошибке, если запрос не удался.
    """
    from src.ai.client import get_ai_response
    
    # Формируем промт с учетом режима и контекста
    prompt = request.question
    if request.mode == "tarot" and "cards" in request.context:
        cards = request.context.get("cards", [])
        if cards:
            prompt = f"Интерпретируй карты Таро в контексте вопроса: {request.question}. Карты: {', '.join(cards)}."
    
    response = get_ai_response(prompt)
    return {"response": response}
