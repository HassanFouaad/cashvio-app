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
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/features', priority: 1.0, changeFrequency: 'daily' },
  { path: '/pricing', priority: 1.0, changeFrequency: 'daily' },
  { path: '/contact', priority: 1.0, changeFrequency: 'daily' },
  { path: '/register', priority: 1.0, changeFrequency: 'daily' },
  { path: '/docs', priority: 1.0, changeFrequency: 'daily' },
  { path: '/privacy', priority: 1.0, changeFrequency: 'daily' },
  { path: '/terms', priority: 1.0, changeFrequency: 'daily' },
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
