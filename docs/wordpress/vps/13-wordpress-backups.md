---
title: Автоматические бэкапы WordPress на Debian 12
description: Настройка автоматических локальных бэкапов WordPress через bash скрипты и cron - база данных и файлы
keywords: [wordpress backup debian, автоматический бэкап wordpress, backup script bash, резервное копирование wordpress, wp-cli backup]
---

# Автоматические бэкапы WordPress

Настройка автоматических локальных бэкапов WordPress на сервере - база данных и файлы сайта.

## Структура бэкапов

Создайте директорию для хранения бэкапов:

```bash
mkdir -p ~/backups/{database,files,logs}
chmod 700 ~/backups
```

Структура:
- `database/` - дампы базы данных
- `files/` - архивы файлов WordPress
- `logs/` - логи выполнения скриптов

## Скрипт бэкапа базы данных

Создайте скрипт для бэкапа БД:

```bash
nano ~/backups/backup-database.sh
```

Содержимое скрипта:

```bash
#!/bin/bash

# Конфигурация
SITE_NAME="example.com"
SITE_PATH="/home/username/example.com/public"
BACKUP_DIR="/home/username/backups/database"
LOG_FILE="/home/username/backups/logs/database-backup.log"
RETENTION_DAYS=7

# Дата для имени файла
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${SITE_NAME}_${DATE}.sql.gz"

# Функция логирования
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Начало бэкапа
log "Starting database backup for $SITE_NAME"

# Создание дампа через WP-CLI
cd "$SITE_PATH" || { log "ERROR: Cannot access site directory"; exit 1; }

if wp db export - | gzip > "$BACKUP_FILE"; then
    FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "SUCCESS: Database backup created: ${BACKUP_FILE} (${FILESIZE})"
else
    log "ERROR: Database backup failed"
    exit 1
fi

# Удаление старых бэкапов
log "Removing backups older than ${RETENTION_DAYS} days"
find "$BACKUP_DIR" -name "${SITE_NAME}_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# Подсчет бэкапов
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "${SITE_NAME}_*.sql.gz" | wc -l)
log "Total backups: ${BACKUP_COUNT}"

log "Database backup completed successfully"
```

Сделайте скрипт исполняемым:

```bash
chmod +x ~/backups/backup-database.sh
```

## Скрипт бэкапа файлов

Создайте скрипт для бэкапа файлов WordPress:

```bash
nano ~/backups/backup-files.sh
```

Содержимое:

```bash
#!/bin/bash

# Конфигурация
SITE_NAME="example.com"
SITE_PATH="/home/username/example.com/public"
BACKUP_DIR="/home/username/backups/files"
LOG_FILE="/home/username/backups/logs/files-backup.log"
RETENTION_DAYS=7

# Дата для имени файла
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${SITE_NAME}_${DATE}.tar.gz"

# Функция логирования
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Начало бэкапа
log "Starting files backup for $SITE_NAME"

# Создание архива (исключая кеш и временные файлы)
if tar -czf "$BACKUP_FILE" \
    --exclude='wp-content/cache' \
    --exclude='wp-content/uploads/cache' \
    --exclude='wp-content/w3tc-config' \
    --exclude='wp-content/backup*' \
    --exclude='*.log' \
    -C "$(dirname "$SITE_PATH")" \
    "$(basename "$SITE_PATH")"; then

    FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "SUCCESS: Files backup created: ${BACKUP_FILE} (${FILESIZE})"
else
    log "ERROR: Files backup failed"
    exit 1
fi

# Удаление старых бэкапов
log "Removing backups older than ${RETENTION_DAYS} days"
find "$BACKUP_DIR" -name "${SITE_NAME}_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# Подсчет бэкапов
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "${SITE_NAME}_*.tar.gz" | wc -l)
log "Total backups: ${BACKUP_COUNT}"

log "Files backup completed successfully"
```

Сделайте исполняемым:

