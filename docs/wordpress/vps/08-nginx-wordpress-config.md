---
title: Настройка Nginx server block для WordPress
description: Создание и настройка Nginx конфигурации для WordPress сайта с HTTPS, HTTP/2 и редиректами
keywords: [nginx wordpress config, nginx server block wordpress, nginx https wordpress, wordpress nginx configuration]
---

# Настройка Nginx server block для WordPress

Создание оптимальной конфигурации Nginx для WordPress сайта с поддержкой HTTPS, HTTP/2 и правильными редиректами.

## Создание структуры директорий

Создайте директории для сайта (замените `example.com` на ваш домен):

```bash
mkdir -p ~/example.com/public
mkdir -p ~/example.com/logs
```

Установите права доступа:

```bash
chmod -R 755 ~/example.com
```

## Создание конфигурации Nginx

Создайте файл конфигурации:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Вставьте следующую конфигурацию (замените `example.com` и `username` на свои):

```nginx
# HTTPS - основной сервер
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name example.com;

    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Логи
    access_log /home/username/example.com/logs/access.log;
    error_log /home/username/example.com/logs/error.log;

    # Корневая директория
    root /home/username/example.com/public;
    index index.php index.html;

    # WordPress permalink structure
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    # Обработка PHP
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi.conf;
    }

    # Запрет доступа к скрытым файлам
    location ~ /\.ht {
        deny all;
    }

    # Кэширование статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# HTTPS - редирект www -> non-www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    return 301 https://example.com$request_uri;
}

# HTTP - редирект на HTTPS
server {
    listen 80;
    listen [::]:80;

    server_name example.com www.example.com;

    return 301 https://example.com$request_uri;
}
```

## Включение сайта

Создайте символическую ссылку:

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com
```

Проверьте конфигурацию:

```bash
sudo nginx -t
```

Если всё OK, перезапустите Nginx:

```bash
sudo systemctl reload nginx.service
```

## Дополнительные настройки безопасности

Для повышения безопасности добавьте в server block:

```nginx
# Защита от clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# XSS защита
add_header X-XSS-Protection "1; mode=block" always;

# Запрет MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# Referrer Policy
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# Защита wp-config.php
location = /wp-config.php {
    deny all;
}

# Запрет доступа к readme и license
location ~* /(readme|license)\.(html|txt)$ {
    deny all;
}
```

## Ограничение доступа к wp-admin

Для ограничения доступа к админке по IP:

```nginx
location /wp-admin {
    # Разрешить только ваш IP
    allow 203.0.113.10;
    deny all;

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        include fastcgi.conf;
    }
}
```

## Настройка upload limits

Увеличьте лимит загрузки файлов в server block:

```nginx
client_max_body_size 128M;
```

## Проверка конфигурации

Проверьте, что сайт доступен:

```bash
curl -I https://example.com
```

Должен вернуться статус 200 или 301/302 (если WordPress еще не установлен).

Проверьте логи при проблемах:

```bash
tail -f ~/example.com/logs/error.log
```

## Следующий шаг

Nginx настроен для WordPress. Далее установим сам WordPress через WP-CLI.
