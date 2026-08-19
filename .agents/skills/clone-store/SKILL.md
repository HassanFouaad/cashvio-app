---
name: clone-store
description: >-
  Clone a public shop webpage into a new Cashvio tenant: system refresh token,
  create tenant, scrape products with exact prices, seed catalog/images, apply
  industry-matched storefront theme and brand color, attach category + hero
  images (scraped or Unsplash), output subdomain + admin credentials. Use when
  the user provides a shop URL and a system-admin refreshToken, or asks to
  clone/import/demo a store from a website.
---

# Clone Store

End-to-end kit lives in `scripts/clone-store/`. **Start by reading** [`scripts/clone-store/prompt.md`](../../../scripts/clone-store/prompt.md).

## When to use

- User pastes a shop URL + system admin `refreshToken`
- User asks to clone / import / mirror a store into Cashvio for a demo
- User wants credentials (subdomain + admin) for a freshly generated tenant from a real catalogue

## Inputs

| Input | Required | Source |
| --- | --- | --- |
| Shop URL | yes | user |
| System refresh token | yes | user (`cv_refresh_token` from SYSTEM login) |
| Store name | no | scrape / `--name` |
| Industry / theme | no | scrape guess / `--industry` / `--theme` |

## Agent workflow

1. Open `scripts/clone-store/prompt.md` and `scripts/clone-store/README.md`
2. Ensure Playwright chromium is available (`npx playwright install chromium`)
3. Prefer the orchestrator:

```bash
npm run clone:store -- --url "URL" --refresh-token "TOKEN"
```

4. If scrape looks thin (`catalog.json` productCount low or prices wrong):
   - Fix `scripts/clone-store/runs/<runId>/catalog.json` yourself (browser tools / page read)
   - **Must set** `industry` and ideally `brandColors.primary`
   - Optional: `headerImages[]`, `categoryDetails[{ name, imageUrl }]`
   - Resume: `npm run clone:store -- --run <runId> --skip-scrape --refresh-token "TOKEN"`
5. Step 09 deletes onboarding samples (`SAMPLE-*` products, Sample Category / القسم التجريبي) before seed
6. Prefer industry-driven theme (step 07). Only pass `--theme` when the human forces it
7. Confirm step 08 uploaded category + hero images (`credentials.visuals`)
8. Present `credentials.json` (subdomain, storefront URL, admin email/password, theme, visuals)

## Tool map

All under `scripts/clone-store/tools/`:

| Step | File |
| --- | --- |
| Refresh system session | `01-refresh-system.mjs` |
| Create tenant + credentials | `02-create-tenant.mjs` |
| Scrape catalogue | `03-scrape-catalog.mjs` |
| Delete onboarding samples | `09-cleanup-samples.mjs` |
| Download product images | `04-download-images.mjs` |
| Seed categories/products/stock | `05-seed-catalog.mjs` |
| Upload + attach product images | `06-upload-images.mjs` |
| Apply storefront theme + brand color | `07-apply-theme.mjs` |
| Category images + hero banners | `08-sync-visuals.mjs` |
| Orchestrator | `run.mjs` |

Shared libs: `lib/api.mjs`, `lib/theme-map.mjs`, `lib/image-sources.mjs`, `lib/download-image.mjs`, `lib/sample-onboarding.mjs`, `lib/passwords.mjs`, `lib/run-io.mjs`.

## Theme + visuals selection

1. **Theme** — `lib/theme-map.mjs` (`pickTheme`). Keys: `CLASSIC`, `WARM`, `FRESH`, `CARE`, `TECH`, `ELEGANT`, `EDITORIAL`, `PLAYFUL`. Fashion/scarves → EDITORIAL, food → WARM, grocery → FRESH, pharmacy/beauty → CARE, electronics → TECH, jewelry/luxury → ELEGANT, kids/gifts → PLAYFUL.
2. **Brand color** — scraped `brandColors.primary` becomes `customTokens` on the storefront PATCH.
3. **Category images** — scraped `categoryDetails` first; else Unsplash by category keyword / industry (`lib/image-sources.mjs`), same pattern as marketing-shots.
4. **Hero / header** — scraped `headerImages` (og:image, banners) first; fill to 3 with industry Unsplash heroes.

Set `catalog.json` `industry`, `notes`, and `brandColors.primary` when the page look is clear.

## Reuse of existing scripts

Product/category/inventory/image upload patterns mirror `scripts/marketing-shots/` (`seed.mjs`, `sync-images.mjs`) but target a **newly created** tenant instead of the hardcoded marketing demo store. Unsplash curation lives in `lib/image-sources.mjs`.

## Security

- Never print the system refresh token back to the user in full if avoidable
- Never commit `runs/**` session/credential files
- Generated admin passwords live only in `credentials.json` for that run

## Done when

`runs/<runId>/credentials.json` exists with `storeSubdomain`, `storefrontUrl`, `admin.password`, `theme`, and preferably `visuals`. Summarize product count, theme key, and category/hero image counts for the user.
