import type { MetadataRoute } from 'next';
import { env } from '@/config/env';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface PageConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  /** Override lastModified for specific pages (ISO date string) */
  lastModified?: string;
}

const pages: PageConfig[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/register', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/docs', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly', lastModified: '2026-01-01' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly', lastModified: '2026-01-01' },
];

const locales = ['en', 'ar'] as const;
const defaultLocale = 'en';

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = env.site.url;
  // Use a consistent date for pages without specific lastModified
  const defaultLastModified = new Date().toISOString().split('T')[0];

  const entries: MetadataRoute.Sitemap = pages.flatMap((page) =>
    locales.map((locale) => {
      // English is default (no prefix), Arabic uses /ar
      const localePath = locale === defaultLocale ? '' : `/${locale}`;
      const url = `${SITE_URL}${localePath}${page.path}`;

      return {
        url,
        lastModified: page.lastModified ? new Date(page.lastModified) : new Date(defaultLastModified),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            // x-default points to the default locale (English)
            'x-default': `${SITE_URL}${page.path}`,
            'en': `${SITE_URL}${page.path}`,
            'ar': `${SITE_URL}/ar${page.path}`,
          },
        },
      };
    })
  );

  return entries;
}
