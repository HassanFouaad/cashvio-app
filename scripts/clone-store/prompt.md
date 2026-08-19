# Clone Store — Agent Brief

You are cloning a real shop page into a Cashvio demo tenant end to end.

## Inputs you will receive

1. **Source URL** — a shop / catalogue web page (any public storefront)
2. **System admin refresh token** — value of `cv_refresh_token` from a Cashvio **SYSTEM** audience session (super admin)

Optional: store name override, industry hint, forced theme key, plan id, max products.

## Your job

1. Read this folder (`scripts/clone-store/`) and `.agents/skills/clone-store/SKILL.md`
2. Run the tools (or `tools/run.mjs`) to:
   - scrape products with **exact selling prices**
   - create a new tenant named after the store
   - **delete onboarding sample products + sample category** (`SAMPLE-*`, Sample Category / القسم التجريبي)
   - seed categories / products / stock
   - upload product images
   - **choose storefront theme + brand color from industry** (and scraped primary when available)
   - **attach category images** (scraped, else Unsplash by category/industry)
   - **attach hero / header images** (scraped og/banner, else stylish Unsplash by industry)
3. Return **only** the credentials output (subdomain + admin login) and the run folder path

## Non-negotiable rules

- Never commit `.env.local`, refresh tokens, or `runs/**/credentials.json` / session files
- Keep scraped **selling prices exact** (do not invent discounts or round away cents unless the source has no decimals)
- Product names max **64** characters (API constraint) — truncate carefully, keep meaning
- If scrape quality is weak, **edit `catalog.json` yourself** (add/fix products) before seeding
- Prefer exact store name from the page (`og:site_name` / brand) for the tenant name
- Cost/purchase price is usually private: if missing, leave blank so the seeder estimates at `CLONE_COST_RATIO` (default 0.4)
- Respect the source site: do not hammer pages; the scraper already throttles
- **Set `catalog.json` `industry` correctly** before theme/visuals (fashion, restaurant, grocery, pharmacy, electronics, jewelry, kids, general). Prefer industry mapping over `--theme` unless the human forced a theme
- Set `brandColors.primary` (hex) when the shop has a clear brand color
- Category / hero images: prefer scraped URLs in `categoryDetails` / `headerImages`; otherwise leave blank and let step `08` pick Unsplash

## One-command path (preferred when scrape looks good)

From `my-app` repo root (Node 20+):

```bash
# once
cp scripts/clone-store/.env.example scripts/clone-store/.env.local
# put CASHVIO_SYSTEM_REFRESH_TOKEN in .env.local OR pass --refresh-token

npx playwright install chromium   # if not already installed

npm run clone:store -- --url "https://SOURCE_SHOP" --refresh-token "REFRESH_TOKEN"
```

Artifacts land in `scripts/clone-store/runs/<runId>/`.
Final file to present: `credentials.json`.

## Step-by-step path (use when you need to review the catalog)

```bash
# 1) Scrape (creates run id)
node --env-file=scripts/clone-store/.env.local \
  scripts/clone-store/tools/03-scrape-catalog.mjs --url "https://SOURCE_SHOP"
# note the printed run id

# 2) YOU review / fix scripts/clone-store/runs/<runId>/catalog.json
#    - storeName, industry, brandColors.primary
#    - every product name + price
#    - drop junk rows
#    - optional: headerImages[], categoryDetails[{ name, imageUrl }]

# 3) Finish the pipeline
npm run clone:store -- --run <runId> --skip-scrape --refresh-token "REFRESH_TOKEN"
```

## Individual tools

