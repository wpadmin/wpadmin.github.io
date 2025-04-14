module.exports = {
  title: 'wpadmin',
  tagline: 'Справочник разработчика',
  url: 'https://wpadmin.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'wpadmin',
  projectName: 'wpadmin.github.io',
  deploymentBranch: 'gh-pages', // Ветка для деплоя
  trailingSlash: false,
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

};