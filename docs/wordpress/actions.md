# Подключение стилей и скриптов

Правильное подключение CSS и JavaScript в WordPress имеет большое значение для производительности сайта. Вот оптимальный подход:

## Правильное подключение стилей (CSS)

```php
function theme_enqueue_styles() {
    // Основной стиль темы
    wp_enqueue_style('main-style', get_stylesheet_uri(), array(), filemtime(get_stylesheet_directory() . '/style.css'));
    
    // Дополнительные стили
    wp_enqueue_style('extra-style', get_template_directory_uri() . '/assets/css/extra.css', array(), filemtime(get_stylesheet_directory() . '/assets/css/extra.css'));
}
add_action('wp_enqueue_scripts', 'theme_enqueue_styles');
}
```


## Правильное подключение скриптов (JS)

```php
function theme_enqueue_scripts() {
    // Подключаем jQuery из WordPress
    wp_enqueue_script('jquery');
    
    // Собственные скрипты
    wp_enqueue_script('main-script', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), filemtime(get_stylesheet_directory() . '/assets/js/main.js'), true);
    
    // Передача параметров в JavaScript
    wp_localize_script('main-script', 'ajax_object', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('ajax-nonce')
    ));
}
add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');
```

## Условное подключение для разных страниц:

```php
function conditional_scripts() {
    // Только для главной страницы
    if (is_front_page()) {
        wp_enqueue_script('home-script', get_template_directory_uri() . '/assets/js/home.js', array(), filemtime(get_stylesheet_directory() . '/assets/js/home.js'), true);
    }
    
    // Только для страниц блога
    if (is_single() || is_archive()) {
        wp_enqueue_style('blog-style', get_template_directory_uri() . '/assets/css/blog.css', array(), filemtime(get_stylesheet_directory() . '/assets/css/blog.css'));
    }
}
add_action('wp_enqueue_scripts', 'conditional_scripts');
```

## Дополнительные оптимизации:

```php
function add_async_defer_attributes($tag, $handle, $src) {
    // Для скриптов аналитики
    if ('analytics-script' === $handle) {
        return str_replace(' src', ' async defer src', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'add_async_defer_attributes', 10, 3);
```

## Условное подключение для разных страниц:

```php
function conditional_scripts() {
    // Только для главной страницы
    if (is_front_page()) {
        wp_enqueue_script('home-script', get_template_directory_uri() . '/assets/js/home.js', array(), filemtime(get_stylesheet_directory() . '/assets/js/home.js'), true);
    }
    
    // Только для страниц блога
    if (is_single() || is_archive()) {
        wp_enqueue_style('blog-style', get_template_directory_uri() . '/assets/css/blog.css', array(), filemtime(get_stylesheet_directory() . '/assets/css/blog.css'));
    }
}
add_action('wp_enqueue_scripts', 'conditional_scripts');
```

## Инлайн стили в WordPress

```php
function add_critical_inline_styles() {
    // Сначала регистрируем базовый стиль
    wp_register_style('main-style', get_stylesheet_uri());
    
    // Инлайн CSS для критических стилей
    $critical_css = '
        header { 
            background-color: #fff;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .hero-section {
            min-height: 80vh;
            display: flex;
            align-items: center;
        }
    ';
    
    // Добавляем инлайн стиль, связываем с main-style
    wp_add_inline_style('main-style', $critical_css);
    
    // Подключаем базовый стиль
    wp_enqueue_style('main-style');
}
add_action('wp_enqueue_scripts', 'add_critical_inline_styles');
```

### Загрузка критического CSS из файла

```php
function add_critical_css_from_file() {
    $critical_css_path = get_template_directory() . '/assets/css/critical.css';
    
    if (file_exists($critical_css_path)) {
        $critical_css = file_get_contents($critical_css_path);
        
        // Выводим напрямую в head
        echo '<style id="critical-css">' . $critical_css . '</style>';
    }
}
add_action('wp_head', 'add_critical_css_from_file', 1);
```


## Инлайн скрипты в WordPress

```php
function add_inline_script() {
    // Регистрируем и подключаем базовый скрипт
    wp_enqueue_script('main-script', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0', true);
    
    // Инлайн JavaScript
    $inline_js = '
        document.addEventListener("DOMContentLoaded", function() {
            const header = document.querySelector("header");
            const scrollWatcher = () => {
                if (window.scrollY > 100) {
                    header.classList.add("scrolled");
                } else {
                    header.classList.remove("scrolled");
                }
            };
            window.addEventListener("scroll", scrollWatcher);
        });
    ';
    
    // Добавляем инлайн скрипт после основного
    wp_add_inline_script('main-script', $inline_js, 'after');
}
add_action('wp_enqueue_scripts', 'add_inline_script');
```

### Прямое добавление скриптов в head для быстрого выполнения

```php
function add_direct_inline_script() {
    ?>
    <script>
        // Скрипт для предотвращения FOUC (мигания нестилизованного контента)
        document.documentElement.className = document.documentElement.className.replace('no-js', 'js');
        
        // Определение параметров для отложенной загрузки ресурсов
        window.siteConfig = {
            ajaxUrl: '<?php echo admin_url('admin-ajax.php'); ?>',
            isLoggedIn: <?php echo is_user_logged_in() ? 'true' : 'false'; ?>,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        };
    </script>
    <?php
}
add_action('wp_head', 'add_direct_inline_script', 1);
```


##  Оптимизация скриптов WooCommerce

```php
function optimize_woocommerce_scripts() {
    // Отключаем стили и скрипты на ненужных страницах
    if (!is_woocommerce() && !is_cart() && !is_checkout() && !is_account_page()) {
        // Отключаем стили WooCommerce
        wp_dequeue_style('woocommerce-general');
        wp_dequeue_style('woocommerce-layout');
        wp_dequeue_style('woocommerce-smallscreen');
        
        // Отключаем скрипты
        wp_dequeue_script('woocommerce');
        wp_dequeue_script('wc-cart-fragments');
        wp_dequeue_script('wc-add-to-cart');
    }
    
    // Оптимизируем корзину
    if (!is_cart() && !is_checkout()) {
        wp_dequeue_script('wc-cart');
    }
    
    // На странице продукта включаем только нужное
    if (is_product()) {
        // Добавляем инлайн скрипт для продукта
        $product_js = '
            document.addEventListener("DOMContentLoaded", function() {
                const addToCartBtn = document.querySelector(".single_add_to_cart_button");
                if (addToCartBtn) {
                    addToCartBtn.addEventListener("click", function() {
                        gtag("event", "add_to_cart", {
                            product_id: ' . get_the_ID() . '
                        });
                    });
                }
            });
        ';
        wp_add_inline_script('wc-single-product', $product_js);
    }
}
add_action('wp_enqueue_scripts', 'optimize_woocommerce_scripts', 99);
```