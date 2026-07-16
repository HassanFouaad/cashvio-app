import { siteConfig } from '@/config/site';

export const revalidate = false;

export function GET(): Response {
  const SITE_URL = siteConfig.url;
  const API_URL = siteConfig.api.url;
  const API_BASE_URL = siteConfig.api.baseUrl;

  const asMetadata = {
    issuer: `${API_BASE_URL}/`,
    token_endpoint: `${API_URL}/auth/login`,
    registration_endpoint: `${API_URL}/auth/register`,
    revocation_endpoint: `${API_URL}/auth/logout`,
    grant_types_supported: [
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
    ],
    scopes_supported: ['api.read', 'api.write'],

    agent_auth: {
      skill: `${SITE_URL}/auth.md`,
      register_uri: `${API_URL}/auth/register`,
      identity_types_supported: ['service_auth'],
      service_auth: {
        credential_types_supported: ['bearer_token'],
      },
    },
  };

  return new Response(JSON.stringify(asMetadata, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
