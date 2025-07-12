from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, user_id: str, telegram_name: str, subscription_status: str, joined: datetime):
        self.user_id = user_id
        self.telegram_name = telegram_name
        self.subscription_status = subscription_status
        self.joined = joined

class TarotHistory:
    def __init__(self, user_id: str, date: datetime, question: str, cards: List[str], summary: str):
        self.user_id = user_id
        self.date = date
        self.question = question
        self.cards = cards
        self.summary = summary

class CoffeeHistory:
    def __init__(self, user_id: str, image_id: str, question: str, result_text: str, date: datetime):
        self.user_id = user_id
        self.image_id = image_id
        self.question = question
        self.result_text = result_text
        self.date = date

class InfoPage:
    def __init__(self, slug: str, title: str, text: str):
        self.slug = slug
        self.title = title
        self.text = text

class CardMeaning:
    def __init__(self, name: str, positive: str, negative: str):
        self.name = name
        self.positive = positive
        self.negative = negative

class Feedback:
    def __init__(self, user_id: str, message: str, date: datetime):
        self.user_id = user_id
        self.message = message
        self.date = date
