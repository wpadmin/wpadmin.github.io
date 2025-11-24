---
title: Настройка Nginx FastCGI кеширования для WordPress
description: Полная настройка FastCGI кеша в Nginx - ускорение WordPress с 2144ms до 136ms
keywords: [nginx fastcgi cache wordpress, nginx page cache, wordpress nginx кеш, fastcgi cache debian, ускорение wordpress nginx]
---

# Настройка Nginx FastCGI кеширования для WordPress

Настройка FastCGI кеша в Nginx для кеширования готовых HTML страниц. Уменьшает время ответа с 2144ms до 136ms.

## Что такое FastCGI Cache

FastCGI Cache кеширует готовые HTML страницы на диске, позволяя Nginx отдавать их напрямую без обращения к PHP и MySQL.

**Производительность:**
- Без кеша: 674 запроса/сек, 2144ms среднее время
- С кешем: 162797 запросов/сек, 136ms среднее время

## Создание директории для кеша

Создайте директорию кеша для вашего сайта:

```bash
mkdir -p ~/example.com/cache
chmod 755 ~/example.com/cache
```

## Настройка Nginx конфигурации

Откройте конфигурацию вашего сайта:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

### 1. Добавьте путь к кешу

**ПЕРЕД** блоком `server {` добавьте:

```nginx
# FastCGI Cache Path
fastcgi_cache_path /home/username/example.com/cache levels=1:2
                   keys_zone=example_com:100m
                   inactive=60m
                   max_size=500m;
```

Параметры:
- `levels=1:2` - структура поддиректорий
- `keys_zone` - имя зоны и размер в памяти (100MB)
- `inactive` - время хранения неиспользуемого кеша (60 минут)
- `max_size` - максимальный размер кеша на диске (500MB)

### 2. Добавьте правила пропуска кеша

Внутри блока `server {` **ПЕРЕД** `location` блоками добавьте:

```nginx
# Cache Bypass Rules
set $skip_cache 0;

# POST запросы не кешируются
if ($request_method = POST) {
    set $skip_cache 1;
}

# URL с параметрами не кешируются
if ($query_string != "") {
    set $skip_cache 1;
}

# Не кешировать админку, API, фиды
if ($request_uri ~* "/wp-admin/|/wp-json/|/xmlrpc.php|wp-.*.php|/feed/|index.php|sitemap(_index)?.xml") {
    set $skip_cache 1;
}

# Не кешировать для авторизованных пользователей
if ($http_cookie ~* "comment_author|wordpress_[a-f0-9]+|wp-postpass|wordpress_no_cache|wordpress_logged_in") {
    set $skip_cache 1;
}
```

### 3. Включите кеш в location блоке

Найдите блок `location ~ \.php$` и добавьте директивы FastCGI кеша:

```nginx
location ~ \.php$ {
    try_files $uri =404;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    fastcgi_pass unix:/run/php/php8.4-fpm.sock;
    fastcgi_index index.php;
    include fastcgi.conf;

    # FastCGI Cache
    fastcgi_cache example_com;
    fastcgi_cache_bypass $skip_cache;
    fastcgi_no_cache $skip_cache;
    fastcgi_cache_valid 200 60m;
    fastcgi_cache_valid 404 10m;
}
```

## Настройка глобальных параметров кеша

Откройте главный конфиг Nginx:

```bash
sudo nano /etc/nginx/nginx.conf
```

Найдите секцию `http {` и добавьте **после** настроек gzip:

```nginx
##
# FastCGI Cache Settings
##

fastcgi_cache_key "$scheme$request_method$http_host$request_uri";
fastcgi_cache_use_stale error timeout invalid_header http_500 http_503;
fastcgi_cache_lock on;
fastcgi_cache_lock_timeout 5s;
add_header X-FastCGI-Cache $upstream_cache_status;
```

Параметры:
- `fastcgi_cache_key` - ключ для кеширования
- `fastcgi_cache_use_stale` - отдавать старый кеш при ошибках
- `fastcgi_cache_lock` - предотвращает одновременную генерацию одной страницы
- `add_header` - добавляет заголовок с статусом кеша

## Проверка и перезапуск Nginx

Проверьте конфигурацию:

```bash
sudo nginx -t
```

Перезапустите Nginx:

```bash
sudo systemctl restart nginx.service
```

