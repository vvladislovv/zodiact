# ZodiacBot 🌟

Полнофункциональное приложение для гаданий и предсказаний с Telegram-ботом и веб-интерфейсом.

## 📋 Содержание

- [Описание проекта](#описание-проекта)
- [Структура проекта](#структура-проекта)
- [Технологии](#технологии)
- [Установка и запуск](#установка-и-запуск)
- [API Endpoints](#api-endpoints)
- [Конфигурация](#конфигурация)
- [Функциональность](#функциональность)

## 🎯 Описание проекта

ZodiacBot - это комплексное приложение для гаданий и предсказаний, включающее:

- **Telegram Bot** - для взаимодействия с пользователями
- **FastAPI Backend** - REST API для обработки запросов
- **React Frontend** - веб-интерфейс с современным дизайном
- **MongoDB** - база данных для хранения пользователей и истории

### Основные возможности:

- 🔮 **Таро гадания** - различные расклады карт Таро
- ☕ **Кофейная гуща** - предсказания по фотографиям
- 💕 **Любовные гадания** - специализированные расклады
- 📊 **Анализ ситуаций** - детальный анализ текущих обстоятельств
- 🔮 **Руны** - гадания на рунах
- 👤 **Профили пользователей** - управление аккаунтами
- 💳 **Система подписок** - платные функции
- 📚 **История гаданий** - сохранение всех предсказаний

## 🏗️ Структура проекта

```
ZodiacBot/
├── Backend/                 # FastAPI сервер
│   ├── config/             # Конфигурация
│   ├── src/
│   │   ├── api/           # API роутеры
│   │   │   └── routers/   # Эндпоинты API
│   │   ├── bot/           # Telegram бот
│   │   ├── db/            # Операции с БД
│   │   ├── ai/            # AI интеграция
│   │   └── utils/         # Утилиты
│   ├── logs/              # Логи приложения
│   ├── main.py            # Точка входа
│   ├── Dockerfile         # Docker конфигурация
│   └── pyproject.toml     # Python зависимости
├── Frontend/              # React приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── features/      # Функциональные модули
│   │   └── utils/         # Утилиты
│   ├── public/            # Статические файлы
│   ├── Dockerfile         # Docker конфигурация
│   └── package.json       # Node.js зависимости
└── docker-compose.yml     # Docker Compose
```

## 🛠️ Технологии

### Backend
- **Python 3.9+** - основной язык
- **FastAPI** - веб-фреймворк
- **Aiogram 3.x** - Telegram Bot API
- **MongoDB** - база данных
- **Motor** - асинхронный MongoDB драйвер
- **Uvicorn** - ASGI сервер
- **Pydantic** - валидация данных

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизированный JavaScript
- **Vite** - сборщик проекта
- **Tailwind CSS** - CSS фреймворк
- **React Router** - маршрутизация

### DevOps
- **Docker** - контейнеризация
- **Docker Compose** - оркестрация контейнеров
- **Nginx** - веб-сервер для статики

## 🚀 Установка и запуск

### Предварительные требования

- Docker и Docker Compose
- Node.js 18+ (для разработки)
- Python 3.9+ (для разработки)

### Быстрый запуск с Docker

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd ZodiacBot
```

2. **Создайте файл .env в корне проекта:**
```env
# API Keys
API_KEY=your-api-key
OPENAI_API_KEY=your-openai-api-key
BOT_TOKEN=your-telegram-bot-token

# Payment (YooKassa)
YUKASSA_SHOP_ID=your-shop-id
YUKASSA_SECRET_KEY=your-secret-key

# App Configuration
DEBUG=False
APP_LINK=https://your-app-domain.com

# Database
MONGODB_URL=mongodb://mongodb:27017/zodiacbot
```

3. **Запустите приложение:**
```bash
docker-compose up --build
```

4. **Откройте приложение:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- MongoDB: localhost:27017

### Разработка

#### Backend
```bash
cd Backend
pip install -r requirements.txt
python main.py
```

#### Frontend
```bash
cd Frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Аутентификация
Все запросы требуют заголовок `X-API-Key` с вашим API ключом.

### Основные эндпоинты

#### 🔮 Таро гадания
- `POST /tarot/draw` - Получить расклад Таро
- `GET /tarot/user/history` - История раскладов пользователя
- `DELETE /tarot/clear-history` - Очистить историю
- `PUT /tarot/update-entry` - Обновить запись
- `DELETE /tarot/delete-entry/{entry_id}` - Удалить запись

#### ☕ Кофейная гуща
- `POST /coffee/fortune` - Получить предсказание по фото
- `GET /coffee/history` - История предсказаний
- `DELETE /coffee/clear-history` - Очистить историю

#### 👤 Пользователи
- `GET /user/profile` - Получить профиль пользователя
- `POST /user/subscribe` - Активировать подписку
- `POST /user/update-profile` - Обновить профиль
- `POST /user/renew-subscription` - Продлить подписку
- `GET /user/subscription-status` - Статус подписки

#### 💳 Платежи
- `POST /payment/yookassa/create-payment` - Создать платеж
- `GET /payment/subscription-details` - Детали подписки
- `POST /payment/cancel-subscription` - Отменить подписку
- `POST /payment/update-autopayment` - Обновить автоплатеж

#### 📊 Анализ и прогнозы
- `POST /analyze` - Анализ ситуации
- `POST /personal-forecast` - Личный прогноз
- `POST /spiritual-growth` - Духовный рост
- `POST /runes-reveal` - Раскрытие рун

#### ℹ️ Информация
- `GET /info/content/{slug}` - Получить контент
- `GET /info/list` - Список информационных материалов

#### 🤖 AI
- `POST /ai/prompt` - AI запросы

#### 💬 Обратная связь
- `POST /feedback` - Отправить отзыв

#### 🃏 Карты
- `GET /cards/meanings` - Значения карт

### Схемы данных

#### Запрос на расклад Таро
```json
{
  "user_id": "string",
  "question": "string",
  "spread_type": "3_cards"
}
```

#### Ответ на расклад Таро
```json
{
  "cards": ["The Fool", "The Magician", "The High Priestess"],
  "interpretation": "string",
  "date": "2024-01-01T12:00:00"
}
```

#### Запрос на кофейную гущу
```json
{
  "user_id": "string",
  "question": "string",
  "image_base64": "base64_encoded_image"
}
```

## ⚙️ Конфигурация

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `API_KEY` | Ключ для аутентификации API | `default-api-key` |
| `OPENAI_API_KEY` | Ключ OpenAI для AI функций | `default-openai-api-key` |
| `BOT_TOKEN` | Токен Telegram бота | `default-bot-token` |
| `YUKASSA_SHOP_ID` | ID магазина YooKassa | `default-yukassa-shop-id` |
| `YUKASSA_SECRET_KEY` | Секретный ключ YooKassa | `default-yukassa-secret-key` |
| `DEBUG` | Режим отладки | `False` |
| `APP_LINK` | Ссылка на веб-приложение | `https://example.com` |
| `MONGODB_URL` | URL MongoDB | `mongodb://localhost:27017/zodiacbot` |

### Структура базы данных

#### Коллекции MongoDB:
- `users` - пользователи
- `tarot_history` - история раскладов Таро
- `coffee_history` - история кофейной гущи
- `logs` - логи приложения

## 🎨 Функциональность

### Telegram Bot
- Команда `/start` - приветствие и ссылка на веб-приложение
- Автоматическое создание пользователей
- Интеграция с веб-интерфейсом

### Веб-интерфейс
- **Главная страница** - обзор всех доступных гаданий
- **Профиль** - управление аккаунтом и подпиской
- **История** - просмотр всех предыдущих гаданий
- **Категории гаданий:**
  - Любовные гадания
  - Анализ ситуаций
  - Статус отношений
  - Кофейная гуща
  - Личный прогноз
  - Духовный рост
  - Таро гадания

### Система подписок
- Месячная подписка (30 дней)
- Годовая подписка (365 дней)
- Автопродление
- Интеграция с YooKassa

### AI интеграция
- Интерпретация карт Таро
- Анализ кофейной гущи
- Персонализированные предсказания

## 🔧 Разработка

### Структура кода

#### Backend архитектура:
- **Модульная структура** - каждый функционал в отдельном модуле
- **Асинхронность** - все операции с БД асинхронные
- **Логирование** - централизованная система логов
- **Валидация** - Pydantic схемы для всех данных

#### Frontend архитектура:
- **Компонентный подход** - переиспользуемые компоненты
- **TypeScript** - строгая типизация
- **Tailwind CSS** - утилитарные классы
- **React Router** - клиентская маршрутизация

### Добавление новых функций

1. **Backend:**
   - Создайте новый роутер в `src/api/routers/`
   - Добавьте схемы в `src/api/schemas.py`
   - Обновите `src/api/app.py`

2. **Frontend:**
   - Создайте компонент в `src/components/`
   - Добавьте страницу в `src/features/`
   - Обновите маршрутизацию в `App.tsx`

## 📝 Логирование

Логи сохраняются в папке `Backend/logs/` с датой в имени файла.
Уровни логирования: INFO, ERROR, DEBUG.

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License

## 📞 Поддержка

Для вопросов и предложений создавайте Issues в репозитории.

---

**ZodiacBot** - ваш персональный помощник в мире гаданий и предсказаний! 🌟 