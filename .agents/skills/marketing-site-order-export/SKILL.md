---
name: marketing-site-order-export
description: Public UUID receipt route, isolated export layout, request-local deduplication, no-store fetching and accurate privacy boundaries.
---

# Digital receipts and order export

Use for the actual `/export/orders/[orderId]` route and its optional `storeId` query parameter. Read the page, `src/app/(export)/layout.tsx`, `src/features/order-export/api/get-order-export.ts`, and the backend public export controller before changing the contract.

## Current implementation

- The unlocalized `src/app/(export)/` group isolates receipt pages from marketing navigation. Locale comes from cookies/request language, not a route locale parameter.
- `getOrderExport(orderId, locale, storeId?)` calls `GET /public/export/orders/:orderId`, optionally supplying `X-Store-Id` as context.
- The backend treats the order UUID URL as a public capability link with IP throttling. There is no separate authenticated `:token` route; the optional store header is not authentication.
- React `cache()` deduplicates within a request. Fetch uses `cache: "no-store"`; do not add 60-second or cross-request caching for receipt data.
- The page awaits parameters, validates UUID format with `notFound()`, uses `ReceiptLoading`, and displays `ReceiptError` for fetch failure. `DigitalReceipt` takes the `order` prop.
- Export layout metadata is translated and non-indexable without fetching the order in `generateMetadata`.

## Change and verification requirements

1. Preserve the existing public projection and cache/privacy requirements. A new authentication or lookup contract is a coordinated backend/marketing security change requiring an agreed Cashvio scope.
2. Keep errors and layout behavior bilingual and isolated. Do not expose merchant credentials, cost/profit/internal notes or invent authorization guarantees.
3. Verify valid/invalid/missing orders, appropriate scope behavior, fresh/no-store responses, locale and responsive rendering for the changed route.
4. Verify actual browser print output when printing changes; do not claim thermal-printer compatibility from a stylesheet or screenshot alone.
5. Report executed checks and limitations in the same Cashvio task. Do not replace failure with a fake receipt or assume optional store context grants access.
