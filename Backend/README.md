# ZodiacBot

ZodiacBot — это многофункциональный бот для Telegram, предоставляющий пользователям доступ к эзотерическим практикам, таким как гадание на картах Таро, интерпретация кофейной гущи и персонализированные предсказания с использованием искусственного интеллекта (ИИ). Проект состоит из backend-части, реализованной на Python с использованием FastAPI для API и Aiogram для Telegram-бота, а также базы данных PostgreSQL для хранения данных пользователей и истории гаданий.

## Основные функции

- **Гадание на картах Таро**: Пользователи могут получать расклады Таро (1 или 3 карты) с интерпретацией, которая сохраняется в истории.
- **Интерпретация кофейной гущи**: Возможность загрузить фото кофейной гущи и получить предсказание.
- **AI-интерпретации**: Персонализированные ответы на вопросы с использованием ИИ, включая детальные интерпретации карт Таро.
- **Справочные материалы**: Доступ к информации о том, как пользоваться ботом и что означают различные символы или карты.
- **Обратная связь**: Пользователи могут отправлять отзывы о работе бота.
- **Управление подписками**: Поддержка активации подписки для доступа к премиум-функциям.

## Технический стек

- **Backend**: Python, FastAPI (для API), Aiogram (для Telegram-бота)
- **База данных**: PostgreSQL с асинхронным доступом через SQLAlchemy
- **ИИ**: Интеграция с API OpenAI для генерации персонализированных интерпретаций
- **Логирование**: Кастомные логи для отслеживания действий и ошибок
- **Контейнеризация**: Поддержка Docker для упрощения развертывания

## Структура проекта

- **src/api/**: Содержит FastAPI приложение и маршруты для обработки запросов (Таро, кофейная гуща, пользовательские данные и т.д.).
- **src/bot/**: Telegram-бот на основе Aiogram, обрабатывающий команды и взаимодействие с пользователями.
- **src/db/**: Модели и операции для работы с базой данных PostgreSQL.
- **src/ai/**: Интеграция с API ИИ для генерации ответов, включая механизмы антиспама и ограничения частоты запросов.
- **config/**: Конфигурационные файлы, включая доступ к переменным окружения и настройку базы данных.

## Установка и запуск

### Требования

- Python 3.9+
- PostgreSQL
- Docker (опционально, для контейнеризации)

### Установка через Poetry

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/yourusername/ZodiacBot.git
   cd ZodiacBot/Backend
   ```

2. Установите зависимости с помощью Poetry:
   ```bash
   poetry install
   ```

3. Настройте переменные окружения в файле `.env`:
   ```bash
   cp .env.example .env
   # Отредактируйте .env, добавив свои значения для BOT_TOKEN, API_KEY, DATABASE_URL и OPENAI_API_KEY
   ```

4. Запустите приложение:
   ```bash
   poetry run python main.py
   ```

### Запуск через Docker

1. Убедитесь, что Docker и Docker Compose установлены.
2. Соберите и запустите контейнеры:
   ```bash
   docker-compose up --build
   ```

## Использование

- **Telegram-бот**: Откройте Telegram и найдите вашего бота, используя токен, указанный в `.env`. Используйте команду `/start` для начала взаимодействия.
- **API**: Доступ к API осуществляется через эндпоинты, описанные в документации FastAPI (по умолчанию доступно по адресу `http://localhost:8000/docs`).

## Эндпоинты API

Ниже приведен список всех доступных эндпоинтов API с описанием их функциональности:

### Пользователи (/user)
- **GET /user/profile** - Получить данные профиля пользователя по уникальному идентификатору. Возвращает информацию о дате регистрации, статусе подписки и дате окончания подписки. Если пользователь не найден, создается новый с базовыми настройками.
- **POST /user/subscribe** - Активировать подписку для пользователя на основе выбранного плана ("monthly" для месячной на 30 дней или другой для годовой на 365 дней). Обновляет статус и дату окончания подписки.

### Карты (/cards)
- **GET /cards/list** - Получить список всех доступных карт (например, Таро) с краткими значениями (положительные и отрицательные аспекты). Если данные отсутствуют, возвращаются тестовые данные. Для первых трех карт добавляется краткая AI-интерпретация.
- **GET /cards/interpret/{card_name}** - Получить детальную интерпретацию конкретной карты в контексте заданного вопроса с помощью AI.

### Кофейная гуща (/coffee)
- **POST /coffee/fortune** - Получить предсказание по фото кофейной гущи. Пользователь отправляет изображение в формате base64 и вопрос. Возвращается интерпретация с помощью AI, данные сохраняются в истории.

### Таро (/tarot)
- **POST /tarot/draw** - Получить расклад карт Таро на основе вопроса и типа расклада ("3_cards" для трех карт, иначе одна карта). Возвращает список карт и их интерпретацию с помощью AI. Данные сохраняются в истории.
- **GET /tarot/history** - Получить историю раскладов Таро пользователя за последние 7 дней, включая дату, вопрос, карты и краткую интерпретацию.
- **DELETE /tarot/clear-history** - Очистить всю историю раскладов Таро и предсказаний по кофейной гуще для указанного пользователя. Возвращает статус операции и количество удаленных записей.

### ИИ (/ai)
- **POST /ai/prompt** - Отправить запрос к ИИ для получения интерпретации или ответа на вопрос. Поддерживает контекст, например, список карт Таро для интерпретации.

### Оплата (/payment)
- **POST /payment/create-checkout-session** - Создать сессию оплаты через ЮKassa для подписки. Пользователь перенаправляется на страницу оплаты ЮKassa, поддерживающую российские карты.
- **GET /payment/success** - Обработать успешную оплату подписки через ЮKassa, активировать подписку для пользователя.
- **GET /payment/cancel** - Обработать отмену оплаты пользователем, возвращает сообщение об отмене.

## Лицензия

Этот проект распространяется под лицензией MIT. Подробности см. в файле LICENSE.

## Контакты

Если у вас есть вопросы или предложения, свяжитесь с нами через Telegram или по электронной почте.
