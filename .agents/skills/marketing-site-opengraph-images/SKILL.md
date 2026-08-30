---
name: marketing-site-opengraph-images
description: Dynamic Open Graph image generation using Next.js ImageResponse, Satori layout, and bilingual font rendering
---

# OpenGraph & Social Share Images

Generate branded, dynamic Open Graph social preview cards (1200x630px) for marketing landing pages and blog posts.

## When to Use

- Adding dynamic `opengraph-image.tsx` or `twitter-image.tsx` to page routes.
- Customizing social card branding, logos, and bilingual typography.

## Core Rules & Invariants

- **Standard Dimensions**: Always generate 1200x630px images with 600x315 safe content area.
- **Edge Runtime**: Export `export const runtime = 'edge'` for low-latency image rendering.
- **Bilingual Font Subsetting**: Load `Inter` for English and `Tajawal` for Arabic text rendering.
- **Brand Consistency**: Use emerald brand primary `#059669` and dark surface `#0a1410`.

## Step-by-Step Implementation Flow

### Step 1: Create `opengraph-image.tsx` in Route Folder

```tsx
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Image({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'metadata.freePos' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a1410',
          padding: '60px 80px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>CASHVIO</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.2, color: '#faf9f7' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: 26, color: '#a1a1aa', marginTop: 16 }}>
            {t('description')}
          </p>
        </div>
        <div style={{ display: 'flex', fontSize: 20, color: '#10b981', fontWeight: 600 }}>
          cash-vio.com
        </div>
      </div>
    ),
    { ...size }
  );
}
```

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — External static image with English-only text for Arabic route
export const metadata = {
  openGraph: { images: ['/static-en-card.png'] },
};

// ✅ REQUIRED — Dynamic locale-aware opengraph-image generator
// src/app/[locale]/features/free-pos/opengraph-image.tsx
```