| # | Script | Purpose |
| --- | --- | --- |
| 01 | `tools/01-refresh-system.mjs` | `POST /v1/auth/refresh` with system refreshToken → access cookie/Bearer |
| 02 | `tools/02-create-tenant.mjs` | `POST /v1/system/tenants` then tenant login; write `credentials.json` |
| 03 | `tools/03-scrape-catalog.mjs` | Playwright + Shopify JSON + JSON-LD → `catalog.json` (products, industry, headerImages, categoryDetails) |
| 09 | `tools/09-cleanup-samples.mjs` | Delete onboarding sample products (`SAMPLE-*`) + sample category |
| 04 | `tools/04-download-images.mjs` | Download product images to `runs/<id>/images/` |
| 05 | `tools/05-seed-catalog.mjs` | Categories + products + inventory (marketing-shots API patterns) |
| 06 | `tools/06-upload-images.mjs` | Presign S3 + attach primary product images |
| 07 | `tools/07-apply-theme.mjs` | Industry → theme/palette/font/radius + brand primary customTokens |
| 08 | `tools/08-sync-visuals.mjs` | Category images + hero banners (scraped or Unsplash) |

## Theme + color (storefront look)

Pick from industry (do **not** force `--theme` unless asked). Brand primary from scrape tints the palette via `customTokens`.

| Industry signals | Theme key |
| --- | --- |
| fashion, clothing, boutique, shoes, scarf, hijab, شال, طرح | `EDITORIAL` |
| restaurant, cafe, bakery, food | `WARM` |
| grocery, supermarket, market | `FRESH` |
| pharmacy, beauty, skincare, clinic | `CARE` |
| electronics, mobile, gadgets | `TECH` |
| jewelry, furniture, luxury, decor | `ELEGANT` |
| kids, toys, books, stationery | `PLAYFUL` |
| unknown / mixed | `CLASSIC` |

Override with `--theme EDITORIAL` or catalog `industry` / `notes` / `brandColors.primary`.

## Category + hero images

1. Scraper fills `headerImages` (og:image, hero/banner imgs) and `categoryDetails` when the source exposes them
2. Step `08` for each category without `imageUrl`:
   - use scraped `categoryDetails` match, else Unsplash keyword/industry pick (`lib/image-sources.mjs`)
3. Step `08` for heroes (max 3):
   - use scraped `headerImages` first, fill remaining slots from industry Unsplash set
4. Agent may manually set `headerImages` / `categoryDetails` in `catalog.json` before resume

## Auth facts (do not reinvent)

- Tokens are **stripped from JSON bodies**; they arrive in `Set-Cookie` (`cv_access_token`, `cv_refresh_token`)
- System APIs need a SYSTEM user JWT (refresh of a system session is enough)
- Tenant APIs need a TENANT login with the password **you generated** (API never returns plaintext password)
- After tenant create, wait briefly for onboarding (`CLONE_ONBOARDING_WAIT_MS`) so PRODUCTS / STOREFRONT features attach

## Success criteria

You are done when `credentials.json` exists and contains:

```json
{
  "storeSubdomain": "...",
  "storefrontUrl": "https://{subdomain}.cash-vio.com",
  "consoleUrl": "https://console.cash-vio.com",
  "admin": { "email": "...", "username": "...", "password": "..." },
  "tenantId": "...",
  "storeId": "...",
  "theme": "EDITORIAL",
  "visuals": { "categoriesUploaded": 2, "heroesUploaded": 3 }
}
```

Present that JSON to the human. Mention product count, theme reason, and whether category/hero images were applied.

## Failure recovery

- **401 on system calls** → re-run `01` with a fresh refresh token
- **Feature / plan errors on products or storefront** → wait and retry `05`/`07`/`08`; or pass `--plan` / `CLONE_PLAN_ID` for a plan that includes PRODUCTS_MODULE + STOREFRONT_MODULE
- **Empty scrape** → manually build `catalog.json` from the page (browser tools), then `--skip-scrape`
- **Image hotlink blocked** → seed without product images (`--skip-images`) or download manually into `runs/<id>/images/` and set `localImage` paths; category/hero can still run via Unsplash (`08`)
- **Weak visuals** → set `industry` + optional `headerImages` / `categoryDetails`, then `--only 7,8`
