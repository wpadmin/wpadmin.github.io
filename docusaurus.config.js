import { themes as prismThemes } from 'prism-react-renderer';
import { defineConfig } from 'docusaurus';

export default defineConfig({
  title: 'Code==Poetry',
  tagline: 'Код — это поэзия',
  favicon: 'img/favicon.ico',

  url: 'https://wpadmin.github.io',
  baseUrl: '/',
  organizationName: 'wpadmin',
  projectName: 'wpadmin.github.io',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/wpadmin/wpadmin.github.io/edit/main/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },

  future: {
    v4: true,
  },
});
