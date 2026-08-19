# AGENTS.md — cashvio-marketing-and-docs

Index of project standards for Cashvio marketing website & merchant documentation (`my-app`). Read only what the task needs.

Standards live in exactly two places:

- `.agents/skills/<name>/SKILL.md` — task-specific standards and step-by-step workflows
- `.cursor/rules/<name>.mdc` — always-on rules (loaded automatically by Cursor)

Resolution order: read the skill; if no skill of that name exists, read the rule file.

## Before writing code (MANDATORY)

1. Match the task under "Task → standards" below.
2. Read those files before editing anything.
3. Follow every pattern they define.
4. Self-check output against "Never ship", then `.agents/skills/seo-preflight/SKILL.md`.

## Agent Startup (Non-Cursor / CLI Agents)

If your environment does not auto-load `.cursor/rules/`, read these always-on standards before processing tasks:
- `.cursor/rules/bilingual-content.mdc` · `content-style.mdc` · `design-system.mdc` · `no-compare-pages.mdc` · `no-pwa.mdc` · `performance.mdc` · `seo-standards.mdc`

## Never ship

Front-loaded because these are the easiest to violate by accident.

- AI punctuation markers in user-visible copy: em-dashes `—`, en-dashes `–`, or arrows `→` (see `.cursor/rules/content-style.mdc`).
- Missing Arabic translations or key disparity — `messages/en.json` and `messages/ar.json` must have identical key sets.
- English-only documentation pages — docs must always exist in pairs (`.mdx` and `.ar.mdx`).
- Brand in title strings (layout template appends `| Cashvio` automatically; double branding is forbidden).
- Competitor comparison pages or routes (`/compare/*` is permanently disabled and redirected).
- PWA / Service Worker / Install prompts — manifest must keep `display: "browser"`, never installable.
- Eager 3rd-party script tags in layouts or pages — lazy-load on interaction / idle only.
- Unoptimized fonts or images — use `next/font/google` and `next/image` with explicit sizing/priority.
- Fabricated schema data (fake ratings/reviews) — only valid JSON-LD schemas from `src/config/seo.ts`.

## Stack

Next.js 16 (App Router + Turbopack) + React 19 + TypeScript. Tailwind CSS + Lucide Icons + next-intl.
Contentlayer / MDX for merchant documentation. Dev port: **3005**.

## Commands

- Dev `npm run dev` (port 3005) · build `npm run build`
- Type-check `npm run type-check` (`tsc --noEmit`) · lint `npm run lint`
- Preflight SEO content check: `node .agents/skills/seo-preflight/scripts/check-content.mjs`

## Structure

```
src/app/[locale]/       localized routes (pages, tools, industries, features, legal)
src/components/         marketing sections, UI primitives, layout, tools
src/config/             seo.ts (schemaTemplates, siteConfig), env.ts
src/lib/seo/            page-metadata.ts (buildPageMetadata, getAlternateUrls)
messages/{en,ar}.json   bilingual UI messages
content/docs/<section>/ bilingual merchant docs (*.mdx and *.ar.mdx)
scripts/                marketing-shots, clone-store
```

## Task → standards

### Marketing Pages & Landing Pages

- Creating new marketing/feature pages: see `.cursor/rules/new-marketing-page.mdc` and `.agents/skills/add-marketing-page/SKILL.md`
- Industry-specific landing pages: see `.agents/skills/add-industry-page/SKILL.md`
- Free online business tools: see `.agents/skills/add-free-tool/SKILL.md`
- Design system & styling: see `.cursor/rules/design-system.mdc`

### Content Writing & Docs

- Content voice and banned punctuation: see `.cursor/rules/content-style.mdc` and `.agents/skills/write-content/SKILL.md`
- Bilingual parity (en + ar): see `.cursor/rules/bilingual-content.mdc`
- Adding merchant documentation pages: see `.cursor/rules/docs-content.mdc` and `.agents/skills/add-doc-page/SKILL.md`

### SEO, Performance & Guardrails

- SEO metadata, keywords, and JSON-LD schema: see `.cursor/rules/seo-standards.mdc`
- Performance and script loading invariants: see `.cursor/rules/performance.mdc`
- No PWA / Browser-only policy: see `.cursor/rules/no-pwa.mdc`
- No competitor comparisons policy: see `.cursor/rules/no-compare-pages.mdc`

### Workflows & Tools

- Store cloning workflow: see `.agents/skills/clone-store/SKILL.md`
- SEO preflight check: see `.agents/skills/seo-preflight/SKILL.md`
