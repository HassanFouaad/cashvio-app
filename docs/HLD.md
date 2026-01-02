# High-Level Design (HLD) - Landing Application

## 1. Executive Summary

This document outlines the high-level architecture for a **world-class SEO-optimized, multilingual (Arabic/English) landing application** built with Next.js 16. The application serves as the public-facing home and landing pages for the organization, featuring maximum performance, full SSR/SSG capabilities, and exceptional maintainability.

---

## 2. Project Goals & Non-Functional Requirements

### 2.1 Primary Goals

| Goal | Description | Priority |
|------|-------------|----------|
| **Maximum SEO** | Achieve perfect Lighthouse SEO scores, comprehensive meta tags, JSON-LD schemas, sitemaps | Critical |
| **Performance** | Sub-second load times, minimal JavaScript, optimal Core Web Vitals | Critical |
| **Internationalization** | Full Arabic (RTL) and English (LTR) support with localized content | Critical |
| **Maintainability** | Easily configurable themes, content, and structure | High |
| **Accessibility** | WCAG 2.1 AA compliance | High |

### 2.2 Non-Functional Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| First Contentful Paint (FCP) | < 1.0s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Time to Interactive (TTI) | < 3.0s | Lighthouse |
| SEO Score | 100/100 | Lighthouse |
| Accessibility Score | 95+/100 | Lighthouse |
| Performance Score | 95+/100 | Lighthouse |
| Bundle Size (JS) | < 100KB gzipped | Build analysis |

---

## 3. Technology Stack

### 3.1 Core Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Next.js** | 16.x | Framework | Best-in-class SSR/SSG, App Router, React Server Components |
| **React** | 19.x | UI Library | Server Components, Streaming, Suspense |
| **TypeScript** | 5.x | Language | Type safety, maintainability |
| **Tailwind CSS** | 4.x | Styling | Zero-runtime CSS, atomic classes, SSR-safe, tree-shaking |
| **next-intl** | 4.x | i18n | Best Next.js i18n library, Server Components support, type-safe |

### 3.2 Why Tailwind CSS for SSR/SEO?

Tailwind CSS is the **optimal choice** for SSR/SEO applications because:

1. **Zero Runtime JavaScript** - All styles are compiled to static CSS at build time
2. **Atomic CSS** - Only used classes are included (tree-shaking)
3. **No FOUC** - Styles are in CSS, not JS, preventing flash of unstyled content
4. **Perfect for SSR** - No hydration mismatch issues
5. **Theme Configuration** - CSS variables for runtime theme switching
6. **RTL Support** - Built-in RTL utilities for Arabic support

### 3.3 Supporting Libraries

| Library | Purpose |
|---------|---------|
| **@tailwindcss/typography** | Beautiful prose styling for documentation |
| **sharp** | Image optimization (built into Next.js) |
| **gray-matter** | Markdown frontmatter parsing for documentation |
| **rehype/remark** | MDX processing for documentation |

---

## 4. Architecture Overview

