import type { MetadataRoute } from 'next';
import { env } from '@/config/env';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface PageConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}

const pages: PageConfig[] = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/register', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/docs', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

const locales = ['en', 'ar'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const SITE_URL = env.site.url;

  const entries: MetadataRoute.Sitemap = pages.flatMap((page) =>
    locales.map((locale) => {
      // English is default (no prefix), Arabic uses /ar
      const localePath = locale === 'en' ? '' : `/${locale}`;
      const url = `${SITE_URL}${localePath}${page.path}`;

      return {
        url,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${SITE_URL}${page.path}`,
            ar: `${SITE_URL}/ar${page.path}`,
          },
        },
      };
    })
  );

  return entries;
}
