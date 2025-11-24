---
title: Установка Redis для WordPress Object Cache на Debian 12
description: Настройка Redis (Valkey) для кеширования объектов WordPress - ускорение запросов к базе данных в 7 раз
keywords: [redis wordpress debian 12, valkey debian, wordpress object cache, redis cache wordpress, ускорение wordpress]
---

# Установка Redis для WordPress Object Cache

Установка Redis (Valkey) для кеширования объектов WordPress. Уменьшает время запросов к БД с 2.1ms до 0.3ms.

## Что такое Object Cache

Object Cache кеширует результаты запросов к MySQL в памяти Redis, значительно снижая нагрузку на базу данных и ускоряя работу сайта.

## Установка Valkey (Redis-совместимый)

В Debian 12 Redis заменён на Valkey - полностью совместимую open-source альтернативу.

Установите Valkey:

```bash
sudo apt install valkey-server valkey-redis-compat -y
```

Включите и запустите службу:

```bash
sudo systemctl enable --now valkey-server.service
```

Проверьте статус:

```bash
sudo systemctl status valkey-server.service
```

## Проверка работы Valkey

Подключитесь к Valkey:

```bash
valkey-cli
```

Проверьте работу:

```bash
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> EXIT
```

## Настройка Valkey (опционально)

Откройте конфигурацию:

```bash
sudo nano /etc/valkey/valkey.conf
```

Рекомендуемые параметры для WordPress:

```ini
# Максимальная память (256MB для VPS 1GB, 512MB для 2GB)
maxmemory 256mb

# Политика вытеснения - удалять старые ключи
maxmemory-policy allkeys-lru

# Отключить сохранение на диск (кеш восстановится автоматически)
save ""
```

Перезапустите после изменений:

```bash
sudo systemctl restart valkey-server.service
```

## Установка плагина Redis Object Cache

### Через WP-CLI

```bash
cd ~/example.com/public
wp plugin install redis-cache --activate
```

### Через админку WordPress

1. Войдите в админку WordPress
2. Перейдите в **Плагины → Добавить новый**
3. Найдите "Redis Object Cache" (автор: Till Krüss)
4. Нажмите **Установить**, затем **Активировать**

## Включение Object Cache

### Через WP-CLI

```bash
wp redis enable
```

### Через админку

1. Перейдите в **Настройки → Redis**
2. Нажмите кнопку **Enable Object Cache**

Должно появиться сообщение об успешном подключении.

## Проверка работы кеша

Проверьте статус через WP-CLI:

```bash
wp redis status
```

Вывод должен показать:
- Status: Connected
- Redis Version: 7.x
- Uptime: время работы

Посмотрите статистику:

```bash
wp redis info
```

## Настройка wp-config.php (опционально)

Если Redis не подключается автоматически, добавьте в `wp-config.php` перед строкой `/* That's all, stop editing! */`:

```php
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_PREFIX', 'wp_');
define('WP_REDIS_DATABASE', 0);
define('WP_REDIS_TIMEOUT', 1);
define('WP_REDIS_READ_TIMEOUT', 1);
```

## Проверка производительности

### До включения кеша

Проверьте время запросов к БД в **Query Monitor** или через Debugging:

```php
// В wp-config.php
define('SAVEQUERIES', true);
```

### После включения кеша

В админке Redis покажет:
- **Hit Ratio** - процент попаданий в кеш (должен быть >80%)
- **Hits/Misses** - соотношение попаданий и промахов
- **Memory Used** - использование памяти

## Очистка кеша

### Через WP-CLI

```bash
wp cache flush
```

### Через админку

**Настройки → Redis → Flush Cache**

### Вручную через Valkey

```bash
valkey-cli
127.0.0.1:6379> FLUSHALL
OK
127.0.0.1:6379> EXIT
```

## Мониторинг Redis

Посмотреть все ключи в кеше:

```bash
valkey-cli --scan --pattern 'wp_*'
```

Посмотреть статистику в реальном времени:

```bash
valkey-cli --stat
```

Отследить команды:

```bash
valkey-cli monitor
```

## Результаты производительности

**Без Object Cache:**
- Время запроса к БД: 2.1ms
- Количество запросов: высокое

**С Object Cache:**
- Время запроса: 0.3ms (в 7 раз быстрее)
- Нагрузка на MySQL: снижена на 60-80%
- Hit Ratio: 85-95%

## Устранение проблем

### Redis не подключается

Проверьте, что служба запущена:

```bash
sudo systemctl status valkey-server.service
```

Проверьте подключение:

```bash
valkey-cli ping
```

### Низкий Hit Ratio

Увеличьте `maxmemory` в конфигурации Valkey:

```bash
sudo nano /etc/valkey/valkey.conf
```

### Высокое использование памяти

Проверьте использование:

```bash
valkey-cli INFO memory
```

Очистите старый кеш:

```bash
valkey-cli FLUSHALL
```

## Следующий шаг

Object Cache настроен. Далее настроим Nginx FastCGI кеширование для статических страниц.
