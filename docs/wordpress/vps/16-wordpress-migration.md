---
title: Миграция WordPress на новый сервер
description: Полное руководство по переносу WordPress с одного VPS на другой - файлы, база данных, SSL, DNS
keywords: [миграция wordpress, перенос wordpress vps, wordpress migration debian, backup restore wordpress, перенос сайта wordpress]
---

# Миграция WordPress на новый сервер

Пошаговое руководство по переносу WordPress с одного VPS на другой с минимальным downtime.

## Подготовка к миграции

### Контрольный список

- [ ] Новый сервер настроен (Nginx, PHP, MySQL/MariaDB)
- [ ] Доступ по SSH к обоим серверам
- [ ] Резервная копия старого сайта
- [ ] Новые DNS TTL снижены (за 24 часа до миграции)

## Этап 1: Подготовка нового сервера

### Настройка SSH ключа для переноса

На новом сервере создайте SSH ключ:

```bash
ssh-keygen -t ed25519 -C "migration-key"
```

Скопируйте публичный ключ:

```bash
cat ~/.ssh/id_ed25519.pub
```

На старом сервере добавьте ключ:

```bash
nano ~/.ssh/authorized_keys
# Вставьте публичный ключ
```

### Создание структуры директорий

На новом сервере:

```bash
mkdir -p ~/example.com/{public,logs,cache}
chmod 755 ~/example.com
```

## Этап 2: Перенос базы данных

### На старом сервере

Экспорт базы данных:

```bash
cd ~/example.com/public
wp db export ~/db-export.sql
```

Или через mysqldump:

```bash
mysqldump -u dbuser -p dbname > ~/db-export.sql
```

Сжатие для ускорения переноса:

```bash
gzip ~/db-export.sql
```

### На новом сервере

Создайте базу данных и пользователя:

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE wordpress_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wordpress_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wordpress_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Перенос файла БД

С нового сервера скопируйте дамп:

```bash
scp old-user@old-server.com:~/db-export.sql.gz ~/
```

Распакуйте и импортируйте:

```bash
gunzip db-export.sql.gz
mysql -u wordpress_user -p wordpress_db < db-export.sql
```

Или через WP-CLI:

```bash
wp db import db-export.sql
```

## Этап 3: Перенос файлов WordPress

### Метод 1: SCP (рекомендуется для малых сайтов)

С нового сервера:

```bash
scp -r old-user@old-server.com:~/example.com/public/ ~/example.com/
```

### Метод 2: rsync (рекомендуется для больших сайтов)

```bash
rsync -avz --progress \
  old-user@old-server.com:~/example.com/public/ \
  ~/example.com/public/
```

### Метод 3: Архив (для очень больших сайтов)

На старом сервере:

```bash
cd ~/example.com
tar -czf site-backup.tar.gz public/
```

Перенос:

```bash
scp old-user@old-server.com:~/example.com/site-backup.tar.gz ~/
```

Распаковка на новом сервере:

```bash
tar -xzf site-backup.tar.gz -C ~/example.com/
```

## Этап 4: Настройка wp-config.php

Обновите данные подключения к БД:

```bash
cd ~/example.com/public
nano wp-config.php
```

Измените:

```php
define( 'DB_NAME', 'wordpress_db' );
define( 'DB_USER', 'wordpress_user' );
define( 'DB_PASSWORD', 'strong_password' );
define( 'DB_HOST', 'localhost' );
```

Или через WP-CLI:

```bash
wp config set DB_NAME wordpress_db
wp config set DB_USER wordpress_user
wp config set DB_PASSWORD 'strong_password'
```

## Этап 5: Nginx конфигурация

### Перенос конфигурации

С нового сервера скопируйте конфиг:

```bash
scp old-user@old-server.com:/etc/nginx/sites-available/example.com ~/example.com-nginx.conf
```

Установите на место:

```bash
sudo mv ~/example.com-nginx.conf /etc/nginx/sites-available/example.com
sudo chown root:root /etc/nginx/sites-available/example.com
```

### Обновление путей

Откройте конфиг и обновите пути:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Измените пути к директориям и логам:

```nginx
root /home/newuser/example.com/public;
access_log /home/newuser/example.com/logs/access.log;
error_log /home/newuser/example.com/logs/error.log;
```

### Активация сайта

