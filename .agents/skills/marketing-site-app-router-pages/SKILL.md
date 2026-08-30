---
name: marketing-site-app-router-pages
description: Next.js 16 App Router page conventions, async params unwrapping, generateMetadata, and setRequestLocale
---

# Next.js App Router Page Conventions

Standardized structure for all localized page routes under `src/app/[locale]/`.

## When to Use

- Creating any new route, page, or layout in the Next.js App Router.
- Refactoring existing pages to meet Next.js 16 standards.

## Core Rules & Invariants

- **Async `params` in Next.js 15+**: `params` and `searchParams` are Promises; ALWAYS `await params`.
- **`setRequestLocale(locale)`**: Invoke at the start of every page and layout component to ensure proper static generation.
- **`generateMetadata()`**: Use `buildPageMetadata()` for canonicals, alternates, and descriptions.
- **`generateStaticParams()`**: Define supported locales `[{ locale: 'en' }, { locale: 'ar' }]` where appropriate.
- **Root Layout Passthrough**: `src/app/layout.tsx` is a pure passthrough; the localized shell lives in `src/app/[locale]/layout.tsx`.

## Standard Page Template

```tsx
import { type Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { type Locale, locales } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { schemaTemplates, serializeSchema, siteConfig } from '@/config/seo';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/my-page',
    namespace: 'metadata.myPage',
    keywords: {
      en: ['target keyword', 'secondary keyword'],
      ar: ['الكلمة المفتاحية المستهدفة', 'كلمة ثانوية'],
    },
  });
}

export default async function StandardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale: typedLocale, namespace: 'myPage' });
  const pageUrl = `${siteConfig.url}${typedLocale === 'ar' ? '/ar' : ''}/my-page`;

  const schemas = [
    schemaTemplates.webPage({
      url: pageUrl,
      name: t('title'),
      description: t('description'),
      locale: typedLocale,
    }),
    schemaTemplates.breadcrumbList({
      items: [
        { name: 'Home', url: siteConfig.url },
        { name: t('title'), url: pageUrl },
      ],
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(schemas) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('description')}</p>
      </main>
    </>
  );
}
```

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — Synchronous params access (throws in Next.js 15+)
export default function BadPage({ params }: { params: { locale: string } }) {
  return <div>{params.locale}</div>;
}

// ✅ REQUIRED — Awaited params
export default async function GoodPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <div>{locale}</div>;
}
```
