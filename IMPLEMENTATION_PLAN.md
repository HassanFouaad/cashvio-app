# Organic Search and Content Plan Implementation

## Status: Ready to Execute

All preflight checks pass. Current infrastructure supports the planned changes.

---

## Tier 1: Immediate CTR and Intent Fixes

### 1. `/tools/vat-calculator` ✓ Infrastructure Ready

**Current State:**

- Title: "Free Egypt VAT Calculator: 14% Value Added Tax"
- Description: "Free Egypt 14% VAT calculator. Add VAT to a net price or extract VAT from a gross total. Instant results, no signup."
- Already uses `buildPageMetadata()` helper
- Tool component exists and functional

**Changes Required:**

- ✅ Metadata already optimized with "Egypt" and "14%" at front
- ✅ Description already states add-VAT and remove-VAT modes
- **ADD:** Short answer block section below hero explaining how to calculate inclusive/exclusive VAT
- **ADD:** Natural links to invoice generator, pricing docs, and POS tax setup docs
- **VERIFY:** Arabic translation has equivalent natural intent (حساب ضريبة القيمة المضافة)
- **VERIFY:** Rate is editable with 14% as Egypt default (already implemented)

**Files to Edit:**

- `messages/en.json` → Add `vatCalculator.answerBlock` section
- `messages/ar.json` → Mirror in Arabic
- `src/features/tools/components/vat-calculator-tool.tsx` → Add answer block before tool form
- `src/features/tools/tool-page-shell.tsx` → Verify link structure

---

### 2. `/features/omnichannel-retail` ✓ Infrastructure Ready

**Current State:**

- Title: "Omnichannel Retail Platform: One Dashboard for Physical & Online Stores"
- Description: "Manage your physical stores and online storefront from one dashboard..."
- 138 translation keys already exist
- Page has comprehensive sections

**Changes Required:**

- **REWRITE:** Title to start with "Track In-Store and Online Sales in One Dashboard"
- **REWRITE:** Description around unified dashboard query intent
- **ADD:** Direct visible answer block below hero: "How do I track in-person and online sales in one dashboard?"
- **ADD:** Product screenshots showing unified order view, inventory sync, channel reporting
- **ENHANCE:** Links to order management, sales analytics, free online store, free POS

**Files to Edit:**

- `messages/en.json` → `metadata.omnichannelRetail.title/description` + `omnichannelRetail.answerBlock`
- `messages/ar.json` → Mirror changes
- `src/app/[locale]/features/omnichannel-retail/page.tsx` → Add answer block section
- Verify existing `FeatureScreenshot` component usage

---

### 3. `/features/coupons-and-discounts` ✓ Infrastructure Ready

**Current State:**

- Title: "Coupons & Discount Code Management for Retailers"
- Description: "Create, manage, and track promotional coupons..."
- 114 translation keys exist
- Full feature page with sections

**Changes Required:**

- **ALIGN:** Snippet and opening with `manage coupons`, `coupon management`, usage-limit intent
- **CLARIFY:** Percentage/fixed discounts, schedules, usage limits, POS + storefront validation
- **CONSOLIDATE:** Overlap between feature page and coupon docs (feature = commercial, docs = setup)
- **STRENGTHEN:** Bidirectional links from docs back to feature page

**Files to Edit:**

- `messages/en.json` → Refine `metadata.couponsAndDiscounts` and hero subtitle
- `messages/ar.json` → Mirror
- `src/app/[locale]/features/coupons-and-discounts/page.tsx` → Review content alignment
- `content/docs/marketing/coupons.mdx` + `.ar.mdx` → Add feature page link

---

### 4. `/tools/price-tag-generator` ✓ Infrastructure Ready

**Current State:**

- Title: "Free Price Tag Generator: Printable A4 Shelf Labels"
- Description: "Make printable A4 shelf price tags with product name, price, and an optional Code 128 barcode..."
- Strongest tool: 1,127 impressions, 89 clicks, 7.9% CTR
- Tool is fully functional

**Changes Required:**

- **PROTECT:** Current title intent (already excellent)
- **EXPAND:** Visible copy for synonym queries (price tag maker, price label generator, print price tags online free, price tag with barcode)
- **CLARIFY:** PDF/browser-print behavior only where tool supports it
- **ADD:** Example output images with descriptive alt text and stable dimensions
- **ADD:** Links to barcode generator, barcode POS, product label docs
- **EMIT:** `tool_completed` event only after successful print/export
- **SHOW:** Cashvio CTA contextually after completion, not before value delivery

**Files to Edit:**

