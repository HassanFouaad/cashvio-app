import type { MetadataRoute } from 'next';

/**
 * Web app manifest for brand identity signals (name, icons, colors).
 *
 * IMPORTANT: `display: "browser"` is intentional. It keeps the site a plain
 * website: browsers will NOT show an install prompt and the site can never
 * behave like an installed PWA. Do not change to standalone/minimal-ui and
 * do not add a service worker.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cashvio: Free POS System & Free Online Store',
    short_name: 'Cashvio',
    description:
      'Complete business management platform for online and in-store operations: sales, inventory, payments, and analytics.',
    start_url: '/',
    display: 'browser',
    background_color: '#1a1f2e',
    theme_color: '#34d399',
    icons: [
      {
        src: '/assets/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/assets/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/assets/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
