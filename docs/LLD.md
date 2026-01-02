# Low-Level Design (LLD) - Landing Application

## 1. Project Structure

### 1.1 Complete Directory Structure

```
my-app/
├── public/
│   ├── fonts/                      # Self-hosted fonts (optional)
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   ├── og-image.png            # Default OG image (1200x630)
│   │   └── ...
│   ├── robots.txt                  # Static fallback (dynamic preferred)
│   └── favicon.ico
│
├── content/
│   └── docs/                       # Documentation MDX files
│       ├── en/
│       │   ├── _meta.json          # Navigation structure
│       │   ├── getting-started/
│       │   │   ├── _meta.json
│       │   │   ├── introduction.mdx
│       │   │   └── ...
│       │   └── ...
│       └── ar/
│           └── ... (mirror structure)
│
├── messages/                       # i18n translations
│   ├── en.json                     # English translations
│   └── ar.json                     # Arabic translations
│
├── src/
│   ├── app/
│   │   ├── [locale]/               # Locale-based routing
│   │   │   ├── layout.tsx          # Root locale layout
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   ├── docs/
│   │   │   │   ├── page.tsx        # Docs index
│   │   │   │   └── [...slug]/
│   │   │   │       └── page.tsx    # Dynamic doc pages
│   │   │   └── not-found.tsx
│   │   │
│   │   ├── layout.tsx              # Root layout (minimal)
│   │   ├── not-found.tsx           # Global 404
│   │   ├── sitemap.ts              # Dynamic sitemap generator
│   │   ├── robots.ts               # Dynamic robots.txt
│   │   ├── manifest.ts             # Web manifest
│   │   └── globals.css             # Global styles + Tailwind
│   │
│   ├── components/
│   │   ├── ui/                     # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── locale-switcher.tsx
│   │   │   └── theme-toggle.tsx
│   │   │
│   │   ├── sections/               # Page sections
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── pricing-cards.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── cta.tsx
│   │   │   └── ...
│   │   │
│   │   ├── docs/                   # Documentation components
│   │   │   ├── doc-sidebar.tsx
│   │   │   ├── doc-toc.tsx
│   │   │   ├── doc-pagination.tsx
│   │   │   ├── doc-search.tsx
│   │   │   └── mdx-components.tsx
│   │   │
│   │   └── seo/                    # SEO components
│   │       ├── json-ld.tsx
│   │       └── breadcrumbs.tsx
│   │
│   ├── config/
│   │   ├── site.ts                 # Site configuration
│   │   ├── navigation.ts           # Navigation structure
│   │   ├── theme.ts                # Theme configuration
│   │   └── seo.ts                  # SEO defaults
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts           # API client
│   │   │   └── plans.ts            # Plans API functions
│   │   │
│   │   ├── docs/
│   │   │   ├── mdx.ts              # MDX processing
│   │   │   ├── navigation.ts       # Docs navigation builder
│   │   │   └── search.ts           # Search index builder
│   │   │
│   │   └── utils/
│   │       ├── cn.ts               # Class name utility
│   │       ├── format.ts           # Formatting utilities
│   │       └── locale.ts           # Locale utilities
│   │
│   ├── i18n/
│   │   ├── routing.ts              # i18n routing config
│   │   ├── request.ts              # Request config
│   │   └── navigation.ts           # Localized navigation helpers
│   │
│   ├── types/
│   │   ├── index.ts                # Type exports
│   │   ├── plan.ts                 # Plan types
│   │   ├── docs.ts                 # Documentation types
│   │   └── seo.ts                  # SEO types
│   │
│   └── middleware.ts               # i18n middleware
│
├── docs/                           # Project documentation
│   ├── HLD.md
│   └── LLD.md
│
├── tailwind.config.ts              # Tailwind configuration
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
└── README.md
```

---

## 2. Core Configuration Files

### 2.1 Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-cdn.com', // Add your CDN hostname
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Experimental features for maximum performance
  experimental: {
    // Enable Partial Prerendering (when stable)
    // ppr: 'incremental',
  },
};

