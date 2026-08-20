---
name: add-free-tool
description: Scaffold a new client-side interactive business tool/calculator under /tools with ToolPageShell, WebApplication JSON-LD, and bilingual support
---

# Add a Free Online Business Tool

Interactive business tools (calculators, barcode generators, receipt builders) drive top-of-funnel inbound traffic and backlinks.

## When to Use

- Adding a new browser-based utility under `/tools/*` (e.g. `/tools/margin-calculator`, `/tools/qr-code-generator`, `/tools/vat-calculator`).
- Providing merchant utilities that generate printable or downloadable assets.

## Core Rules & Invariants

- **Client-Side Processing**: Interactive tool logic MUST run in the browser using React client components (`'use client'`). No server compute required for basic calculations.
- **Reuse `ToolPageShell`**: Wraps the tool with standard breadcrumbs, hero intro, features, FAQs, related tools, WebApplication JSON-LD, and conversion CTA.
- **Clean Export Capabilities**: If the tool generates output, provide standard copy/download options (Canvas/PNG, SVG, CSV, or browser print via `window.print()`).
- **Bilingual Support**: All UI controls, input placeholders, error messages, and calculation formulas must be fully localized.

## Step-by-Step Implementation Flow

### Step 1: Create the Interactive Client Component (`src/features/tools/components/<tool-name>-tool.tsx`)

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function MarginCalculatorTool() {
  const t = useTranslations('marginCalculatorTool');
  const [cost, setCost] = useState<number | ''>('');
  const [revenue, setRevenue] = useState<number | ''>('');

  const numCost = Number(cost) || 0;
  const numRevenue = Number(revenue) || 0;

  const profit = numRevenue - numCost;
  const marginPercent = numRevenue > 0 ? ((profit / numRevenue) * 100).toFixed(2) : '0.00';
  const markupPercent = numCost > 0 ? ((profit / numCost) * 100).toFixed(2) : '0.00';

  return (
    <Card className="p-6 max-w-xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase mb-1 text-muted-foreground">
            {t('labels.costPrice')}
          </label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-2.5 rounded-md border border-border bg-background"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase mb-1 text-muted-foreground">
            {t('labels.sellingPrice')}
          </label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-2.5 rounded-md border border-border bg-background"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-md text-center">
        <div>
          <div className="text-xs text-muted-foreground uppercase font-mono">{t('results.profit')}</div>
          <div className="text-lg font-bold text-primary font-mono">{profit.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase font-mono">{t('results.margin')}</div>
          <div className="text-lg font-bold font-mono">{marginPercent}%</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground uppercase font-mono">{t('results.markup')}</div>
          <div className="text-lg font-bold font-mono">{markupPercent}%</div>
        </div>
      </div>
    </Card>
  );
}
```

### Step 2: Create the Page Route (`src/app/[locale]/tools/<slug>/page.tsx`)

```tsx
import { type Metadata } from 'next';
import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { ToolPageShell } from '@/features/tools/tool-page-shell';
import { MarginCalculatorTool } from '@/features/tools/components/margin-calculator-tool';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/tools/margin-calculator',
    namespace: 'metadata.marginCalculator',
    keywords: {
      en: ['margin calculator', 'profit margin tool', 'markup vs margin calculator'],
      ar: ['حاسبة هامش الربح', 'حساب نسبة الربح', 'حاسبة تسعير المنتجات'],
    },
  });
}

export default async function MarginCalculatorPage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="marginCalculator"
      path="/tools/margin-calculator"
      tool={<MarginCalculatorTool />}
    />
  );
}
```

### Step 3: Complete Registrations

1. **Sitemap (`src/app/sitemap.ts`)**: Add `/tools/margin-calculator`.
2. **Tools Hub (`src/app/[locale]/tools/page.tsx`)**: Add to tool cards grid.
3. **Footer Navigation (`src/config/navigation.ts`)**: Add entry under `footerNavigation.tools`.
4. **Translations (`messages/{en,ar}.json`)**: Add `metadata.marginCalculator`, `marginCalculator` (features/faqs for shell), and `marginCalculatorTool` (client component labels).
5. **LLM Knowledge Base (`src/app/llms.txt/route.ts`)**: Add under "Free tools".
6. **Preflight Scan**: Run `node .agents/skills/seo-preflight/scripts/check-content.mjs`.
