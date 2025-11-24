---
title: Настройка SMTP для WordPress на Debian 12
description: Настройка отправки email через SMTP в WordPress - Gmail, Yandex, Mailgun, SendGrid
keywords: [wordpress smtp debian, настройка email wordpress, wp mail smtp, wordpress gmail smtp, отправка email wordpress]
---

# Настройка SMTP для WordPress

Настройка надежной отправки email из WordPress через внешние SMTP сервисы вместо встроенной функции `mail()`.

## Проблема встроенной отправки mail()

Стандартная функция PHP `mail()` имеет проблемы:
- Письма попадают в спам
- Не работает без настроенного почтового сервера
- Нет очереди и повторных попыток
- Сложная отладка ошибок

## Решение: SMTP через плагин

Используем внешний SMTP сервис через плагин WordPress.

## Выбор SMTP провайдера

### Бесплатные варианты

**Gmail / Google Workspace**
- Лимит: 500 писем/день
- Подходит для: малых сайтов, уведомлений

**Yandex Mail**
- Лимит: 500 писем/день
- Подходит для: русскоязычных сайтов

### Transactional Email сервисы

**SendGrid**
- Бесплатно: 100 писем/день
- Платно: от $15/мес (40K писем)

**Mailgun**
- Бесплатно: 5000 писем/мес первые 3 месяца
- Платно: от $15/мес

**Amazon SES**
- $0.10 за 1000 писем
- Требует верификации домена

## Установка WP Mail SMTP

### Через WP-CLI

```bash
cd ~/example.com/public
wp plugin install wp-mail-smtp --activate
```

### Через админку

1. **Плагины → Добавить новый**
2. Найдите "WP Mail SMTP by WPForms"
3. **Установить** → **Активировать**

## Настройка Gmail/Google Workspace

### Создание App Password

1. Войдите в Google Account: https://myaccount.google.com/
2. **Security → 2-Step Verification** (включите если не включено)
3. **Security → App passwords**
4. Создайте пароль для "Mail" → "Other (Custom name)"
5. Скопируйте сгенерированный пароль

### Настройка плагина

1. **Настройки → WP Mail SMTP → General**

**From Email**: `noreply@example.com` или ваш Gmail

**From Name**: Название сайта

**Mailer**: **Google / Gmail**

**Client ID**: (оставьте пустым для App Password метода)

**Client Secret**: (оставьте пустым)

2. **Перейдите на вкладку Other SMTP**

**SMTP Host**: `smtp.gmail.com`

**Encryption**: SSL

**SMTP Port**: 465

**SMTP Username**: ваш Gmail адрес

**SMTP Password**: App Password из предыдущего шага

**Save Settings**

## Настройка Yandex

**SMTP Host**: `smtp.yandex.ru`

**Encryption**: SSL

**SMTP Port**: 465

**SMTP Username**: ваш Yandex email

**SMTP Password**: пароль от Yandex (или App Password)

## Настройка SendGrid

### Получение API ключа

1. Зарегистрируйтесь на https://sendgrid.com/
2. **Settings → API Keys → Create API Key**
3. Тип: **Full Access** или **Restricted Access (Mail Send)**
4. Скопируйте ключ

### Настройка WP Mail SMTP

**Mailer**: **SendGrid**

**API Key**: ваш SendGrid API ключ

**Domain**: `example.com`

**Save Settings**

## Настройка Mailgun

### Получение данных

1. Зарегистрируйтесь на https://www.mailgun.com/
2. **Sending → Domains → Add New Domain**
3. Настройте DNS записи для домена
4. Скопируйте **SMTP Credentials**

### Настройка плагина

**Mailer**: **Mailgun**

**API Key**: Private API key из Mailgun

**Domain Name**: ваш домен

**Region**: EU или US

**Save Settings**

## Настройка через wp-config.php

Для безопасности можно хранить настройки в `wp-config.php`:

```php
// SMTP Configuration
define('WPMS_ON', true);
define('WPMS_SMTP_HOST', 'smtp.gmail.com');
define('WPMS_SMTP_PORT', 465);
define('WPMS_SSL', 'ssl');
define('WPMS_SMTP_AUTH', true);
define('WPMS_SMTP_USER', 'your-email@gmail.com');
define('WPMS_SMTP_PASS', 'your-app-password');
define('WPMS_SMTP_AUTOTLS', true);
```

Добавьте перед `/* That's all, stop editing! */`

## Тестирование отправки

### Через админку

1. **Настройки → WP Mail SMTP → Email Test**
2. Введите email для получения
3. **Send Email**

Проверьте почту, должно прийти тестовое письмо.

### Через WP-CLI

```bash
wp eval "wp_mail('test@example.com', 'Test Subject', 'Test message');"
```

### Проверка логов

Включите логирование в плагине:

1. **WP Mail SMTP → Settings → Email Log**
2. Включите **Enable Email Logging**

Просмотр логов:

**WP Mail SMTP → Email Log**

## Отладка проблем

### Письма не отправляются

Проверьте логи плагина:

**WP Mail SMTP → Email Log**

Проверьте настройки через WP-CLI:

```bash
wp option get wp_mail_smtp
```

### Ошибка аутентификации

**Gmail**: Убедитесь что используется App Password, а не обычный пароль

**Yandex**: Проверьте что 2FA отключен или используется App Password

### Проверка SMTP подключения

Тест подключения к SMTP:

```bash
telnet smtp.gmail.com 465
```

Должно подключиться (нажмите Ctrl+] затем quit)

## Альтернативные плагины

### WP Offload SES (Amazon SES)

Для Amazon SES:

```bash
wp plugin install amazon-ses-wp-mail --activate
```

Настройка:
- **AWS Access Key ID**
- **AWS Secret Access Key**
- **AWS Region**

### Post SMTP (бесплатный)

```bash
wp plugin install post-smtp --activate
```

Поддерживает:
- Gmail OAuth
- SendGrid
- Mailgun
- SMTP

## Настройка очереди (опционально)

Для высоконагруженных сайтов настройте очередь:

1. Установите **WP Mail Queue**:

```bash
wp plugin install wp-mail-queue --activate
```

2. Настройте cron для обработки очереди:

```bash
wp cron event schedule process_mail_queue +5minutes
```

Письма будут отправляться партиями, не блокируя основной сайт.

## Мониторинг отправки

### Email Log

Плагин WP Mail SMTP ведет лог всех отправленных писем:

**WP Mail SMTP → Email Log**

Можно экспортировать CSV для анализа.

### Уведомления о сбоях

Настройте уведомление админу при ошибках:

```php
// В functions.php темы
add_action('wp_mail_failed', function($error) {
    error_log('Mail failed: ' . $error->get_error_message());
});
```

## Проверка репутации домена

После настройки SMTP проверьте репутацию:

**Mail Tester**: https://www.mail-tester.com/

Отправьте письмо на адрес с сайта, получите оценку SPF, DKIM, DMARC.

## Настройка SPF и DKIM

### SPF запись

Добавьте TXT запись в DNS:

```text
v=spf1 include:_spf.google.com ~all
```

Для SendGrid:

```text
v=spf1 include:sendgrid.net ~all
```

### DKIM

**Gmail**: автоматически

**SendGrid/Mailgun**: следуйте инструкциям провайдера для добавления DKIM записи в DNS

## Производительность

### Асинхронная отправка

Отправка email в фоне:

```php
// В functions.php
add_filter('wp_mail', function($args) {
    wp_schedule_single_event(time(), 'send_async_mail', [$args]);
    return false;
});

add_action('send_async_mail', function($args) {
    wp_mail($args['to'], $args['subject'], $args['message'], $args['headers']);
});
```

## Ограничения и лимиты

**Gmail**: 500 писем/день

**SendGrid Free**: 100 писем/день

**Mailgun**: 5000 писем/мес первые 3 месяца

Для сайтов с большим трафиком используйте платные тарифы или Amazon SES.

## Следующий шаг

Email через SMTP настроен. Далее настроим дополнительную безопасность Nginx, кеширование WooCommerce и автоматические обновления сервера.