### 4.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Static HTML + CSS (Hydrated minimally)                                 ││
│  │  • Server-rendered pages                                                ││
│  │  • CSS Variables for theming                                            ││
│  │  • Minimal client JS (only for interactivity)                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EDGE / CDN                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Vercel Edge Network / CloudFlare                                       ││
│  │  • Static page caching                                                  ││
│  │  • Geo-distributed                                                      ││
│  │  • ISR revalidation                                                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APPLICATION                                │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        APP ROUTER (Server)                              │ │
│  │                                                                         │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │ │
│  │  │   Layouts   │ │   Pages     │ │  Metadata   │ │  Sitemap    │      │ │
│  │  │  (Server)   │ │  (Server)   │ │  Generator  │ │  Generator  │      │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    REACT SERVER COMPONENTS                       │   │ │
│  │  │  • Zero client-side JavaScript for static content               │   │ │
│  │  │  • Data fetching on server                                      │   │ │
│  │  │  • Streaming support                                            │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │                    i18n LAYER (next-intl)                        │   │ │
│  │  │  • /en/* - English routes (LTR)                                 │   │ │
│  │  │  • /ar/* - Arabic routes (RTL)                                  │   │ │
│  │  │  • Server-side locale detection                                 │   │ │
│  │  │  • Static rendering with setRequestLocale                       │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                        CONTENT & CONFIG LAYER                           │ │
│  │                                                                         │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │ │
│  │  │   Theme     │ │   Content   │ │   i18n      │ │    Docs     │      │ │
│  │  │   Config    │ │   Config    │ │  Messages   │ │    MDX      │      │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND INTEGRATION                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  NestJS Backend API                                                     ││
│  │  • GET /api/plans - Pricing plans (ISR: 1 hour)                        ││
│  │  • POST /api/contact - Contact form (Server Action)                    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Rendering Strategy

| Page | Rendering | Revalidation | Reason |
|------|-----------|--------------|--------|
| Home | SSG | Build time | Static content, maximum performance |
| Pricing | ISR | 1 hour | Dynamic data from backend, cached |
| Contact | SSG + Server Actions | Build time | Form uses Server Actions |
| Privacy Policy | SSG | Build time | Static legal content |
| Terms | SSG | Build time | Static legal content |
| Documentation | SSG | Build time | MDX-based, pre-rendered |

---

## 5. Page Structure

### 5.1 Pages Overview

```
/                           → Home page
/[locale]/                  → Localized home page
/[locale]/pricing           → Pricing & features page
/[locale]/contact           → Contact us page
/[locale]/privacy           → Privacy policy page
/[locale]/terms             → Terms and conditions page
/[locale]/docs              → Documentation index
/[locale]/docs/[...slug]    → Documentation pages (catch-all)
```

### 5.2 Locale Support

| Locale | Direction | URL Pattern |
|--------|-----------|-------------|
| `en` | LTR | `/en/*` (default, prefix can be omitted) |
| `ar` | RTL | `/ar/*` |

---

## 6. SEO Strategy

### 6.1 Technical SEO Implementation

| Feature | Implementation |
|---------|----------------|
| **Meta Tags** | Dynamic `generateMetadata` function per page |
| **JSON-LD** | Page-specific structured data schemas |
| **Sitemap** | Dynamic `sitemap.ts` generating all localized URLs |
| **Robots** | `robots.ts` with proper crawler directives |
| **Canonical URLs** | Automatic hreflang and canonical tags |
| **Open Graph** | Full OG implementation for social sharing |
| **Twitter Cards** | Twitter card meta tags |

### 6.2 JSON-LD Schemas by Page

| Page | Schema Types |
|------|--------------|
| Home | Organization, WebSite, BreadcrumbList |
| Pricing | Product, Offer, AggregateOffer |
| Contact | ContactPage, Organization |
| Docs | TechArticle, BreadcrumbList, FAQPage |
| Privacy/Terms | WebPage |

### 6.3 Performance Optimizations for SEO

1. **Image Optimization**: Next.js Image component with WebP/AVIF
2. **Font Optimization**: `next/font` with font-display: swap
3. **Critical CSS**: Tailwind's JIT mode inlines critical styles
4. **Preloading**: Critical resources preloaded
5. **Lazy Loading**: Below-fold images lazy loaded

---

## 7. Internationalization Architecture

### 7.1 i18n Flow

```
Request: /ar/pricing
         │
         ▼
┌─────────────────────────┐
│   Middleware            │
│   - Detect locale       │
│   - Validate locale     │
│   - Set headers         │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Layout                │
│   - Set html dir="rtl"  │
│   - Load Arabic font    │
│   - Apply RTL styles    │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Page                  │
│   - setRequestLocale    │
│   - Load messages       │
│   - Render localized    │
└─────────────────────────┘
```

### 7.2 Message Organization

```
messages/
├── en/
│   ├── common.json       # Shared translations
│   ├── home.json         # Home page
│   ├── pricing.json      # Pricing page
│   ├── contact.json      # Contact page
│   ├── docs.json         # Documentation
│   └── metadata.json     # SEO meta translations
└── ar/
    ├── common.json
    ├── home.json
    ├── pricing.json
    ├── contact.json
    ├── docs.json
    └── metadata.json
```

---

## 8. Theming System

### 8.1 CSS Variables Architecture

```css
:root {
  /* Brand Colors - Configurable */
  --color-primary: 220 90% 56%;
  --color-primary-light: 220 90% 66%;
  --color-primary-dark: 220 90% 46%;
  
  --color-secondary: 280 80% 50%;
  
  /* Semantic Colors */
  --color-background: 0 0% 100%;
  --color-foreground: 222 47% 11%;
  --color-muted: 210 40% 96%;
  --color-muted-foreground: 215 16% 47%;
  
  /* Component Colors */
  --color-card: 0 0% 100%;
  --color-card-foreground: 222 47% 11%;
  --color-border: 214 32% 91%;
  
  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography Scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