```bash
chmod +x ~/backups/backup-files.sh
```

## Полный скрипт бэкапа

Скрипт для одновременного бэкапа БД и файлов:

```bash
nano ~/backups/backup-all.sh
```

Содержимое:

```bash
#!/bin/bash

# Конфигурация
SITE_NAME="example.com"
SITE_PATH="/home/username/example.com/public"
BACKUP_DIR="/home/username/backups"
LOG_FILE="${BACKUP_DIR}/logs/full-backup.log"
RETENTION_DAYS=7

DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP="${BACKUP_DIR}/database/${SITE_NAME}_${DATE}.sql.gz"
FILES_BACKUP="${BACKUP_DIR}/files/${SITE_NAME}_${DATE}.tar.gz"

# Функция логирования
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "========================================="
log "Starting full backup for $SITE_NAME"
log "========================================="

# Бэкап базы данных
log "Step 1: Backing up database..."
cd "$SITE_PATH" || { log "ERROR: Cannot access site directory"; exit 1; }

if wp db export - | gzip > "$DB_BACKUP"; then
    DB_SIZE=$(du -h "$DB_BACKUP" | cut -f1)
    log "SUCCESS: Database backup created (${DB_SIZE})"
else
    log "ERROR: Database backup failed"
    exit 1
fi

# Бэкап файлов
log "Step 2: Backing up files..."
if tar -czf "$FILES_BACKUP" \
    --exclude='wp-content/cache' \
    --exclude='wp-content/uploads/cache' \
    --exclude='*.log' \
    -C "$(dirname "$SITE_PATH")" \
    "$(basename "$SITE_PATH")"; then

    FILES_SIZE=$(du -h "$FILES_BACKUP" | cut -f1)
    log "SUCCESS: Files backup created (${FILES_SIZE})"
else
    log "ERROR: Files backup failed"
    exit 1
fi

# Очистка старых бэкапов
log "Step 3: Cleaning old backups..."
find "${BACKUP_DIR}/database" -name "${SITE_NAME}_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}/files" -name "${SITE_NAME}_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# Статистика
DB_COUNT=$(find "${BACKUP_DIR}/database" -name "${SITE_NAME}_*.sql.gz" | wc -l)
FILES_COUNT=$(find "${BACKUP_DIR}/files" -name "${SITE_NAME}_*.tar.gz" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

log "========================================="
log "Backup completed successfully"
log "Database backups: ${DB_COUNT}"
log "Files backups: ${FILES_COUNT}"
log "Total backup size: ${TOTAL_SIZE}"
log "========================================="
```

Сделайте исполняемым:

```bash
chmod +x ~/backups/backup-all.sh
```

## Тестирование скриптов

Запустите скрипты вручную для проверки:

```bash
# Тест бэкапа БД
~/backups/backup-database.sh

# Тест бэкапа файлов
~/backups/backup-files.sh

# Тест полного бэкапа
~/backups/backup-all.sh
```

Проверьте логи:

```bash
cat ~/backups/logs/full-backup.log
```

Проверьте созданные бэкапы:

```bash
ls -lh ~/backups/database/
ls -lh ~/backups/files/
```

## Автоматизация через cron

Откройте crontab:

```bash
crontab -e
```

Добавьте задачи:

```cron
# Полный бэкап каждый день в 2:00 ночи
0 2 * * * /home/username/backups/backup-all.sh

# Или раздельно:
# База данных каждые 6 часов
0 */6 * * * /home/username/backups/backup-database.sh

# Файлы раз в день в 3:00
0 3 * * * /home/username/backups/backup-files.sh
```

## Восстановление из бэкапа

### Восстановление базы данных

```bash
# Список доступных бэкапов
ls -lh ~/backups/database/

# Восстановление
cd ~/example.com/public
gunzip < ~/backups/database/example.com_20250124_020000.sql.gz | wp db import -
```

### Восстановление файлов

