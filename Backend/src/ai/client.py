import requests
from src.utils.logger import log_info, log_error
from config.config import OPENAI_API_KEY

def get_ai_response(prompt: str, model: str = "gpt-4o", max_tokens: int = 700) -> str:
    """
    Отправляет запрос к API ИИ и возвращает ответ.
    
    Параметры:
    - prompt: Текст запроса или промпта для ИИ.
    - model: Модель ИИ для использования (по умолчанию "gpt-4o").
    - max_tokens: Максимальное количество токенов в ответе (по умолчанию 700).
    
    Возвращает:
    - Ответ от ИИ в виде строки или сообщение об ошибке.
    """
    from time import time
    try:
        # Простая проверка частоты запросов (антиспам)
        if not hasattr(get_ai_response, "last_request_time") or time() - get_ai_response.last_request_time > 5:  # Ограничение 1 запрос каждые 5 секунд
            get_ai_response.last_request_time = time()
            
            # Проверка подписки или баланса пользователя (заглушка)
            # TODO: Реализовать проверку подписки/баланса пользователя
            user_has_subscription = True  # Заглушка, предполагаем, что подписка есть
            if not user_has_subscription:
                log_info("AI request denied due to lack of subscription or balance")
                return "Для использования ИИ требуется активная подписка или достаточный баланс. Пожалуйста, проверьте ваш статус."
            
            # Проверка локации пользователя (заглушка)
            # TODO: Реализовать проверку локации пользователя
            user_location_allowed = True  # Заглушка, предполагаем, что локация разрешена
            if not user_location_allowed:
                log_info("AI request denied due to restricted location")
                return "Доступ к ИИ ограничен в вашей локации. Пожалуйста, свяжитесь с поддержкой для получения дополнительной информации."
                
            api_url = "https://api.proxyapi.ru/openai/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENAI_API_KEY}"
            }
            data = {
                "model": model,
                "messages": [
                    {"role": "system", "content": "Вы - высококвалифицированный ассистент, специализирующийся на предсказаниях, интерпретациях карт Таро, кофейной гущи и других эзотерических практик. Ваша задача - предоставлять пользователю глубокие, содержательные и персонализированные ответы на их вопросы. Используйте контекст, предоставленный пользователем, чтобы сделать ответ максимально релевантным. Если вопрос касается Таро, анализируйте карты и их возможные значения в контексте вопроса. Если вопрос о кофейной гуще, интерпретируйте образы и символы, которые могут быть видны на изображении. Старайтесь давать ответы, которые звучат естественно и вдохновляюще, избегая банальных фраз. Если контекст или данные отсутствуют, используйте общие знания и интуицию, чтобы дать полезный совет. Всегда сохраняйте тон доброжелательный и поддерживающий, чтобы пользователь чувствовал себя комфортно."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": max_tokens
            }
            
            log_info(f"Sending AI prompt request with question: {prompt[:50]}...")
            response = requests.post(api_url, headers=headers, json=data)
            response_data = response.json()
            # print(response_data)
            if "choices" in response_data and len(response_data["choices"]) > 0:
                log_info("Successfully received response from AI")
                return response_data["choices"][0]["message"]["content"]
            else:
                log_error("No valid response choices from AI API")
                return "К сожалению, произошла ошибка при получении ответа от ИИ. Пожалуйста, попробуйте снова через некоторое время."
        else:
            log_info("AI request skipped due to rate limiting")
            return "Слишком много запросов к ИИ. Пожалуйста, подождите несколько секунд перед следующим запросом."
    except Exception as e:
        log_error(f"Error in AI prompt request: {str(e)}")
        return f"Ошибка при запросе к ИИ: {str(e)}"
