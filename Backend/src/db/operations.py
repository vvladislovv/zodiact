from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from datetime import datetime, timedelta
from typing import List, Optional
from src.api.schemas import (
    TarotHistoryItem, CoffeeFortuneResponse, FeedbackRequest,
    AIPromptRequest, SubscriptionRequest, User, InfoListItem,
    InfoContentResponse, CardMeaning
)

async def get_collection(db, collection_name: str) -> AsyncIOMotorCollection:
    return db[collection_name]

async def get_user_by_user_id(db, user_id: str) -> Optional[User]:
    users = await get_collection(db, "users")
    user_data = await users.find_one({"user_id": user_id})
    if user_data:
        # Добавляем обязательные поля с значениями по умолчанию, если они отсутствуют
        if "telegram_name" not in user_data:
            user_data["telegram_name"] = "Unknown"
        if "joined" not in user_data:
            user_data["joined"] = datetime.now()
        return User(**user_data)
    return None

async def create_user(db, user_id: str, referred_by: Optional[str] = None) -> User:
    users = await get_collection(db, "users")
    user_data = {
        "user_id": user_id,
        "telegram_name": "Unknown",  # Placeholder since this field is required
        "joined": datetime.now(),    # Placeholder since this field is required
        "subscription_status": "inactive",
        "subscription_expires": None,
        "points": 0,
        "referred_by": referred_by,
        "created_at": datetime.now()
    }
    await users.insert_one(user_data)
    return User(**user_data)

async def update_user_subscription(db, user_id: str, status: str, expires: datetime):
    users = await get_collection(db, "users")
    await users.update_one(
        {"user_id": user_id},
        {"$set": {"subscription_status": status, "subscription_expires": expires}}
    )

async def update_user(db, user_id: str, updates: dict):
    users = await get_collection(db, "users")
    await users.update_one(
        {"user_id": user_id},
        {"$set": updates}
    )

async def add_points_to_user(db, user_id: str, points: int):
    users = await get_collection(db, "users")
    await users.update_one(
        {"user_id": user_id},
        {"$inc": {"points": points}}
    )

async def create_tarot_history(db, user_id: int, question: str, cards: str, interpretation: str):
    tarot_history = await get_collection(db, "tarot_history")
    await tarot_history.insert_one({
        "user_id": user_id,
        "question": question,
        "cards": cards,
        "interpretation": interpretation,
        "created_at": datetime.now()
    })

async def get_tarot_history(db, user_id: int) -> List[TarotHistoryItem]:
    tarot_history = await get_collection(db, "tarot_history")
    seven_days_ago = datetime.now() - timedelta(days=7)
    history_cursor = tarot_history.find({
        "user_id": user_id,
        "created_at": {"$gte": seven_days_ago}
    }).sort("created_at", -1)
    history = await history_cursor.to_list(length=100)  # Ограничиваем количество записей
    result = []
    for item in history:
        # Преобразуем данные из базы в формат, соответствующий схеме TarotHistoryItem
        cards_str = item.get('cards', '')
        cards_list = cards_str.split(',') if isinstance(cards_str, str) and cards_str else []
        result.append(TarotHistoryItem(
            date=item.get('created_at', datetime.now()),
            question=item.get('question', ''),
            cards=cards_list,
            summary=item.get('interpretation', '')
        ))
    return result

async def create_coffee_history(db, user_id: int, image_id: str, question: str, interpretation: str):
    coffee_history = await get_collection(db, "coffee_history")
    await coffee_history.insert_one({
        "user_id": user_id,
        "image_id": image_id,
        "question": question,
        "interpretation": interpretation,
        "created_at": datetime.now()
    })

async def create_feedback(db, user_id: int, message: str):
    feedback = await get_collection(db, "feedback")
    await feedback.insert_one({
        "user_id": user_id,
        "message": message,
        "created_at": datetime.now()
    })

async def get_info_page_by_slug(db, slug: str) -> Optional[InfoContentResponse]:
    info_pages = await get_collection(db, "info_pages")
    page = await info_pages.find_one({"slug": slug})
    if page:
        return InfoContentResponse(**page)
    return None

async def get_all_info_pages(db) -> List[InfoListItem]:
    info_pages = await get_collection(db, "info_pages")
    pages_cursor = info_pages.find().sort("title", 1)
    pages = await pages_cursor.to_list(length=100)  # Ограничиваем количество записей
    return [InfoListItem(**page) for page in pages]

async def get_all_card_meanings(db) -> List[CardMeaning]:
    card_meanings = await get_collection(db, "card_meanings")
    meanings_cursor = card_meanings.find().sort("name", 1)
    meanings = await meanings_cursor.to_list(length=100)  # Ограничиваем количество записей
    return [CardMeaning(**meaning) for meaning in meanings]

async def update_tarot_history_entry(db, user_id: int, entry_id: str, updates: dict) -> bool:
    """
    Обновить запись в истории раскладов Таро для указанного пользователя.
    
    Args:
        db: Объект базы данных.
        user_id: Уникальный идентификатор пользователя.
        entry_id: Уникальный идентификатор записи в истории.
        updates: Словарь с обновляемыми полями и их значениями.
    
    Returns:
        bool: True, если запись обновлена, False, если запись не найдена.
    """
    tarot_history = await get_collection(db, "tarot_history")
    from pymongo.bson import ObjectId
    
    result = await tarot_history.update_one(
        {"user_id": user_id, "_id": ObjectId(entry_id)},
        {"$set": updates}
    )
    return result.modified_count > 0

async def get_coffee_history(db, user_id: int) -> List[dict]:
    """
    Получить историю предсказаний по кофейной гуще для указанного пользователя.
    
    Args:
        db: Объект базы данных.
        user_id: Уникальный идентификатор пользователя.
    
    Returns:
        List[dict]: Список записей истории предсказаний.
    """
    coffee_history = await get_collection(db, "coffee_history")
    seven_days_ago = datetime.now() - timedelta(days=7)
    history_cursor = coffee_history.find({
        "user_id": user_id,
        "created_at": {"$gte": seven_days_ago}
    }).sort("created_at", -1)
    history = await history_cursor.to_list(length=100)  # Ограничиваем количество записей
    return history

async def delete_coffee_history(db, user_id: int) -> int:
    """
    Удалить историю предсказаний по кофейной гуще для указанного пользователя.
    
    Args:
        db: Объект базы данных.
        user_id: Уникальный идентификатор пользователя.
    
    Returns:
        int: Количество удаленных записей.
    """
    coffee_history = await get_collection(db, "coffee_history")
    result = await coffee_history.delete_many({"user_id": user_id})
    return result.deleted_count

async def delete_user_history(db, user_id: int) -> int:
    """
    Удалить всю историю (Таро и кофейную гущу) для указанного пользователя.
    
    Args:
        db: Объект базы данных.
        user_id: Уникальный идентификатор пользователя.
    
    Returns:
        int: Количество удаленных записей.
    """
    tarot_history = await get_collection(db, "tarot_history")
    coffee_history = await get_collection(db, "coffee_history")
    
    tarot_result = await tarot_history.delete_many({"user_id": user_id})
    coffee_result = await coffee_history.delete_many({"user_id": user_id})
    
    return tarot_result.deleted_count + coffee_result.deleted_count

async def create_log(db, level: str, message: str):
    logs = await get_collection(db, "logs")
    await logs.insert_one({
        "level": level,
        "message": message,
        "timestamp": datetime.now()
    })
