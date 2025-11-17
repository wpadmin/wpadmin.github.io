---
sidebar_position: 1
title: Quick Start
description: Next.js project setup with TypeScript, Tailwind, shadcn/ui, Drizzle, and Payload CMS
---

# Next.js Quick Start

Production-ready setup with modern stack.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible components
- **Drizzle ORM** - Type-safe database
- **Payload CMS** - Headless CMS
- **Heroicons** - Icon library

## Setup Checklist

### 1. Initialize Project

```bash
npx create-next-app@latest richsoft --typescript --tailwind --app
cd richsoft
```

Creates Next.js app with:
- TypeScript configuration
- Tailwind CSS setup
- App Router structure
- ESLint configuration

### 2. Add UI Components

```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog sheet
```

Installs shadcn/ui with:
- Radix UI primitives
- Tailwind styling
- Accessible by default

### 3. Setup Database

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

Drizzle ORM features:
- Type-safe queries
- Automatic migrations
- Postgres, MySQL, SQLite support

### 4. Add CMS

```bash
npx create-payload-app@latest
```

Payload CMS provides:
- Admin panel
- API generation
- Media management
- Authentication

### 5. Install Icons

```bash
npm install @heroicons/react
```

Heroicons includes:
- 300+ SVG icons
- Outline and solid variants
- MIT licensed

### 6. Add Utilities

```bash
npm install clsx tailwind-merge
```

Utilities for:
- Conditional class names
- Tailwind class merging
- Clean component APIs

## Production Config

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

### Configuration Details

**Image Optimization:**
- AVIF and WebP formats
- Automatic compression
- Lazy loading

**Partial Prerendering (PPR):**
- Static shell + dynamic content
- Faster initial load
- Better SEO

## Project Structure

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

## Environment Variables

```bash title=".env.local"
DATABASE_URL="postgres://..."
PAYLOAD_SECRET="your-secret"
```

## Next Steps

1. Configure database schema with Drizzle
2. Set up authentication
3. Create API routes
4. Deploy to Vercel

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Database migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# Drizzle Studio
npx drizzle-kit studio
```
