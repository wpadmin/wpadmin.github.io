---
title: Установка SSL сертификата Let's Encrypt на Debian 12
description: Получение бесплатного SSL сертификата Let's Encrypt с помощью Certbot для WordPress сайта
keywords: [lets encrypt debian 12, certbot debian, ssl сертификат wordpress, https wordpress, certbot nginx]
---

# Установка SSL сертификата Let's Encrypt

Получение бесплатного SSL сертификата для WordPress сайта с помощью Let's Encrypt и Certbot.

## Предварительные требования

- Домен с настроенной A-записью на IP сервера
- Nginx установлен и работает
- Порты 80 и 443 открыты в firewall

## Создание default SSL сертификата

Сначала создайте самоподписанный сертификат для default server block:

```bash
sudo mkdir -p /etc/nginx/ssl/default
```

Создайте сертификат:

```bash
sudo openssl req -x509 -newkey rsa:4096 -days 36500 \
-keyout /etc/nginx/ssl/default/privkey.pem \
-out /etc/nginx/ssl/default/cert.pem \
-subj "/CN=default" -nodes
```

Обновите default server block в `/etc/nginx/nginx.conf`:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    server_name _;

    ssl_certificate /etc/nginx/ssl/default/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/default/privkey.pem;

    return 444;
}
```

Проверьте и перезапустите Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx.service
```

## Установка Certbot

Установите Certbot и плагин для Nginx:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Проверьте версию:

```bash
certbot --version
```

## Получение SSL сертификата

Получите сертификат для вашего домена (замените на свой):

```bash
sudo certbot certonly --nginx -d example.com -d www.example.com
```

Certbot спросит:
1. **Email** - введите для уведомлений о продлении
2. **Terms of Service** - `Y` (согласиться)
3. **Share email** - `N` (необязательно)

После успешного получения сертификаты будут в:
- `/etc/letsencrypt/live/example.com/fullchain.pem`
- `/etc/letsencrypt/live/example.com/privkey.pem`

## Автоматическое продление

Проверьте, что автопродление настроено:

```bash
sudo systemctl status certbot.timer
```

Проверьте работу продления (тест без реального продления):

```bash
sudo certbot renew --dry-run
```

Если всё OK - сертификаты будут продлеваться автоматически.

## Проверка сертификатов

Посмотрите список установленных сертификатов:

```bash
sudo certbot certificates
```

Проверьте дату истечения:

```bash
sudo certbot certificates | grep "Expiry Date"
```

## Добавление поддомена к существующему сертификату

Если нужно добавить поддомен к существующему сертификату:

```bash
sudo certbot certonly --nginx --cert-name example.com \
-d example.com -d www.example.com -d blog.example.com
```

## Отзыв сертификата (если нужно)

Если нужно отозвать сертификат:

```bash
sudo certbot revoke --cert-path /etc/letsencrypt/live/example.com/cert.pem
```

## Устранение проблем

### Ошибка: Port 80 already in use

Убедитесь, что Nginx запущен и доступен на порту 80:

```bash
sudo systemctl status nginx.service
```

### Ошибка: DNS не настроен

Проверьте A-запись домена:

```bash
dig +short example.com
```

Должен вернуться IP вашего сервера.

### Проверка firewall

Убедитесь, что порты открыты:

```bash
sudo ufw status verbose
```

## Следующий шаг

SSL сертификат получен. Далее создадим Nginx server block для WordPress сайта с HTTPS.
