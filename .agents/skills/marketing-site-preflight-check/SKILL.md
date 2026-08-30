---
name: marketing-site-preflight-check
description: Fast 30-second preflight check protocol for marketing code and content changes
---

# Preflight Check Protocol (Fast Scan)

A rapid 30-second verification routine to run before completing any code, documentation, or copy task.

## When to Use

- After modifying any `.tsx`, `.ts`, `.json`, or `.mdx` file.
- Before committing changes or submitting work to the user.

## Fast Preflight Checklist

### 1. Automated Validation (10 seconds)
Run the content validator script to catch banned punctuation, key disparities, and YAML syntax issues:
```bash
node .agents/skills/marketing-site-seo-preflight/scripts/check-content.mjs
```

### 2. Type-Check Scan (10 seconds)
Confirm zero TypeScript compilation or generic type errors:
```bash
npm run type-check
```

### 3. Manual Inspection Checklist (10 seconds)

- [ ] **No Double Branding**: Did you add `"| Cashvio"` or `"Cashvio"` to any title in `messages/en.json` or `messages/ar.json`? (If yes, REMOVE it; the layout handles it).
- [ ] **No Banned Punctuation**: Check for `—`, `–`, or `→`.
- [ ] **Doc Pairing**: If you created a `.mdx` doc, did you create its `.ar.mdx` sibling and register in `meta.json` + `meta.ar.json`?
- [ ] **Async Params**: Did you `await params` and call `setRequestLocale(locale)`?
- [ ] **Locale Links**: Are internal links imported from `@/i18n/navigation`?
- [ ] **No Competitor Comparisons**: Did you mention Foodics, Loyverse, Odoo, or other named rivals? (If yes, generalize).
- [ ] **No PWA Elements**: Confirm `manifest.ts` is still `display: 'browser'`.
