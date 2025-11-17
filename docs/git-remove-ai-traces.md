# Как полностью убрать следы AI-ассистента из Git-репозитория

Если вы использовали Claude, GitHub Copilot или другого AI-ассистента для работы с кодом, в истории Git остаются следы: коммиты с email `noreply@anthropic.com`, ветки с префиксом `claude/*`, и AI отображается в списке Contributors на GitHub.

Это руководство поможет полностью очистить репозиторий.

## Проблема

После работы с AI-ассистентом в репозитории могут быть:

- **Коммиты** с авторством AI (email вроде `noreply@anthropic.com`)
- **Ветки** с названиями `claude/*`, `copilot/*` и т.д.
- **Contributors** — AI отображается как соавтор проекта на GitHub
- **Pull Requests** созданные от имени AI

## Подготовка

Перед началом убедитесь, что:

1. У вас есть backup репозитория
2. Вы единственный разработчик (или предупредили команду)
3. Нет открытых PR, которые могут сломаться

```bash
# Создайте backup
cp -r .git .git-backup
```

## Шаг 1: Диагностика

Сначала выясните масштаб проблемы.

### Проверить email-адреса в коммитах

```bash
git log --all --format='%ae' | sort | uniq
```

**Типичный вывод:**
```
your@email.com
noreply@anthropic.com  # ← Это Claude
```

### Проверить все ветки

```bash
git branch -a
```

**Типичный вывод:**
```
  main
* claude/fix-issue-123
  claude/add-feature-456
  remotes/origin/claude/fix-issue-123
  remotes/origin/claude/add-feature-456
```

### Проверить коммиты AI

```bash
git log --all --author="noreply@anthropic.com" --oneline
```

## Шаг 2: Настройка вашего авторства

```bash
git config user.name "Ваше Имя"
git config user.email "ваш@email.com"
```

**Важно:** Используйте email, привязанный к вашему GitHub аккаунту.

## Шаг 3: Объединение изменений

Если в ветках AI есть нужные изменения, сначала объедините их:

```bash
# Переключитесь на main
git checkout main

# Объедините ветку AI (если нужны изменения)
git merge claude/feature-branch
```

## Шаг 4: Удаление веток AI

### Удаление локальных веток

```bash
# Удалить конкретную ветку
git branch -D claude/fix-issue-123

# Удалить все ветки claude/*
git branch | grep 'claude/' | xargs git branch -D
```

### Удаление удалённых веток

```bash
# Удалить конкретную
git push origin --delete claude/fix-issue-123

# Удалить все ветки claude/* на origin
git branch -r | grep 'origin/claude/' | sed 's/origin\///' | xargs -I {} git push origin --delete {}
```

## Шаг 5: Переписывание истории коммитов

**ВНИМАНИЕ:** Это необратимая операция! После неё все хеши коммитов изменятся.

### Вариант A: filter-branch (встроенный)

```bash
git filter-branch -f --env-filter '
GIT_AUTHOR_NAME="Ваше Имя"
GIT_AUTHOR_EMAIL="ваш@email.com"
GIT_COMMITTER_NAME="Ваше Имя"
GIT_COMMITTER_EMAIL="ваш@email.com"
' --tag-name-filter cat -- --all
```

**Что делает:**
- Переписывает ВСЕ коммиты во ВСЕХ ветках
- Меняет author и committer на ваши данные
- Сохраняет теги

### Вариант B: git-filter-repo (современный)

```bash
# Установка
pip install git-filter-repo

# Переписывание
git filter-repo \
  --name-callback 'return b"Ваше Имя"' \
  --email-callback 'return b"ваш@email.com"'
```

**Преимущества:**
- Быстрее filter-branch
- Безопаснее
- Не создаёт backup refs

### Вариант C: Только замена AI

Если хотите заменить только коммиты AI, а не все:

```bash
git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "noreply@anthropic.com" ]; then
    GIT_AUTHOR_NAME="Ваше Имя"
    GIT_AUTHOR_EMAIL="ваш@email.com"
fi
if [ "$GIT_COMMITTER_EMAIL" = "noreply@anthropic.com" ]; then
    GIT_COMMITTER_NAME="Ваше Имя"
    GIT_COMMITTER_EMAIL="ваш@email.com"
fi
' --tag-name-filter cat -- --all
```

