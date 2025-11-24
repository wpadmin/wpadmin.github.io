---
title: Установка и настройка Nginx на Debian 12
description: Установка веб-сервера Nginx на Debian 12 для WordPress - настройка производительности, gzip и brotli сжатие
keywords: [nginx debian 12, установка nginx debian, настройка nginx wordpress, nginx performance, brotli nginx debian]
---

# Установка и настройка Nginx на Debian 12

Установка и оптимизация Nginx для хостинга WordPress на Debian 12.

## Установка Nginx

Обновите систему и установите Nginx:

```bash
sudo apt update
sudo apt install nginx -y
```

Проверьте версию:

```bash
nginx -v
```

## Базовая настройка Nginx

Откройте конфигурационный файл:

```bash
sudo nano /etc/nginx/nginx.conf
```

### Основные параметры

Найдите и измените следующие директивы в секции `http {}`:

```nginx
user www-data;
worker_processes auto;

events {
    worker_connections 768;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;
    server_tokens off;

    # Timeouts
    keepalive_timeout 15;
    client_max_body_size 64m;

    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss
               application/atom+xml image/svg+xml;
}
```

### Проверка лимита открытых файлов

Узнайте текущий лимит:

```bash
ulimit -n
```

Если значение больше 768, измените `worker_connections` на это значение в `nginx.conf`.

## Установка Brotli сжатия

Установите модули Brotli:

```bash
sudo apt install libnginx-mod-http-brotli-filter libnginx-mod-http-brotli-static -y
```

Добавьте в секцию `http {}` файла `/etc/nginx/nginx.conf`:

```nginx
# Brotli Compression
brotli on;
brotli_comp_level 5;
brotli_types text/plain text/css application/json application/javascript
             text/xml application/xml application/xml+rss text/javascript;
```

## Проверка и запуск Nginx

Проверьте конфигурацию на ошибки:

```bash
sudo nginx -t
```

Если всё ОК, перезапустите Nginx:

```bash
sudo systemctl restart nginx.service
```

Включите автозапуск:

```bash
sudo systemctl enable nginx.service
```

Проверьте статус:

```bash
sudo systemctl status nginx.service
```

## Настройка catch-all сервера

Откройте `/etc/nginx/nginx.conf` и после строки `include /etc/nginx/sites-enabled/*;` добавьте:

```nginx
# Catch-all server block
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}
```

Это закроет доступ к серверу по IP-адресу, разрешая только настроенные домены.

Проверьте и перезапустите:

```bash
sudo nginx -t
sudo systemctl restart nginx.service
```

## Проверка работы

Откройте в браузере IP вашего сервера - должна появиться стандартная страница Nginx (если не настроен catch-all) или ошибка соединения (если catch-all включен).

## Следующий шаг

Nginx установлен и настроен. Далее установим PHP 8.4 для обработки WordPress.
