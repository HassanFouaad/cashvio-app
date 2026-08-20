---
name: inject-standards
description: Load and inject all core project standards and task-specific skills into the current agent session
---

# Inject Standards

Load and inject the full suite of Cashvio marketing website standards into the agent session.

## When to Use

- At the start of an agent session when working on the `my-app` codebase.
- Before executing complex tasks touching multiple architectural layers.

## Standards Injected

### 1. Always-On Universal Invariants (`.cursor/rules/`)
- `coding-standards.mdc`: TypeScript strictness, Next.js 16 conventions, async `params`, `setRequestLocale`.
- `content-style.mdc`: Banned punctuation (`—`, `–`, `→`), copywriting tone, Egyptian Arabic voice.
- `bilingual-content.mdc`: Strict en/ar key parity, paired `.mdx` docs, dotted namespaces.
- `seo-standards.mdc`: No double branding in titles, `buildPageMetadata`, JSON-LD schemas via `schemaTemplates`.
- `design-system.mdc`: Tailwind v4 CSS-first variables, thermal receipt aesthetics, UI primitives.
- `performance.mdc`: Defer third-party scripts, font loading with `display: swap`, image optimization.
- `no-pwa.mdc`: Browser-only policy, `manifest.ts` keeps `display: 'browser'`.
- `no-compare-pages.mdc`: Permanent ban on named competitor pages and comparisons.
- `pre-flight.mdc`: Mandatory self-verification checklist.

### 2. Task-Specific Skills (`.agents/skills/`)
- `verify-marketing-code`: 6-step audit & 35-item anti-pattern matrix.
- `seo-preflight`: Pre-ship build & content scan workflow.
- `add-marketing-page`: Scaffold feature landing pages.
- `add-industry-page`: Scaffold industry vertical landing pages.
- `add-free-tool`: Scaffold client-side interactive business tools.
- `add-doc-page`: Add bilingual Fumadocs MDX documentation topics.
- `write-content`: Copywriting standards and retail persona.
- `theme-styling`: Tailwind CSS v4 tokens and receipt primitives.
- `analytics-tracking`: GA4 and Meta Pixel event tracking.
- `app-router-pages`: App Router conventions and metadata.
- `cross-app-sync`: Subdomain cookie sync and preferences.
- `order-export`: Standalone receipt export route.
- `forms-and-api`: Contact forms and backend API client.
- `opengraph-images`: Dynamic edge social cards.
