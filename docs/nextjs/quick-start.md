---
sidebar_position: 1
title: Быстрый старт
description: Настройка проекта Next.js с TypeScript, Tailwind, shadcn/ui, Drizzle и Payload CMS
---

# Быстрый старт с Next.js

Готовый к продакшену стек с современными технологиями.

## Технологический стек

- **Next.js 15** — React-фреймворк с App Router
- **TypeScript** — типобезопасность
- **Tailwind CSS** — утилитарные стили
- **shadcn/ui** — доступные компоненты
- **Drizzle ORM** — типобезопасная работа с БД
- **Payload CMS** — headless CMS
- **Heroicons** — библиотека иконок

## Чек-лист установки

### 1. Инициализация проекта

```bash
npx create-next-app@latest richsoft --typescript --tailwind --app
cd richsoft
```

Создаёт приложение Next.js с:
- конфигурацией TypeScript
- настроенным Tailwind CSS
- структурой App Router
- настроенным ESLint

### 2. Добавление UI-компонентов

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog sheet
```

Устанавливает shadcn/ui с:
- примитивами Radix UI
- стилями Tailwind
- доступностью из коробки

### 3. Настройка базы данных

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

Возможности Drizzle ORM:
- типобезопасные запросы
- автоматические миграции
- поддержка Postgres, MySQL, SQLite

### 4. Добавление CMS

```bash
npx create-payload-app@latest
```

Payload CMS предоставляет:
- админ-панель
- генерацию API
- управление медиа
- аутентификацию

### 5. Установка иконок

```bash
npm install @heroicons/react
```

Heroicons включает:
- 300+ SVG-иконок
- варианты outline и solid
- лицензия MIT

### 6. Добавление утилит

```bash
npm install clsx tailwind-merge
```

Утилиты для:
- условных классов
- слияния классов Tailwind
- чистого API компонентов

## Конфигурация для продакшена

```typescript title="next.config.mjs"
/** @type {import('next').NextConfig} */
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-domain.ru',
      },
    ],
  },
  experimental: {
    ppr: true, // Partial Prerendering
  },
};
```

### Детали конфигурации

**Оптимизация изображений:**
- форматы AVIF и WebP
- автоматическое сжатие
- ленивая загрузка

**Partial Prerendering (PPR):**
- статическая оболочка + динамический контент
- быстрая начальная загрузка
- лучшее SEO

## Структура проекта

```plaintext
richsoft/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
├── lib/
│   ├── db/
│   │   └── schema.ts
│   └── utils.ts
├── public/
├── drizzle.config.ts
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## Переменные окружения

```bash title=".env.local"
DATABASE_URL="postgres://..."
PAYLOAD_SECRET="your-secret"
```

## Следующие шаги

1. Настроить схему БД с Drizzle
2. Настроить аутентификацию
3. Создать API-роуты
4. Задеплоить на Vercel

## Полезные команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Миграции БД
npx drizzle-kit generate
npx drizzle-kit migrate

# Drizzle Studio
npx drizzle-kit studio
```