## Шаг 6: Очистка backup refs

После filter-branch Git создаёт резервные копии:

```bash
# Удалить backup refs
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin

# Очистить reflog
git reflog expire --expire=now --all

# Сборка мусора
git gc --prune=now --aggressive
```

## Шаг 7: Force push

```bash
# Принудительно отправить все ветки
git push --force --all origin

# Принудительно отправить теги (если есть)
git push --force --tags origin
```

## Шаг 8: Проверка результата

### Проверить email в коммитах

```bash
git log --all --format='%ae' | sort | uniq
```

Должен быть только ваш email.

### Проверить отсутствие веток AI

```bash
git branch -a | grep claude
```

Должно быть пустым.

### Проверить GitHub Contributors

1. Откройте ваш репозиторий на GitHub
2. Посмотрите раздел Contributors
3. AI должен исчезнуть (может занять несколько часов из-за кэша)

## Шаг 9: Обновление локальных клонов

Если у вас есть другие локальные копии репозитория:

```bash
# В другой копии
cd другая-копия

# Жёсткое обновление
git fetch origin
git reset --hard origin/main
git clean -fd
```

## Автоматизация

Создайте скрипт для повторного использования:

```bash
#!/bin/bash
# remove-ai-traces.sh

NAME="Ваше Имя"
EMAIL="ваш@email.com"

echo "Настройка git config..."
git config user.name "$NAME"
git config user.email "$EMAIL"

echo "Удаление локальных веток claude/*..."
git branch | grep 'claude/' | xargs -r git branch -D

echo "Удаление удалённых веток claude/*..."
git branch -r | grep 'origin/claude/' | sed 's/origin\///' | xargs -I {} git push origin --delete {} 2>/dev/null

echo "Переписывание истории..."
git filter-branch -f --env-filter "
GIT_AUTHOR_NAME='$NAME'
GIT_AUTHOR_EMAIL='$EMAIL'
GIT_COMMITTER_NAME='$NAME'
GIT_COMMITTER_EMAIL='$EMAIL'
" --tag-name-filter cat -- --all

echo "Очистка backup refs..."
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin

echo "Сборка мусора..."
git gc --prune=now --aggressive

echo "Готово! Выполните: git push --force --all origin"
```

## Предотвращение в будущем

### Использование .mailmap

Создайте файл `.mailmap` в корне репозитория:

```
Ваше Имя <ваш@email.com> Claude <noreply@anthropic.com>
```

Это не изменит историю, но GitHub будет показывать коммиты AI как ваши.

### Pre-commit hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Проверка email автора
AUTHOR_EMAIL=$(git config user.email)

if [[ "$AUTHOR_EMAIL" == *"anthropic.com"* ]] || [[ "$AUTHOR_EMAIL" == *"github.com"* ]]; then
    echo "Ошибка: Используется email AI-ассистента!"
    echo "Установите свой email: git config user.email 'ваш@email.com'"
    exit 1
fi
```

### Настройка Claude Code

При использовании Claude Code можно настроить git config до начала работы:

```bash
git config user.name "wpadmin"
git config user.email "codeispoetry@ya.ru"
```

## Возможные проблемы

### Protected branch

```
error: remote: refusing to allow force push to protected branch
```

**Решение:** Временно снимите защиту с ветки в настройках GitHub.

### Large repository

Для больших репозиториев filter-branch может занять много времени.

**Решение:** Используйте git-filter-repo — он значительно быстрее.

### Сломанные PR

После переписывания истории все открытые PR станут невалидными.

**Решение:** Закройте PR до переписывания или пересоздайте их после.

## Этические соображения

Помните, что удаление следов AI из репозитория:

- **Законно** — это ваш код и ваш репозиторий
- **Этично** — если вы ревьюили и понимаете код
- **Спорно** — если выдаёте чужую работу за свою

AI — это инструмент, как IDE или линтер. Код, который вы проверили и за который несёте ответственность, можно считать вашим.

## Итого

Полное удаление следов AI требует:

1. ✅ Удаления веток claude/*
2. ✅ Переписывания email в коммитах
3. ✅ Force push на remote
4. ✅ Очистки GitHub кэша (автоматически)

После этих шагов вы будете единственным contributor в репозитории.

---

*Последнее обновление: ноябрь 2025*
