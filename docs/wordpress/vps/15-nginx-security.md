---
title: Усиление безопасности Nginx и SSH для WordPress
description: Настройка безопасности Nginx - SSL hardening, security headers, защита от XSS и clickjacking, усиление SSH
keywords: [nginx security debian, ssl hardening nginx, security headers nginx, ssh hardening debian, wordpress security nginx]
---

# Усиление безопасности Nginx и SSH

Настройка дополнительной безопасности Nginx и SSH для защиты WordPress сайта.

## Усиление безопасности SSH

### Обновление SSH ключей

Удалите старые слабые ключи:

```bash
sudo rm /etc/ssh/ssh_host_*
```

Создайте новые надежные ключи:

```bash
sudo ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -N ""
sudo ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N ""
```

### Удаление слабых Diffie-Hellman ключей

```bash
sudo awk '$5 >= 3071' /etc/ssh/moduli | sudo tee /etc/ssh/moduli.safe > /dev/null
sudo mv /etc/ssh/moduli.safe /etc/ssh/moduli
```

### Усиление SSH конфигурации

Создайте файл с усиленными настройками:

```bash
sudo nano /etc/ssh/sshd_config.d/ssh_hardening.conf
```

Содержимое:

```text
# Современные алгоритмы обмена ключами
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512,diffie-hellman-group-exchange-sha256

# Современные шифры
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr

# Современные MAC алгоритмы
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,umac-128-etm@openssh.com

# Алгоритмы для SSH ключей
HostKeyAlgorithms ssh-ed25519,ssh-ed25519-cert-v01@openssh.com,sk-ssh-ed25519@openssh.com,sk-ssh-ed25519-cert-v01@openssh.com,rsa-sha2-256,rsa-sha2-512,rsa-sha2-256-cert-v01@openssh.com,rsa-sha2-512-cert-v01@openssh.com
```

Перезапустите SSH:

```bash
sudo systemctl restart ssh.service
```

Проверьте подключение в новой сессии **не закрывая текущую**!

## SSL/TLS усиление в Nginx

Откройте главную конфигурацию:

```bash
sudo nano /etc/nginx/nginx.conf
```

### Настройка современных TLS протоколов

Найдите секцию `http {}` и добавьте/измените SSL настройки:

```nginx
##
# SSL Settings
##

# Только современные протоколы
ssl_protocols TLSv1.2 TLSv1.3;

# Современные шифры
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305;

# Предпочитать шифры сервера
ssl_prefer_server_ciphers off;

# Diffie-Hellman параметры
ssl_dhparam /etc/nginx/dhparam;

# Кеширование SSL сессий
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;
```

### Скачивание Diffie-Hellman параметров

```bash
sudo curl -o /etc/nginx/dhparam https://ssl-config.mozilla.org/ffdhe4096.txt
```

## Security Headers

Добавьте защитные заголовки в секцию `http {}`:

```nginx
##
# Security Headers
##

# HSTS - принудительный HTTPS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Защита от clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Защита от MIME-sniffing
add_header X-Content-Type-Options "nosniff" always;

# XSS Protection (устаревший, но для совместимости)
add_header X-XSS-Protection "0" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;

# Permissions Policy
add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
```

## Дополнительные настройки безопасности

### Скрытие версии Nginx

Уже настроено в базовой конфигурации:

```nginx
server_tokens off;
```

### Ограничение размера запросов

```nginx
# Максимальный размер тела запроса
client_max_body_size 64m;

# Буфер для заголовков
large_client_header_buffers 4 16k;
```

### Таймауты

```nginx
# Таймауты для защиты от медленных атак
client_body_timeout 12;
client_header_timeout 12;
send_timeout 10;
keepalive_timeout 15;
```

## Защита WordPress админки

В конфигурации вашего сайта добавьте ограничение по IP для wp-admin:

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Добавьте в server block:

```nginx
# Ограничение доступа к админке по IP
location /wp-admin {
    # Разрешить ваш IP
    allow 203.0.113.10;
    # Запретить все остальные
    deny all;

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        include fastcgi.conf;
    }
}

# wp-login.php также ограничить
location = /wp-login.php {
    allow 203.0.113.10;
    deny all;

    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.4-fpm.sock;
}
```

## Защита важных файлов WordPress

Запретите доступ к конфигурационным файлам:

```nginx
# Защита wp-config.php
location = /wp-config.php {
    deny all;
}

# Защита readme и license
location ~* /(readme|license)\.(html|txt)$ {
    deny all;
}

# Запрет выполнения PHP в uploads
location ~* ^/wp-content/uploads/.*\.php$ {
    deny all;
}

# Защита .htaccess и .git
location ~ /\.(ht|git|svn) {
    deny all;
}
```

## Rate Limiting (ограничение скорости)

Защита от брутфорса wp-login.php:

В секции `http {}` добавьте:

```nginx
# Зона для rate limiting
limit_req_zone $binary_remote_addr zone=wplogin:10m rate=2r/s;
```

В конфигурации сайта:

```nginx
location = /wp-login.php {
    limit_req zone=wplogin burst=5 nodelay;

    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.4-fpm.sock;
}
```

## Проверка и применение

Проверьте конфигурацию:

```bash
sudo nginx -t
```

Перезапустите Nginx:

```bash
sudo systemctl restart nginx.service
```

## Тестирование безопасности

### SSL Labs Test

Проверьте SSL конфигурацию:

https://www.ssllabs.com/ssltest/

Должна быть оценка **A** или **A+**

### Security Headers

Проверьте заголовки безопасности:

https://securityheaders.com/

### Проверка через curl

```bash
curl -I https://example.com
```

Должны присутствовать заголовки:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Content-Security-Policy`

## Автоматические обновления безопасности

Проверьте, что unattended-upgrades настроен (из первой статьи):

```bash
sudo systemctl status unattended-upgrades
```

Проверьте конфигурацию:

```bash
cat /etc/apt/apt.conf.d/50unattended-upgrades | grep security
```

## Мониторинг безопасности

### Проверка логов на подозрительную активность

```bash
# Попытки доступа к wp-login.php
sudo grep "wp-login.php" /var/log/nginx/access.log | tail -20

# 403 ошибки (запрещенный доступ)
sudo grep " 403 " /var/log/nginx/access.log | tail -20

# 404 ошибки (поиск уязвимостей)
sudo grep " 404 " /var/log/nginx/access.log | tail -20
```

### Мониторинг fail2ban

```bash
sudo fail2ban-client status sshd
```

## Дополнительные плагины WordPress

Установите плагины безопасности:

```bash
wp plugin install wordfence --activate
# или
wp plugin install ithemes-security --activate
```

## Firewall правила

Проверьте UFW статус:

```bash
sudo ufw status verbose
```

Должны быть открыты только:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)

## Резюме настроек

✅ SSH усилен современными алгоритмами
✅ TLS 1.2 и 1.3 с современными шифрами
✅ Security headers настроены
✅ WordPress админка защищена
✅ Rate limiting для wp-login.php
✅ Важные файлы защищены от доступа
✅ Автообновления безопасности включены

## Следующий шаг

Безопасность усилена. Далее рассмотрим миграцию WordPress между серверами.
