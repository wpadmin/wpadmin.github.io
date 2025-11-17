import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  // Основная информация сайта
  title: 'Code==Poetry',
  tagline: 'Код — это поэзия',
  favicon: 'img/favicon.ico',

  url: 'https://wpadmin.github.io',
  baseUrl: '/',
  organizationName: 'wpadmin',
  projectName: 'wpadmin.github.io',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
  },

  // Базовые плагины и конфигурация
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // Оформление и навигация
  themeConfig: ({
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Code==Poetry',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Документация',
        },
        { to: '/blog', label: 'Блог', position: 'left' },
        {
          href: 'https://github.com/wpadmin',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Документация',
          items: [
            {
              label: 'Начало',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Code==Poetry. Built with Docusaurus.`,
    },
    // Подсветка синтаксиса в коде
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  }),
};

export default config;
