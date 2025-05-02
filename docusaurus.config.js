import { themes as prismThemes } from 'prism-react-renderer'

module.exports = {
  title: 'wpadmin: WordPress разработчик',
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
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
          },
        },
        blog: {
          editLocalizedFiles: false,
          blogTitle: 'Блог Жени Ш.',
          blogDescription: 'Блог о WordPress, JavaScript и веб-разработке',
          blogSidebarCount: 5,
          blogSidebarTitle: 'Все записи',
          routeBasePath: 'blog',
          include: ['**/*.{md,mdx}'],
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          postsPerPage: 12,
          blogListComponent: '@theme/BlogListPage',
          blogPostComponent: '@theme/BlogPostPage',
          blogTagsListComponent: '@theme/BlogTagsListPage',
          blogTagsPostsComponent: '@theme/BlogTagsPostsPage',
          showReadingTime: true,
        },
      },
    ],
  ],
  themeConfig: {
    // Add metadata tags for the whole site
    metadata: [
      { name: 'keywords', content: 'wpadmin, wordpress, nextjs' },
      { name: 'description', content: 'Частный WordPress разработчик. Заказать сайт на WordPress. Создание сайтов и доработка на ВордПресс.' },
      { name: 'og:title', content: 'wpadmin: WordPress разработчик' },
      { name: 'og:description', content: 'wpadmin: дизайнер и WordPress разработчик' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],

    prism: {
      theme: prismThemes.github,
      additionalLanguages: [
        // Ваши текущие языки
        'powershell',
        'php',
        'json',
        'yaml',
        'bash',
        // Веб-ориентированные языки
        'css',
        'scss',
        'jsx',
        'tsx',
        'graphql',
        'typescript',
        'sql',
        'regex',
        'markup-templating', // для шаблонизаторов
        'docker',
        'nginx',
        'http',
        'javascript',
      ],
    },
  },
};