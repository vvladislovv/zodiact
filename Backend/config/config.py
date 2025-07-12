import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# API Key for security
API_KEY = os.getenv("API_KEY", "default-api-key")

# OpenAI API Key for AI services
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "default-openai-api-key")

# YUKassa credentials for payment processing
YUKASSA_SHOP_ID = os.getenv("YUKASSA_SHOP_ID", "default-yukassa-shop-id")
YUKASSA_SECRET_KEY = os.getenv("YUKASSA_SECRET_KEY", "default-yukassa-secret-key")

# Telegram Bot Token
BOT_TOKEN = os.getenv("BOT_TOKEN", "default-bot-token")

# Debug mode (True/False)
DEBUG = os.getenv("DEBUG", "False") == "True"

# App link for Telegram mini-app
APP_LINK = os.getenv("APP_LINK", "https://example.com")

# Database configuration for MongoDB with async support using motor
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/zodiacbot")

# Create async MongoDB client using motor
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(MONGODB_URL)
db = client.get_default_database()

async def get_db():
    yield db
