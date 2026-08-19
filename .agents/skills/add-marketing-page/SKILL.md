---
name: add-marketing-page
description: Create any new marketing page (feature deep-dive, hub, or custom landing page) on the Cashvio site with correct metadata, JSON-LD, bilingual copy, and every required registration. Use when adding a page that is not an industry page or a free tool (those have their own skills).
---

# Add a Marketing Page

## Decide the page type first

| Type | Do this instead |
| --- | --- |
| Industry/business-type page | Use the add-industry-page skill |
| Free tool | Use the add-free-tool skill |
| Docs article | Use the add-doc-page skill |
| Feature deep-dive, hub, or custom landing page | Continue below |

## Templates to copy

- Feature deep-dive: `src/app/[locale]/features/free-pos/page.tsx` (hero, problem, solution, feature grid, FAQ, CTA, plus a page-specific SoftwareApplication schema)
- Hub/collection page: `src/app/[locale]/industries/page.tsx` (hero, ReceiptCard grid linking to children, CTA, CollectionPage schema)

## Non-negotiables for every page

1. `generateMetadata` uses `buildPageMetadata({ locale, path, namespace, keywords })` from `src/lib/seo/page-metadata.ts`. Never hand-roll metadata.
2. Keywords: `Record<Locale, string[]>`, 5 to 8 per language, money keywords first, Egypt-first where relevant.
3. JSON-LD in the server component body via `schemaTemplates` + `serializeSchema`: minimum WebPage + BreadcrumbList; add `faqPage` when the page has FAQs. Breadcrumbs include every level (Home > hub > page).
4. `setRequestLocale(locale)` at the top of the component.
5. Sections built from `@/components/marketing` components (see the design-system rule). No hand-rolled hero/CTA markup.
6. Copy follows the content-style and bilingual-content rules: both message files, no banned characters, keyword-first title WITHOUT the brand suffix.

## Registrations (page is not done without these)

```
- [ ] messages/en.json + ar.json: metadata.<ns> and <ns> content
- [ ] src/app/sitemap.ts staticPages entry
- [ ] src/app/llms.txt/route.ts entry in the right section
- [ ] src/config/navigation.ts link (footer section; header nav only for hubs)
- [ ] navigation.* / footer.* label keys in both message files
- [ ] Bump contentLastUpdated in src/config/seo.ts
- [ ] Run the seo-preflight skill
```
