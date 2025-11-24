---
title: Установка MySQL 8.4 на Debian 12 для WordPress
description: Установка и настройка MySQL 8.4 на Debian 12 - создание базы данных и пользователя для WordPress
keywords: [mysql 8.4 debian 12, установка mysql debian, mysql wordpress, создать базу данных mysql, mysql secure installation]
---

# Установка MySQL 8.4 на Debian 12 для WordPress

Установка MySQL 8.4 и настройка базы данных для WordPress.

## Установка MySQL 8.4

Скачайте пакет конфигурации MySQL APT репозитория:

```bash
wget https://dev.mysql.com/get/mysql-apt-config_0.8.36-1_all.deb
```

Установите пакет:

```bash
sudo dpkg -i mysql-apt-config_0.8.36-1_all.deb
```

В интерактивном меню:
1. Выберите "Ok" для MySQL Server 8.4 (должно быть выбрано по умолчанию)
2. Нажмите Enter

Обновите список пакетов:

```bash
sudo apt update
```

Установите MySQL Server:

```bash
sudo apt install mysql-server -y
```

Проверьте версию:

```bash
mysql --version
```

## Безопасная настройка MySQL

Запустите скрипт безопасности:

```bash
sudo mysql_secure_installation
```

Ответьте на вопросы:
1. **VALIDATE PASSWORD component** - `Y` (рекомендуется)
2. **Password validation policy** - `2` (STRONG)
3. **Remove anonymous users** - `Y`
4. **Disallow root login remotely** - `Y`
5. **Remove test database** - `Y`
6. **Reload privilege tables** - `Y`

## Создание базы данных для WordPress

Войдите в MySQL:

```bash
sudo mysql -u root -p
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

Выйдите из MySQL:

```sql
EXIT;
```

## Проверка подключения

Проверьте, что пользователь может подключиться к базе:

```bash
mysql -u wpuser -p wordpress
```

Введите пароль. Если подключение успешно, выйдите:

```sql
EXIT;
```

## Настройка производительности (опционально)

Откройте конфигурацию MySQL:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Добавьте или измените в секции `[mysqld]`:

```ini
# Performance tuning for WordPress
max_connections = 100
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
```

Значение `innodb_buffer_pool_size` должно быть ~70% от доступной RAM (для сервера 1GB используйте 256M, для 2GB - 512M).

Перезапустите MySQL:

```bash
sudo systemctl restart mysql.service
```

## Проверка статуса

Проверьте, что MySQL работает:

```bash
sudo systemctl status mysql.service
```

## Следующий шаг

MySQL установлен и база данных для WordPress создана. Далее установим WP-CLI и сам WordPress.