export default withNextIntl(nextConfig);
```

### 2.2 Tailwind Configuration (`tailwind.config.ts`)

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
        // Primary brand color (configurable via CSS variables)
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
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
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
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--color-foreground))',
            '--tw-prose-headings': 'hsl(var(--color-foreground))',
            '--tw-prose-lead': 'hsl(var(--color-muted-foreground))',
            '--tw-prose-links': 'hsl(var(--color-primary))',
            '--tw-prose-bold': 'hsl(var(--color-foreground))',
            '--tw-prose-counters': 'hsl(var(--color-muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--color-muted-foreground))',
            '--tw-prose-hr': 'hsl(var(--color-border))',
            '--tw-prose-quotes': 'hsl(var(--color-foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--color-border))',
            '--tw-prose-captions': 'hsl(var(--color-muted-foreground))',
            '--tw-prose-code': 'hsl(var(--color-foreground))',
            '--tw-prose-pre-code': 'hsl(var(--color-foreground))',
            '--tw-prose-pre-bg': 'hsl(var(--color-muted))',
            '--tw-prose-th-borders': 'hsl(var(--color-border))',
            '--tw-prose-td-borders': 'hsl(var(--color-border))',
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
```

### 2.3 Global CSS (`src/app/globals.css`)

```css
@import 'tailwindcss';

/* ============================================
   CSS VARIABLES - LIGHT THEME (DEFAULT)
   ============================================ */
:root {
  /* Primary Brand Colors - CUSTOMIZE THESE */
  --color-primary: 220 90% 56%;
  --color-primary-light: 220 90% 66%;
  --color-primary-dark: 220 90% 46%;
  --color-primary-foreground: 0 0% 100%;
  
  /* Secondary Brand Color */
  --color-secondary: 262 83% 58%;
  --color-secondary-foreground: 0 0% 100%;
  
  /* Accent Color */
  --color-accent: 173 80% 40%;
  --color-accent-foreground: 0 0% 100%;
  
  /* Semantic Colors */
  --color-background: 0 0% 100%;
  --color-foreground: 222 47% 11%;
  
  --color-muted: 210 40% 96%;
  --color-muted-foreground: 215 16% 47%;
  
  --color-card: 0 0% 100%;
  --color-card-foreground: 222 47% 11%;
  
  --color-border: 214 32% 91%;
  
  --color-destructive: 0 84% 60%;
  --color-destructive-foreground: 0 0% 100%;
  
  /* Border Radius Scale */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
}

/* ============================================
   CSS VARIABLES - DARK THEME
   ============================================ */
.dark {
  --color-primary: 220 90% 60%;
  --color-primary-light: 220 90% 70%;
  --color-primary-dark: 220 90% 50%;
  --color-primary-foreground: 0 0% 100%;
  
  --color-secondary: 262 83% 65%;
  --color-secondary-foreground: 0 0% 100%;
  
  --color-accent: 173 80% 50%;
  --color-accent-foreground: 0 0% 100%;
  
  --color-background: 222 47% 6%;
  --color-foreground: 210 40% 98%;
  
  --color-muted: 217 33% 12%;
  --color-muted-foreground: 215 20% 65%;
  
  --color-card: 222 47% 9%;
  --color-card-foreground: 210 40% 98%;
  
  --color-border: 217 33% 20%;
  
  --color-destructive: 0 63% 50%;
  --color-destructive-foreground: 0 0% 100%;
}

/* ============================================
   BASE STYLES
   ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  @apply bg-background text-foreground;
  font-family: var(--font-sans), system-ui, sans-serif;
  min-height: 100vh;
}

/* RTL Support */
[dir='rtl'] body {
  font-family: var(--font-arabic), var(--font-sans), system-ui, sans-serif;
}

/* Focus Styles for Accessibility */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary;
}

/* Selection Colors */
::selection {
  @apply bg-primary/20 text-foreground;
}

/* ============================================
   SCROLLBAR STYLING
   ============================================ */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-muted;
}

::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/30 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}

/* ============================================
   ANIMATION UTILITIES
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Staggered animation delays */
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
.animate-delay-400 { animation-delay: 400ms; }
.animate-delay-500 { animation-delay: 500ms; }

/* ============================================
   PROSE/TYPOGRAPHY OVERRIDES
   ============================================ */
.prose {
  @apply max-w-none;
}

.prose code:not(pre code) {
  @apply bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono;
}

.prose pre {
  @apply bg-muted border border-border rounded-lg;
}

/* ============================================
   RTL UTILITIES
   ============================================ */
[dir='rtl'] .rtl\:space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}
```

---

## 3. Internationalization Setup

### 3.1 i18n Routing Configuration (`src/i18n/routing.ts`)

