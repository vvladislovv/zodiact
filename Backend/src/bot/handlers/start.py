from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import CommandStart

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    """
    Обработчик команды /start.
    Отправляет приветственное сообщение и может открывать мини-приложение (пока заглушка).
    """
    from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
    from config.config import APP_LINK, get_db
    from src.db.operations import get_user_by_user_id, create_user
    from src.utils.logger import log_info, log_error
    
    try:
        user_id = str(message.from_user.id)
        log_info(f"Received /start command from Telegram ID {user_id}")
        # Используем прямой доступ к базе данных, так как асинхронный контекстный менеджер вызывает ошибку
        from config.config import db
        user = await get_user_by_user_id(db, user_id)
        if user is None:
            user = await create_user(db, user_id)
            log_info(f"Created new user with Telegram ID {user_id} on /start command")
        else:
            log_info(f"User with Telegram ID {user_id} already exists, skipping registration")
        
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Открыть мини-приложение", url=APP_LINK)]
        ])
        await message.answer(
            f"Привет, {message.from_user.first_name}! Я ZodiacBot. Нажми на кнопку ниже, чтобы открыть мини-приложение.\n"
            "Пока это заглушка, но скоро здесь будет что-то интересное!",
            reply_markup=keyboard
        )
    except Exception as e:
        log_error(f"Error handling /start command for Telegram ID {message.from_user.id}: {str(e)}")
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Открыть мини-приложение", url=APP_LINK)]
        ])
        await message.answer(
            "Привет! Я ZodiacBot. Сейчас возникла небольшая проблема. Пожалуйста, попробуйте позже.",
            reply_markup=keyboard
        )
