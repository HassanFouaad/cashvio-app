import { siteConfig } from '@/config/site';

export const revalidate = false;

export function GET(): Response {
  const SITE_URL = siteConfig.url;
  const API_URL = siteConfig.api.url;

  const content = `# auth.md

You are an agent. ${siteConfig.name} is a multi-tenant business management platform for online and in-store operations.

This document describes how to register and authenticate with the ${siteConfig.name} API.

## Discovery

### Protected Resource Metadata

\`\`\`http
GET ${SITE_URL}/.well-known/oauth-protected-resource
\`\`\`

Returns the resource server location, scopes, and authorization server URL.

### Authorization Server Metadata

\`\`\`http
GET ${SITE_URL}/.well-known/oauth-authorization-server
\`\`\`

Returns token endpoint, registration endpoint, and supported grant types.

## Step 1: Register

Create a tenant account by sending a POST request to the registration endpoint.

\`\`\`http
POST ${API_URL}/auth/register
Content-Type: application/json

{
  "firstName": "string",
  "lastName": "string",
  "email": "user@example.com",
  "password": "string",
  "phone": "string (optional)",
  "businessName": "string",
  "language": "en | ar"
}
\`\`\`

Response (201):

\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "<JWT>",
    "refreshToken": "<JWT>",
    "user": { "id": "uuid", "email": "user@example.com" }
  }
}
\`\`\`

The access token is a short-lived JWT. The refresh token is long-lived. Store both securely.

## Step 2: Authenticate

If you already have an account, obtain credentials by signing in:

\`\`\`http
POST ${API_URL}/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "string"
}
\`\`\`

Response (200):

\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "<JWT>",
    "refreshToken": "<JWT>"
  }
}
\`\`\`

## Step 3: Use the Access Token

Present the access token as a Bearer token on all API requests:

\`\`\`http
GET ${API_URL}/resource
Authorization: Bearer <accessToken>
\`\`\`

## Step 4: Refresh

When the access token expires, refresh it:

\`\`\`http
POST ${API_URL}/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken>"
}
\`\`\`

Response (200):

\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "<new JWT>",
    "refreshToken": "<new JWT>"
  }
}
\`\`\`

## Scopes

| Scope | Description |
|-------|-------------|
| api.read | Read access to tenant resources (products, orders, customers, inventory) |
| api.write | Write access to tenant resources (create, update, delete) |

Access is further restricted by the user's role and permissions within their tenant.

## Available Resources

The API provides endpoints for:

- **Products**: catalogue management, variants, pricing
- **Inventory**: stock tracking across stores
- **Orders**: multi-channel order processing
- **Customers**: customer management, balances
- **Suppliers**: supplier management, purchase orders
- **Stores**: multi-location management
- **Reports**: analytics and reporting

## Documentation

- Full documentation: ${SITE_URL}/docs
- LLM-optimized index: ${SITE_URL}/llms.txt
- LLM-optimized full docs: ${SITE_URL}/llms-full.txt
- OpenAPI spec: ${API_URL}/docs-json

## Errors

All errors follow a standard envelope:

\`\`\`json
{
  "success": false,
  "error": {
    "message": "Translated error message",
    "statusCode": 400
  }
}
\`\`\`

- 401 on a previously-working token: refresh the token (Step 4).
- 401 after refresh fails: re-authenticate (Step 2).
- 429: back off and retry.
- 5xx: retry with exponential backoff.

## Contact

- Support: ${siteConfig.contact.email}
- Website: ${SITE_URL}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