```bash
# Список бэкапов
ls -lh ~/backups/files/

# Распаковка (ВНИМАНИЕ: перезапишет файлы!)
tar -xzf ~/backups/files/example.com_20250124_020000.tar.gz -C /home/username/
```

## Мониторинг бэкапов

Скрипт проверки актуальности бэкапов:

```bash
nano ~/backups/check-backups.sh
```

Содержимое:

```bash
#!/bin/bash

SITE_NAME="example.com"
BACKUP_DIR="/home/username/backups"
MAX_AGE_HOURS=25

# Проверка последнего бэкапа БД
LAST_DB=$(find "${BACKUP_DIR}/database" -name "${SITE_NAME}_*.sql.gz" -mmin -$((MAX_AGE_HOURS * 60)) | wc -l)

# Проверка последнего бэкапа файлов
LAST_FILES=$(find "${BACKUP_DIR}/files" -name "${SITE_NAME}_*.tar.gz" -mmin -$((MAX_AGE_HOURS * 60)) | wc -l)

if [ "$LAST_DB" -eq 0 ] || [ "$LAST_FILES" -eq 0 ]; then
    echo "WARNING: No recent backups found!"
    exit 1
else
    echo "OK: Recent backups found"
    exit 0
fi
```

Добавьте в cron для уведомлений:

```cron
0 12 * * * /home/username/backups/check-backups.sh || echo "Backup check failed for example.com" | mail -s "Backup Alert" admin@example.com
```

## Скрипт для нескольких сайтов

Универсальный скрипт для всех сайтов:

```bash
nano ~/backups/backup-all-sites.sh
```

Содержимое:

```bash
#!/bin/bash

# Массив сайтов
declare -a SITES=(
    "site1.com:/home/username/site1.com/public"
    "site2.com:/home/username/site2.com/public"
    "site3.com:/home/username/site3.com/public"
)

BACKUP_DIR="/home/username/backups"
DATE=$(date +%Y%m%d_%H%M%S)

for site_info in "${SITES[@]}"; do
    IFS=':' read -r SITE_NAME SITE_PATH <<< "$site_info"

    echo "Backing up $SITE_NAME..."

    # Бэкап БД
    cd "$SITE_PATH"
    wp db export - | gzip > "${BACKUP_DIR}/database/${SITE_NAME}_${DATE}.sql.gz"

    # Бэкап файлов
    tar -czf "${BACKUP_DIR}/files/${SITE_NAME}_${DATE}.tar.gz" \
        --exclude='wp-content/cache' \
        -C "$(dirname "$SITE_PATH")" "$(basename "$SITE_PATH")"

    echo "✓ $SITE_NAME backed up"
done

echo "All sites backed up successfully"
```

## Оптимизация хранения

### Инкрементальные бэкапы файлов

Используйте `rsync` для инкрементальных бэкапов:

```bash
rsync -avz --delete \
    --exclude='wp-content/cache' \
    ~/example.com/public/ \
    ~/backups/incremental/example.com/
```

### Сжатие старых бэкапов

Пересжатие старых бэкапов с максимальным сжатием:

```bash
find ~/backups/files -name "*.tar.gz" -mtime +7 -exec gzip -9 {} \;
```

## Проверка целостности бэкапов

Скрипт проверки архивов:

```bash
#!/bin/bash

for backup in ~/backups/database/*.gz; do
    if gunzip -t "$backup" 2>/dev/null; then
        echo "✓ $backup - OK"
    else
        echo "✗ $backup - CORRUPTED"
    fi
done

for backup in ~/backups/files/*.tar.gz; do
    if tar -tzf "$backup" >/dev/null 2>&1; then
        echo "✓ $backup - OK"
    else
        echo "✗ $backup - CORRUPTED"
    fi
done
```

## Следующий шаг

Автоматические бэкапы настроены. Далее настроим отправку email через SMTP для уведомлений WordPress.
