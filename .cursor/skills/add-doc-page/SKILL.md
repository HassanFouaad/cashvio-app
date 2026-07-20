---
name: add-doc-page
description: Add a bilingual documentation topic (English .mdx + Arabic .ar.mdx pair) to content/docs with frontmatter, meta.json navigation, and Fumadocs components. Use when documenting a feature, writing help content, or when the user asks to add or update docs.
---

# Add a Documentation Page

Docs are SEO assets: they feed `llms.txt`/`llms-full.txt` and rank for how-to queries. Every topic ships in both languages at once.

## Checklist

```
- [ ] 1. content/docs/<section>/<slug>.mdx (English)
- [ ] 2. content/docs/<section>/<slug>.ar.mdx (Arabic, same structure)
- [ ] 3. Slug added to content/docs/<section>/meta.json "pages" array
- [ ] 4. (New section only) folder + meta.json, referenced from content/docs/meta.json
- [ ] 5. Run the seo-preflight skill
```

## File template

```mdx
---
title: Keyword-first short title
description: One plain sentence saying what the reader will learn.
---

Intro paragraph: what this feature does and why a merchant cares (2 to 3 sentences).

## Section heading

Steps, tables, and callouts...
```

## Conventions

- Both files mirror each other: same headings, same tables, same components, same order.
- Navigation paths: **Settings > Branding** (bold, `>` separator, never arrows).
- Status flows in prose: "Pending, then Preparing, then Ready, then Delivering, and finally Completed".
- UI names in bold: **Adjust Stock**. Values and codes in backticks.
- Use the existing MDX components: `<Callout>` for notes/warnings, `<Steps>` for sequences, `<Cards>` for link grids. Look at `content/docs/getting-started/onboarding.mdx` for reference.
- content-style rule applies fully: no em-dashes, en-dashes, or arrows anywhere, including frontmatter.
- Arabic file: natural Arabic (not literal translation), English technical terms kept as-is (POS, CSV, QR).
- Docs URLs are auto-included in the sitemap and llms.txt from the Fumadocs source; no manual registration beyond meta.json.

## Sidebar registration

`content/docs/<section>/meta.json` lists page slugs in display order. A page missing from `meta.json` will not appear in the sidebar. New sections are wired in `content/docs/meta.json` with a `---Section Label---` divider plus `"...<folder>"`.
