---
title: Быстрый старт с n8n
description: Как быстро запустить n8n локально с помощью Docker или npm для тестирования
keywords: [n8n, docker, npm, установка, локальный запуск, quick start]
sidebar_position: 2
---

# Быстрый старт с n8n

Самый быстрый способ попробовать n8n — запустить его локально на своём компьютере.

## Требования

Перед установкой убедитесь, что у вас установлен:
- **Docker Desktop** (Mac/Windows/Linux) или **Docker Engine** версии 20.10+
- Проверьте версию: `docker --version`

## Запуск через Docker

### Метод 1: Быстрый старт (без сохранения данных)

Самый простой способ для тестирования:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  docker.n8n.io/n8nio/n8n
```

:::warning Внимание
При использовании `--rm` все workflows будут удалены после остановки контейнера. Этот метод подходит только для тестирования.
:::

### Метод 2: С сохранением данных (рекомендуется)

#### Шаг 1: Создайте директорию для данных

```bash
mkdir -p ~/.n8n
```

Если возникают проблемы с правами доступа:

```bash
chmod 777 ~/.n8n
```

#### Шаг 2: Запустите n8n

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

После запуска откройте браузер и перейдите на `http://localhost:5678`

### Метод 3: Docker Compose (для постоянного использования)

#### Шаг 1: Создайте структуру проекта

```bash
mkdir -p ~/n8n-setup
cd ~/n8n-setup
```

#### Шаг 2: Создайте файл compose.yaml

```yaml
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
    environment:
      # Базовая авторизация (опционально)
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_secure_password
      # Часовой пояс
      - GENERIC_TIMEZONE=Europe/Moscow
      - TZ=Europe/Moscow
```

#### Шаг 3: Запустите

```bash
cd ~/n8n-setup
docker compose up -d
```

#### Управление контейнером

```bash
# Просмотр логов
docker compose logs -f

# Остановка
docker compose down

# Перезапуск
docker compose restart

# Обновление до последней версии
docker compose pull
docker compose up -d
```

## Запуск через npm

Если у вас установлен Node.js (версия 18.10 или выше):

```bash
npm install n8n -g
n8n start
```

## Запуск через npx

Без глобальной установки:

```bash
npx n8n
```

## Первый вход

1. Откройте браузер и перейдите на `http://localhost:5678`
2. Создайте аккаунт (логин и пароль для локального использования)
3. Вы попадёте в интерфейс создания workflows

## Создание первого workflow

### Простой пример: Webhook + Ответ

1. Нажмите **"Add first step"**
2. Найдите и выберите **"Webhook"** node
3. Настройте HTTP Method: `GET`
4. Скопируйте Test URL
5. Нажмите **"+"** чтобы добавить следующий node
6. Выберите **"Respond to Webhook"**
7. Настройте Response Body:

```json
{
  "message": "Hello from n8n!",
  "timestamp": "{{$now}}"
}
```

8. Нажмите **"Execute Workflow"**
9. Откройте скопированный URL в новой вкладке
10. Вы увидите JSON ответ!

### Пример с таймером и уведомлением

1. Создайте новый workflow
2. Добавьте **"Schedule Trigger"** node
   - Настройте расписание (например, каждый день в 9:00)
3. Добавьте **"HTTP Request"** node
   - URL: `https://api.github.com/repos/n8n-io/n8n`
   - Method: GET
4. Добавьте **"Set"** node для обработки данных
5. Добавьте **"Telegram"** или **"Slack"** node для отправки уведомления

## Полезные команды

### Просмотр версии

```bash
n8n --version
```

### Запуск на другом порту

```bash
n8n start --port 5679
```

### Запуск с tunnel (для доступа извне)

```bash
n8n start --tunnel
```

## Системные требования

### Минимальные

- **CPU**: 1 core
- **RAM**: 512 MB
- **Disk**: 1 GB
- **Node.js**: 18.10+

### Рекомендуемые

- **CPU**: 2 cores
- **RAM**: 2 GB
- **Disk**: 10 GB
- **Node.js**: 20+ LTS

## Что дальше?

После того как вы опробовали n8n локально:

- [Установка на VPS](./vps-install.md) — полное руководство по развертыванию на production сервере
- [Официальная документация n8n](https://docs.n8n.io/) — детальная документация по всем возможностям
- [Community workflows](https://n8n.io/workflows/) — готовые шаблоны от сообщества

## Частые проблемы

### Порт 5678 занят

Используйте другой порт:

```bash
n8n start --port 5679
```

### Ошибка разрешений с Docker

Добавьте sudo или настройте Docker для работы без sudo:

```bash
sudo docker run -it --rm --name n8n -p 5678:5678 docker.n8n.io/n8nio/n8n
```

### Node.js устаревшей версии

Обновите Node.js через nvm:

```bash
nvm install 20
nvm use 20
npm install n8n -g
```
