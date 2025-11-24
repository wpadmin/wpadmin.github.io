---
title: Мониторинг и обслуживание WordPress сервера на Debian 12
description: Мониторинг производительности, анализ логов, обновление системы, отладка WordPress на VPS
keywords: [мониторинг сервера debian, wordpress monitoring, htop debian, анализ логов nginx, maintenance wordpress vps]
---

# Мониторинг и обслуживание WordPress сервера

Инструменты и команды для мониторинга производительности, анализа логов и обслуживания WordPress на Debian 12.

## Мониторинг ресурсов сервера

### htop - интерактивный мониторинг

Установка:

```bash
sudo apt install htop -y
```

Запуск:

```bash
htop
```

Показывает в реальном времени:
- Загрузку CPU по ядрам
- Использование RAM и Swap
- Процессы с сортировкой по CPU/Memory
- Load Average

**Горячие клавиши:**
- `F6` - сортировка
- `F9` - убить процесс
- `F10` или `q` - выход

### Быстрая проверка ресурсов

Загрузка CPU:

```bash
uptime
```

Использование памяти:

```bash
free -h
```

Использование диска:

```bash
df -h
```

Использование inodes:

```bash
df -i
```

### Мониторинг процессов

Топ процессов по CPU:

```bash
ps aux --sort=-%cpu | head -10
```

Топ процессов по памяти:

```bash
ps aux --sort=-%mem | head -10
```

## Мониторинг Nginx

### Статус и перезапуск

Проверка статуса:

```bash
sudo systemctl status nginx
```

Проверка конфигурации:

```bash
sudo nginx -t
```

Перезагрузка конфигурации:

```bash
sudo systemctl reload nginx
```

### Анализ логов Nginx

Топ IP адресов (посетители):

```bash
awk '{print $1}' ~/example.com/logs/access.log | sort | uniq -c | sort -nr | head -20
```

Топ запрашиваемых страниц:

```bash
awk '{print $7}' ~/example.com/logs/access.log | sort | uniq -c | sort -nr | head -20
```

Коды ответов (статистика):

```bash
awk '{print $9}' ~/example.com/logs/access.log | sort | uniq -c | sort -nr
```

Ошибки 404:

```bash
grep " 404 " ~/example.com/logs/access.log | awk '{print $7}' | sort | uniq -c | sort -nr | head -20
```

Ошибки 500:

```bash
grep " 500 " ~/example.com/logs/error.log | tail -20
```

Медленные запросы (> 1 секунды):

```bash
awk '$NF > 1.0 {print $7, $NF}' ~/example.com/logs/access.log | sort -k2 -nr | head -20
```

## Мониторинг PHP-FPM

### Статус PHP-FPM

```bash
sudo systemctl status php8.4-fpm
```

### Проверка процессов PHP

```bash
ps aux | grep php-fpm
```

### Логи PHP-FPM

```bash
sudo tail -f /var/log/php8.4-fpm.log
```

### PHP memory limit

Проверка текущего лимита:

```bash
php -i | grep memory_limit
```

## Мониторинг MySQL/MariaDB

### Статус службы

```bash
sudo systemctl status mysql
# или
sudo systemctl status mariadb
```

### Подключения к БД

```bash
mysqladmin -u root -p processlist
```

### Статус БД

```bash
mysqladmin -u root -p status
```

### Медленные запросы

Включите лог медленных запросов в `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

Перезапустите MySQL:

```bash
sudo systemctl restart mysql
```

Анализ:

```bash
sudo tail -f /var/log/mysql/slow.log
```

## Мониторинг WordPress

### Проверка здоровья сайта

```bash
wp core verify-checksums
```

### Проверка обновлений

```bash
wp core check-update
wp plugin list --update=available
wp theme list --update=available
```

### Статус кеша

Redis:

```bash
wp redis status
wp redis info
```

Nginx FastCGI cache:

```bash
find ~/example.com/cache -type f | wc -l
du -sh ~/example.com/cache
```

### Логи WordPress

Включите debug лог в `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Просмотр логов:

```bash
tail -f ~/example.com/public/wp-content/debug.log
```

## Ротация логов

### Настройка logrotate для сайта

Создайте конфигурацию:

```bash
sudo nano /etc/logrotate.d/example-com
```

Содержимое:

```text
/home/username/example.com/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 username username
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

Проверка:

```bash
sudo logrotate -d /etc/logrotate.d/example-com
```

Принудительный запуск:

```bash
sudo logrotate -f /etc/logrotate.d/example-com
```

## Обновление системы

### Проверка доступных обновлений

```bash
sudo apt update
apt list --upgradable
```

### Установка обновлений

```bash
sudo apt update
sudo apt dist-upgrade -y
sudo apt autoremove -y
```

### Обновление PHP

```bash
# Установка новой версии PHP
sudo apt install php8.4-fpm php8.4-common php8.4-mysql \
php8.4-xml php8.4-intl php8.4-curl php8.4-gd \
php8.4-imagick php8.4-cli php8.4-dev php8.4-imap \
php8.4-mbstring php8.4-opcache php8.4-redis \
php8.4-soap php8.4-zip -y

