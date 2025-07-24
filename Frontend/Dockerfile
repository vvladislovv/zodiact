# Базовый образ для сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем только package files для кеширования зависимостей
COPY package.json yarn.lock* ./

# Устанавливаем зависимости (этот слой будет кешироваться)
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --network-timeout 300000; else npm ci; fi

# Копируем исходный код
COPY . .

# Собираем приложение
RUN yarn build

# Production образ с nginx
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 5713

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
