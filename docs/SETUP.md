# Project Setup Guide

This guide walks you through setting up the landing application from scratch following the HLD and LLD specifications.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Dependencies Installation](#2-dependencies-installation)
3. [Project Structure Creation](#3-project-structure-creation)
4. [Configuration Files](#4-configuration-files)
5. [Development Workflow](#5-development-workflow)
6. [Deployment](#6-deployment)

---

## 1. Prerequisites

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x LTS or later | Runtime |
| Yarn | 1.22.x or later | Package manager |
| Git | Latest | Version control |

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "lokalise.i18n-ally",
    "unifiedjs.vscode-mdx"
  ]
}
```

---

## 2. Dependencies Installation

### 2.1 Update package.json

Replace your `package.json` with the following:

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack --port 3005",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true next build",
    "postbuild": "next-sitemap"
  },
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "next-intl": "^4.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.0.0",
    "typescript": "^5",
    "next-sitemap": "^4.2.3",
    "gray-matter": "^4.0.3",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-pretty-code": "^0.14.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.0",
    "next-mdx-remote": "^5.0.0",
    "shiki": "^1.24.4"
  }
}
```

### 2.2 Install Dependencies

```bash
# Clean install
rm -rf node_modules yarn.lock
yarn install
```

---

## 3. Project Structure Creation

### 3.1 Create Directory Structure

Run these commands to create the project structure:

```bash
# Create main directories
mkdir -p src/app/[locale]/{pricing,contact,privacy,terms,docs/[...slug]}
mkdir -p src/components/{ui,layout,sections,docs,seo}
mkdir -p src/config
mkdir -p src/lib/{api,docs,utils}
mkdir -p src/i18n
mkdir -p src/types
mkdir -p messages
mkdir -p content/docs/{en,ar}/{getting-started,guides,api-reference}
mkdir -p public/images

# Create placeholder files
touch src/middleware.ts
touch src/app/sitemap.ts
touch src/app/robots.ts
touch src/app/manifest.ts
touch src/app/globals.css
touch src/app/layout.tsx
touch src/app/not-found.tsx
touch src/app/[locale]/layout.tsx
touch src/app/[locale]/page.tsx
touch src/app/[locale]/not-found.tsx
touch src/i18n/routing.ts
touch src/i18n/request.ts
touch src/i18n/navigation.ts
touch src/config/site.ts
touch src/config/theme.ts
touch src/config/navigation.ts
touch src/lib/utils/cn.ts
touch messages/en.json
touch messages/ar.json
```

---

## 4. Configuration Files

### 4.1 TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/config/*": ["./src/config/*"],
      "@/types/*": ["./src/types/*"],
      "@/i18n/*": ["./src/i18n/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "content/**/*.mdx"
  ],
  "exclude": ["node_modules"]
}
```

### 4.2 Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

### 4.3 Tailwind CSS Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
          light: 'hsl(var(--color-primary-light) / <alpha-value>)',
          dark: 'hsl(var(--color-primary-dark) / <alpha-value>)',
          foreground: 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
          foreground: 'hsl(var(--color-secondary-foreground) / <alpha-value>)',
        },
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        muted: {
          DEFAULT: 'hsl(var(--color-muted) / <alpha-value>)',
          foreground: 'hsl(var(--color-muted-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--color-card) / <alpha-value>)',
          foreground: 'hsl(var(--color-card-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--color-border) / <alpha-value>)',
        accent: {
          DEFAULT: 'hsl(var(--color-accent) / <alpha-value>)',
          foreground: 'hsl(var(--color-accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--color-destructive) / <alpha-value>)',
          foreground: 'hsl(var(--color-destructive-foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        arabic: ['var(--font-arabic)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
```

### 4.4 PostCSS Configuration (`postcss.config.js`)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 4.5 ESLint Configuration (`.eslintrc.json`)

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
    "react/no-unescaped-entities": "off"
  }
}
```

### 4.6 Next Sitemap Configuration (`next-sitemap.config.js`)

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourcompany.com',
  generateRobotsTxt: false, // We generate our own in app/robots.ts
  generateIndexSitemap: false,
  exclude: ['/api/*', '/_next/*'],
  alternateRefs: [
    {
      href: 'https://yourcompany.com/en',
      hreflang: 'en',
    },
    {
      href: 'https://yourcompany.com/ar',
      hreflang: 'ar',
    },
  ],
};
```

### 4.7 Environment Variables (`.env.local.example`)

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourcompany.com

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_GA_ID=

# Feature Flags
NEXT_PUBLIC_ENABLE_BLOG=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### 4.8 VS Code Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "i18n-ally.localesPaths": ["messages"],
  "i18n-ally.keystyle": "nested",
  "i18n-ally.enabledParsers": ["json"],
  "i18n-ally.sourceLanguage": "en"
}
```

---

## 5. Development Workflow

### 5.1 Daily Development

```bash
# Start development server with Turbopack
yarn dev

# Run type checking in watch mode (separate terminal)
yarn type-check --watch
```

### 5.2 Before Committing

```bash
# Run all checks
yarn lint
yarn type-check
yarn build

# Test production build locally
yarn start
```

### 5.3 Adding New Translations

1. Add keys to both `messages/en.json` and `messages/ar.json`
2. Use the `i18n-ally` extension to manage translations
3. Access translations in components:

```typescript
// Server Component
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('home');
  return <h1>{t('hero.title')}</h1>;
}
```

### 5.4 Adding New Pages

1. Create page file: `src/app/[locale]/newpage/page.tsx`
2. Add translations to `messages/en.json` and `messages/ar.json`
3. Update navigation config in `src/config/navigation.ts`
4. Add to sitemap (automatically handled by `sitemap.ts`)

### 5.5 Adding Documentation

1. Create MDX file: `content/docs/en/category/page-name.mdx`
2. Create Arabic version: `content/docs/ar/category/page-name.mdx`
3. Update `_meta.json` for navigation ordering

Example MDX frontmatter:

```markdown
---
title: Getting Started
description: Learn how to get started with our platform
date: 2026-01-02
---

# Getting Started

Content goes here...
```

---

## 6. Deployment

### 6.1 Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### 6.2 Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

For standalone output, add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... other config
};
```

Build and run:

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

---

## 7. Maintenance

### 7.1 Updating Dependencies

```bash
# Check for updates
yarn outdated

# Update all dependencies
yarn upgrade-interactive --latest
```

### 7.2 Performance Monitoring

1. Run Lighthouse audits regularly
2. Monitor Core Web Vitals in Vercel Analytics
3. Check bundle size with `yarn analyze`

### 7.3 SEO Monitoring

1. Submit sitemap to Google Search Console
2. Monitor indexing status
3. Check for crawl errors regularly

---

## Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `src/config/site.ts` | Site metadata, contact info |
| `src/config/theme.ts` | Theme colors, fonts |
| `messages/*.json` | All translations |
| `content/docs/**/*.mdx` | Documentation content |
| `src/app/globals.css` | CSS variables, global styles |

### Useful Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Start dev server |
| `yarn build` | Production build |
| `yarn type-check` | TypeScript validation |
| `yarn lint:fix` | Auto-fix lint issues |
| `yarn analyze` | Bundle analysis |

---

*Document Version: 1.0*  
*Last Updated: January 2, 2026*

