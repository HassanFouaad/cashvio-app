# Organic Search and Content Plan Implementation

## Status: Completed & Verified

All planned items across Tier 1, Tier 2, Tier 3, and the New Asset have been implemented, verified, and preflight checked.

---

## Tier 1: Immediate CTR and Intent Fixes

### 1. `/tools/vat-calculator` ✓ Completed

**Current State:**

- Title: "Free Egypt VAT Calculator: 14% Value Added Tax"
- Description: "Free Egypt 14% VAT calculator. Add VAT to a net price or extract VAT from a gross total. Instant results, no signup."
- Already uses `buildPageMetadata()` helper
- Tool component exists and functional

**Changes Required:**

- [x] Metadata already optimized with "Egypt" and "14%" at front
- [x] Description already states add-VAT and remove-VAT modes
- [x] **ADD:** Short answer block section below hero explaining how to calculate inclusive/exclusive VAT
- [x] **ADD:** Natural links to invoice generator, pricing docs, and POS tax setup docs
- [x] **VERIFY:** Arabic translation has equivalent natural intent (حساب ضريبة القيمة المضافة)
- [x] **VERIFY:** Rate is editable with 14% as Egypt default (already implemented)

**Files to Edit:**

- `messages/en.json` → Add `vatCalculator.answerBlock` section
- `messages/ar.json` → Mirror in Arabic
- `src/features/tools/components/vat-calculator-tool.tsx` → Add answer block before tool form
- `src/features/tools/tool-page-shell.tsx` → Verify link structure

---

### 2. `/features/omnichannel-retail` ✓ Completed

**Current State:**

- Title: "Track In-Store and Online Sales in One Dashboard"
- Description: "Track in-store and online sales from a single dashboard. Shared inventory, orders, customers, and channel reports. Real-time sync between POS and online store."
- 138 translation keys already exist
- Page has comprehensive sections

**Changes Required:**

- [x] **REWRITE:** Title to start with "Track In-Store and Online Sales in One Dashboard"
- [x] **REWRITE:** Description around unified dashboard query intent
- [x] **ADD:** Direct visible answer block below hero: "How do I track in-person and online sales in one dashboard?"
- [x] **ADD:** Product screenshots showing unified order view, inventory sync, channel reporting
- [x] **ENHANCE:** Links to order management, sales analytics, free online store, free POS

**Files to Edit:**

- `messages/en.json` → `metadata.omnichannelRetail.title/description` + `omnichannelRetail.answerBlock`
- `messages/ar.json` → Mirror changes
- `src/app/[locale]/features/omnichannel-retail/page.tsx` → Add answer block section
- Verify existing `FeatureScreenshot` component usage

---

### 3. `/features/coupons-and-discounts` ✓ Completed

**Current State:**

- Title: "Coupons & Discount Code Management for Retailers"
- Description: "Create, manage, and track promotional coupons..."
- 114 translation keys exist
- Full feature page with sections

**Changes Required:**

- [x] **ALIGN:** Snippet and opening with `manage coupons`, `coupon management`, usage-limit intent
- [x] **CLARIFY:** Percentage/fixed discounts, schedules, usage limits, POS + storefront validation
- [x] **CONSOLIDATE:** Overlap between feature page and coupon docs (feature = commercial, docs = setup)
- [x] **STRENGTHEN:** Bidirectional links from docs back to feature page

**Files to Edit:**

- `messages/en.json` → Refine `metadata.couponsAndDiscounts` and hero subtitle
- `messages/ar.json` → Mirror
- `src/app/[locale]/features/coupons-and-discounts/page.tsx` → Review content alignment
- `content/docs/marketing/coupons.mdx` + `.ar.mdx` → Add feature page link

---

### 4. `/tools/price-tag-generator` ✓ Completed

**Current State:**

- Title: "Free Price Tag Generator: Printable A4 Shelf Labels"
- Description: "Make printable A4 shelf price tags with product name, price, and an optional Code 128 barcode..."
- Strongest tool: 1,127 impressions, 89 clicks, 7.9% CTR
- Tool is fully functional

**Changes Required:**

- [x] **PROTECT:** Current title intent (already excellent)
- [x] **EXPAND:** Visible copy for synonym queries (price tag maker, price label generator, print price tags online free, price tag with barcode)
- [x] **CLARIFY:** PDF/browser-print behavior only where tool supports it
- [x] **ADD:** Example output images with descriptive alt text and stable dimensions
- [x] **ADD:** Links to barcode generator, barcode POS, product label docs
- [x] **EMIT:** `tool_completed` event only after successful print/export
- [x] **SHOW:** Cashvio CTA contextually after completion, not before value delivery

**Files to Edit:**

- `messages/en.json` → Expand `priceTagGenerator` description/steps with synonym coverage
- `messages/ar.json` → Mirror
- `src/features/tools/components/price-tag-generator-tool.tsx` → Add `trackEvent('tool_completed')` on print
- `src/features/tools/tool-page-shell.tsx` → Verify CTA placement timing
- **ADD:** Example output images to `/public/assets/tools/price-tag-examples/`

---

## Tier 2: Ranking and Authority Fixes ✓ Completed

### 5. `/features/free-pos` ✓ Completed

- [x] Expand synonym coverage (free cashier, online cash register, cash-register software)
- [x] Add device, barcode, receipt, inventory, free-plan boundary sections
- [x] Link to industry pages and first-sale setup docs
- [x] Avoid download claims (browser-based)

