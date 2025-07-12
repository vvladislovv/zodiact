import asyncio
import uvicorn
from fastapi import FastAPI
from src.api.app import app as fastapi_app
from src.bot.app import create_bot
from config.config import DEBUG

async def start_bot():
    """
    Запуск Telegram-бота.
    """
    bot, dp = await create_bot()
    print("Telegram-бот запущен")
    await dp.start_polling(bot)

async def start_api():
    """
    Запуск FastAPI сервера.
    """
    config = uvicorn.Config(
        app=fastapi_app,
        host="0.0.0.0",
        port=8000,
        reload=DEBUG
    )
    server = uvicorn.Server(config)
    print("FastAPI сервер запущен на http://0.0.0.0:8000")
    await server.serve()

async def main():
    """
    Основная функция для одновременного запуска FastAPI и Aiogram.
    """
    tasks = [
        asyncio.create_task(start_bot()),
        asyncio.create_task(start_api())
    ]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
