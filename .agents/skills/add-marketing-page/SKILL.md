---
name: add-marketing-page
description: Scaffold any new marketing page (feature deep-dive, hub, or landing page) with SEO metadata, JSON-LD, bilingual copy, and required registrations
---

# Add a Marketing Page

Complete workflow for creating high-converting, SEO-optimized marketing and feature landing pages.

## When to Use

- Adding a new core feature deep-dive page (e.g. `/features/offline-mode`, `/features/thermal-printing`).
- Adding a new marketing hub or category landing page (e.g. `/features`, `/tools`).
- Adding a geo-targeted or custom conversion landing page.

*(Note: For industry-specific pages use `add-industry-page`, for interactive calculators/tools use `add-free-tool`, and for user documentation use `add-doc-page`).*

## Core Rules & Invariants

- **Centralized Metadata**: Use `buildPageMetadata()` from `@/lib/seo/page-metadata`.
- **No Double Branding**: Never add `"| Cashvio"` or `"Cashvio"` to title strings in `messages/{en,ar}.json`.
- **Structured Data**: Include WebPage + BreadcrumbList schemas at minimum, plus FAQPage when FAQs are present.
- **Async Params**: Await `params` and call `setRequestLocale(locale)`.
- **Bilingual Parity**: Exact key mirror between `messages/en.json` and `messages/ar.json`.
- **Registration Checklist**: Register route in sitemap, `llms.txt`, and footer navigation.

## Step-by-Step Implementation Flow

### Step 1: Create the Page Route (`src/app/[locale]/features/<slug>/page.tsx`)

```tsx
import { type Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { schemaTemplates, serializeSchema, siteConfig } from '@/config/seo';
import { LedgerHero } from '@/components/marketing/ledger-hero';
import { PrinterReceipt } from '@/components/marketing/printer-receipt';
import { FaqSection } from '@/components/marketing/faq-section';
import { LedgerCta } from '@/components/marketing/ledger-cta';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/features/offline-mode',
    namespace: 'metadata.offlineMode',
    keywords: {
      en: ['offline POS', 'offline cashier software', 'POS without internet Egypt'],
      ar: ['كاشير بدون نت', 'نقاط بيع اوفلاين', 'برنامج كاشير يعمل بدون انترنت'],
    },
  });
}

export default async function OfflineModePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale: typedLocale, namespace: 'offlineMode' });
  const tLedger = await getTranslations({ locale: typedLocale, namespace: 'ledger' });

  const pageUrl = `${siteConfig.url}${typedLocale === 'ar' ? '/ar' : ''}/features/offline-mode`;

  const schemas = [
    schemaTemplates.webPage({
      url: pageUrl,
      name: t('hero.title'),
      description: t('hero.subtitle'),
      locale: typedLocale,
    }),
    schemaTemplates.breadcrumbList({
      items: [
        { name: 'Home', url: siteConfig.url },
        { name: 'Features', url: `${siteConfig.url}/features` },
        { name: t('hero.title'), url: pageUrl },
      ],
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(schemas) }}
      />
      <div className="space-y-16 py-8 sm:py-12">
        <LedgerHero
          eyebrow={`${tLedger('no')} 01 · ${t('hero.badge')}`}
          title={t('hero.title')}
          subtitle={t('hero.subtitle')}
          ctaPrimary={t('hero.ctaPrimary')}
          ctaSecondary={t('hero.ctaSecondary')}
          aside={<PrinterReceipt items={t.raw('receipt.items')} />}
        />

        {/* Feature Grid & Content Sections */}

        <FaqSection
          title={t('faq.title')}
          items={t.raw('faq.items')}
        />

        <LedgerCta
          title={t('cta.title')}
          subtitle={t('cta.subtitle')}
          buttonText={t('cta.button')}
        />
      </div>
    </>
  );
}
```

### Step 2: Add Bilingual Messages (`messages/en.json` & `ar.json`)

Add the metadata namespace and page namespace:

```json
// messages/en.json
{
  "metadata": {
    "offlineMode": {
      "title": "Offline POS System: Sell Without Internet",
      "description": "Never stop selling during internet outages. Cashvio stores transactions locally and syncs automatically when reconnected."
    }
  },
  "offlineMode": {
    "hero": {
      "badge": "OFFLINE RESILIENCE",
      "title": "Sell Without Internet. Sync When Online.",
      "subtitle": "Keep checkout queues moving even when the Wi-Fi drops.",
      "ctaPrimary": "Start Free POS",
      "ctaSecondary": "View Pricing"
    },
    "faq": {
      "title": "Frequently Asked Questions",
      "items": [
        {
          "question": "How does offline mode work?",
          "answer": "Orders are saved securely in your browser storage and synced automatically once your connection is restored."
        }
      ]
    },
    "cta": {
      "title": "Never lose a sale to a dropped connection",
      "subtitle": "Create your free account today in 30 seconds.",
      "button": "Get Started Free"
    }
  }
}
```

### Step 3: Complete Mandatory Registrations

1. **Sitemap (`src/app/sitemap.ts`)**: Add `/features/offline-mode` to the static pages array.
2. **LLM Knowledge Base (`src/app/llms.txt/route.ts`)**: Add entry under the Features section.
3. **Footer Navigation (`src/config/navigation.ts`)**: Add `{ key: 'offlineMode', href: '/features/offline-mode' }` to `footerNavigation.features`.
4. **Navigation Translation Keys**: Add `"offlineMode": "Offline POS"` to `navigation` in both `messages/en.json` and `messages/ar.json`.
5. **Freshness Bump**: Update `contentLastUpdated` in `src/config/seo.ts`.
6. **Preflight Scan**: Run `node .agents/skills/seo-preflight/scripts/check-content.mjs`.

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — Handcrafted metadata, synchronous params, hardcoded brand in title
export const metadata = {
  title: 'Offline POS | Cashvio', // Double branding
};

export default function Page({ params }: { params: { locale: string } }) {
  const locale = params.locale; // Crashes in Next.js 15+
  return <div>Offline POS</div>;
}

// ✅ REQUIRED — buildPageMetadata, async params, clean schemas
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/features/offline-mode',
    namespace: 'metadata.offlineMode',
    keywords: { en: ['offline pos'], ar: ['كاشير بدون نت'] },
  });
}
```
