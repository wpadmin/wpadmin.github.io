---
title: Установка WP-CLI на Debian 12
description: Установка WP-CLI - инструмента командной строки для управления WordPress на сервере
keywords: [wp-cli debian 12, установка wp-cli, wordpress command line, wp-cli install debian]
---

# Установка WP-CLI на Debian 12

Установка WP-CLI - официального инструмента командной строки для управления WordPress.

## Что такое WP-CLI

WP-CLI позволяет управлять WordPress без браузера: устанавливать, обновлять, настраивать плагины и темы через терминал.

## Установка WP-CLI

Скачайте последнюю версию WP-CLI:

```bash
cd ~/
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
```

Проверьте, что файл работает:

```bash
php wp-cli.phar --info
```

Должна появиться информация о версии PHP, MySQL и WP-CLI.

Сделайте файл исполняемым:

```bash
chmod +x wp-cli.phar
```

Переместите в системную директорию:

```bash
sudo mv wp-cli.phar /usr/local/bin/wp
```

## Проверка установки

Проверьте работу команды `wp`:

```bash
wp --info
```

Вывод должен показать версию WP-CLI и параметры PHP.

Проверьте версию:

```bash
wp cli version
```

## Автодополнение команд (опционально)

Установите автодополнение для bash:

```bash
cd ~/
curl -O https://raw.githubusercontent.com/wp-cli/wp-cli/v2.10.0/utils/wp-completion.bash
```

Добавьте в `.bashrc`:

```bash
echo "source ~/wp-completion.bash" >> ~/.bashrc
source ~/.bashrc
```

Теперь можно использовать Tab для автодополнения команд WP-CLI.

## Основные команды WP-CLI

Несколько полезных команд для проверки:

```bash
# Справка по командам
wp help

# Список доступных команд
wp cli cmd-dump

# Проверка обновлений WP-CLI
wp cli check-update
```

## Следующий шаг

WP-CLI установлен. Далее настроим Nginx server block и получим SSL сертификат для сайта.