- `messages/en.json` → Expand `priceTagGenerator` description/steps with synonym coverage
- `messages/ar.json` → Mirror
- `src/features/tools/components/price-tag-generator-tool.tsx` → Add `trackEvent('tool_completed')` on print
- `src/features/tools/tool-page-shell.tsx` → Verify CTA placement timing
- **ADD:** Example output images to `/public/assets/tools/price-tag-examples/`

---

## Tier 2: Ranking and Authority Fixes

### 5. `/features/free-pos`

- Expand synonym coverage (free cashier, online cash register, cash-register software)
- Add device, barcode, receipt, inventory, free-plan boundary sections
- Link to industry pages and first-sale setup docs
- Avoid download claims (browser-based)

### 6. `/features/arabic-pos`

- Replace absolute claims with concrete RTL, receipt, language facts
- Improve English snippet for Arabic-capability seekers
- Improve Arabic snippet for native intent
- Link to Arabic industry pages, free POS, Arabic registration

### 7. `/features/inventory-management`

- Shorten overlong metadata
- Align opening with "free online inventory tracking"
- Explain workflow with real stock examples
- Link to low-stock, stocktake, transfer, purchase-order, dead-stock docs
- Do NOT create separate inventory-tracker page (avoid cannibalization)

### 8. `/free-pos-egypt`

- Preserve local EGP and Arabic-support intent
- Tighten title around "free cashier software in Egypt"
- Link to VAT calculator, Egypt invoice generator, industry pages
- Keep claims factual, avoid tax/e-invoice compliance

---

## Tier 3: Docs with Commercial Bridges

### 9. `/ar/docs/reports/dead-stock-analytics`

**Current State:**

- 80 impressions, 0 clicks, position 8.71
- Query: "نموذج تقرير المخزون الراكد" (76 impressions, position 8.05)
- Docs already exist in English and Arabic

**Changes Required:**

- **REWRITE:** Arabic title/description around dead-stock report and template
- **ADD:** Downloadable/printable example report with sample data
- **ADD:** Links to sales analytics and inventory management with product CTA after instructional content

**Files to Edit:**

- `content/docs/reports/dead-stock-analytics.ar.mdx` → Enhance with template/example
- Update metadata in frontmatter
- Add example report CSV/PDF to `/public/assets/reports/`

### 10. `/docs/integrations/paymob-online-payments`

- Confirm canonical and redirects work (`/en/docs/...` → root English)
- Title answers Paymob integration setup intent
- Link to free online store and payment setup

---

## New Asset: Dead-Stock Report Template

**Deliverable:**

- Browser-printable or downloadable template
- Columns: SKU, Product, Quantity, Unit Cost, Stock Value, Last Sale Date, Age Bucket, Recommended Action
- Explanation of 30/60/90-day aging windows
- Links to dead-stock analytics docs, inventory feature, sales analytics, registration
- Bilingual (English + Arabic)
- `WebApplication` schema only if truly interactive

**Implementation:**

1. Create `/tools/dead-stock-report` route
2. Build report generator tool component
3. Add to tools navigation
4. Register in sitemap and llms.txt
5. Add metadata translations

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
- [ ] Verify `/en/*` redirects permanently to unprefixed URLs
- [ ] Confirm `/en/*` absent from sitemap
- [ ] Validate sitemap `lastModified` stability
- [ ] Check visible title, metadata, OG, schema consistency
- [ ] Verify `register` indexable but not growth target
- [ ] Review 404 double-branding (if reproducible in GA4)
- [ ] Maintain mobile LCP, CLS, INP with new screenshots

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

1. **Tier 1 priority pages** (immediate CTR impact)
   - VAT calculator answer block
   - Omnichannel retail title + answer block
   - Coupons alignment
   - Price tag tool enhancements

2. **Run preflight** after each page
3. **Tier 2 authority pages** (ranking improvement)
4. **Tier 3 docs bridges** (commercial flow)
5. **New asset: dead-stock template**
6. **Internal linking audit**
7. **Technical validation sweep**
8. **Content distribution** (directories, partnerships)

---

## Acceptance Criteria

- [ ] Every changed page ships in English + Arabic with matching keys
- [ ] Each page owns one primary search intent (no cannibalization)
- [ ] Feature-cluster CTR ≥ 2.0% (28-day window)
- [ ] VAT calculator CTR ≥ 3% while in top 10
- [ ] Price-tag tool retains ≥ 8% CTR + 30% non-brand click growth
- [ ] Tool and doc conversions trackable through 7-day activation

---

## Next Steps

Ready to begin implementation. Start with Tier 1, Page 1: VAT Calculator.
