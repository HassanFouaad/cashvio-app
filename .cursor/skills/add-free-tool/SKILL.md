---
name: add-free-tool
description: Build a new free browser tool page (calculator, generator) under /tools with the interactive client component, bilingual copy, WebApplication schema, and all registrations. Use when adding a free tool, calculator, or generator to the marketing site.
---

# Add a Free Tool Page

Free tools are link magnets: they earn passive backlinks and rank for "free <tool>" queries. Each tool is a client component rendered inside `ToolPageShell` (which provides hero, how-to steps, Cashvio cross-sell, FAQ, CTA, and all four JSON-LD schemas automatically).

## Checklist

```
- [ ] 1. Client component src/features/tools/components/<name>-tool.tsx (+ barrel export)
- [ ] 2. Page file src/app/[locale]/tools/<slug>/page.tsx
- [ ] 3. metadata.<namespace> + <namespace> content in messages/en.json + ar.json
- [ ] 4. Tools hub: toolKeys + toolLinks + tools.items.<key> (both locales)
- [ ] 5. Sitemap entry in src/app/sitemap.ts
- [ ] 6. Footer: navigation.ts resources section + navigation.<key> labels (both locales)
- [ ] 7. llms.txt entry under "Free tools"
- [ ] 8. Run the seo-preflight skill
```

## 1. Client component

`'use client'` component with the interactive logic. Follow `src/features/tools/components/margin-calculator-tool.tsx`: plain English digits, no currency hardcoding, instant results (no submit button), download/copy actions where relevant. Export it from `src/features/tools/components/index.ts`.

## 2. Page file

Copy `src/app/[locale]/tools/barcode-generator/page.tsx`, changing slug, namespace, keywords (per-locale, money keywords like "free VAT calculator Egypt" / "حاسبة ضريبة القيمة المضافة"), and the `tool` prop.

## 3. Translation namespace shape (both locales, identical structure)

```json
"metadata": { "<namespace>": { "title": "", "description": "" } },
"<namespace>": {
  "hero": { "title": "", "titleHighlight": "", "subtitle": "" },
  "steps": {
    "badge": "", "title": "",
    "s1": { "title": "", "description": "" },
    "s2": { "title": "", "description": "" },
    "s3": { "title": "", "description": "" }
  },
  "pitch": {
    "badge": "", "title": "", "subtitle": "",
    "p1": { "title": "", "description": "" },
    "p2": { "title": "", "description": "" },
    "p3": { "title": "", "description": "" }
  },
  "faq": {
    "title": "",
    "q1": { "question": "", "answer": "" },
    "q2": { "question": "", "answer": "" },
    "q3": { "question": "", "answer": "" }
  },
  "cta": { "title": "", "subtitle": "", "button": "", "note": "" }
}
```

Copy rules: content-style + bilingual-content rules apply. Title pattern: "Free <Tool>: <Benefit>" without the brand. The `pitch` section cross-sells Cashvio honestly (the tool is free forever, no signup, and Cashvio does the bigger job).

## 4. Tools hub wiring

In `src/app/[locale]/tools/page.tsx` add the key to `toolKeys` and `toolLinks`, then add `tools.items.<key>` ({ title, description, cta }) to BOTH message files.
