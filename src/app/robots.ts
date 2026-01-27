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
  const commonDisallow = [
    '/api/',
    '/_next/',
    '/private/',
    '/admin/',
    '/*.json$',
    '/cdn-cgi'
  ];
  
  return {
    rules: [
      // Default rule for all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: commonDisallow,
      },
      // Google-specific optimizations (main search + specialized bots)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/assets/', '/images/'],
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // Bing-specific optimizations
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // DuckDuckGo
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // Yandex (important for Russian-speaking markets)
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // AI Crawlers - Allow indexing for AI search visibility
      {
        userAgent: 'GPTBot',
        allow: ['/', '/features', '/pricing', '/docs'],
        disallow: ['/api/', '/private/', '/admin/', '/register'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/features', '/pricing', '/docs'],
        disallow: ['/api/', '/private/', '/admin/', '/register'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/features', '/pricing', '/docs'],
        disallow: ['/api/', '/private/', '/admin/', '/register'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: ['/', '/features', '/pricing', '/docs'],
        disallow: ['/api/', '/private/', '/admin/', '/register'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/features', '/pricing', '/docs'],
        disallow: ['/api/', '/private/', '/admin/', '/register'],
      },
      // Facebook/Meta crawlers
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // Twitter/X crawler
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // LinkedIn crawler
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      // Block known bad bots and scrapers
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
