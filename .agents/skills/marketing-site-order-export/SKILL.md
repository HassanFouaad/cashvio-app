---
name: marketing-site-order-export
description: Digital receipt export route (/export/receipt/:token), layout isolation, server-side caching, and printable thermal receipt rendering
---

# Digital Receipt & Order Export Architecture

Render secure, standalone printable digital receipts for customer order tracking and WhatsApp dispatch.

## When to Use

- Working on `/export/receipt/:token` route or receipt generation logic.
- Fetching order export data securely from the backend API.
- Customizing thermal receipt printing layouts for customers.

## Core Rules & Invariants

- **Layout Isolation**: The export route group `src/app/[locale]/(export)/` isolates the receipt from the main marketing header, footer, chat widget, and navigation.
- **Server Data Caching**: Fetch order data via React `cache()` in `@/features/order-export/services/export-data.ts` to deduplicate fetches between `generateMetadata` and page rendering.
- **Security**: Token-based access (`:token`) only; no credentials or merchant sensitive keys exposed in the payload.
- **Print Optimization**: Includes `@media print` stylesheets to ensure thermal receipt printer compatibility and hide browser headers.

## Step-by-Step Implementation Flow

### Step 1: Server-Side Cached Fetch

```tsx
import { cache } from 'react';
import { env } from '@/config/env';

export const getExportOrder = cache(async (token: string) => {
  const res = await fetch(`${env.API_BASE_URL}/public/orders/export/${token}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
});
```

### Step 2: Render Receipt Component

```tsx
import { notFound } from 'next/navigation';
import { getExportOrder } from '@/features/order-export/services/export-data';
import { DigitalReceipt } from '@/features/order-export/components/digital-receipt';

interface Props {
  params: Promise<{ locale: string; token: string }>;
}

export default async function ExportReceiptPage({ params }: Props) {
  const { token, locale } = await params;
  const order = await getExportOrder(token);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4 flex justify-center">
      <DigitalReceipt order={order} locale={locale} />
    </div>
  );
}
```

## ❌ FORBIDDEN vs ✅ REQUIRED

```tsx
// ❌ FORBIDDEN — Duplicate fetch without cache in metadata and page
export async function generateMetadata({ params }) {
  const data = await fetchOrder(params.token); // 1st fetch
}
export default async function Page({ params }) {
  const data = await fetchOrder(params.token); // 2nd fetch (duplicate!)
}

// ✅ REQUIRED — React cache() wrapper for single network request
import { getExportOrder } from '@/features/order-export/services/export-data';

export async function generateMetadata({ params }) {
  const data = await getExportOrder(token); // Cached
}
```
