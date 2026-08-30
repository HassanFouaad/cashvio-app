---
name: marketing-site-seo-preflight
description: Verify the marketing site before finishing any task — content character scan, en/ar translation parity, JSON validity, type-check, and build. Use after any change to pages, messages, docs, or SEO config in my-app, and before telling the user work is done.
---

# SEO Preflight Check

Run this before declaring any my-app task complete. It catches the mistakes that silently hurt rankings or crash the bilingual runtime.

## Steps

All commands run from the my-app root (`D:\work\Self\code\my-app`).

### 1. Content scan (banned characters + translation parity)

```bash
node .agents/skills/marketing-site-seo-preflight/scripts/check-content.mjs
```

The script fails if it finds:
- Em-dashes, en-dashes, or arrows in `messages/*.json` string values or any `content/docs/**/*.mdx`
- Key-set mismatches between `messages/en.json` and `messages/ar.json`
- Invalid JSON in either messages file

It also lists suspicious lines in `src/` containing banned characters; comments are fine there, rendered strings are not. Review each hit.

### 2. Types and build

```bash
npm run type-check
npm run build
```

Note: stale `.next/types` errors after deleting routes disappear once `npm run build` regenerates them; build is authoritative.

### 3. Page registration spot-checks (when pages were added or removed)

- New URL present in `src/app/sitemap.ts` static pages
- New page listed in `src/app/llms.txt/route.ts`
- Footer/nav links added in `src/config/navigation.ts` plus label keys in both message files
- Titles do NOT contain the brand (the layout template appends "| Cashvio")

### 4. Freshness

If marketing content meaningfully changed, bump `contentLastUpdated` in `src/config/seo.ts` (a real date string, never `new Date()`).

## Result format

Report pass/fail per step. A task is not done while any step fails.