.dark {
  --color-background: 222 47% 11%;
  --color-foreground: 210 40% 98%;
  --color-muted: 217 33% 17%;
  --color-muted-foreground: 215 20% 65%;
  --color-card: 222 47% 15%;
  --color-card-foreground: 210 40% 98%;
  --color-border: 217 33% 25%;
}
```

### 8.2 Theme Switching (No JS Required)

The theme system uses:
1. **CSS Media Query**: `prefers-color-scheme` for system preference
2. **CSS Class**: `.dark` on `<html>` for manual override
3. **Cookie**: Persist user preference server-side

---

## 9. Documentation System

### 9.1 Features

- **MDX Support**: Write docs in Markdown with React components
- **Auto Navigation**: Generated from file structure
- **Search**: Full-text search (Algolia or Pagefind)
- **Versioning Ready**: Structure supports future versioning
- **Code Highlighting**: Syntax highlighting for code blocks
- **Table of Contents**: Auto-generated from headings

### 9.2 Documentation Structure

```
content/
└── docs/
    ├── en/
    │   ├── getting-started/
    │   │   ├── introduction.mdx
    │   │   ├── installation.mdx
    │   │   └── quick-start.mdx
    │   ├── guides/
    │   │   ├── authentication.mdx
    │   │   └── ...
    │   └── api-reference/
    │       └── ...
    └── ar/
        └── ... (same structure)
```

---

## 10. Backend Integration

### 10.1 API Endpoints

| Endpoint | Method | Purpose | Caching |
|----------|--------|---------|---------|
| `/api/plans` | GET | Fetch pricing plans | ISR 1h |
| `/api/contact` | POST | Submit contact form | No cache |

### 10.2 Data Types (from Backend)

```typescript
// From backend PlanDto
interface Plan {
  id: string;
  arName: string;
  enName: string;
  price: number;
  period: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  isActive: boolean;
  planFeatures: PlanFeature[];
}

interface PlanFeature {
  id: string;
  planId: string;
  featureId: string;
  value: boolean | Record<string, unknown>;
}
```

---

## 11. Security Considerations

| Concern | Mitigation |
|---------|------------|
| XSS | React's automatic escaping, JSON-LD sanitization |
| CSRF | Server Actions with built-in protection |
| Headers | Security headers via next.config.ts |
| Content Policy | Strict CSP headers |

---

## 12. Deployment Architecture

### 12.1 Recommended: Vercel

- **Edge Network**: Global CDN for static assets
- **ISR**: Built-in support for incremental static regeneration
- **Analytics**: Web Vitals monitoring
- **Preview Deployments**: PR previews

### 12.2 Alternative: Self-Hosted

- **Docker**: Multi-stage build for minimal image
- **CDN**: CloudFlare for static asset caching
- **Server**: Node.js runtime for SSR/ISR

---

## 13. Monitoring & Analytics

| Tool | Purpose |
|------|---------|
| **Vercel Analytics** | Web Vitals, real user metrics |
| **Google Search Console** | SEO monitoring |
| **Lighthouse CI** | Performance regression testing |

---

## 14. Future Considerations

1. **Blog Section**: MDX-based blog with RSS feed
2. **Multi-Region**: Edge functions for regional content
3. **A/B Testing**: Feature flags for landing page variants
4. **Analytics Dashboard**: Custom analytics integration

---

## 15. Success Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | 95+ | Lighthouse CI |
| Lighthouse SEO | 100 | Lighthouse CI |
| Core Web Vitals | All Green | Google Search Console |
| Time to First Byte | < 200ms | Vercel Analytics |
| Build Time | < 2 minutes | CI/CD |

---

*Document Version: 1.0*  
*Last Updated: January 2, 2026*

