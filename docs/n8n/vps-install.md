---
title: Установка n8n на VPS
description: Полное руководство по установке n8n на VPS с Docker, Nginx, SSL и базой данных PostgreSQL
keywords: [n8n vps, n8n production, n8n docker, n8n nginx, n8n ssl, n8n postgresql]
sidebar_position: 3
---

# Установка n8n на VPS

Полное руководство по установке n8n на production сервере с Debian 12, включая Docker, Nginx, SSL сертификаты и PostgreSQL.

## Требования

### Минимальные характеристики сервера

- **CPU**: 1 core (рекомендуется 2+)
- **RAM**: 1 GB (рекомендуется 2+ GB)
- **Disk**: 10 GB свободного места
- **OS**: Debian 12 / Ubuntu 22.04+ / другой Linux

### Что потребуется

- VPS сервер с root доступом
- Доменное имя (например, `n8n.example.com`)
- A-запись в DNS, указывающая на IP сервера

## Подготовка сервера

### Обновление системы

```bash
apt update && apt upgrade -y
```

### Установка Docker

```bash
# Установка зависимостей
apt install -y ca-certificates curl gnupg

# Добавление репозитория Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Проверка установки
docker --version
docker compose version
```

## Установка n8n

### Создание структуры проекта

```bash
mkdir -p /opt/n8n
cd /opt/n8n
```

### Создание docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: n8n-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=your_strong_password_here
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n"]
      interval: 10s
      timeout: 5s
      retries: 5

  n8n:
    image: docker.n8n.io/n8nio/n8n
    container_name: n8n
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      # База данных
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=your_strong_password_here

      # Основные настройки
      - N8N_HOST=n8n.example.com
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.example.com/

      # Часовой пояс
      - GENERIC_TIMEZONE=Europe/Moscow
      - TZ=Europe/Moscow

      # Безопасность
      - N8N_SECURE_COOKIE=true

      # Executions
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  n8n_data:
```

:::warning Важно
Замените `your_strong_password_here` на надёжный пароль и `n8n.example.com` на ваш домен!
:::

### Запуск n8n

```bash
docker compose up -d
```

Проверьте статус:

```bash
docker compose ps
docker compose logs -f
```

## Настройка Nginx

### Установка Nginx

```bash
apt install -y nginx
```

### Создание конфигурации

Создайте файл `/etc/nginx/sites-available/n8n`:

```nginx
server {
    listen 80;
    server_name n8n.example.com;

    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffering off;
        proxy_request_buffering off;
        proxy_read_timeout 86400;
    }
}
```

Активируйте конфигурацию:

```bash
ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Установка SSL сертификата

### Установка Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### Получение сертификата

```bash
certbot --nginx -d n8n.example.com
```

Следуйте инструкциям на экране. Certbot автоматически настроит Nginx для работы с HTTPS.

### Автоматическое обновление сертификатов

Certbot автоматически добавляет задачу в cron. Проверьте:

```bash
systemctl status certbot.timer
```

## Первый вход в n8n

1. Откройте браузер и перейдите на `https://n8n.example.com`
2. Создайте администраторский аккаунт
3. Начните создавать workflows!

## Управление n8n

### Основные команды

```bash
# Просмотр логов
docker compose logs -f n8n

# Перезапуск
docker compose restart n8n

# Остановка
docker compose down

# Обновление до последней версии
docker compose pull
docker compose up -d

# Резервное копирование
docker compose exec postgres pg_dump -U n8n n8n > backup_$(date +%Y%m%d).sql
```

## Резервное копирование

### Backup скрипт

Создайте файл `/opt/n8n/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/n8n/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup базы данных
docker compose exec -T postgres pg_dump -U n8n n8n | gzip > $BACKUP_DIR/n8n_db_$DATE.sql.gz

# Backup файлов n8n
docker run --rm -v n8n_n8n_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/n8n_files_$DATE.tar.gz -C /data .

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

Сделайте скрипт исполняемым:

```bash
chmod +x /opt/n8n/backup.sh
```

### Автоматическое резервное копирование

Добавьте в crontab (ежедневно в 3:00):

```bash
crontab -e
```

Добавьте строку:

```
0 3 * * * /opt/n8n/backup.sh >> /var/log/n8n_backup.log 2>&1
```

## Безопасность

### Firewall (UFW)

```bash
apt install -y ufw

# Разрешить SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Включить firewall
ufw enable
ufw status
```

### Fail2ban

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

## Мониторинг

### Проверка здоровья

```bash
# Статус контейнеров
docker compose ps

# Использование ресурсов
docker stats

# Логи
docker compose logs --tail=100 -f
```

### Проверка доступности

Создайте простой скрипт `/opt/n8n/health-check.sh`:

```bash
#!/bin/bash
URL="https://n8n.example.com"

if curl -s --head --request GET $URL | grep "200 OK" > /dev/null; then
   echo "n8n is UP"
else
   echo "n8n is DOWN"
   # Отправить уведомление (например, в Telegram)
   docker compose restart n8n
fi
```

## Обновление n8n

```bash
cd /opt/n8n

# Создать backup перед обновлением
./backup.sh

# Скачать новые образы
docker compose pull

# Пересоздать контейнеры
docker compose up -d

# Проверить логи
docker compose logs -f
```

## Устранение проблем

### n8n не запускается

```bash
# Проверить логи
docker compose logs n8n

# Проверить доступность базы данных
docker compose exec postgres psql -U n8n -d n8n -c "\l"
```

### Ошибки подключения к базе данных

```bash
# Перезапустить PostgreSQL
docker compose restart postgres

# Проверить healthcheck
docker compose ps
```

### Проблемы с webhook

Убедитесь, что в `docker-compose.yml` правильно указаны:
- `N8N_HOST` - ваш домен без протокола
- `WEBHOOK_URL` - полный URL с https://

## Дополнительные настройки

### Увеличение лимитов для больших workflows

В `docker-compose.yml` добавьте для n8n:

```yaml
environment:
  - N8N_PAYLOAD_SIZE_MAX=16
  - EXECUTIONS_TIMEOUT=300
  - EXECUTIONS_TIMEOUT_MAX=600
```

### Настройка email

```yaml
environment:
  - N8N_EMAIL_MODE=smtp
  - N8N_SMTP_HOST=smtp.gmail.com
  - N8N_SMTP_PORT=465
  - N8N_SMTP_USER=your-email@gmail.com
  - N8N_SMTP_PASS=your-app-password
  - N8N_SMTP_SENDER=your-email@gmail.com
  - N8N_SMTP_SSL=true
```

## Полезные ссылки

- [Официальная документация n8n](https://docs.n8n.io/)
- [n8n Community workflows](https://n8n.io/workflows/)
- [n8n Forum](https://community.n8n.io/)

## Источники

- [Docker | n8n Docs](https://docs.n8n.io/hosting/installation/docker/)
- [N8N Docker Installation: Complete Setup Guide](https://latenode.com/blog/n8n-docker-installation-complete-setup-guide-production-configuration-examples-2025)
- [How to Set Up n8n on DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-setup-n8n)