### 6. `/features/arabic-pos` ✓ Completed

- [x] Replace absolute claims with concrete RTL, receipt, language facts
- [x] Improve English snippet for Arabic-capability seekers
- [x] Improve Arabic snippet for native intent
- [x] Link to Arabic industry pages, free POS, Arabic registration

### 7. `/features/inventory-management` ✓ Completed

- [x] Shorten overlong metadata (145 chars)
- [x] Align opening with "free online inventory tracking"
- [x] Explain workflow with real stock examples
- [x] Link to low-stock, stocktake, transfer, purchase-order, dead-stock docs
- [x] Do NOT create separate inventory-tracker page (avoid cannibalization)

### 8. `/free-pos-egypt` ✓ Completed

- [x] Preserve local EGP and Arabic-support intent
- [x] Tighten title around "free cashier software in Egypt"
- [x] Link to VAT calculator, Egypt invoice generator, industry pages
- [x] Keep claims factual, avoid tax/e-invoice compliance

---

## Tier 3: Docs with Commercial Bridges ✓ Completed

### 9. `/ar/docs/reports/dead-stock-analytics` ✓ Completed

**Current State:**

- 80 impressions, 0 clicks, position 8.71
- Query: "نموذج تقرير المخزون الراكد" (76 impressions, position 8.05)
- Docs already exist in English and Arabic

**Changes Required:**

- [x] **REWRITE:** Arabic title/description around dead-stock report and template
- [x] **ADD:** Downloadable/printable example report with sample data (links to `/tools/dead-stock-report`)
- [x] **ADD:** Links to sales analytics and inventory management with product CTA after instructional content

**Files to Edit:**

- `content/docs/reports/dead-stock-analytics.ar.mdx` → Enhance with template/example
- Update metadata in frontmatter
- Add example report CSV/PDF to `/public/assets/reports/`

### 10. `/docs/integrations/paymob-online-payments` ✓ Completed

- [x] Confirm canonical and redirects work (`/en/docs/...` → root English)
- [x] Title answers Paymob integration setup intent
- [x] Link to free online store and payment setup

---

## New Asset: Dead-Stock Report Template ✓ Completed

**Deliverable:**

- [x] Browser-printable or downloadable template
- [x] Columns: SKU, Product, Quantity, Unit Cost, Stock Value, Last Sale Date, Age Bucket, Recommended Action
- [x] Explanation of 30/60/90-day aging windows
- [x] Links to dead-stock analytics docs, inventory feature, sales analytics, registration
- [x] Bilingual (English + Arabic)
- [x] `WebApplication` schema only if truly interactive

**Implementation:**

1. [x] Create `/tools/dead-stock-report` route
2. [x] Build report generator tool component
3. [x] Add to tools navigation
4. [x] Register in sitemap and llms.txt
5. [x] Add metadata translations

---

## Internal Authority Flow Updates

**Pattern:**

- Tools → relevant product capability + one next-step doc
- Feature pages → supporting docs + industries + registration
- Industry pages → max 4 relevant features
- Docs → product pages only where product solves documented task

**Implementation:**

- Create `RelatedContent` component for consistent bilingual linking
- Use descriptive anchor text (no repeated "learn more")
- Add to all modified pages

---

## Technical Checks Required

- [x] Root English canonicals correct
- [x] Arabic `/ar` canonicals correct
- [x] Verify `/en/*` redirects permanently to unprefixed URLs (`next.config.ts`)
- [x] Confirm `/en/*` absent from sitemap (`src/app/sitemap.ts`)
- [x] Validate sitemap `lastModified` stability (`defaultLastModified`)
- [x] Check visible title, metadata, OG, schema consistency
- [x] Verify `register` indexable but not growth target
- [x] Review 404 double-branding (verified in `not-found.tsx`)
- [x] Maintain mobile LCP, CLS, INP with new screenshots
- [x] Full `tsc --noEmit` and `check-content.mjs` verification passing

---

## Measurement Setup

**Track Weekly by:**

- Hostname (cash-vio.com)
- Locale (en, ar)
- Page group (tools, features, docs)
- Query type (brand, non-brand)
- Country
- Device

**Metrics:**

- Clicks and impressions
- Non-brand CTR
- Average position
- Landing sessions
- Tool completion
- CTA click
- Registration start
- Sign up
- 7-day activated tenants

**Window:** 28-day comparison

---

## Execution Order

1. [x] **Tier 1 priority pages** (immediate CTR impact)
   - VAT calculator answer block + related links
   - Omnichannel retail title + answer block
   - Coupons alignment + docs cross-links
   - Price tag tool enhancements + analytics

2. [x] **Run preflight** after each page
3. [x] **Tier 2 authority pages** (ranking improvement)
4. [x] **Tier 3 docs bridges** (commercial flow)
5. [x] **New asset: dead-stock template**
6. [x] **Internal linking audit**
7. [x] **Technical validation sweep**
8. [ ] **Content distribution** (directories, partnerships - post-deploy ongoing)

---

## Acceptance Criteria

- [x] Every changed page ships in English + Arabic with matching keys
- [x] Each page owns one primary search intent (no cannibalization)
- [x] Tool and doc bridges route traffic cleanly to commercial capabilities
- [x] Preflight checks pass: zero banned characters, strict JSON parity, zero TypeScript/lint errors

---

## Next Steps

Implementation complete. Deploy to staging/production and begin 28-day Search Console tracking window.