```typescript
import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  // All supported locales
  locales,
  
  // Default locale
  defaultLocale: 'en',
  
  // Locale prefix strategy:
  // 'always' - /en/about, /ar/about
  // 'as-needed' - /about (default), /ar/about
  // 'never' - /about (with cookie/header detection)
  localePrefix: 'always',
  
  // Localized pathnames (optional)
  pathnames: {
    '/': '/',
    '/pricing': {
      en: '/pricing',
      ar: '/pricing', // Can use /التسعير for Arabic URLs
    },
    '/contact': {
      en: '/contact',
      ar: '/contact',
    },
    '/privacy': {
      en: '/privacy',
      ar: '/privacy',
    },
    '/terms': {
      en: '/terms',
      ar: '/terms',
    },
    '/docs': {
      en: '/docs',
      ar: '/docs',
    },
    '/docs/[...slug]': {
      en: '/docs/[...slug]',
      ar: '/docs/[...slug]',
    },
  },
});

// Locale metadata
export const localeMetadata: Record<Locale, {
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  hrefLang: string;
}> = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    hrefLang: 'en',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    hrefLang: 'ar',
  },
};
```

### 3.2 Request Configuration (`src/i18n/request.ts`)

```typescript
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate and get locale
  const requested = await requestLocale;
  const locale: Locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load messages for the locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    
    // Timezone for date formatting
    timeZone: 'UTC',
    
    // Date/Time formats
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'long',
        },
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'USD',
        },
        percentage: {
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      },
    },
    
    // Error handling
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn('Missing translation:', error.message);
      } else {
        console.error('i18n error:', error);
      }
    },
    
    // Fallback behavior
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`;
    },
  };
});
```

### 3.3 Navigation Helpers (`src/i18n/navigation.ts`)

```typescript
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Create navigation helpers with type safety
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
```

### 3.4 Middleware (`src/middleware.ts`)

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing, {
  // Locale detection from Accept-Language header
  localeDetection: true,
});

export const config = {
  // Match all routes except static files and API routes
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /_static (static files)
    // - /favicon.ico, sitemap.xml, robots.txt
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
```

### 3.5 Translation Messages Structure

#### English (`messages/en.json`)

```json
{
  "metadata": {
    "siteName": "Your Company",
    "siteDescription": "The best solution for your business needs",
    "home": {
      "title": "Home - Your Company",
      "description": "Welcome to Your Company - The leading platform for..."
    },
    "pricing": {
      "title": "Pricing & Plans - Your Company",
      "description": "Choose the perfect plan for your business needs"
    },
    "contact": {
      "title": "Contact Us - Your Company",
      "description": "Get in touch with our team"
    },
    "privacy": {
      "title": "Privacy Policy - Your Company",
      "description": "Learn how we protect your data"
    },
    "terms": {
      "title": "Terms & Conditions - Your Company",
      "description": "Our terms of service"
    },
    "docs": {
      "title": "Documentation - Your Company",
      "description": "Comprehensive guides and API documentation"
    }
  },
  "common": {
    "getStarted": "Get Started",
    "learnMore": "Learn More",
    "contactUs": "Contact Us",
    "viewPricing": "View Pricing",
    "readDocs": "Read Documentation",
    "switchLanguage": "العربية",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode"
  },
  "navigation": {
    "home": "Home",
    "pricing": "Pricing",
    "contact": "Contact",
    "docs": "Docs",
    "privacy": "Privacy",
    "terms": "Terms"
  },
  "home": {
    "hero": {
      "title": "Transform Your Business with Our Platform",
      "subtitle": "The all-in-one solution that helps you manage, grow, and succeed",
      "cta": "Start Free Trial"
    },
    "features": {
      "title": "Why Choose Us",
      "subtitle": "Everything you need to succeed"
    },
    "testimonials": {
      "title": "What Our Customers Say",
      "subtitle": "Join thousands of satisfied customers"
    },
    "cta": {
      "title": "Ready to Get Started?",
      "subtitle": "Start your free trial today",
      "button": "Start Now"
    }
  },
  "pricing": {
    "title": "Simple, Transparent Pricing",
    "subtitle": "Choose the plan that's right for you",
    "monthly": "Monthly",
    "yearly": "Yearly",
    "perMonth": "/month",
    "perYear": "/year",
    "popular": "Most Popular",
    "features": "Features",
    "getStarted": "Get Started",
    "contactSales": "Contact Sales",
    "enterprise": {
      "title": "Enterprise",
      "description": "For large organizations with custom needs"
    }
  },
  "contact": {
    "title": "Get in Touch",
    "subtitle": "We'd love to hear from you",
    "form": {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "subject": "Subject",
      "message": "Message",
      "submit": "Send Message",
      "sending": "Sending...",
      "success": "Message sent successfully!",
      "error": "Failed to send message. Please try again."
    },
    "info": {
      "title": "Contact Information",
      "email": "Email",
      "phone": "Phone",
      "address": "Address"
    }
  },
  "docs": {
    "searchPlaceholder": "Search documentation...",
    "onThisPage": "On this page",
    "editOnGitHub": "Edit this page",
    "lastUpdated": "Last updated",
    "previous": "Previous",
    "next": "Next"
  },
  "footer": {
    "description": "Your trusted partner for business success",
    "company": "Company",
    "resources": "Resources",
    "legal": "Legal",
    "social": "Follow Us",
    "copyright": "© {year} Your Company. All rights reserved."
  },
  "errors": {
    "notFound": {
      "title": "Page Not Found",
      "description": "The page you're looking for doesn't exist",
      "backHome": "Go Back Home"
    }
  }
}
```

