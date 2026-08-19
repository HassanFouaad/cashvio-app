---
name: add-industry-page
description: Scaffold a new industry/business-type landing page (restaurant, pharmacy, supermarket, etc.) with bilingual copy, SEO metadata, structured data, and all required registrations. Use when adding a page under /industries or when the user asks for a POS landing page targeting a business type.
---

# Add an Industry Landing Page

Industry pages are the site's main SEO growth lever (the Loyverse playbook: one page per business type). Each page reuses `IndustryPageShell`; the real work is the bilingual copy.

## Checklist

```
- [ ] 1. Page file src/app/[locale]/industries/<slug>/page.tsx
- [ ] 2. metadata.industry<Name> in messages/en.json + ar.json
- [ ] 3. industry<Name> content namespace in both message files
- [ ] 4. Sitemap entry in src/app/sitemap.ts
- [ ] 5. Hub page: industryKeys + industryLinks + industriesHub.items.<key> (both locales)
- [ ] 6. Footer link: navigation.ts industries section + navigation.industry<Name> labels (both locales)
- [ ] 7. llms.txt entry under "Business types"
- [ ] 8. Run the seo-preflight skill
```

## 1. Page file

Copy `src/app/[locale]/industries/cafe/page.tsx` exactly, changing: slug, namespace, path, and the per-locale keywords array (5 to 8 money keywords per language, Egypt-first, e.g. "pharmacy POS Egypt" / "برنامج صيدلية").

## 2 + 3. Translations (the real work)

Namespace shape consumed by `IndustryPageShell` (identical structure in en.json and ar.json):

```json
"metadata": { "industryPharmacy": { "title": "...", "description": "..." } },
"industryPharmacy": {
  "hero": { "title": "", "titleHighlight": "", "subtitle": "" },
  "pains": {
    "title": "",
    "p1": { "title": "", "description": "" },
    "p2": { "title": "", "description": "" },
    "p3": { "title": "", "description": "" }
  },
  "features": {
    "title": "", "subtitle": "",
    "f1": { "title": "", "description": "" },
    "f2": { "title": "", "description": "" },
    "f3": { "title": "", "description": "" },
    "f4": { "title": "", "description": "" },
    "f5": { "title": "", "description": "" },
    "f6": { "title": "", "description": "" }
  },
  "faq": {
    "title": "",
    "q1": { "question": "", "answer": "" },
    "q2": { "question": "", "answer": "" },
    "q3": { "question": "", "answer": "" }
  },
  "cta": { "title": "", "subtitle": "" }
}
```

Copy rules:
- Follow the content-style and bilingual-content rules (no banned characters, natural Arabic with the file's light Egyptian flavor).
- Metadata title is keyword-first WITHOUT the brand: "Pharmacy POS System: Free Cashier for Pharmacies".
- Pains: three real daily problems of that business, written concretely (not generic "save time").
- Features f1 to f6: map SHIPPED Cashvio capabilities to that vertical (POS, online store, inventory variants, credit book, purchase orders, barcode labels, WhatsApp updates, multi-store, staff roles, reports). Never invent features the product does not have.
- FAQ answers: 2 to 3 sentences, direct answer first; target "is it really free", migration, and one vertical-specific question.

## 5. Hub page wiring

In `src/app/[locale]/industries/page.tsx` add the slug to `industryKeys` and `industryLinks`, then add `industriesHub.items.<key>` ({ title, description, cta }) to BOTH message files.

## 6. Footer

`src/config/navigation.ts`: add `{ key: 'industry<Name>', href: '/industries/<slug>' }` to the `industries` footer section, plus `navigation.industry<Name>` labels in both message files.
