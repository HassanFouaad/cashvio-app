# Landing Application Documentation

Welcome to the documentation for the SEO-optimized, multilingual landing application.

## Overview

This is a **world-class landing application** built with:

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **Tailwind CSS 4** - Utility-first CSS framework
- **next-intl** - Internationalization for Next.js
- **TypeScript 5** - Type safety

## Documentation Index

### Architecture & Design

| Document | Description |
|----------|-------------|
| [HLD.md](./HLD.md) | **High-Level Design** - Architecture overview, technology choices, SEO strategy |
| [LLD.md](./LLD.md) | **Low-Level Design** - Detailed implementation, code examples, component structure |
| [SETUP.md](./SETUP.md) | **Setup Guide** - Step-by-step installation and configuration |

## Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build
```

## Key Features

### 🌐 Internationalization (i18n)
- Full Arabic (RTL) and English (LTR) support
- Server-side locale handling
- Type-safe translations
- SEO-friendly localized URLs (`/en/*`, `/ar/*`)

### 🔍 SEO Optimization
- Perfect Lighthouse SEO scores
- JSON-LD structured data on all pages
- Dynamic sitemap with all localized URLs
- Proper hreflang and canonical tags
- Open Graph and Twitter Card meta tags

### ⚡ Performance
- React Server Components (zero client JS for static content)
- Static Site Generation (SSG) where possible
- Incremental Static Regeneration (ISR) for dynamic content
- Optimized images (WebP/AVIF)
- Minimal JavaScript bundle

### 🎨 Theming
- Light and dark mode support
- CSS variables for easy customization
- Configurable brand colors
- RTL-ready components

### 📚 Documentation System
- MDX-powered documentation
- Auto-generated navigation
- Syntax highlighting
- Table of contents
- Full-text search ready

## Pages

| Route | Description |
|-------|-------------|
| `/[locale]` | Home page |
| `/[locale]/pricing` | Pricing plans (ISR from backend) |
| `/[locale]/contact` | Contact form |
| `/[locale]/privacy` | Privacy policy |
| `/[locale]/terms` | Terms and conditions |
| `/[locale]/docs/*` | Documentation |

## Backend Integration

The application integrates with your NestJS backend for:

- **Pricing Plans**: Fetched via ISR (revalidates hourly)
- **Contact Form**: Server Actions (future implementation)

API types are derived from your backend DTOs:

```typescript
interface Plan {
  id: string;
  arName: string;
  enName: string;
  price: number;
  period: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  isActive: boolean;
  planFeatures: PlanFeature[];
}
```

## Configuration Files

| File | Purpose |
|------|---------|
| `src/config/site.ts` | Site name, URL, contact info, social links |
| `src/config/theme.ts` | Brand colors, fonts, spacing |
| `messages/en.json` | English translations |
| `messages/ar.json` | Arabic translations |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `next.config.ts` | Next.js configuration |

## Customization

### Changing Brand Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --color-primary: 220 90% 56%; /* HSL values */
  --color-secondary: 262 83% 58%;
}
```

### Adding New Pages

1. Create `src/app/[locale]/newpage/page.tsx`
2. Add translations to `messages/*.json`
3. Update navigation in `src/config/navigation.ts`

### Adding Documentation

1. Create MDX file in `content/docs/en/category/page.mdx`
2. Create Arabic version in `content/docs/ar/category/page.mdx`

## Scripts

```bash
yarn dev          # Development server with Turbopack
yarn build        # Production build
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix lint issues
yarn type-check   # TypeScript validation
yarn analyze      # Bundle size analysis
```

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Docker

```bash
docker build -t my-app .
docker run -p 3000:3000 my-app
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse SEO | 100 |
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |

## Contributing

1. Follow the coding standards in LLD.md
2. Ensure all translations are complete
3. Run `yarn lint` and `yarn type-check` before committing
4. Test RTL layout for Arabic pages

---

*For detailed implementation guidance, see [LLD.md](./LLD.md)*

