---
name: verify-marketing-code
description: Comprehensive 6-step verification protocol, 35-item anti-pattern matrix, and DRY audit for my-app
---

# Verify Marketing Code & Documentation

Comprehensive verification checklist and anti-pattern detection matrix for Cashvio marketing and documentation web applications.

## When to Use

- Before completing any feature, page, tool, documentation, or refactor in `my-app`.
- When performing a code review or agent self-audit.

## Step 1: Identify Changed Files & Category Mapping

Map every modified or added file to its architectural category:

| File Pattern | Category | Applicable Verification Steps |
| --- | --- | --- |
| `src/app/[locale]/**/page.tsx` | Route / Page | Step 2, Step 3A, Step 4 |
| `src/components/marketing/**` | Marketing UI | Step 2, Step 3B, Step 4, Step 5 |
| `src/components/ui/**` | Design Primitive | Step 2, Step 3C, Step 4, Step 5 |
| `src/features/tools/**` | Free Interactive Tool | Step 2, Step 3D, Step 4 |
| `content/docs/**` | Documentation | Step 2, Step 3E, Step 4 |
| `messages/{en,ar}.json` | i18n Translation | Step 2, Step 3F, Step 4 |
| `src/config/**` / `src/lib/**` | Core Lib / Config | Step 2, Step 3G, Step 4 |

---

## Step 2: Universal Blocking Checks

Before examining layer-specific logic, verify these 6 blocking criteria:

1. **TypeScript Strictness**: Zero `any` or `unknown`. Explicit types on all component props and functions.
2. **Banned Characters Scan**: No em-dashes (`—`), en-dashes (`–`), or arrows (`→`) in any user-facing strings or MDX.
3. **Bilingual Key Parity**: 100% key match between `messages/en.json` and `messages/ar.json`.
4. **Paired Documentation**: Every `.mdx` file has a matching `.ar.mdx` sibling.
5. **No Double Branding**: No `"Cashvio"` or `"| Cashvio"` in meta title translation strings.
6. **No PWA / No Competitor Pages**: Manifest `display: 'browser'`, zero named competitor pages or comparison headers.

---

## Step 3: Layer-Specific Checklists

### 3A. Route & Page Components (`page.tsx`)
- [ ] `params` is typed as `Promise<{ locale: string }>` and awaited (`const { locale } = await params`).
- [ ] `setRequestLocale(locale)` is called at the top of the component.
- [ ] `generateMetadata()` delegates to `buildPageMetadata()`.
- [ ] Structured data schemas use `schemaTemplates` and `serializeSchema()`.
- [ ] Internal links use `Link` from `@/i18n/navigation`.

### 3B. Marketing Components & Sections
- [ ] Server component by default unless client state or browser APIs are required.
- [ ] Translated text passed via props from server parents or fetched via `getTranslations`.
- [ ] Responsive grid layout with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- [ ] Eyebrow mono annotations use middle dot `·` (`NO. 01 · TOPIC`).

### 3C. UI Primitives & Design System
- [ ] Tailwind CSS v4 semantic tokens (`bg-surface`, `border-border`, `text-foreground`, `text-primary`).
- [ ] No hardcoded hex colors or arbitrary px container widths.
- [ ] Thermal receipt styling uses `.receipt-edge`, `.tear-line`, or `.stamp-badge`.

### 3D. Free Interactive Tools (`features/tools`)
- [ ] Uses `ToolPageShell` for layout, SEO, WebApplication JSON-LD, and bilingual metadata.
- [ ] State managed with React `useState` / `useCallback`.
- [ ] Clean output generation (Canvas, SVG, PNG export, or native browser print).

### 3E. Documentation Pages (`content/docs`)
- [ ] Paired `.mdx` and `.ar.mdx` files created simultaneously.
- [ ] Frontmatter contains `title` and `description` without double branding.
- [ ] Navigation registered in both `meta.json` and `meta.ar.json`.
- [ ] Navigation paths use `**Settings > Branding**`, never arrows.

### 3F. Translations & i18n
- [ ] Grouped under appropriate namespaces (`metadata.<page>`, `features`, `industriesHub`, `common`).
- [ ] Arabic translations sound natural with light Egyptian merchant register (`شوف`, `اللي`, `مش`).
- [ ] Technical abbreviations kept in English (`POS`, `QR`, `CSV`, `PDF`, `USB`).

---

## Step 4: Anti-Pattern Detection Matrix (35 Checks)

