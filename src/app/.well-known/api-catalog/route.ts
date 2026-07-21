import { siteConfig } from '@/config/site';

export const revalidate = false;

export function GET(): Response {
  const SITE_URL = siteConfig.url;
  const API_URL = siteConfig.api.url;

  const catalog = {
    linkset: [
      {
        anchor: `${API_URL}/`,
        'service-desc': [
          {
            href: `${API_URL}/docs-json`,
            type: 'application/json',
          },
        ],
        'service-doc': [
          {
            href: `${SITE_URL}/docs`,
            type: 'text/html',
          },
          {
            href: `${SITE_URL}/docs/getting-started/onboarding`,
            type: 'text/html',
          },
          {
            href: `${SITE_URL}/llms.txt`,
            type: 'text/plain',
          },
          {
            href: `${SITE_URL}/llms-full.txt`,
            type: 'text/plain',
          },
          {
            href: `${SITE_URL}/auth.md`,
            type: 'text/markdown',
          },
        ],
        status: [
          {
            href: `${API_URL}/health`,
            type: 'application/json',
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
