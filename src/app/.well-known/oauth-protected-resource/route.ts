import { siteConfig } from '@/config/site';

export const revalidate = false;

export function GET(): Response {
  const SITE_URL = siteConfig.url;
  const API_URL = siteConfig.api.url;
  const API_BASE_URL = siteConfig.api.baseUrl;

  const prm = {
    resource: `${API_URL}/`,
    resource_name: siteConfig.name,
    resource_logo_uri: `${SITE_URL}/apple-icon.png`,
    authorization_servers: [`${API_BASE_URL}/`],
    scopes_supported: ['api.read', 'api.write'],
    bearer_methods_supported: ['header'],
  };

  return new Response(JSON.stringify(prm, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
