# WooCommerce для профи

Для опытных пользователей WooCommerce предлагает широкие возможности кастомизации и оптимизации:

## Использование хуков WooCommerce

```php
add_action('woocommerce_before_shop_loop', 'custom_before_shop_loop');

function custom_before_shop_loop() {
    echo '<p>Мой кастомный контент перед списком товаров</p>';
}
