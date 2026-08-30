# AGENTS.md — cashvio-marketing-and-docs

Index of project standards for Cashvio marketing website & merchant documentation (`my-app`). Read only what the task needs.

Standards live in exactly two places:

- `.agents/skills/<name>/SKILL.md` — task-specific standards and step-by-step workflows
- `.cursor/rules/<name>.mdc` — always-on rules (loaded automatically by Cursor)

Resolution order: read the skill; if no skill of that name exists, read the rule file.
Machine-readable catalog of every standard: `.cursor/standards-index.yml`.

## Before writing code (MANDATORY)

1. Match the task under "Task → standards" below.
2. Read those files before editing anything.
3. Follow every pattern they define.
4. Self-check output against "Never ship", then `.agents/skills/marketing-site-verify-marketing-code/SKILL.md` or `.agents/skills/marketing-site-preflight-check/SKILL.md`.

## Agent Startup (Non-Cursor / CLI Agents)

If your environment does not auto-load `.cursor/rules/`, read these always-on standards before processing tasks:

- `.cursor/rules/coding-standards.mdc` · `content-style.mdc` · `bilingual-content.mdc` · `seo-standards.mdc` · `design-system.mdc` · `performance.mdc` · `no-pwa.mdc` · `no-compare-pages.mdc` · `pre-flight.mdc`

## Never ship

Front-loaded because these are the easiest to violate by accident.

- AI punctuation markers in user-visible copy: em-dashes `—`, en-dashes `–`, or arrows `→` (see `.cursor/rules/content-style.mdc`).
- Missing Arabic translations or key disparity — `messages/en.json` and `messages/ar.json` must have identical key sets.
- English-only documentation pages — docs must always exist in pairs (`.mdx` and `.ar.mdx`) and be registered in `meta.json` + `meta.ar.json`.
- Brand in title strings — layout template appends `| Cashvio` automatically (`%s | Cashvio`); double branding is strictly forbidden.
- Competitor comparison pages or routes (`/compare/*` is permanently disabled and redirected; no named competitor mentions in copy).
- PWA / Service Worker / Install prompts — manifest must keep `display: "browser"`, never installable.
- Eager 3rd-party script tags in layouts or pages — lazy-load on interaction / idle only.
- Unoptimized fonts or images — use `next/font/google` and `next/image` with explicit sizing/priority.
- Synchronous `params` access on pages/layouts — Next.js 15+ requires `await params`.
- Missing `setRequestLocale(locale)` at the top of server components and layouts.
- Bare `next/link` on localized routes — use `Link` from `@/i18n/navigation`.
- Direct `document.cookie` or `localStorage` without `@/lib/utils/cross-app-sync`.
- Fabricated schema data (fake ratings/reviews) — only valid JSON-LD schemas from `src/config/seo.ts`.

## Naming (applies everywhere)

| Target | Convention | Example |
| --- | --- | --- |
| Components & Props | PascalCase, props with `Props` suffix | `LedgerHero.tsx`, `LedgerHeroProps` |
| Functions & methods | camelCase, verb-first | `buildPageMetadata`, `formatNumber` |
| Hooks | camelCase with `use` prefix | `useLocaleConfig`, `useTranslations` |
| Files & directories | kebab-case | `barcode-generator-tool.tsx`, `offline-mode/` |
| Constants | UPPER_SNAKE_CASE | `SCROLL_DEPTH_MILESTONES`, `COOKIE_KEYS` |
| CSS variables | kebab-case with `--` prefix | `--ledger-line`, `--font-receipt` |
| Translation namespaces | camelCase | `freePos`, `marginCalculator`, `metadata` |

## Stack

Next.js 16.2 (App Router + Turbopack) + React 19.2 + TypeScript. Tailwind CSS v4 + Lucide Icons + next-intl 4.7.
Fumadocs MDX for merchant documentation. Dev port: **3005**.

## Commands

