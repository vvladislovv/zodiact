from fastapi import APIRouter, Depends, Security, HTTPException
from fastapi.security import APIKeyHeader
from src.api.schemas import SubscriptionRequest, SubscriptionResponse, User
from config.config import API_KEY, get_db
from src.db.operations import get_user_by_user_id, create_user, update_user_subscription, update_user
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter(prefix="/user", tags=["user"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

@router.get("/profile", response_model=User)
async def user_profile(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Получить данные пользователя.
    
    Этот эндпоинт возвращает профиль пользователя на основе его уникального идентификатора.
    Профиль включает информацию о дате регистрации, статусе подписки и дате окончания подписки.
    Если пользователь не найден в базе данных, он создается как новый пользователь с базовыми настройками.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чей профиль нужно получить.
    
    Возвращает:
    - Объект User, содержащий:
        - user_id: Уникальный идентификатор пользователя.
        - telegram_name: Имя пользователя в Telegram (если доступно).
        - full_name: Полное имя пользователя (если указано).
        - joined: Дата регистрации пользователя.
        - subscription_status: Текущий статус подписки ("active" или "inactive").
        - subscription_expires: Дата окончания подписки (если применимо).
        - created_at: Дата создания записи в базе данных.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            # Create a new user if not found
            user = await create_user(db, user_id)
            log_info(f"User profile created: ID={user_id}, Action=NewUser")
        else:
            log_info(f"User profile accessed: ID={user_id}, Action=ProfileView")
        return user
    except Exception as e:
        log_error(f"Error retrieving profile for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении данных пользователя: {str(e)}")

@router.post("/subscribe", response_model=SubscriptionResponse)
async def user_subscribe(request: SubscriptionRequest, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Активировать подписку.
    
    Этот эндпоинт позволяет активировать подписку для пользователя на основе выбранного плана.
    Поддерживаются планы "monthly" (месячная подписка на 30 дней) и другие (годовая подписка на 365 дней).
    Статус подписки обновляется в базе данных, и устанавливается дата окончания подписки.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, для которого активируется подписка.
    - plan: Тип подписки ("monthly" для месячной или любой другой для годовой).
    
    Возвращает:
    - status: Статус операции (например, "success" при успешной активации).
    - expires: Дата окончания подписки.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        expires = datetime.now() + timedelta(days=30 if request.plan == "monthly" else 365)
        await update_user_subscription(db, request.user_id, "active", expires)
        log_info(f"Subscription activated for user {request.user_id} with plan {request.plan}, expires on {expires}")
        return {"status": "success", "expires": expires}
    except Exception as e:
        log_error(f"Error activating subscription for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при активации подписки: {str(e)}")

@router.post("/update-profile", response_model=User)
async def update_user_profile(user_id: str, telegram_name: Optional[str] = None, full_name: Optional[str] = None, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Обновить данные профиля пользователя.
    
    Этот эндпоинт позволяет обновить имя в Telegram и полное имя пользователя.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чей профиль нужно обновить.
    - telegram_name: Новое имя пользователя в Telegram (опционально).
    - full_name: Новое полное имя пользователя (опционально).
    
    Возвращает:
    - Обновленный объект User.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        
        updates = {}
        if telegram_name is not None:
            updates['telegram_name'] = telegram_name
        if full_name is not None:
            updates['full_name'] = full_name
            
        if updates:
            await update_user(db, user_id, updates)
            log_info(f"User profile updated: ID={user_id}, Updates={updates}")
        else:
            log_info(f"No updates provided for user profile: ID={user_id}")
            
        updated_user = await get_user_by_user_id(db, user_id)
        return updated_user
    except Exception as e:
        log_error(f"Error updating profile for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении профиля: {str(e)}")

@router.post("/renew-subscription", response_model=SubscriptionResponse)
async def renew_subscription(request: SubscriptionRequest, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Продлить подписку.
    
    Этот эндпоинт позволяет продлить существующую подписку пользователя на основе выбранного плана.
    Если подписка активна, новая дата окончания будет рассчитана от текущей даты окончания.
    Если подписка неактивна, новая дата окончания будет рассчитана от текущей даты.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, для которого продлевается подписка.
    - plan: Тип подписки ("monthly" для месячной или любой другой для годовой).
    
    Возвращает:
    - status: Статус операции (например, "success" при успешном продлении).
    - expires: Новая дата окончания подписки.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, request.user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
            
        current_expires = user.subscription_expires if user.subscription_expires and user.subscription_expires > datetime.now() else datetime.now()
        additional_days = 30 if request.plan == "monthly" else 365
        new_expires = current_expires + timedelta(days=additional_days)
        
        await update_user_subscription(db, request.user_id, "active", new_expires)
        log_info(f"Subscription renewed for user {request.user_id} with plan {request.plan}, new expiration {new_expires}")
        return {"status": "success", "expires": new_expires}
    except Exception as e:
        log_error(f"Error renewing subscription for user {request.user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при продлении подписки: {str(e)}")

@router.get("/subscription-status", response_model=dict)
async def subscription_status(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Проверить статус подписки.
    
    Этот эндпоинт возвращает текущий статус подписки пользователя и дату окончания, если подписка активна.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чей статус подписки нужно проверить.
    
    Возвращает:
    - status: Текущий статус подписки ("active" или "inactive").
    - expires: Дата окончания подписки (если применимо).
    - days_left: Количество оставшихся дней до окончания подписки (если активна).
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
            
        status = user.subscription_status
        expires = user.subscription_expires
        days_left = 0
        
        if status == "active" and expires:
            if expires > datetime.now():
                days_left = (expires - datetime.now()).days
            else:
                status = "inactive"
                await update_user_subscription(db, user_id, "inactive", None)
                log_info(f"Subscription expired for user {user_id}, updated status to inactive")
                
        log_info(f"Subscription status checked for user {user_id}: Status={status}, DaysLeft={days_left}")
        return {"status": status, "expires": expires, "days_left": days_left}
    except Exception as e:
        log_error(f"Error checking subscription status for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при проверке статуса подписки: {str(e)}")

@router.post("/referral", response_model=dict)
async def add_referral(user_id: str, referrer_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Добавить рефералку.
    
    Этот эндпоинт позволяет добавить рефералку для пользователя. Проверяется, чтобы пользователь
    не мог пригласить сам себя. При успешном добавлении рефералки начисляется 1000 баллов
    пригласившему пользователю.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, который был приглашен.
    - referrer_id: Уникальный идентификатор пользователя, который пригласил.
    
    Возвращает:
    - status: Статус операции ("success" или "error").
    - message: Сообщение о результате операции.
    """
    from src.utils.logger import log_info, log_error
    from src.db.operations import add_points_to_user
    
    try:
        if user_id == referrer_id:
            raise HTTPException(status_code=400, detail="Нельзя пригласить самого себя")
            
        user = await get_user_by_user_id(db, user_id)
        referrer = await get_user_by_user_id(db, referrer_id)
        
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
        if referrer is None:
            raise HTTPException(status_code=404, detail="Пригласивший пользователь не найден")
            
        if user.referred_by is not None:
            raise HTTPException(status_code=400, detail="Пользователь уже был приглашен другим пользователем")
            
        await update_user(db, user_id, {"referred_by": referrer_id})
        await add_points_to_user(db, referrer_id, 1000)
        
        log_info(f"Referral added: UserID={user_id}, ReferrerID={referrer_id}, PointsAdded=1000")
        return {"status": "success", "message": "Рефералка успешно добавлена, начислено 1000 баллов пригласившему пользователю"}
    except Exception as e:
        log_error(f"Error adding referral for user {user_id} by referrer {referrer_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при добавлении рефералки: {str(e)}")

@router.post("/delete-tarot-history", response_model=dict)
async def delete_tarot_history(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Удалить историю раскладов Таро пользователя.
    
    Этот эндпоинт позволяет удалить историю раскладов Таро для указанного пользователя.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью историю нужно удалить.
    
    Возвращает:
    - status: Статус операции ("success" или "error").
    - message: Сообщение о результате операции.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
            
        from src.db.operations import delete_user_history
        deleted_count = await delete_user_history(db, int(user.user_id))
        log_info(f"Deleted tarot history for user {user_id}, {deleted_count} records removed")
        return {"status": "success", "message": f"История раскладов Таро успешно удалена, удалено записей: {deleted_count}"}
    except Exception as e:
        log_error(f"Error deleting tarot history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении истории раскладов Таро: {str(e)}")

@router.get("/history", response_model=dict)
async def get_user_history(user_id: str, api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Получить историю действий пользователя.
    
    Этот эндпоинт возвращает историю действий пользователя, включая расклады Таро и другие операции.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, чью историю нужно получить.
    
    Возвращает:
    - status: Статус операции ("success" или "error").
    - history: Список записей истории действий пользователя.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
            
        # Placeholder: Actual history retrieval to be implemented in database operations
        placeholder_history = []
        log_info(f"User history retrieved for user {user_id} (placeholder data)")
        return {"status": "success", "history": placeholder_history}
    except Exception as e:
        log_error(f"Error retrieving history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при получении истории пользователя: {str(e)}")

@router.get("/history/search", response_model=dict)
async def search_user_history(user_id: str, query: str = "", api_key: str = Depends(get_api_key), db = Depends(get_db)):
    """
    Поиск в истории действий пользователя.
    
    Этот эндпоинт позволяет искать записи в истории действий пользователя по заданному запросу.
    
    Параметры:
    - user_id: Уникальный идентификатор пользователя, в чьей истории нужно выполнить поиск.
    - query: Поисковый запрос для фильтрации записей истории (опционально).
    
    Возвращает:
    - status: Статус операции ("success" или "error").
    - results: Список записей истории, соответствующих поисковому запросу.
    """
    from src.utils.logger import log_info, log_error
    
    try:
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
            
        # Placeholder: Actual search to be implemented in database operations
        placeholder_results = []
        log_info(f"History search performed for user {user_id} with query '{query}' (placeholder data)")
        return {"status": "success", "results": placeholder_results}
    except Exception as e:
        log_error(f"Error searching history for user {user_id} with query '{query}': {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при поиске в истории пользователя: {str(e)}")
