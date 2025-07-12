from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from config.config import BOT_TOKEN
from src.bot.handlers.start import router as start_router

async def create_bot():
    """
    Создание и настройка Telegram-бота.
    """
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher()
    
    # Подключение роутеров
    dp.include_router(start_router)
    
    return bot, dp
