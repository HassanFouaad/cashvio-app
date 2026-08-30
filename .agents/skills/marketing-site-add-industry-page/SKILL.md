---
name: marketing-site-add-industry-page
description: Scaffold a new industry/business-type landing page (restaurant, pharmacy, supermarket, etc.) with bilingual copy, SEO metadata, and required registrations
---

# Add an Industry Landing Page

Industry vertical landing pages are the primary organic SEO acquisition engine for retail, food & beverage, and services niches.

## When to Use

- Adding a new retail or service vertical under `/industries/*` (e.g., `/industries/flower-shop`, `/industries/pet-store`).
- Targeting specific shopkeeper search queries for specialized cashier and inventory needs.

## Core Rules & Invariants

- **Reuse `IndustryPageShell`**: All industry pages delegate page composition to `IndustryPageShell`.
- **Bilingual Structure**: Identical namespace shape in `messages/en.json` and `messages/ar.json` under `industry<Name>`.
- **Pains & Features Mapping**: 3 realistic daily pain points and 6 actual Cashvio capabilities mapped to that vertical.
- **Keywords Strategy**: 5 to 8 high-intent keywords per language (Egypt-first for Arabic).
- **Mandatory 7-Point Registration**: Page file, messages (metadata + content), sitemap, hub links, footer navigation, `llms.txt`, and SEO freshness.

## Step-by-Step Implementation Flow

### Step 1: Create the Page Route (`src/app/[locale]/industries/<slug>/page.tsx`)

```tsx
import { type Metadata } from 'next';
import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { IndustryPageShell } from '@/features/industries/industry-page-shell';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale: locale as Locale,
    path: '/industries/flower-shop',
    namespace: 'metadata.industryFlowerShop',
    keywords: {
      en: ['flower shop POS', 'florist point of sale', 'flower store inventory software Egypt'],
      ar: ['كاشير محلات ورد', 'برنامج إدارة محل زهور', 'نظام نقاط بيع لمحل الورد'],
    },
  });
}

export default async function FlowerShopIndustryPage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryFlowerShop"
      path="/industries/flower-shop"
    />
  );
}
```

### Step 2: Add Bilingual Messages (`messages/en.json` & `ar.json`)

```json
{
  "metadata": {
    "industryFlowerShop": {
      "title": "Flower Shop POS System: Free Cashier & Inventory for Florists",
      "description": "Track custom bouquets, manage seasonal floral stock, print customer receipts, and receive online orders with Cashvio free POS."
    }
  },
  "industryFlowerShop": {
    "hero": {
      "title": "Free POS & Inventory System for Florists",
      "titleHighlight": "Flower Shops",
      "subtitle": "Track perishable blooms, manage custom bouquets, and handle holiday rushes effortlessly."
    },
    "pains": {
      "title": "Running a flower shop comes with unique daily headaches",
      "p1": {
        "title": "Perishable Stock Waste",
        "description": "Blooms expire quickly. Track stock turnover and expiry to minimize costly spoilage."
      },
      "p2": {
        "title": "Complex Custom Bouquets",
        "description": "Combine individual stems, ribbons, and vases into one unified bill with itemized pricing."
      },
      "p3": {
        "title": "Mother's Day & Valentine's Rush",
        "description": "Long queues slow down sales during peak holidays. Scan and print receipts in 2 seconds."
      }
    },
    "features": {
      "title": "Everything you need to grow your floral business",
      "subtitle": "Built-in tools to manage sales, inventory, and loyal customers.",
      "f1": { "title": "Fast POS Checkout", "description": "Quick sales screen with one-tap favorite bouquets and fast payment logging." },
      "f2": { "title": "Real-Time Stock Alerts", "description": "Know when your most popular stems are running low before peak weekends." },
      "f3": { "title": "Custom Online Storefront", "description": "Take pre-orders online and send delivery tracking links over WhatsApp." },
      "f4": { "title": "Customer Credit Ledger", "description": "Record regular customer balances and corporate account receivables." },
      "f5": { "title": "Thermal Receipt Printing", "description": "Print clean receipts with your shop logo, care instructions, and QR codes." },
      "f6": { "title": "Daily Profit Reports", "description": "See your net margins and best-selling flower arrangements at closing." }
    },
    "faq": {
      "title": "Frequently Asked Questions",
      "q1": {
        "question": "Is Cashvio really free for flower shops?",
        "answer": "Yes. Our free tier includes complete POS checkout, unlimited products, inventory tracking, and one store location with no trial expiration."
      },
      "q2": {
        "question": "Can I use barcode scanners and thermal printers?",
        "answer": "Yes. Cashvio connects with standard USB and Bluetooth thermal printers and barcode scanners on Windows, Android, and iOS."
      },
      "q3": {
        "question": "Can I take flower delivery orders online?",
        "answer": "Yes. Your free Cashvio online store lets customers browse your catalog, select delivery dates, and order via WhatsApp."
      }
    },
    "cta": {
      "title": "Start running your flower shop smoothly today",
      "subtitle": "Join thousands of retail shopkeepers. Set up your shop in 30 seconds."
    }
  }
}
```

### Step 3: Complete Registrations

1. **Sitemap (`src/app/sitemap.ts`)**: Add `/industries/flower-shop`.
2. **Industries Hub (`src/app/[locale]/industries/page.tsx`)**: Add `'flower-shop'` to `industryKeys` and `industryLinks`.
3. **Hub Messages (`industriesHub.items.flowerShop`)**: Add `{ title, description, cta }` in both `en.json` and `ar.json`.
4. **Footer Navigation (`src/config/navigation.ts`)**: Add entry under `footerNavigation.industries`.
5. **Footer Translation Keys**: Add `"industryFlowerShop": "Flower Shops"` in `messages/{en,ar}.json`.
6. **LLM Knowledge Base (`src/app/llms.txt/route.ts`)**: Add bullet under "Business types".
7. **Preflight Scan**: Run `node .agents/skills/marketing-site-seo-preflight/scripts/check-content.mjs`.
