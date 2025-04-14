module.exports = {
  title: 'Dev Notes',
  tagline: 'Справочник разработчика',
  url: 'https://wpadmin.github.io',
  baseUrl: 'wpadmin.github.io',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'wpadmin',
  projectName: 'wpadmin.github.io',
  deploymentBranch: 'main', // Ветка для деплоя
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