```bash
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com
sudo nginx -t
sudo systemctl reload nginx.service
```

## Этап 6: SSL сертификаты

### Временное решение

Скопируйте существующие сертификаты со старого сервера:

```bash
# На старом сервере
sudo cp /etc/letsencrypt/live/example.com/fullchain.pem ~/
sudo cp /etc/letsencrypt/live/example.com/privkey.pem ~/
sudo chown $USER *.pem

# На новом сервере
scp old-user@old-server.com:~/*.pem ~/example.com/
```

Обновите пути в Nginx конфиге:

```nginx
ssl_certificate /home/newuser/example.com/fullchain.pem;
ssl_certificate_key /home/newuser/example.com/privkey.pem;
```

### Постоянное решение (после смены DNS)

После смены DNS получите новые сертификаты:

```bash
sudo certbot certonly --nginx -d example.com -d www.example.com
```

Обновите пути в конфиге на стандартные:

```nginx
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

## Этап 7: Проверка перед сменой DNS

### Проверка через hosts файл

На локальной машине добавьте в `/etc/hosts` (macOS/Linux) или `C:\Windows\System32\drivers\etc\hosts` (Windows):

```text
NEW_SERVER_IP example.com
NEW_SERVER_IP www.example.com
```

Откройте сайт в браузере - должен открыться с нового сервера.

### Проверка функциональности

- [ ] Главная страница открывается
- [ ] Админка доступна
- [ ] Посты и страницы работают
- [ ] Изображения загружаются
- [ ] Формы отправляются
- [ ] Плагины работают

### Удалите запись из hosts после проверки

## Этап 8: Смена DNS

### Снижение TTL (за 24 часа до миграции)

Установите TTL для A-записи на минимум (300-600 секунд).

### Обновление A-записей

В панели управления DNS:

1. Найдите A-запись для `example.com`
2. Измените IP на новый сервер
3. Найдите A-запись для `www.example.com`
4. Измените IP на новый сервер

### Проверка распространения DNS

```bash
dig +short example.com
```

Или онлайн: https://www.whatsmydns.net/

## Этап 9: Пост-миграция

### Настройка Cron

```bash
crontab -e
```

Добавьте:

```cron
*/5 * * * * cd /home/newuser/example.com/public && /usr/local/bin/wp cron event run --due-now --quiet
```

### Настройка бэкапов

```bash
# Скопируйте скрипты бэкапа
scp old-user@old-server.com:~/backups/*.sh ~/backups/
chmod +x ~/backups/*.sh
```

Обновите пути в скриптах и добавьте в cron.

### Настройка кеширования

Очистите и прогрейте кеш:

```bash
# Redis
wp cache flush

# Nginx FastCGI
sudo rm -rf ~/example.com/cache/*

# Прогрев кеша
curl https://example.com
```

## Этап 10: Мониторинг после миграции

### Проверка логов ошибок

```bash
tail -f ~/example.com/logs/error.log
```

### Мониторинг производительности

```bash
# Проверка времени ответа
curl -w "\nTime: %{time_total}s\n" https://example.com

# Проверка SSL
curl -I https://example.com
```

### Проверка базы данных

```bash
wp db check
wp db optimize
```

## Откат на старый сервер (если что-то пошло не так)

Если возникли проблемы:

1. Верните A-записи DNS на старый IP
2. Ожидайте распространения DNS (5-60 минут)
3. Старый сервер снова работает

## Окончательное отключение старого сервера

### Через неделю после успешной миграции

1. Сделайте финальный бэкап старого сервера
2. Скачайте бэкап локально
3. Удалите сайт со старого сервера:

```bash
# НА СТАРОМ СЕРВЕРЕ!
rm -rf ~/example.com
```

4. Можно отменить старый VPS

## Контрольный список миграции

- [ ] База данных перенесена и работает
- [ ] Все файлы перенесены
- [ ] wp-config.php обновлен
- [ ] Nginx настроен и работает
- [ ] SSL сертификаты установлены
- [ ] DNS обновлены
- [ ] Cron настроен
- [ ] Бэкапы настроены
- [ ] Кеш настроен
- [ ] Мониторинг работает
- [ ] Старый сервер сохранен как fallback (минимум неделя)

## Следующий шаг

Миграция завершена. Далее настроим мониторинг сервера для отслеживания производительности и проблем.