#### Arabic (`messages/ar.json`)

```json
{
  "metadata": {
    "siteName": "شركتك",
    "siteDescription": "الحل الأفضل لاحتياجات عملك",
    "home": {
      "title": "الرئيسية - شركتك",
      "description": "مرحباً بك في شركتك - المنصة الرائدة في..."
    },
    "pricing": {
      "title": "الأسعار والباقات - شركتك",
      "description": "اختر الباقة المثالية لاحتياجات عملك"
    },
    "contact": {
      "title": "تواصل معنا - شركتك",
      "description": "تواصل مع فريقنا"
    },
    "privacy": {
      "title": "سياسة الخصوصية - شركتك",
      "description": "تعرف على كيفية حماية بياناتك"
    },
    "terms": {
      "title": "الشروط والأحكام - شركتك",
      "description": "شروط الخدمة الخاصة بنا"
    },
    "docs": {
      "title": "التوثيق - شركتك",
      "description": "أدلة شاملة وتوثيق API"
    }
  },
  "common": {
    "getStarted": "ابدأ الآن",
    "learnMore": "اعرف المزيد",
    "contactUs": "تواصل معنا",
    "viewPricing": "عرض الأسعار",
    "readDocs": "قراءة التوثيق",
    "switchLanguage": "English",
    "darkMode": "الوضع الداكن",
    "lightMode": "الوضع الفاتح"
  },
  "navigation": {
    "home": "الرئيسية",
    "pricing": "الأسعار",
    "contact": "تواصل معنا",
    "docs": "التوثيق",
    "privacy": "الخصوصية",
    "terms": "الشروط"
  },
  "home": {
    "hero": {
      "title": "حوّل عملك مع منصتنا",
      "subtitle": "الحل الشامل الذي يساعدك على الإدارة والنمو والنجاح",
      "cta": "ابدأ التجربة المجانية"
    },
    "features": {
      "title": "لماذا تختارنا",
      "subtitle": "كل ما تحتاجه للنجاح"
    },
    "testimonials": {
      "title": "ماذا يقول عملاؤنا",
      "subtitle": "انضم إلى آلاف العملاء الراضين"
    },
    "cta": {
      "title": "مستعد للبدء؟",
      "subtitle": "ابدأ تجربتك المجانية اليوم",
      "button": "ابدأ الآن"
    }
  },
  "pricing": {
    "title": "أسعار بسيطة وشفافة",
    "subtitle": "اختر الباقة المناسبة لك",
    "monthly": "شهري",
    "yearly": "سنوي",
    "perMonth": "/شهر",
    "perYear": "/سنة",
    "popular": "الأكثر شعبية",
    "features": "المميزات",
    "getStarted": "ابدأ الآن",
    "contactSales": "تواصل مع المبيعات",
    "enterprise": {
      "title": "المؤسسات",
      "description": "للمؤسسات الكبيرة ذات الاحتياجات الخاصة"
    }
  },
  "contact": {
    "title": "تواصل معنا",
    "subtitle": "نحب أن نسمع منك",
    "form": {
      "name": "الاسم الكامل",
      "email": "البريد الإلكتروني",
      "phone": "رقم الهاتف",
      "subject": "الموضوع",
      "message": "الرسالة",
      "submit": "إرسال الرسالة",
      "sending": "جاري الإرسال...",
      "success": "تم إرسال الرسالة بنجاح!",
      "error": "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى."
    },
    "info": {
      "title": "معلومات التواصل",
      "email": "البريد الإلكتروني",
      "phone": "الهاتف",
      "address": "العنوان"
    }
  },
  "docs": {
    "searchPlaceholder": "البحث في التوثيق...",
    "onThisPage": "في هذه الصفحة",
    "editOnGitHub": "تعديل هذه الصفحة",
    "lastUpdated": "آخر تحديث",
    "previous": "السابق",
    "next": "التالي"
  },
  "footer": {
    "description": "شريكك الموثوق لنجاح الأعمال",
    "company": "الشركة",
    "resources": "الموارد",
    "legal": "قانوني",
    "social": "تابعنا",
    "copyright": "© {year} شركتك. جميع الحقوق محفوظة."
  },
  "errors": {
    "notFound": {
      "title": "الصفحة غير موجودة",
      "description": "الصفحة التي تبحث عنها غير موجودة",
      "backHome": "العودة للرئيسية"
    }
  }
}
```

