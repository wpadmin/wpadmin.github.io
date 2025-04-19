module.exports = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'App',
      items: [
        'app/phpmyadmin',
      ],
    },
    'javascript',
    'typescript',
    'php',
    {
      type: 'category',
      label: 'WordPress',
      items: [
        'wordpress/actions',
        'wordpress/hooks',
        {
          type: 'category',
          label: 'WooCommerce',
          items: [
            'wordpress/woocommerce/novice',
            'wordpress/woocommerce/profi',
          ],
        },
      ],
    },
  ],
};