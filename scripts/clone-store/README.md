# Clone Store

Turn a public shop webpage into a Cashvio tenant: scrape products (exact prices), create the tenant, seed catalogue + images, apply a matching storefront theme/colors, attach category + hero imagery, and emit admin credentials.

**Hand this folder + a shop URL + a system-admin refresh token to an AI agent.**  
Agent brief: [`prompt.md`](./prompt.md) · Cursor skill: [`.agents/skills/marketing-site-clone-store/`](../../.agents/skills/marketing-site-clone-store/)

## Quick start

```bash
# From my-app root
cp scripts/clone-store/.env.example scripts/clone-store/.env.local
# set CASHVIO_SYSTEM_REFRESH_TOKEN=...

npx playwright install chromium   # once

npm run clone:store -- --url "https://some-shop.example" --refresh-token "$TOKEN"
```

Output: `scripts/clone-store/runs/<runId>/credentials.json`

```json
{
  "storeSubdomain": "some-shop",
  "storefrontUrl": "https://some-shop.cash-vio.com",
  "admin": { "email": "...", "username": "...", "password": "..." },
  "theme": "EDITORIAL",
  "visuals": { "categoriesUploaded": 2, "heroesUploaded": 3 }
}
```

## Pipeline

```
03 scrape  →  01 system refresh  →  02 create tenant
         →  09 cleanup sample catalog
         →  04 download product images  →  05 seed catalog
         →  06 upload product images    →  07 apply theme/colors
         →  08 category + hero visuals
```

| Script | Role |
| --- | --- |
| `tools/run.mjs` | Orchestrator |
| `tools/01-refresh-system.mjs` | System access from refreshToken |
| `tools/02-create-tenant.mjs` | `POST /v1/system/tenants` + tenant login |
| `tools/03-scrape-catalog.mjs` | Shopify JSON / JSON-LD / Playwright (products, industry, headers, category tiles) |
| `tools/09-cleanup-samples.mjs` | Delete onboarding sample products + sample category |
| `tools/04-download-images.mjs` | Cache product images under `runs/<id>/images/` |
| `tools/05-seed-catalog.mjs` | Categories, products, stock |
| `tools/06-upload-images.mjs` | Presign S3 + attach product images |
| `tools/07-apply-theme.mjs` | Industry → Cashvio theme/palette + brand primary |
| `tools/08-sync-visuals.mjs` | Category images + hero banners (scraped or Unsplash) |

API shapes match `scripts/marketing-shots/` (seed + image upload) but always against a **new** tenant.

## Review before seed

Scrapers miss platform-specific markup. Always glance at `catalog.json`:

- `storeName`, `industry`, `brandColors.primary`
- Each `products[].name` + `price` (exact)
- Optional `headerImages[]`, `categoryDetails[{ name, imageUrl }]`
- Drop noise rows

Then resume:

```bash
npm run clone:store -- --run <runId> --skip-scrape --refresh-token "$TOKEN"
```

## Themes + visuals

See `lib/theme-map.mjs` and `lib/image-sources.mjs`.

- Fashion → EDITORIAL, food → WARM, grocery → FRESH, pharmacy/beauty → CARE, electronics → TECH, jewelry → ELEGANT, kids/gifts → PLAYFUL, else CLASSIC
- Brand hex from scrape becomes `customTokens.primary`
- Categories without images get Unsplash by keyword/industry
- Heroes: scraped banners first, then industry Unsplash set (max 3)

Force theme with `--theme EDITORIAL`. Skip visuals with `--skip-visuals`.

## Env

See `.env.example`. Required: `CASHVIO_SYSTEM_REFRESH_TOKEN` (or `--refresh-token`).

Optional: `CLONE_PLAN_ID` if freemium lacks PRODUCTS / STOREFRONT modules on your environment.

## Security

- `.env.local` and `runs/*` (except `.gitkeep`) are gitignored
- Never commit refresh tokens or generated passwords