---

## 4. Layout Implementation

### 4.1 Root Layout (`src/app/layout.tsx`)

```typescript
import type { ReactNode } from 'react';

// Minimal root layout - locale layout handles everything
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
```

### 4.2 Locale Layout (`src/app/[locale]/layout.tsx`)

```typescript
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';

import { routing, localeMetadata, type Locale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { getFonts } from '@/lib/fonts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

import '../globals.css';

// Generate static params for all locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const alternateLanguages: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternateLanguages[loc] = `${siteConfig.url}/${loc}`;
  }

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t('siteName'),
      template: `%s | ${t('siteName')}`,
    },
    description: t('siteDescription'),
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: alternateLanguages,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      url: siteConfig.url,
      siteName: t('siteName'),
      title: t('siteName'),
      description: t('siteDescription'),
      images: [
        {
          url: `${siteConfig.url}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: t('siteName'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('siteName'),
      description: t('siteDescription'),
      images: [`${siteConfig.url}/images/og-image.png`],
      creator: siteConfig.social.twitter,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
  };
}

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get locale metadata
  const { direction } = localeMetadata[locale as Locale];

  // Get fonts for the locale
  const { fontSans, fontMono, fontArabic } = getFonts(locale as Locale);

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontMono.variable} ${fontArabic?.variable || ''}`}
    >
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Theme script - runs before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Header locale={locale as Locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} />
      </body>
    </html>
  );
}
```

---

## 5. SEO Implementation

### 5.1 Sitemap Generator (`src/app/sitemap.ts`)

```typescript
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { getDocsSlugs } from '@/lib/docs/navigation';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const lastModified = new Date();

  // Static pages
  const staticPages = ['', '/pricing', '/contact', '/privacy', '/terms', '/docs'];

  // Generate entries for each locale
  const staticEntries = staticPages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified,
      changeFrequency: page === '' ? 'weekly' : 'monthly' as const,
      priority: page === '' ? 1 : page === '/pricing' ? 0.9 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
        ),
      },
    }))
  );

  // Documentation pages
  const docsSlugs = await getDocsSlugs();
  const docsEntries = docsSlugs.flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/docs/${slug}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((loc) => [loc, `${baseUrl}/${loc}/docs/${slug}`])
        ),
      },
    }))
  );

  return [...staticEntries, ...docsEntries];
}
```

### 5.2 Robots Configuration (`src/app/robots.ts`)

```typescript
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
```

### 5.3 JSON-LD Component (`src/components/seo/json-ld.tsx`)

```typescript
import type { Thing, WithContext } from 'schema-dml-json-ld';

interface JsonLdProps<T extends Thing> {
  data: WithContext<T>;
}

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

// Pre-built schema generators
export function generateOrganizationSchema(config: {
  name: string;
  url: string;
  logo: string;
  description: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
  };
  social?: string[];
}) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Organization' as const,
    name: config.name,
    url: config.url,
    logo: config.logo,
    description: config.description,
    ...(config.email && { email: config.email }),
    ...(config.phone && { telephone: config.phone }),
    ...(config.address && {
      address: {
        '@type': 'PostalAddress' as const,
        streetAddress: config.address.street,
        addressLocality: config.address.city,
        addressCountry: config.address.country,
      },
    }),
    ...(config.social && { sameAs: config.social }),
  };
}

export function generateWebSiteSchema(config: {
  name: string;
  url: string;
  description: string;
  searchUrl?: string;
}) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'WebSite' as const,
    name: config.name,
    url: config.url,
    description: config.description,
    ...(config.searchUrl && {
      potentialAction: {
        '@type': 'SearchAction' as const,
        target: {
          '@type': 'EntryPoint' as const,
          urlTemplate: config.searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateProductSchema(config: {
  name: string;
  description: string;
  image: string;
  offers: Array<{
    price: number;
    priceCurrency: string;
    availability: 'InStock' | 'OutOfStock';
    url: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Product' as const,
    name: config.name,
    description: config.description,
    image: config.image,
    offers: config.offers.map((offer) => ({
      '@type': 'Offer' as const,
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      availability: `https://schema.org/${offer.availability}`,
      url: offer.url,
    })),
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  };
}
```

---

## 6. Component Architecture

### 6.1 UI Components Base (`src/lib/utils/cn.ts`)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 6.2 Button Component (`src/components/ui/button.tsx`)

```typescript
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary',
        outline:
          'border border-border bg-transparent hover:bg-muted focus-visible:ring-primary',
        ghost:
          'hover:bg-muted focus-visible:ring-primary',
        link:
          'text-primary underline-offset-4 hover:underline focus-visible:ring-primary',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### 6.3 Card Component (`src/components/ui/card.tsx`)

