from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    user_id: str
    telegram_name: str
    full_name: Optional[str] = None
    subscription_status: str
    subscription_expires: Optional[datetime] = None
    joined: datetime

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str = None  # Добавляем поле id как псевдоним для user_id

    class Config:
        validate_by_name = True
        from_attributes = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.id is None:
            self.id = self.user_id

# Tarot Draw Schemas
class TarotDrawRequest(BaseModel):
    user_id: str
    question: str
    spread_type: str

class TarotDrawResponse(BaseModel):
    cards: List[str]
    interpretation: str
    date: datetime

# Tarot History Schemas
class TarotHistoryItem(BaseModel):
    date: datetime
    question: str
    cards: List[str]
    summary: str

    class Config:
        from_attributes = True

# Coffee Fortune Schemas
class CoffeeFortuneRequest(BaseModel):
    user_id: str
    question: str
    image_base64: str

    class Config:
        validate_by_name = True
        from_attributes = True
        alias_generator = lambda field: field.replace("_", "")

    def __init__(self, **kwargs):
        if "userId" in kwargs and "user_id" not in kwargs:
            kwargs["user_id"] = kwargs.pop("userId")
        if "photo" in kwargs and "image_base64" not in kwargs:
            image_data = kwargs.pop("photo")
            if image_data.startswith("data:image"):
                image_data = image_data.split(",")[1]
            kwargs["image_base64"] = image_data
        super().__init__(**kwargs)

class CoffeeFortuneResponse(BaseModel):
    interpretation: str
    date: datetime

# User Subscription Schemas
class SubscriptionRequest(BaseModel):
    user_id: str
    plan: str

class SubscriptionResponse(BaseModel):
    status: str
    expires: datetime

# Info Content Schemas
class InfoContentResponse(BaseModel):
    title: str
    text: str

class InfoListItem(BaseModel):
    slug: str
    title: str

# AI Prompt Schemas
class AIPromptRequest(BaseModel):
    mode: str
    question: str
    context: dict

class AIPromptResponse(BaseModel):
    response: str

# Feedback Schemas
class FeedbackRequest(BaseModel):
    user_id: str
    message: str

# Card List Schemas
class CardMeaning(BaseModel):
    name: str
    positive: str
    negative: str

    class Config:
        from_attributes = True
