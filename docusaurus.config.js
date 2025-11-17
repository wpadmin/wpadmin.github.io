import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  // site metadata
  title: 'Code==Poetry',
  tagline: 'Код — это поэзия',
  favicon: 'img/favicon.ico',

  // deployment
  url: 'https://wpadmin.github.io',
  baseUrl: '/',
  organizationName: 'wpadmin',
  projectName: 'wpadmin.github.io',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // i18n
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  // presets
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  // theme
  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Code==Poetry',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Документация',
        },
        {to: '/blog', label: 'Блог', position: 'left'},
        {
          href: 'https://github.com/wpadmin',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `${new Date().getFullYear()} Code==Poetry`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