```typescript
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';
```

---

## 7. Page Implementations

### 7.1 Home Page (`src/app/[locale]/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { type Locale } from '@/i18n/routing';
import { JsonLd, generateOrganizationSchema, generateWebSiteSchema } from '@/components/seo/json-ld';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Testimonials } from '@/components/sections/testimonials';
import { CTA } from '@/components/sections/cta';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // JSON-LD structured data
  const organizationSchema = generateOrganizationSchema({
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    social: Object.values(siteConfig.social).filter(Boolean),
  });

  const websiteSchema = generateWebSiteSchema({
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    searchUrl: `${siteConfig.url}/${locale}/docs?q={search_term_string}`,
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      
      <Hero locale={locale as Locale} />
      <Features locale={locale as Locale} />
      <Testimonials locale={locale as Locale} />
      <CTA locale={locale as Locale} />
    </>
  );
}
```

### 7.2 Pricing Page (`src/app/[locale]/pricing/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { type Locale } from '@/i18n/routing';
import { getPlans } from '@/lib/api/plans';
import { JsonLd, generateProductSchema, generateBreadcrumbSchema } from '@/components/seo/json-ld';
import { PricingSection } from '@/components/sections/pricing';
import { FAQ } from '@/components/sections/faq';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.pricing' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/pricing`,
    },
  };
}

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch plans from backend (with ISR caching)
  const plans = await getPlans();

  // Generate product schema for each plan
  const productSchemas = plans.map((plan) =>
    generateProductSchema({
      name: locale === 'ar' ? plan.arName : plan.enName,
      description: `${plan.period.toLowerCase()} subscription plan`,
      image: `${siteConfig.url}/images/plans/${plan.id}.png`,
      offers: [
        {
          price: plan.price,
          priceCurrency: 'USD',
          availability: plan.isActive ? 'InStock' : 'OutOfStock',
          url: `${siteConfig.url}/${locale}/pricing#${plan.id}`,
        },
      ],
    })
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `${siteConfig.url}/${locale}` },
    { name: locale === 'ar' ? 'الأسعار' : 'Pricing', url: `${siteConfig.url}/${locale}/pricing` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {productSchemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      
      <PricingSection locale={locale as Locale} plans={plans} />
      <FAQ locale={locale as Locale} />
    </>
  );
}
```

### 7.3 Contact Page (`src/app/[locale]/contact/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { type Locale } from '@/i18n/routing';
import { JsonLd, generateBreadcrumbSchema } from '@/components/seo/json-ld';
import { ContactSection } from '@/components/sections/contact';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const contactSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'ContactPage' as const,
    name: locale === 'ar' ? 'تواصل معنا' : 'Contact Us',
    description: locale === 'ar' ? 'تواصل مع فريقنا' : 'Get in touch with our team',
    url: `${siteConfig.url}/${locale}/contact`,
    mainEntity: {
      '@type': 'Organization' as const,
      name: siteConfig.name,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `${siteConfig.url}/${locale}` },
    { name: locale === 'ar' ? 'تواصل معنا' : 'Contact', url: `${siteConfig.url}/${locale}/contact` },
  ]);

  return (
    <>
      <JsonLd data={contactSchema} />
      <JsonLd data={breadcrumbSchema} />
      
      <ContactSection locale={locale as Locale} />
    </>
  );
}
```

---

## 8. Documentation System

### 8.1 MDX Configuration (`src/lib/docs/mdx.ts`)

```typescript
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/docs/mdx-components';
import type { DocFrontmatter, DocPage } from '@/types/docs';

const DOCS_PATH = path.join(process.cwd(), 'content/docs');

