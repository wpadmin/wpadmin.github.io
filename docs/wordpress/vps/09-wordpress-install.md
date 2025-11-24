---
title: Установка WordPress через WP-CLI на Debian 12
description: Установка WordPress с помощью WP-CLI - скачивание, настройка базы данных и первоначальная конфигурация
keywords: [установка wordpress wpcli, wordpress через командную строку, wp core install, wordpress vps installation]
---

# Установка WordPress через WP-CLI

Установка WordPress с помощью WP-CLI на подготовленный сервер с Nginx, PHP и MySQL/MariaDB.

## Создание базы данных

Создайте базу данных и пользователя для WordPress (если еще не создали).

Войдите в MySQL/MariaDB:

```bash
sudo mysql -u root -p
```

Выполните команды (замените `dbname`, `dbuser`, `password` на свои):

```sql
CREATE DATABASE wordpress_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wordpress_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wordpress_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Скачивание WordPress

Перейдите в директорию сайта:

```bash
cd ~/example.com/public
```

Скачайте WordPress:

```bash
wp core download --locale=ru_RU
```

Для английской версии используйте:

```bash
wp core download
```

Проверьте, что файлы загружены:

```bash
ls -la
```

## Настройка wp-config.php

Создайте конфигурационный файл:

```bash
wp core config \
  --dbname=wordpress_db \
  --dbuser=wordpress_user \
  --dbpass='strong_password_here' \
  --dbhost=localhost \
  --dbprefix=wp_
```

WP-CLI автоматически сгенерирует уникальные ключи безопасности.

Проверьте созданный файл:

```bash
ls -la wp-config.php
```

## Установка WordPress

Запустите установку (замените параметры на свои):

```bash
wp core install \
  --url=https://example.com \
  --title='Название сайта' \
  --admin_user=admin \
  --admin_password='admin_password_here' \
  --admin_email=admin@example.com \
  --skip-email
```

**Параметры:**
- `--url` - адрес вашего сайта (с https://)
- `--title` - название сайта
- `--admin_user` - имя администратора (НЕ используйте "admin"!)
- `--admin_password` - надёжный пароль
- `--admin_email` - email администратора
- `--skip-email` - не отправлять email уведомление

После выполнения увидите:

```
Success: WordPress installed successfully.
```

## Проверка установки

Откройте сайт в браузере:

```
https://example.com
```

Должна открыться главная страница WordPress.

Войдите в админку:

```
https://example.com/wp-admin
```

## Базовая настройка WordPress

### Изменение структуры постоянных ссылок

Установите понятные URL:

```bash
wp rewrite structure '/%postname%/' --hard
```

Проверьте:

```bash
wp rewrite list --format=table
```

### Удаление стандартного контента

Удалите демо-пост:

```bash
wp post delete 1 --force
```

Удалите демо-страницу:

```bash
wp post delete 2 --force
```

Удалите демо-комментарий:

```bash
wp comment delete 1 --force
```

### Настройка часового пояса

```bash
wp option update timezone_string 'Europe/Moscow'
```

### Настройка языка

Если установили русскую версию, проверьте язык:

```bash
wp language core list
```

Активируйте русский (если нужно):

```bash
wp language core install ru_RU
wp language core activate ru_RU
```

## Установка и настройка плагинов

### Установка популярных плагинов

Установите и активируйте нужные плагины:

```bash
# SEO плагин
wp plugin install wordpress-seo --activate

# Кэширование
wp plugin install wp-super-cache --activate

# Безопасность
wp plugin install wordfence --activate

# Резервное копирование
wp plugin install updraftplus --activate
```

Посмотреть список плагинов:

```bash
wp plugin list
```

## Обновление WordPress

Проверьте доступные обновления:

```bash
wp core check-update
```

Обновите ядро:

```bash
wp core update
```

Обновите базу данных (если нужно):

```bash
wp core update-db
```

Обновите все плагины:

```bash
wp plugin update --all
```

## Создание резервной копии

Экспортируйте базу данных:

```bash
wp db export ~/backup-$(date +%Y%m%d).sql
```

Создайте архив файлов:

```bash
cd ~/
tar -czf example.com-backup-$(date +%Y%m%d).tar.gz example.com/
```

## Проверка статуса WordPress

Проверьте версию WordPress:

```bash
wp core version
```

Проверьте состояние БД:

```bash
wp db check
```

Посмотрите информацию о сайте:

```bash
wp core check-update
wp plugin list
wp theme list
```

## Устранение проблем

### Ошибка подключения к БД

Проверьте данные в wp-config.php:

```bash
wp config get DB_NAME
wp config get DB_USER
```

Проверьте подключение к БД:

```bash
wp db check
```

### Ошибка прав доступа

Установите правильные права:

```bash
cd ~/example.com/public
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

### Проблемы с URL

Проверьте настройки URL:

```bash
wp option get siteurl
wp option get home
```

Исправьте при необходимости:

```bash
wp option update siteurl 'https://example.com'
wp option update home 'https://example.com'
```

## Готово!

WordPress установлен и настроен! Теперь можно:
- Установить и настроить тему
- Добавить необходимые плагины
- Создать страницы и записи
- Настроить меню и виджеты

Полезные команды для управления:

```bash
# Справка по WP-CLI
wp help

# Список всех команд
wp cli cmd-dump

# Проверить производительность
wp profile stage --all
```
