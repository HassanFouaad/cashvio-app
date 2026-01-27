import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { brand } from '@/config/seo';

/**
 * Web App Manifest - PWA Configuration
 * 
 * SEO Benefits:
 * - Enables "Add to Home Screen" prompts
 * - Improves mobile engagement signals
 * - Better Core Web Vitals through offline capability
 * 
 * Note: For Arabic locale, a separate manifest-ar.json should be served
 * This default manifest serves the English version
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: `${siteConfig.name} - ${brand.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    orientation: 'any',
    background_color: '#1a1f2e',
    theme_color: '#34d399',
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/assets/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/assets/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/assets/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/assets/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/assets/portal.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Cashvio Dashboard',
      },
      {
        src: '/assets/mobile1.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Cashvio Mobile App',
      },
    ],
    categories: ['business', 'productivity', 'finance', 'shopping'],
    shortcuts: [
      {
        name: 'Features',
        url: '/features',
        description: 'Explore all features',
      },
      {
        name: 'Pricing',
        url: '/pricing',
        description: 'View pricing plans',
      },
      {
        name: 'Register',
        url: '/register',
        description: 'Create free account',
      },
    ],
    related_applications: [],
  };
}

