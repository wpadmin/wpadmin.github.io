---
title: Установка MariaDB на Debian 12 для WordPress (альтернатива MySQL)
description: Установка и настройка MariaDB 11.4 на Debian 12 - создание базы данных и пользователя для WordPress
keywords: [mariadb debian 12, установка mariadb debian, mariadb wordpress, mariadb vs mysql, создать базу данных mariadb]
---

# Установка MariaDB на Debian 12 для WordPress

Установка MariaDB 11.4 как альтернатива MySQL для WordPress. MariaDB - форк MySQL с улучшенной производительностью и совместимостью.

:::info Выбор между MySQL и MariaDB
Эта статья показывает альтернативный вариант установки базы данных. Если вы уже установили MySQL из [предыдущей статьи](04-mysql-install.md), пропустите эту.
:::

## Установка MariaDB 11.4

Добавьте официальный репозиторий MariaDB:

```bash
sudo apt install software-properties-common dirmngr apt-transport-https -y
sudo curl -o /etc/apt/keyrings/mariadb-keyring.pgp 'https://mariadb.org/mariadb_release_signing_key.pgp'
```

Добавьте репозиторий MariaDB 11.4:

```bash
echo "deb [signed-by=/etc/apt/keyrings/mariadb-keyring.pgp] https://mirror.docker.ru/mariadb/repo/11.4/debian bookworm main" | sudo tee /etc/apt/sources.list.d/mariadb.list
```

Обновите список пакетов:

```bash
sudo apt update
```

Установите MariaDB Server:

```bash
sudo apt install mariadb-server mariadb-client -y
```

Проверьте версию:

```bash
mariadb --version
```

Проверьте статус службы:

```bash
sudo systemctl status mariadb.service
```

## Безопасная настройка MariaDB

Запустите скрипт безопасности:

```bash
sudo mariadb-secure-installation
```

Ответьте на вопросы:
1. **Enter current password for root** - нажмите Enter (пароля еще нет)
2. **Switch to unix_socket authentication** - `n` (No)
3. **Change the root password** - `Y` и введите надёжный пароль
4. **Remove anonymous users** - `Y`
5. **Disallow root login remotely** - `Y`
6. **Remove test database** - `Y`
7. **Reload privilege tables** - `Y`

## Создание базы данных для WordPress

Войдите в MariaDB:

```bash
sudo mariadb -u root -p
```

Создайте базу данных:

```sql
CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Создайте пользователя (замените `wpuser` и `password` на свои):

```sql
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'your_strong_password';
```

Выдайте права доступа:

```sql
GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser'@'localhost';
```

Примените изменения:

```sql
FLUSH PRIVILEGES;
```

Выйдите из MariaDB:

```sql
EXIT;
```

## Проверка подключения

Проверьте, что пользователь может подключиться к базе:

```bash
mariadb -u wpuser -p wordpress
```

Введите пароль. Если подключение успешно, выйдите:

```sql
EXIT;
```

## Настройка производительности (опционально)

Создайте файл конфигурации:

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Найдите секцию `[mysqld]` и добавьте или измените:

```ini
# Performance tuning for WordPress
max_connections = 100
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Query cache (MariaDB specific)
query_cache_type = 1
query_cache_limit = 2M
query_cache_size = 64M
```

**Рекомендации по памяти:**
- VPS 1GB: `innodb_buffer_pool_size = 256M`
- VPS 2GB: `innodb_buffer_pool_size = 512M`
- VPS 4GB: `innodb_buffer_pool_size = 1G`

Перезапустите MariaDB:

```bash
sudo systemctl restart mariadb.service
```

## Проверка статуса

Проверьте, что MariaDB работает:

```bash
sudo systemctl status mariadb.service
```

Проверьте производительность (опционально):

```bash
sudo mariadb -u root -p -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size';"
```

## Отличия MariaDB от MySQL

**Преимущества MariaDB:**
- Query Cache (отсутствует в MySQL 8.0+)
- Лучшая производительность на многих нагрузках
- Полная совместимость с WordPress
- Открытое развитие сообществом

**Совместимость:**
WordPress отлично работает с обеими СУБД. Команды и API идентичны.

## Следующий шаг

MariaDB установлена и база данных для WordPress создана. Далее установим WP-CLI и сам WordPress.