export async function getDocBySlug(
  locale: string,
  slug: string[]
): Promise<DocPage | null> {
  const filePath = path.join(DOCS_PATH, locale, ...slug) + '.mdx';

  try {
    const source = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(source);

    const { content: compiledContent } = await compileMDX<DocFrontmatter>({
      source: content,
      components: mdxComponents,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: 'wrap',
                properties: {
                  className: ['anchor'],
                },
              },
            ],
            [
              rehypePrettyCode,
              {
                theme: 'github-dark',
                keepBackground: true,
              },
            ],
          ],
        },
      },
    });

    return {
      frontmatter: data as DocFrontmatter,
      content: compiledContent,
      slug: slug.join('/'),
    };
  } catch {
    return null;
  }
}

export async function getAllDocSlugs(locale: string): Promise<string[][]> {
  const slugs: string[][] = [];

  async function walkDir(dir: string, currentSlug: string[] = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walkDir(path.join(dir, entry.name), [...currentSlug, entry.name]);
      } else if (entry.name.endsWith('.mdx') && !entry.name.startsWith('_')) {
        const slug = entry.name.replace('.mdx', '');
        slugs.push([...currentSlug, slug]);
      }
    }
  }

  await walkDir(path.join(DOCS_PATH, locale));
  return slugs;
}
```

### 8.2 Documentation Page (`src/app/[locale]/docs/[...slug]/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { routing, type Locale } from '@/i18n/routing';
import { getDocBySlug, getAllDocSlugs } from '@/lib/docs/mdx';
import { getDocsNavigation } from '@/lib/docs/navigation';
import { JsonLd, generateBreadcrumbSchema } from '@/components/seo/json-ld';
import { DocSidebar } from '@/components/docs/doc-sidebar';
import { DocToc } from '@/components/docs/doc-toc';
import { DocPagination } from '@/components/docs/doc-pagination';

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
}