## Проверка работы кеша

### Проверка через заголовки

```bash
curl -I https://example.com
```

Ищите заголовок `X-FastCGI-Cache`:
- **MISS** - первый запрос, страница не в кеше
- **HIT** - страница взята из кеша
- **BYPASS** - кеш пропущен (админка, авторизованный пользователь)

### Проверка файлов кеша

```bash
ls -la ~/example.com/cache/
```

Должны появиться поддиректории с закешированными файлами.

### Проверка производительности

Сделайте несколько запросов подряд:

```bash
curl -w "\nTime: %{time_total}s\n" https://example.com
```

Первый запрос (MISS) будет медленнее, последующие (HIT) - быстрее.

## Настройка для WooCommerce

Если используете WooCommerce, добавьте исключения для корзины и checkout:

```nginx
# WooCommerce страницы не кешируются
if ($request_uri ~* "/cart/|/checkout/|/my-account/") {
    set $skip_cache 1;
}

# Не кешировать если в корзине есть товары
if ($http_cookie ~* "woocommerce_items_in_cart") {
    set $skip_cache 1;
}
```

Проверьте и перезапустите:

```bash
sudo nginx -t
sudo systemctl reload nginx.service
```

## Установка плагина для автоочистки кеша

### Nginx Helper

Установите плагин **Nginx Helper**:

```bash
cd ~/example.com/public
wp plugin install nginx-helper --activate
```

Настройте плагин:

```bash
wp option update rt_wp_nginx_helper_options '{"enable_purge":"1","cache_method":"enable_fastcgi","purge_method":"get_request","enable_map":"0","enable_log":"0","log_level":"INFO","log_filesize":"5","enable_stamp":"0","purge_homepage_on_new":"1","purge_homepage_on_edit":"1","purge_homepage_on_del":"1","purge_archive_on_new":"1","purge_archive_on_edit":"1","purge_archive_on_del":"1","purge_archive_on_new_comment":"0","purge_archive_on_deleted_comment":"0","purge_page_on_mod":"1","purge_page_on_new_comment":"1","purge_page_on_deleted_comment":"1"}' --format=json
```

Или настройте через админку:
1. **Настройки → Nginx Helper**
2. Enable Purge: **On**
3. Cache Method: **nginx FastCGI cache**
4. Purge Method: **Delete local server cache files**

## Ручная очистка кеша

### Через WP-CLI с плагином

```bash
wp nginx-helper purge-all
```

### Полная очистка файлов

```bash
sudo rm -rf ~/example.com/cache/*
```

### Очистка конкретной страницы

```bash
curl -X PURGE https://example.com/some-page/
```

## Мониторинг кеша

### Размер кеша

```bash
du -sh ~/example.com/cache/
```

### Количество закешированных файлов

```bash
find ~/example.com/cache -type f | wc -l
```

### Hit/Miss статистика

Добавьте в Nginx access log:

```nginx
log_format cache '$remote_addr - $upstream_cache_status [$time_local] '
                 '"$request" $status $body_bytes_sent '
                 '"$http_referer" "$http_user_agent"';

access_log /home/username/example.com/logs/cache.log cache;
```

Анализ:

```bash
grep "HIT" ~/example.com/logs/cache.log | wc -l
grep "MISS" ~/example.com/logs/cache.log | wc -l
```

## Расширенная настройка

### Разное время кеширования

```nginx
# Главная - 30 минут
location = / {
    fastcgi_cache_valid 200 30m;
}

# Посты - 60 минут
location ~ ^/[^/]+/?$ {
    fastcgi_cache_valid 200 60m;
}
```

### Предварительный прогрев кеша

```bash
# Создайте список URL
wp post list --post_type=post --format=csv --fields=url | tail -n +2 > urls.txt

# Прогрейте кеш
while read url; do curl -s "$url" > /dev/null; done < urls.txt
```

## Результаты

**До кеширования:**
- 674 запросов обработано
- 2144ms среднее время ответа
- Высокая нагрузка на CPU и MySQL

**После кеширования:**
- 162797 запросов обработано (+24000%)
- 136ms среднее время ответа (-94%)
- Минимальная нагрузка на сервер

## Следующий шаг

FastCGI кеш настроен. Далее настроим дополнительную оптимизацию и мониторинг сервера.
