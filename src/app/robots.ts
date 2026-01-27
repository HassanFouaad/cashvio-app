import type { MetadataRoute } from 'next';
import { env } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = env.site.url;
  
  // Common disallowed paths
  const commonDisallow = [
    '/api/',
    '/_next/',
    '/private/',
    '/admin/',
    '/*.json$',
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
