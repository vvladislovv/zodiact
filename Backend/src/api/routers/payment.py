from fastapi import APIRouter, Depends, Security, HTTPException, Response, Request
from fastapi.security import APIKeyHeader
from src.api.schemas import SubscriptionRequest, SubscriptionResponse
from config.config import API_KEY, get_db, YUKASSA_SHOP_ID, YUKASSA_SECRET_KEY
from src.db.operations import get_user_by_user_id, update_user_subscription, update_user
from datetime import datetime, timedelta
import requests
import uuid
from typing import Dict
from src.ai.client import get_ai_response
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/payment", tags=["payment"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

@router.post("/create-checkout-session", response_model=Dict)
async def create_checkout_session(request: SubscriptionRequest, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Создать сессию оплаты через ЮKassa для подписки.
    
    Этот эндпоинт создает сессию оплаты в ЮKassa для выбранного плана подписки.
    Пользователь будет перенаправлен на страницу оплаты ЮKassa для завершения транзакции.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, для которого создается сессия оплаты.
    - plan: Тип подписки ("monthly" для месячной или любой другой для годовой).
    
    Возвращает:
    - url: URL страницы оплаты ЮKassa для перенаправления пользователя.
    - payment_id: Идентификатор платежа для отслеживания.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, request.user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
            
        amount = 500 if request.plan == "monthly" else 5000  # Цена в рублях
        days = 30 if request.plan == "monthly" else 365
        payment_id = str(uuid.uuid4())
        
        headers = {
            "Authorization": f"Basic {YUKASSA_SHOP_ID}:{YUKASSA_SECRET_KEY}",
            "Idempotence-Key": payment_id,
            "Content-Type": "application/json"
        }
        
        data = {
            "amount": {
                "value": str(amount),
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": "http://localhost:8000/payment/success?payment_id=" + payment_id
            },
            "capture": True,
            "description": f"Подписка {request.plan} для пользователя {request.user_id}",
            "metadata": {
                "user_id": request.user_id,
                "plan": request.plan,
                "days": str(days)
            }
        }
        
        response = requests.post("https://api.yookassa.ru/v3/payments", headers=headers, json=data)
        if response.status_code == 200:
            payment_data = response.json()
            log_info(f"Checkout session created for user {request.user_id} with plan {request.plan}, payment_id {payment_id}")
            return {"url": payment_data["confirmation"]["confirmation_url"], "payment_id": payment_id}
        else:
            raise HTTPException(status_code=500, detail=f"Ошибка при создании сессии оплаты: {response.text}")
    except Exception as e:
        log_error(f"Error creating checkout session for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при создании сессии оплаты: {str(e)}")

@router.get("/success", response_model=SubscriptionResponse)
async def payment_success(payment_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Обработать успешную оплату подписки.
    
    Этот эндпоинт обрабатывает успешное завершение оплаты через ЮKassa.
    Подписка активируется для пользователя на основе данных платежа.
    
    Параметры:
    - payment_id: Идентификатор платежа ЮKassa.
    
    Возвращает:
    - status: Статус операции (например, "success" при успешной активации).
    - expires: Дата окончания подписки.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        headers = {
            "Authorization": f"Basic {YUKASSA_SHOP_ID}:{YUKASSA_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"https://api.yookassa.ru/v3/payments/{payment_id}", headers=headers)
        if response.status_code == 200:
            payment_data = response.json()
            if payment_data["status"] == "succeeded":
                user_id = payment_data["metadata"]["user_id"]
                plan = payment_data["metadata"]["plan"]
                days = int(payment_data["metadata"]["days"])
                
                expires = datetime.now() + timedelta(days=days)
                await update_user_subscription(db, user_id, "active", expires)
                log_info(f"Payment successful for user {user_id} with plan {plan}, subscription expires on {expires}")
                return {"status": "success", "expires": expires}
            else:
                raise HTTPException(status_code=400, detail="Оплата не завершена")
        else:
            raise HTTPException(status_code=500, detail=f"Ошибка при проверке статуса платежа: {response.text}")
    except Exception as e:
        log_error(f"Error processing payment success for payment {payment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке успешной оплаты: {str(e)}")

@router.get("/cancel")
async def payment_cancel():
    """
    Обработать отмену оплаты.
    
    Этот эндпоинт обрабатывает отмену оплаты пользователем.
    Возвращает сообщение об отмене.
    """
    from src.utils.logger import log_info
    
    log_info("Payment cancelled by user")
    return {"status": "cancelled", "message": "Оплата отменена пользователем"}

class AutopaymentRequest(BaseModel):
    enabled: bool

class PaymentRequest(BaseModel):
    plan: str
    price: float

@router.post("/update-autopayment", response_model=dict)
async def update_autopayment(request: Request, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Обновить статус автоплатежа для пользователя.
    
    Этот эндпоинт позволяет включить или отключить автоплатеж для подписки пользователя.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя (опционально, может быть в теле запроса).
    - enabled: Статус автоплатежа (true для включения, false для отключения).
    
    Возвращает:
    - status: Статус операции (например, "success" при успешном обновлении).
    - message: Сообщение о результате операции.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        body = await request.json()
        user_id_from_request = body.get('userId')
        if not user_id_from_request:
            raise HTTPException(status_code=400, detail="Идентификатор пользователя обязателен")
        enabled = body.get('enabled', False)
        
        user = await get_user_by_user_id(db, user_id_from_request)
        if user is None:
            log_info(f"No user found with ID {user_id_from_request} for autopayment update")
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        await update_user(db, user_id_from_request, {"autopayment_enabled": enabled})
        log_info(f"Autopayment updated for user {user_id_from_request}: {'enabled' if enabled else 'disabled'}")
        return {
            "status": "success",
            "message": f"Автоплатеж {'включен' if enabled else 'отключен'} для пользователя {user_id_from_request}"
        }
    except Exception as e:
        log_error(f"Error updating autopayment for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении статуса автоплатежа: {str(e)}")

@router.post("/yookassa/create-payment", response_model=dict)
async def create_yookassa_payment(request: Request, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Создать платеж через ЮKassa для подписки.
    
    Этот эндпоинт создает запрос на оплату через ЮKassa для выбранного плана подписки.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя (опционально, может быть в теле запроса).
    - plan: Тип подписки (например, "День", "Неделя", "Месяц").
    - price: Сумма платежа в рублях.
    
    Возвращает:
    - status: Статус операции (например, "success" при успешном создании платежа).
    - payment_url: URL для перенаправления пользователя на страницу оплаты.
    - payment_id: Идентификатор платежа для отслеживания.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        body = await request.json()
        user_id_from_request = body.get('userId')
        if not user_id_from_request:
            raise HTTPException(status_code=400, detail="Идентификатор пользователя обязателен")
        plan = body.get('plan', 'unknown')
        price = body.get('price', 0.0)
        
        user = await get_user_by_user_id(db, user_id_from_request)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
            
        payment_id = str(uuid.uuid4())
        headers = {
            "Authorization": f"Basic {YUKASSA_SHOP_ID}:{YUKASSA_SECRET_KEY}",
            "Idempotence-Key": payment_id,
            "Content-Type": "application/json"
        }
        
        data = {
            "amount": {
                "value": str(price),
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": "http://localhost:8000/payment/success?payment_id=" + payment_id
            },
            "capture": True,
            "description": f"Подписка {plan} для пользователя {user_id_from_request}",
            "metadata": {
                "user_id": user_id_from_request,
                "plan": plan
            }
        }
        
        response = requests.post("https://api.yookassa.ru/v3/payments", headers=headers, json=data)
        if response.status_code == 200:
            payment_data = response.json()
            log_info(f"Yookassa payment created for user {user_id_from_request} with plan {plan}, payment_id {payment_id}")
            return {
                "status": "success",
                "payment_url": payment_data["confirmation"]["confirmation_url"],
                "payment_id": payment_id
            }
        else:
            raise HTTPException(status_code=500, detail=f"Ошибка при создании платежа: {response.text}")
    except Exception as e:
        log_error(f"Error creating Yookassa payment for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при создании платежа через ЮKassa: {str(e)}")