- Dev `npm run dev` (port 3005) · build `npm run build`
- Type-check `npm run type-check` (`tsc --noEmit`) · lint `npm run lint`
- Preflight SEO content check: `node .agents/skills/marketing-site-seo-preflight/scripts/check-content.mjs`

## Structure

```
src/app/[locale]/       localized routes (pages, tools, industries, features, legal)
src/app/[locale]/(export)/ digital receipt export route group (isolated layout)
src/components/marketing/ marketing sections (ledger hero, receipts, comparisons, FAQs)
src/components/ui/      reusable UI primitives (buttons, inputs, cards, badges)
src/components/layout/  global shell components (header, footer, drawers, switchers)
src/features/           modular feature domains (tools, industries, order-export)
src/config/             seo.ts (schemaTemplates, siteConfig), env.ts, navigation.ts
src/lib/seo/            page-metadata.ts (buildPageMetadata, getAlternateUrls)
src/lib/utils/          cross-app-sync.ts, formatting, DOM helpers
messages/{en,ar}.json   bilingual UI messages (strict structural parity)
content/docs/<section>/ bilingual merchant docs (*.mdx and *.ar.mdx)
scripts/                marketing-shots, clone-store
```

## Task → standards

### Marketing Pages & Landing Pages

- Creating new feature landing pages: see `.agents/skills/marketing-site-add-marketing-page/SKILL.md`
- Industry-specific landing pages: see `.agents/skills/marketing-site-add-industry-page/SKILL.md`
- Free online business tools: see `.agents/skills/marketing-site-add-free-tool/SKILL.md`
- App Router page conventions & async params: see `.agents/skills/marketing-site-app-router-pages/SKILL.md`
- Design system & styling: see `.cursor/rules/design-system.mdc` and `.agents/skills/marketing-site-theme-styling/SKILL.md`
- Dynamic OpenGraph social preview cards: see `.agents/skills/marketing-site-opengraph-images/SKILL.md`

### Content Writing & Docs

- Content voice and banned punctuation: see `.cursor/rules/content-style.mdc` and `.agents/skills/marketing-site-write-content/SKILL.md`
- Bilingual parity (en + ar): see `.cursor/rules/bilingual-content.mdc`
- Adding merchant documentation pages: see `.agents/skills/marketing-site-add-doc-page/SKILL.md`

### SEO, Performance & Guardrails

- SEO metadata, keywords, and JSON-LD schema: see `.cursor/rules/seo-standards.mdc`
- Performance and script loading invariants: see `.cursor/rules/performance.mdc`
- No PWA / Browser-only policy: see `.cursor/rules/no-pwa.mdc`
- No competitor comparisons policy: see `.cursor/rules/no-compare-pages.mdc`

### Data, State & Integrations

- Analytics event tracking & attribution: see `.agents/skills/marketing-site-analytics-tracking/SKILL.md`
- Cross-app cookie synchronization: see `.agents/skills/marketing-site-cross-app-sync/SKILL.md`
- Order export & digital receipts: see `.agents/skills/marketing-site-order-export/SKILL.md`
- Lead forms & backend API: see `.agents/skills/marketing-site-forms-and-api/SKILL.md`
- Store cloning workflow: see `.agents/skills/marketing-site-clone-store/SKILL.md`

### Before Declaring the Task Done

- Comprehensive 6-step code & content audit: see `.agents/skills/marketing-site-verify-marketing-code/SKILL.md`
- Fast 30-second preflight check: see `.agents/skills/marketing-site-preflight-check/SKILL.md`
- SEO preflight check script: see `.agents/skills/marketing-site-seo-preflight/SKILL.md`

### Maintaining the Standards Themselves

- Inject standards into session: see `.agents/skills/marketing-site-inject-standards/SKILL.md`
- Extract new tribal knowledge into a skill: see `.agents/skills/marketing-site-discover-standards/SKILL.md`
- Rebuild standards index catalog: see `.agents/skills/marketing-site-index-standards/SKILL.md`
