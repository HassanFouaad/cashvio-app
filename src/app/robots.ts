import type { MetadataRoute } from 'next';
import { env } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = env.site.url;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
