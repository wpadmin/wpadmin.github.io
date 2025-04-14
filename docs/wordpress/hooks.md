
---

## ✍ Пример содержимого для `hooks.md`:

```markdown
# Hooks в WordPress

Hooks в WordPress делятся на **Actions** и **Filters**. Actions используются для выполнения функций в определённые моменты, а Filters — для изменения данных.

## Пример кода

```php
add_filter('the_content', 'modify_content');

function modify_content($content) {
    return $content . "<p>Дополнительная информация.</p>";
}
