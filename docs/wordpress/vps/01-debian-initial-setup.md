---
title: Настройка и защита VPS сервера на Debian 12
description: Полное руководство по первичной настройке VPS с Debian 12 для WordPress - создание пользователя, SSH ключи, firewall, fail2ban
keywords: [debian 12 vps, настройка debian сервера, debian ssh ключи, ufw firewall debian, fail2ban debian, wordpress vps debian]
---

# Настройка и защита VPS сервера на Debian 12

Полная настройка и защита VPS сервера на Debian 12 для хостинга WordPress.

## Что потребуется

- Домен или поддомен
- Доступ к DNS для настройки A-записи
- VPS с Debian 12

## Первое подключение

Подключитесь к серверу через SSH:

```bash
ssh root@your_server_ip
```

### Настройка hostname

Задайте серверу имя вашего домена:

```bash
hostnamectl hostname example.com
```

Добавьте A-запись в DNS, указывающую на IP сервера. После обновления DNS можно подключаться по домену:

```bash
ssh root@example.com
```

### Настройка timezone

Установите временную зону (рекомендуется UTC):

```bash
timedatectl set-timezone UTC
```

Посмотреть доступные зоны:

```bash
timedatectl list-timezones
```

Проверить текущую настройку:

```bash
timedatectl
```

## Обновление системы

Обновите все пакеты:

```bash
apt update
apt dist-upgrade
apt autoremove
reboot now
```

После перезагрузки подключитесь снова.

### Автоматические обновления безопасности

Установите пакет для автообновлений:

```bash
apt install unattended-upgrades
dpkg-reconfigure unattended-upgrades
```

Выберите "Yes" для включения.

Настройте параметры (опционально):

```bash
nano /etc/apt/apt.conf.d/50unattended-upgrades
```

Убедитесь, что включены обновления безопасности:

```ini
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
```

## Создание пользователя

Создайте нового пользователя (замените `username` на свое имя):

```bash
adduser username
```

Добавьте пользователя в группу sudo:

```bash
usermod -aG sudo username
```

Выйдите и войдите под новым пользователем:

```bash
logout
ssh username@example.com
```

## Настройка SSH ключей

### На локальной машине

Создайте SSH ключ:

```bash
ssh-keygen -t ed25519 -C "username@laptop"
```

Скопируйте публичный ключ в буфер обмена:

```bash
# macOS/Linux
cat ~/.ssh/id_ed25519.pub
```

### На сервере

Создайте директорию для ключей:

```bash
mkdir ~/.ssh
chmod 700 ~/.ssh
```

Создайте файл для авторизованных ключей:

```bash
nano ~/.ssh/authorized_keys
```

Вставьте ваш публичный ключ, сохраните и выйдите.

Установите права доступа:

```bash
chmod 600 ~/.ssh/authorized_keys
```

## Отключение root доступа

Откройте конфигурацию SSH:

```bash
sudo nano /etc/ssh/sshd_config
```

Найдите и измените:

```text
PermitRootLogin no
```

Перезапустите SSH:

```bash
sudo systemctl restart ssh.service
```

## Отключение аутентификации по паролю

В том же файле `/etc/ssh/sshd_config` найдите и измените:

```text
PasswordAuthentication no
```

Перезапустите SSH:

```bash
sudo systemctl restart ssh.service
```

**Важно:** Проверьте, что можете подключиться по ключу **до** выхода из текущей сессии!

Если пароль всё ещё запрашивается, проверьте файлы в `/etc/ssh/sshd_config.d/` - там могут быть конфликтующие настройки.

## Настройка Firewall (UFW)

Установите UFW:

```bash
sudo apt install ufw
```

Разрешите необходимые порты:

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

Проверьте правила:

```bash
sudo ufw show added
```

Включите firewall:

```bash
sudo ufw enable
```

Проверьте статус:

```bash
sudo ufw status verbose
```

Firewall блокирует весь входящий трафик, кроме SSH (22), HTTP (80) и HTTPS (443).

## Установка Fail2ban

Установите Fail2ban для защиты от брутфорса:

```bash
sudo apt install fail2ban
```

Включите и запустите службу:

```bash
sudo systemctl enable --now fail2ban.service
```

Проверьте статус:

```bash
sudo systemctl status fail2ban.service
```

### Поддержка IPv6 (опционально)

Создайте конфигурационный файл:

```bash
sudo nano /etc/fail2ban/fail2ban.local
```

Добавьте:

```ini
[DEFAULT]
allowipv6 = auto
```

Перезапустите службу:

```bash
sudo systemctl restart fail2ban.service
```

## Готово

Базовая настройка и защита сервера завершена. Теперь можно переходить к установке стека для WordPress: Nginx, PHP 8.4, MySQL и WP-CLI.
