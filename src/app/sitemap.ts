import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { urls, pageSEO } from '@/config/seo';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface PageConfig {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}

const pages: PageConfig[] = [
  { path: '', ...pageSEO.home },
  { path: '/features', ...pageSEO.features },
  { path: '/pricing', ...pageSEO.pricing },
  { path: '/contact', ...pageSEO.contact },
  { path: '/register', ...pageSEO.register },
  { path: '/docs', ...pageSEO.docs },
  { path: '/privacy', ...pageSEO.privacy },
  { path: '/terms', ...pageSEO.terms },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = pages.flatMap((page) =>
    routing.locales.map((locale) => {
      // English (default) has no locale prefix, Arabic uses /ar
      const localePath = locale === 'en' ? '' : `/${locale}`;
      const url = `${urls.site}${localePath}${page.path}`;

      return {
        url,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            en: `${urls.site}${page.path}`,
            ar: `${urls.site}/ar${page.path}`,
            'x-default': `${urls.site}${page.path}`,
          },
        },
      };
    })
  );

  return entries;
}
