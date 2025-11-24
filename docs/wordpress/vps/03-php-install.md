---
title: Установка PHP 8.4 на Debian 12 для WordPress
description: Установка PHP 8.4 FPM и необходимых расширений для WordPress на Debian 12 - настройка производительности и интеграция с Nginx
keywords: [php 8.4 debian 12, php-fpm debian, php wordpress extensions, установка php debian, php nginx debian]
---

# Установка PHP 8.4 на Debian 12 для WordPress

Установка PHP 8.4 FPM со всеми необходимыми расширениями для WordPress.

## Добавление репозитория Sury

Для установки PHP 8.4 на Debian 12 используем репозиторий Ondřej Surý:

```bash
sudo apt install -y lsb-release ca-certificates curl
sudo curl -sSLo /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb
sudo dpkg -i /tmp/debsuryorg-archive-keyring.deb
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list'
sudo apt update
```

## Установка PHP 8.4 и расширений

Установите PHP 8.4 FPM и все необходимые модули для WordPress ([официальные требования](https://make.wordpress.org/hosting/handbook/server-environment/)):

```bash
sudo apt install -y php8.4-fpm php8.4-common php8.4-mysql \
php8.4-xml php8.4-xmlrpc php8.4-intl php8.4-curl php8.4-gd \
php8.4-imagick php8.4-cli php8.4-dev php8.4-imap \
php8.4-mbstring php8.4-opcache php8.4-redis \
php8.4-soap php8.4-zip php8.4-bcmath php8.4-exif
```

**Ключевые расширения для WordPress:**
- `mysql` - подключение к базе данных
- `curl` - удалённые запросы (API, обновления)
- `xml`, `xmlrpc` - парсинг XML
- `mbstring` - работа с UTF-8 текстом
- `gd`, `imagick` - обработка изображений
- `zip` - распаковка плагинов и тем
- `opcache` - кеширование PHP кода
- `exif` - метаданные изображений

Проверьте версию:

```bash
php-fpm8.4 -v
```

## Настройка PHP-FPM pool

Откройте конфигурацию пула:

```bash
sudo nano /etc/php/8.4/fpm/pool.d/www.conf
```

Найдите и измените (замените `username` на ваше имя пользователя):

```ini
user = username
group = username
listen.owner = username
listen.group = username
```

## Настройка php.ini

Откройте конфигурацию PHP:

```bash
sudo nano /etc/php/8.4/fpm/php.ini
```

Найдите и измените следующие параметры:

```ini
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 300
memory_limit = 256M
```

Найдите секцию `[opcache]` и измените:

```ini
opcache.enable_file_override = 1
opcache.memory_consumption = 128
opcache.interned_strings_buffer = 8
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 2
```

## Проверка и перезапуск PHP-FPM

Проверьте конфигурацию:

```bash
sudo php-fpm8.4 -t
```

Перезапустите PHP-FPM:

```bash
sudo systemctl restart php8.4-fpm.service
```

Включите автозапуск:

```bash
sudo systemctl enable php8.4-fpm.service
```

Проверьте статус:

```bash
sudo systemctl status php8.4-fpm.service
```

## Интеграция PHP с Nginx

Откройте дефолтную конфигурацию Nginx:

```bash
sudo nano /etc/nginx/sites-available/default
```

Найдите и раскомментируйте (или добавьте) секцию обработки PHP:

```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.4-fpm.sock;
}
```

Проверьте конфигурацию Nginx:

```bash
sudo nginx -t
```

Перезапустите Nginx:

```bash
sudo systemctl restart nginx.service
```

## Тест PHP

Создайте тестовый файл:

```bash
echo "<?php phpinfo();" | sudo tee /var/www/html/info.php
```

Откройте в браузере: `http://your_server_ip/info.php`

Должна появиться страница с информацией о PHP 8.4.

После проверки удалите файл:

```bash
sudo rm /var/www/html/info.php
```

## Следующий шаг

PHP 8.4 установлен и интегрирован с Nginx. Далее установим MySQL 8.4 для базы данных WordPress.