# Обновление конфигурации Nginx
sudo nano /etc/nginx/sites-available/example.com
# Измените: fastcgi_pass unix:/run/php/php8.4-fpm.sock;

# Проверка и перезагрузка
sudo nginx -t
sudo systemctl reload nginx
```

## Инструменты мониторинга

### netdata - мониторинг в реальном времени

Установка:

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Доступ: `http://your-server-ip:19999`

Настройка доступа только с вашего IP в firewall:

```bash
sudo ufw allow from YOUR_IP to any port 19999
```

### glances - консольный мониторинг

Установка:

```bash
sudo apt install glances -y
```

Запуск:

```bash
glances
```

Показывает: CPU, RAM, Disk, Network, Processes в одном окне.

## Алерты и уведомления

### Скрипт проверки здоровья

```bash
nano ~/monitor.sh
```

Содержимое:

```bash
#!/bin/bash

# Проверка использования диска
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "WARNING: Disk usage is ${DISK_USAGE}%"
fi

# Проверка использования памяти
MEM_USAGE=$(free | grep Mem | awk '{printf("%.0f"), $3/$2 * 100}')
if [ $MEM_USAGE -gt 90 ]; then
    echo "WARNING: Memory usage is ${MEM_USAGE}%"
fi

# Проверка Nginx
if ! systemctl is-active --quiet nginx; then
    echo "ERROR: Nginx is not running!"
fi

# Проверка PHP-FPM
if ! systemctl is-active --quiet php8.4-fpm; then
    echo "ERROR: PHP-FPM is not running!"
fi

# Проверка MySQL
if ! systemctl is-active --quiet mysql; then
    echo "ERROR: MySQL is not running!"
fi

# Проверка сайта
HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" https://example.com)
if [ $HTTP_CODE -ne 200 ]; then
    echo "ERROR: Site returned HTTP $HTTP_CODE"
fi
```

Сделайте исполняемым:

```bash
chmod +x ~/monitor.sh
```

Добавьте в cron (каждые 5 минут):

```cron
*/5 * * * * ~/monitor.sh || echo "Server alert!" | mail -s "Server Problem" admin@example.com
```

## Анализ производительности WordPress

### Query Monitor плагин

Установка:

```bash
wp plugin install query-monitor --activate
```

Показывает:
- SQL запросы и время выполнения
- PHP ошибки и warnings
- HTTP API запросы
- Использование хуков

### Профилирование через WP-CLI

```bash
wp profile stage --all --spotlight
```

## Очистка и оптимизация

### Очистка WordPress

```bash
# Удаление ревизий постов
wp post delete $(wp post list --post_type='revision' --format=ids) --force

# Очистка transients
wp transient delete --all

# Оптимизация БД
wp db optimize

# Очистка кеша
wp cache flush
```

### Очистка системы

```bash
# Удаление старых пакетов
sudo apt autoremove -y
sudo apt autoclean

# Очистка журналов
sudo journalctl --vacuum-time=7d
```

## Контрольный список обслуживания

### Ежедневно (автоматически)
- [ ] Бэкапы БД и файлов
- [ ] Проверка здоровья сервера

### Еженедельно
- [ ] Проверка логов на ошибки
- [ ] Анализ производительности
- [ ] Проверка доступных обновлений

### Ежемесячно
- [ ] Обновление системы и ПО
- [ ] Ротация и архивирование старых логов
- [ ] Проверка бэкапов на восстановление
- [ ] Анализ безопасности (SSL, headers)

## Полезные алиасы

Добавьте в `~/.bashrc`:

```bash
# Мониторинг
alias monitor='htop'
alias logs='tail -f ~/example.com/logs/error.log'
alias access='tail -f ~/example.com/logs/access.log'

# Обслуживание
alias update='sudo apt update && apt list --upgradable'
alias upgrade='sudo apt update && sudo apt dist-upgrade -y && sudo apt autoremove -y'

# WordPress
alias wpcheck='wp core check-update && wp plugin list --update=available'
alias wpcache='wp cache flush && sudo rm -rf ~/example.com/cache/*'
```

Применить:

```bash
source ~/.bashrc
```

## Заключение

Регулярный мониторинг и обслуживание обеспечивают:
- Высокую производительность
- Раннее обнаружение проблем
- Безопасность сервера и WordPress
- Стабильную работу сайта

Настройте автоматические проверки и уведомления для проактивного управления сервером.
