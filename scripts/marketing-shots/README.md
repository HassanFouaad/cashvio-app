# Marketing screenshots & demo seed

Reusable tooling to seed a Cashvio tenant with realistic apparel data and capture
portal screenshots into `public/assets` for the marketing site.

## Setup

```bash
# From my-app root
cp scripts/marketing-shots/.env.example scripts/marketing-shots/.env.local
# edit .env.local with tenant credentials

npm install
npx playwright install chromium
```

Requires Node 20+ (`--env-file` support). Credentials are **never** committed —
only `.env.example` is in git.

## Typical workflow

```bash
# 1) Seed / expand demo data (idempotent CVX-* SKUs)
npm run shots:seed

# 2) Optional helpers
npm run shots:restock
npm run shots:customer-stats
npm run shots:status

# 3) Capture screenshots → scripts/marketing-shots/raw/
npm run shots:capture
# or: npm run shots:capture -- desktop
# or: npm run shots:capture -- mobile
# or: npm run shots:capture -- pos

# 4) Process into public/assets
npm run shots:process
```

## Scripts

| File | Purpose |
| --- | --- |
| `seed.mjs` | Categories, products, stock, customers, suppliers, POs, orders, returns |
| `restock.mjs` | Safe inventory restock (only existing inventory rows) |
| `customer-stats.mjs` | PATCH customer spend/visits from orders |
| `status.mjs` / `totals.mjs` | Tenant health / counts |
| `upload-images.mjs` | Attach PNGs from `product-images/` to CVX-* products |
| `capture.mjs` | Playwright captures (en/ar × light/dark) |
| `process.mjs` | sharp → `public/assets` |

## Asset naming

`{key}-{locale}-{theme}.png` — e.g. `pos-en-dark.png`, `mobile-pos-ar-light.png`.

| Key | Form factor | Screen |
| --- | --- | --- |
| `pos` | desktop | `/pos-view/create-order` |
| `mobile-pos` | phone | same POS route |
| `orders` / `mobile-orders` | desktop / phone | `/orders` |
| `inventory` / `mobile-inventory` | desktop / phone | `/inventory` |
| `products` / `management` | desktop / phone | `/catalogue/products` |

## Notes

- Order seeding uses `source: WEB` + `IN_STORE` / `PICKUP` (skip `DELIVERY`).
- Coupons / users routes are plan-gated on Starter — capture skips them.
- `raw/` is gitignored; only processed `public/assets` are committed.