export async function generateStaticParams() {
  const params: Array<{ locale: string; slug: string[] }> = [];

  for (const locale of routing.locales) {
    const slugs = await getAllDocSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = await getDocBySlug(locale, slug);

  if (!doc) {
    return {};
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/docs/${slug.join('/')}`,
    },
  };
}

export default async function DocPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const doc = await getDocBySlug(locale, slug);

  if (!doc) {
    notFound();
  }

  const navigation = await getDocsNavigation(locale);

  // Build breadcrumb
  const breadcrumbItems = [
    { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `${siteConfig.url}/${locale}` },
    { name: locale === 'ar' ? 'التوثيق' : 'Docs', url: `${siteConfig.url}/${locale}/docs` },
    ...slug.map((s, i) => ({
      name: doc.frontmatter.title,
      url: `${siteConfig.url}/${locale}/docs/${slug.slice(0, i + 1).join('/')}`,
    })),
  ];

  const articleSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'TechArticle' as const,
    headline: doc.frontmatter.title,
    description: doc.frontmatter.description,
    datePublished: doc.frontmatter.date,
    dateModified: doc.frontmatter.lastModified || doc.frontmatter.date,
    author: {
      '@type': 'Organization' as const,
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization' as const,
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject' as const,
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
  };

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={articleSchema} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_200px] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <DocSidebar navigation={navigation} currentSlug={slug.join('/')} />
          </aside>

          {/* Main Content */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1>{doc.frontmatter.title}</h1>
            {doc.content}
            <DocPagination
              navigation={navigation}
              currentSlug={slug.join('/')}
              locale={locale as Locale}
            />
          </article>

          {/* Table of Contents */}
          <aside className="hidden xl:block">
            <DocToc headings={doc.frontmatter.headings || []} />
          </aside>
        </div>
      </div>
    </>
  );
}
```

---

## 9. API Integration

### 9.1 API Client (`src/lib/api/client.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
```

### 9.2 Plans API (`src/lib/api/plans.ts`)

```typescript
import { apiClient } from './client';
import type { Plan } from '@/types/plan';

interface PlansResponse {
  data: Plan[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export async function getPlans(): Promise<Plan[]> {
  try {
    const response = await apiClient<PlansResponse>('/api/plans', {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['plans'],
      },
    });

    return response.data.filter((plan) => plan.isActive);
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    // Return fallback data for build time
    return getFallbackPlans();
  }
}

// Fallback plans for when API is unavailable
function getFallbackPlans(): Plan[] {
  return [
    {
      id: 'basic',
      arName: 'الأساسية',
      enName: 'Basic',
      price: 9.99,
      period: 'MONTH',
      isActive: true,
      planFeatures: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'pro',
      arName: 'احترافي',
      enName: 'Professional',
      price: 29.99,
      period: 'MONTH',
      isActive: true,
      planFeatures: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'enterprise',
      arName: 'المؤسسات',
      enName: 'Enterprise',
      price: 99.99,
      period: 'MONTH',
      isActive: true,
      planFeatures: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}
```

---

## 10. Site Configuration

### 10.1 Site Config (`src/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'Your Company',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourcompany.com',
  description: 'The best solution for your business needs',
  
  // Keywords for SEO
  keywords: [
    'business',
    'platform',
    'solution',
    'enterprise',
    // Add more relevant keywords
  ],

  // Contact information
  contact: {
    email: 'contact@yourcompany.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Business Street',
      city: 'San Francisco, CA',
      country: 'United States',
    },
  },

  // Social media links
  social: {
    twitter: '@yourcompany',
    facebook: 'https://facebook.com/yourcompany',
    linkedin: 'https://linkedin.com/company/yourcompany',
    github: 'https://github.com/yourcompany',
  },

  // Feature flags
  features: {
    blog: false,
    newsletter: false,
    analytics: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
```

### 10.2 Theme Config (`src/config/theme.ts`)

```typescript
// Theme configuration - modify these values to customize your brand
export const themeConfig = {
  // Brand colors (HSL values without the hsl() wrapper)
  colors: {
    // Primary brand color
    primary: {
      light: '220 90% 56%',
      dark: '220 90% 60%',
    },
    // Secondary brand color
    secondary: {
      light: '262 83% 58%',
      dark: '262 83% 65%',
    },
    // Accent color
    accent: {
      light: '173 80% 40%',
      dark: '173 80% 50%',
    },
  },

  // Border radius scale
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Font configuration
  fonts: {
    // Sans-serif font for body text
    sans: 'Inter',
    // Monospace font for code
    mono: 'JetBrains Mono',
    // Arabic font
    arabic: 'IBM Plex Sans Arabic',
  },

  // Animation settings
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type ThemeConfig = typeof themeConfig;
```

---

## 11. Type Definitions

### 11.1 Plan Types (`src/types/plan.ts`)

```typescript
export type PlanPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface PlanFeature {
  id: string;
  planId: string;
  featureId: string;
  value: boolean | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  arName: string;
  enName: string;
  price: number;
  period: PlanPeriod;
  isActive: boolean;
  planFeatures: PlanFeature[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 11.2 Documentation Types (`src/types/docs.ts`)

```typescript
export interface DocFrontmatter {
  title: string;
  description: string;
  date?: string;
  lastModified?: string;
  author?: string;
  tags?: string[];
  headings?: Array<{
    level: number;
    text: string;
    id: string;
  }>;
}

export interface DocPage {
  frontmatter: DocFrontmatter;
  content: React.ReactNode;
  slug: string;
}

export interface DocNavItem {
  title: string;
  href: string;
  children?: DocNavItem[];
}

export interface DocsNavigation {
  items: DocNavItem[];
}
```

---

## 12. Performance Checklist

### 12.1 Build-time Optimizations

- [ ] Enable Turbopack for faster development builds
- [ ] Configure proper image optimization settings
- [ ] Set up font optimization with `next/font`
- [ ] Enable static page generation where possible
- [ ] Configure ISR for dynamic content

### 12.2 Runtime Optimizations

- [ ] Use React Server Components by default
- [ ] Minimize client-side JavaScript
- [ ] Implement code splitting with dynamic imports
- [ ] Use streaming for large pages
- [ ] Optimize third-party scripts

### 12.3 SEO Checklist

- [ ] Unique title and description for each page
- [ ] Proper heading hierarchy (h1-h6)
- [ ] Alt text for all images
- [ ] Structured data (JSON-LD) on all pages
- [ ] XML sitemap with all localized URLs
- [ ] Robots.txt properly configured
- [ ] Canonical URLs set
- [ ] Hreflang tags for all locales
- [ ] Open Graph meta tags
- [ ] Twitter Card meta tags

### 12.4 Accessibility Checklist

- [ ] Semantic HTML structure
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast ratios meet WCAG AA
- [ ] Reduced motion support
- [ ] Screen reader testing

---

## 13. Development Commands

```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Type checking
yarn type-check

# Linting
yarn lint

# Run tests
yarn test

# Analyze bundle
yarn analyze
```

---

## 14. Environment Variables

```env
# .env.local

# Site URL (required for SEO)
NEXT_PUBLIC_SITE_URL=https://yourcompany.com

# Backend API URL
NEXT_PUBLIC_API_URL=https://api.yourcompany.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature flags
NEXT_PUBLIC_ENABLE_BLOG=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

*Document Version: 1.0*  
*Last Updated: January 2, 2026*

