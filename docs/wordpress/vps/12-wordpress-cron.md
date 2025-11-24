---
title: Настройка WordPress Cron через системный crontab
description: Правильная настройка WordPress Cron - отключение wp-cron.php и настройка системного cron для надежного выполнения задач
keywords: [wordpress cron debian, disable wp-cron, настройка cron wordpress, wp-cli cron, системный cron wordpress]
---

# Настройка WordPress Cron через системный crontab

Настройка надежного выполнения запланированных задач WordPress через системный cron вместо встроенного wp-cron.php.

## Проблема встроенного WP-Cron

Встроенный `wp-cron.php` WordPress запускается только при посещении сайта:
- Не работает на сайтах с низким трафиком
- Создает нагрузку при каждом визите
- Может пропускать задачи на закешированных сайтах
- Не гарантирует точное время выполнения

## Решение: системный cron

Системный cron Linux выполняет задачи независимо от посетителей, по точному расписанию.

## Отключение встроенного WP-Cron

Откройте `wp-config.php`:

```bash
cd ~/example.com/public
nano wp-config.php
```

Добавьте **перед** строкой `/* That's all, stop editing! */`:

```php
define('DISABLE_WP_CRON', true);
```

Или через WP-CLI:

```bash
wp config set DISABLE_WP_CRON true --raw
```

Сохраните файл.

## Настройка системного cron

Откройте crontab вашего пользователя:

```bash
crontab -e
```

При первом запуске выберите редактор (nano - самый простой).

Добавьте задачу для запуска WordPress Cron каждые 5 минут:

```cron
*/5 * * * * cd /home/username/example.com/public && /usr/local/bin/wp cron event run --due-now --quiet
```

**Замените:**
- `username` - ваше имя пользователя
- `example.com` - имя домена

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

## Объяснение команды

```bash
cd /home/username/example.com/public
```
Переход в директорию WordPress

```bash
/usr/local/bin/wp cron event run --due-now
```
Запуск всех просроченных задач через WP-CLI

```bash
--quiet
```
Без вывода - предотвращает отправку email

## Проверка настройки cron

Посмотрите список задач cron:

```bash
crontab -l
```

Проверьте запланированные события WordPress:

```bash
wp cron event list
```

## Запуск cron вручную

Для немедленного выполнения всех просроченных задач:

```bash
cd ~/example.com/public
wp cron event run --due-now
```

## Настройка для нескольких сайтов

Если на сервере несколько WordPress сайтов, добавьте задачу для каждого:

```cron
# Сайт 1
*/5 * * * * cd /home/username/site1.com/public && /usr/local/bin/wp cron event run --due-now --quiet

# Сайт 2 - запуск со сдвигом на 2 минуты
2-59/5 * * * * cd /home/username/site2.com/public && /usr/local/bin/wp cron event run --due-now --quiet

# Сайт 3 - запуск со сдвигом на 4 минуты
4-59/5 * * * * cd /home/username/site3.com/public && /usr/local/bin/wp cron event run --due-now --quiet
```

Сдвиг времени распределяет нагрузку на CPU.

## Расписание cron

Примеры расписаний:

```cron
# Каждые 5 минут
*/5 * * * * команда

# Каждый час в 0 минут
0 * * * * команда

# Каждый день в 3:00 ночи
0 3 * * * команда

# Каждый понедельник в 1:00
0 1 * * 1 команда

# Каждый первый день месяца в 2:00
0 2 1 * * команда
```

Формат: `минута час день месяц день_недели`

## Мониторинг работы cron

### Проверка последнего запуска

```bash
wp cron event list --fields=hook,next_run,recurrence
```

### Логирование cron

Добавьте вывод в лог-файл:

```cron
*/5 * * * * cd /home/username/example.com/public && /usr/local/bin/wp cron event run --due-now >> /home/username/example.com/logs/cron.log 2>&1
```

Просмотр лога:

```bash
tail -f ~/example.com/logs/cron.log
```

### Системные логи cron

Просмотр системных логов cron:

```bash
sudo grep CRON /var/log/syslog | tail -20
```

## Тестирование cron

### Создание тестового события

```bash
wp cron event schedule test_event now
```

Проверка списка:

```bash
wp cron event list
```

Запуск:

```bash
wp cron event run --due-now
```

Удаление тестового события:

```bash
wp cron event delete test_event
```

## Популярные задачи WordPress Cron

Проверьте какие задачи запланированы:

```bash
wp cron event list
```

Типичные задачи:
- `wp_version_check` - проверка обновлений WordPress
- `wp_update_plugins` - проверка обновлений плагинов
- `wp_update_themes` - проверка обновлений тем
- `wp_scheduled_delete` - очистка корзины
- `wp_scheduled_auto_draft_delete` - удаление черновиков
- `delete_expired_transients` - очистка просроченных transients

## Отладка проблем

### Cron не выполняется

Проверьте права доступа:

```bash
ls -la ~/example.com/public/wp-cron.php
```

Проверьте путь к WP-CLI:

```bash
which wp
```

Должно вернуть `/usr/local/bin/wp`

### Задачи не запускаются

Проверьте константу в wp-config.php:

```bash
wp config get DISABLE_WP_CRON
```

Должно вернуть `true`

Запустите вручную с выводом ошибок:

```bash
wp cron event run --due-now
```

### Проверка синтаксиса crontab

```bash
crontab -l | grep -v "^#" | grep -v "^$"
```

## Альтернативные подходы

### Использование wget/curl (не рекомендуется)

```cron
*/5 * * * * wget -q -O - https://example.com/wp-cron.php?doing_wp_cron >/dev/null 2>&1
```

Недостатки:
- Timeout на длительных задачах
- Дополнительная нагрузка через HTTP
- Проблемы с SSL сертификатами

### Использование WP-CLI (рекомендуется)

Преимущества WP-CLI:
- Нет timeout
- Прямой доступ к PHP
- Детальный вывод ошибок
- Быстрее выполнение

## Мониторинг сервисами

Используйте внешние сервисы для мониторинга cron:
- **Cronitor** - мониторинг выполнения cron
- **Healthchecks.io** - уведомления о пропущенных задачах
- **Dead Man's Snitch** - проверка регулярности выполнения

Пример с Healthchecks.io:

```cron
*/5 * * * * cd /home/username/example.com/public && /usr/local/bin/wp cron event run --due-now --quiet && curl -fsS --retry 3 https://hc-ping.com/your-uuid > /dev/null
```

## Следующий шаг

Системный Cron настроен. Далее настроим отправку email через SMTP для WordPress.
