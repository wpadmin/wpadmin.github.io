---
slug: lee-robinson-stack-2025
title: Стек технологий Lee Robinson в 2025 году
authors: [wpadmin]
tags: [nextjs, react, typescript, tailwind, postgres]
description: Разбор технологического стека Lee Robinson - бывшего VP Developer Experience в Vercel. Какие инструменты использует создатель множества курсов по Next.js.
keywords: [lee robinson, next.js, react, typescript, tailwind css, postgres, drizzle, vercel, shadcn ui]
---

# Стек технологий Lee Robinson в 2025 году

[Lee Robinson](https://leerob.com) - бывший VP Developer Experience в Vercel, создатель множества курсов по Next.js и React. Работает с Next.js с 2018 года, с React - с 2015. Сейчас работает в [Cursor](https://cursor.com), обучая разработчиков использованию AI-инструментов.

Разберем его актуальный стек на январь 2025.

<!-- truncate -->

## 1. Framework: Next.js + React + TypeScript

**Почему:** 7 лет опыта работы с Next.js делают его максимально продуктивным в этом фреймворке.

### Ключевые технологии:

- **[Next.js](https://nextjs.org)** - React-фреймворк с серверным рендерингом, статической генерацией и App Router
- **[React 19](https://react.dev)** - библиотека для построения пользовательских интерфейсов
- **[TypeScript](https://www.typescriptlang.org)** - типизированный JavaScript, используется во всех проектах

### Паттерны работы:

- **Server Components** - основной способ получения данных (в page или layout)
- **Server Actions** - обработка форм без написания API-эндпоинтов
- **useActionState** - React 19 хук для управления состоянием форм
- **[Zod](https://zod.dev)** - валидация данных с TypeScript-first подходом
- **[SWR](https://swr.vercel.app)** - клиентский data fetching (для legacy кода)

## 2. Styling: Tailwind CSS + shadcn/ui

**Почему:** Tailwind - самая AI-friendly CSS библиотека. Стили находятся рядом с разметкой, что упрощает генерацию кода.

### Инструменты:

- **[Tailwind CSS](https://tailwindcss.com)** - utility-first CSS фреймворк
  - Компилятор генерирует только используемые классы
  - Фиксированный верхний предел размера CSS
  - Минификация, сжатие и кэширование из коробки

- **[shadcn/ui](https://ui.shadcn.com)** - коллекция переиспользуемых компонентов
  - Построены на доступных, нестилизованных примитивах
  - Кнопки, инпуты, диалоги, графики, темы
  - Полностью кастомизируемые

## 3. Database: Postgres + Drizzle

**Почему:** Type-safe работа с базой данных, удобные миграции и отличная интеграция с TypeScript.

### Стек:

- **[PostgreSQL](https://www.postgresql.org)** - основная база данных
- **[Drizzle ORM](https://orm.drizzle.team)** - легковесный TypeScript ORM
  - Type-safe запросы
  - Drizzle Studio для просмотра данных
  - Drizzle Kit для миграций

- **[postgres.js](https://github.com/porsager/postgres)** - недооцененный Postgres клиент (по мнению Lee)

## 4. AI: v0

**Почему:** Экономия времени на рутинных задачах.

- **[v0](https://v0.dev)** - AI-ассистент от Vercel
  - Редактирование и рефакторинг кода
  - Отладка
  - Актуальные знания о Next.js, React, Drizzle

## 5. Coding Patterns

Философия Lee Robinson:

- **Большие файлы лучше множества мелких компонентов** - меньше переключений между файлами
- **Колокация кода** - часто меняющийся код должен быть рядом
- **Copy/paste лучше неправильной абстракции** - не создавай абстракции преждевременно
- **SVG спрайты вместо inline SVG** - оптимизация размера бандла

## Дополнительные инструменты

Из различных проектов Lee:

- **[Vercel](https://vercel.com)** - деплой и хостинг
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - хранение файлов
- **[Neon](https://neon.tech)** - serverless Postgres

## Выводы

Стек Lee Robinson отражает современные тренды веб-разработки:

1. **TypeScript везде** - типобезопасность на всех уровнях
2. **Server-first** - максимум логики на сервере
3. **AI-assisted** - использование AI для рутины
4. **Простота** - избегание преждевременных абстракций

Этот стек отлично подходит для:
- Стартапов и MVP
- SaaS приложений
- Корпоративных проектов
- Любых React/Next.js проектов

---

*Источник: [leerob.com/stack](https://leerob.com/stack) - январь 2025*
