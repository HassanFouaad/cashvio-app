import type { MetadataRoute } from 'next';
import { env } from '@/config/env';

/**
 * Robots.txt Configuration for Marketing Site
 * 
 * NOTE: This only affects the main marketing domain (e.g., cash-vio.com)
 * 
 * Subdomains have their own robots.txt:
 * - portal.cash-vio.com - Blocked (private business portal)
 * - api.cash-vio.com - Blocked (API endpoints)
 * - console.cash-vio.com - Blocked (admin console)
 * 
 * Each subdomain must have its own robots.txt with "Disallow: /"
 */
export default function robots(): MetadataRoute.Robots {
  const SITE_URL = env.site.url;
  
  // Common disallowed paths
  // Note: Disallow URLs with query parameters to prevent crawling of parameterized URLs
  const commonDisallow = [
    '/api/',
    '/_next/',
    '/private/',
    '/admin/',
    '/*.json$',
    '/cdn-cgi',
    '/thank-you',
    '/export/',
    // Block URLs with query parameters to prevent duplicate content and unnecessary crawling
    '/*?*',
  ];
  
  return {
    rules: [
      // Default rule for all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: commonDisallow,
      }
     
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
