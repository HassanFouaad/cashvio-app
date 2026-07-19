import type { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { contentLastUpdated } from '@/config/seo';
import { source } from '@/lib/docs-source';

interface PageConfig {
  path: string;
  /** Override lastModified for specific pages (ISO date string) */
  lastModified?: string;
}

/* ============================================
   STATIC PAGES
   ============================================ */
const staticPages: PageConfig[] = [
  { path: '' },

  { path: '/features' },
  { path: '/features/free-pos' },
  { path: '/features/free-online-store' },
  { path: '/features/arabic-pos' },
  { path: '/features/coupons-and-discounts' },
  { path: '/features/omnichannel-retail' },
  { path: '/features/inventory-management' },
  { path: '/features/order-management' },
  { path: '/features/customer-management' },
  { path: '/features/sales-analytics' },
  { path: '/features/purchase-orders' },
  { path: '/features/returns-and-refunds' },
  { path: '/features/multi-store-management' },
  { path: '/features/team-management' },
  { path: '/pricing' },
  { path: '/contact' },
  { path: '/register' },
  { path: '/docs' },
  { path: '/privacy' },
  { path: '/terms' },

  { path: '/tools' },
  { path: '/tools/barcode-generator' },
  { path: '/tools/qr-code-generator' },
  { path: '/tools/profit-margin-calculator' },

  { path: '/compare/loyverse' },
  { path: '/compare/foodics' },
  { path: '/compare/odoo-pos' },

  { path: '/industries/cafe' },
  { path: '/industries/clothing' },
  { path: '/industries/minimarket' },
];

const locales = ['en', 'ar'] as const;
const defaultLocale = 'en';

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = env.site.url;
  // A stable date bumped on real content changes — never "today at build time",
  // which would falsely mark every URL as freshly modified on every deploy.
  const defaultLastModified = contentLastUpdated;

  /* ============================================
     STATIC PAGE ENTRIES
     ============================================ */
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => {
      const localePath = locale === defaultLocale ? '' : `/${locale}`;
      const url = `${SITE_URL}${localePath}${page.path}`;

      return {
        url,
        lastModified: page.lastModified ? new Date(page.lastModified) : new Date(defaultLastModified),
        alternates: {
          languages: {
            'x-default': `${SITE_URL}${page.path}`,
            'en': `${SITE_URL}${page.path}`,
            'ar': `${SITE_URL}/ar${page.path}`,
          },
        },
      };
    })
  );

  /* ============================================
     DOCUMENTATION PAGE ENTRIES
     Generated dynamically from Fumadocs source
     ============================================ */
  const docsEntries: MetadataRoute.Sitemap = [];
  const processedPaths = new Set<string>();

  for (const locale of locales) {
    const pages = source.getPages(locale);

    for (const page of pages) {
      // Extract the docs path without locale prefix
      // page.url is like "/en/docs/..." or "/ar/docs/..."
      const docsPath = page.url.replace(/^\/(en|ar)/, '');

      // Avoid duplicate entries (same path for both locales)
      const entryKey = `${locale}:${docsPath}`;
      if (processedPaths.has(entryKey)) continue;
      processedPaths.add(entryKey);

      const localePath = locale === defaultLocale ? '' : `/${locale}`;
      const url = `${SITE_URL}${localePath}${docsPath}`;

      docsEntries.push({
        url,
        lastModified: new Date(defaultLastModified),
   
        alternates: {
          languages: {
            'x-default': `${SITE_URL}${docsPath}`,
            'en': `${SITE_URL}${docsPath}`,
            'ar': `${SITE_URL}/ar${docsPath}`,
          },
        },
      });
    }
  }

  return [...staticEntries, ...docsEntries];
}
