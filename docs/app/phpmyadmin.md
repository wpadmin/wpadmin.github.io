---
id: phpmyadmin
title: Установка phpMyAdmin в WSL Debian
description: Как установить phpMyAdmin для работы с Nginx в WSL Debian? Пошаговое руководство.
keywords:
  - phpMyAdmin
  - Nginx
  - Debian  
  - backend
image: /img/phpmyadmin-banner.png
hide_title: false
hide_table_of_contents: false
---


# phpMyAdmin для работы с Nginx в WSL Debian

Чтобы установить phpMyAdmin в WSL Debian и сделать его доступным на домене dev.local, нужно выполнить несколько шагов. Давайте рассмотрим весь процесс:

## 1. Установка необходимых компонентов

```bash
sudo apt update
sudo apt install nginx mysql-server php-fpm php-mysql php-mbstring php-zip php-gd php-json php-curl
```

## 2. Установка phpMyAdmin

```bash
sudo apt install phpmyadmin
```

При установке:

На вопрос о веб-сервере, не выбирайте ничего (так как Apache не используется)
Выберите "Да" на вопрос о настройке базы данных для phpMyAdmin
Введите пароль для пользователя phpMyAdmin


## 3. Настройка Nginx для phpMyAdmin

```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/
```


## 4. Создание конфигурации Nginx для dev.local
Создайте файл конфигурации для вашего домена:

```bash
sudo nano /etc/nginx/sites-available/dev.local
```

Добавьте в файл следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name dev.local;
    
    root /var/www/html;
    index index.php index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /phpmyadmin {
        index index.php;
        
        location ~ ^/phpmyadmin/(.+\.php)$ {
            try_files $uri =404;
            root /var/www/html;
            fastcgi_pass unix:/var/run/php/php-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }
        
        location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt))$ {
            root /var/www/html;
        }
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
    }
    
    location ~ /\.ht {
        deny all;
    }
}
```

Обратите внимание: Проверьте правильное название сокета PHP-FPM. Оно может быть /var/run/php/php7.4-fpm.sock или другим в зависимости от версии PHP. Проверьте вашу версию PHP:

```bash
php -v
```

И соответственно замените путь к сокету в конфигурации.

## 5. Активация сайта и перезапуск Nginx

```bash
sudo ln -s /etc/nginx/sites-available/dev.local /etc/nginx/sites-enabled/
sudo nginx -t # проверка синтаксиса конфигурации
sudo systemctl restart nginx
```


## 6. Настройка домена dev.local в Windows

```text
127.0.0.1 dev.local
```


## 7. Настройка порт-форвардинга в WSL

Чтобы соединить порт 80 в WSL с портом 80 в Windows, выполните в PowerShell с правами администратора:

```powershell
netsh interface portproxy add v4tov4 listenaddress=127.0.0.1 listenport=80 connectaddress=$(wsl hostname -I) connectport=80
```


## 8. Проверка доступа

Теперь вы должны иметь доступ к phpMyAdmin по адресу http://dev.local/phpmyadmin в браузере Windows.
Если возникнут проблемы с доступом, проверьте:

Запущены ли службы Nginx и MySQL (sudo systemctl status nginx и sudo systemctl status mysql)
Правильность настройки порт-форвардинга
Файл hosts в Windows
Логи ошибок Nginx: sudo tail -f /var/log/nginx/error.log

Также убедитесь, что вы используете правильный путь к сокету PHP-FPM в конфигурации Nginx.