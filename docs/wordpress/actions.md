# Actions в WordPress

В WordPress, Actions — это события, которые могут быть использованы для выполнения функции на определённом этапе выполнения.

## Пример кода

```php
add_action('wp_footer', 'add_custom_footer_content');

function add_custom_footer_content() {
    echo "<p>Текст в подвале страницы!</p>";
}