| # | Anti-Pattern | Severity | Remediation |
|---|---|---|---|
| 1 | Named competitor in FAQ / copy | BLOCKING | Rewrite to generic category ("Traditional POS systems") |
| 2 | Double branding in title ("... \| Cashvio") | BLOCKING | Remove brand suffix; root layout appends `%s \| Cashvio` |
| 3 | Banned punctuation (`—`, `–`, `→`) | BLOCKING | Replace with `,`, `:`, `.`, `>`, or prose transitions |
| 4 | AI marketing buzzwords ("unlock", "seamless") | WARNING | Replace with concrete merchant benefit ("Save 2 hours daily") |
| 5 | Em-dash in table exclusion `[—]` | BLOCKING | Replace with `[✗]` |
| 6 | Arrow in breadcrumbs or docs paths | BLOCKING | Use `>` (e.g. `Settings > Branding`) |
| 7 | Missing Arabic translation key | BLOCKING | Add key to `messages/ar.json` with natural copy |
| 8 | Unpaired documentation `.mdx` | BLOCKING | Create corresponding `.ar.mdx` sibling file |
| 9 | Unregistered doc in `meta.json` | WARNING | Add slug to both `meta.json` and `meta.ar.json` |
| 10 | Eager third-party script in `<head>` | BLOCKING | Defer with `strategy="lazyOnload"` and interaction trigger |
| 11 | Direct font `<link>` stylesheet | BLOCKING | Use `next/font/google` (`Inter`, `Tajawal`) with `display: 'swap'` |
| 12 | Missing `priority` on above-the-fold hero image | WARNING | Add `priority` prop to active mode hero screenshot |
| 13 | Raw `<img>` tag without aspect ratio | BLOCKING | Use `next/image` (`<Image />`) with explicit dimensions |
| 14 | Dynamic `new Date()` in SEO freshness | BLOCKING | Use static `contentLastUpdated` from `@/config/seo` |
| 15 | Fabricated review/rating JSON-LD | BLOCKING | Remove fabricated properties; keep only valid schemas |
| 16 | Manifest `display: 'standalone'` | BLOCKING | Keep `display: 'browser'` in `src/app/manifest.ts` |
| 17 | Direct `localStorage` bypassing sync | WARNING | Use helpers from `@/lib/utils/cross-app-sync` |
| 18 | Bare `next/link` on localized route | BLOCKING | Import `Link` from `@/i18n/navigation` |
| 19 | Hardcoded `/ar/` in link hrefs | BLOCKING | Use canonical route path (`/features`) with `Link` |
| 20 | Synchronous `params.locale` access | BLOCKING | Await `params` (`const { locale } = await params`) |
| 21 | Missing `setRequestLocale` in page | BLOCKING | Call `setRequestLocale(locale)` at the top of server component |
| 22 | Unnecessary `'use client'` on static UI | WARNING | Remove `'use client'` and pass server-translated props |
| 23 | Hardcoded hex color in component | WARNING | Use semantic Tailwind class (`bg-surface`, `text-primary`) |
| 24 | Hardcoded container width (`1200px`) | WARNING | Use `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| 25 | English text hardcoded in JSX | BLOCKING | Move to `messages/{en,ar}.json` under appropriate namespace |
| 26 | Hardcoded English `aria-label` | BLOCKING | Translate via `t('common:...')` or appropriate namespace |
| 27 | Inline JSON-LD without `serializeSchema` | BLOCKING | Use `serializeSchema()` to escape XSS entities |
| 28 | Hand-rolled metadata in `generateMetadata` | BLOCKING | Use `buildPageMetadata()` helper |
| 29 | Re-implementing thermal receipt border | WARNING | Use `.receipt-edge` or `.tear-line` utility classes |
| 30 | Re-implementing free tool layout | WARNING | Use `ToolPageShell` component |
| 31 | Re-implementing industry vertical layout | WARNING | Use `IndustryPageShell` component |
| 32 | Untranslated validation error in form | BLOCKING | Use bilingual validation strings from messages |
| 33 | Broken external link tracking | WARNING | Use `TrackedExternalLink` for outbound affiliate/docs links |
| 34 | Bypassing `AnalyticsProvider` for GA | BLOCKING | Use existing `@next/third-parties/google` wrapper |
| 35 | Uncached order export receipt fetch | WARNING | Wrap fetch in React `cache()` to deduplicate layout/page |

---

## Step 5: DRY Violation Detection Matrix

| Repeated Logic Pattern | Preferred Shared Solution |
| --- | --- |
| Metadata & Alternates | `buildPageMetadata()` in `@/lib/seo/page-metadata` |
| JSON-LD Schemas | `schemaTemplates` in `@/config/seo` |
| Thermal Receipt Shell | `PrinterReceipt` in `@/components/marketing/printer-receipt` |
| Dual Light/Dark Screenshots | `ThemedShot` in `@/components/ui/themed-shot` |
| Industry Vertical Shell | `IndustryPageShell` in `@/features/industries/industry-page-shell` |
| Free Tool Page Shell | `ToolPageShell` in `@/features/tools/tool-page-shell` |
| Cross-Subdomain Cookies | `cross-app-sync.ts` in `@/lib/utils/cross-app-sync` |
| Client Button with Tracking | `TrackedButtonLink` in `@/components/marketing/tracked-button-link` |

---

## Step 6: Verification Report Format

Generate a concise markdown verification summary:

```markdown
### Verification Summary: [Feature / Page Name]

- **Files Checked**: `src/app/[locale]/...`, `messages/en.json`, `messages/ar.json`
- **Banned Punctuation Scan**: PASS (0 violations)
- **i18n Key Parity**: PASS (100% parity across EN and AR)
- **SEO & Double Branding**: PASS (No brand suffix in title, buildPageMetadata used)
- **App Router & Async Params**: PASS (`await params` + `setRequestLocale` present)
- **Anti-Pattern Matrix Audit**: 35/35 checks cleared
- **Automated Preflight Command**: `node .agents/skills/seo-preflight/scripts/check-content.mjs` -> PASS
```
