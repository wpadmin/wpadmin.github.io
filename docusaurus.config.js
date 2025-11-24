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

  // i18n
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
    localeConfigs: {
      ru: {
        translate: false, // Improves build performance for non-translated sites
      },
    },
  },

  // head tags for performance optimization
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
  ],

  // markdown configuration
  markdown: {
    format: 'mdx',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // presets
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            copyright: `Copyright © ${new Date().getFullYear()} Code==Poetry`,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  // theme
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      metadata: [
        {name: 'keywords', content: 'программирование, разработка, веб-разработка, javascript, typescript, react, nextjs'},
        {name: 'author', content: 'Женя'},
        {property: 'og:type', content: 'website'},
      ],
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
        additionalLanguages: [
          'bash',
          'nginx',
          'ini',
          'sql',
          'php',
          'javascript',
          'typescript',
          'jsx',
          'tsx',
          'css',
          'scss',
          'json',
          'yaml',
          'docker',
          'git',
        ],
      },
    }),
};

export default config;
