import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const lastModified = new Date();

  const staticPages = ['', '/pricing', '/contact', '/privacy', '/terms', '/docs'];

  const entries = staticPages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified,
      changeFrequency: page === '' ? 'weekly' : 'monthly' as const,
      priority: page === '' ? 1 : page === '/pricing' ? 0.9 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
        ),
      },
    }))
  );

  return entries;
}

