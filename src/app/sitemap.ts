import type { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { source } from '@/lib/docs-source';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface PageConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  /** Override lastModified for specific pages (ISO date string) */
  lastModified?: string;
}

/* ============================================
   STATIC PAGES
   ============================================ */
const staticPages: PageConfig[] = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
{ path: 'https://ulker.cash-vio.com', priority: 1.0, changeFrequency: 'daily' },
{ path: 'https://aila-store.cash-vio.com', priority: 1.0, changeFrequency: 'daily' },
  { path: '/features', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/register', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/docs', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

const locales = ['en', 'ar'] as const;
const defaultLocale = 'en';

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = env.site.url;
  const defaultLastModified = new Date().toISOString().split('T')[0];

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
        changeFrequency: page.changeFrequency,
        priority: page.priority,
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

      // Determine priority based on page hierarchy
      let priority = 0.7;
      if (docsPath === '/docs') {
        priority = 0.9; // Docs index
      } else if (docsPath.split('/').length <= 3) {
        priority = 0.8; // Section-level pages
      }

      docsEntries.push({
        url,
        lastModified: new Date(defaultLastModified),
        changeFrequency: 'weekly' as ChangeFrequency,
        priority,
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
