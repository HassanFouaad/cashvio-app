import { siteConfig } from '@/config/site';

export const revalidate = false;

export function GET(): Response {
  const SITE_URL = siteConfig.url;
  const API_URL = siteConfig.api.url;
  const API_BASE_URL = siteConfig.api.baseUrl;
  const PORTAL_URL = siteConfig.links.portal;

  const content = `# auth.md

You are an agent. ${siteConfig.name} is a multi-tenant business management platform for online and in-store operations.

This document describes how authentication with the ${siteConfig.name} API works today, so you can decide what you can and cannot do on a user's behalf.

## Summary for agents

- There is **no OAuth, API key, or token-exchange flow** for third-party or non-browser agents today. No discovery metadata, client registration, grant types, or scopes exist.
- Sessions are browser sessions. The API sets the credentials as **HttpOnly cookies** and never returns a token in a response body.
- Credentialed cross-origin requests are accepted only from ${siteConfig.name}'s own first-party web apps (the merchant portal, the admin portal, and this site).
- To act for a merchant, send the human to sign up at ${SITE_URL}/register or sign in at ${PORTAL_URL}/login and let them complete the task there.

The rest of this document describes the browser contract used by the first-party apps.

## Sessions and cookies

| Cookie | Readable by JavaScript | Purpose |
|--------|------------------------|---------|
| \`cv_access_token\` | No (HttpOnly) | Short-lived access credential sent with API requests |
| \`cv_refresh_token\` | No (HttpOnly) | Rotating refresh credential used by \`POST /v1/auth/refresh\` |

- Both cookies are \`SameSite=Lax\`, \`Secure\` in production, and scoped to the shared ${siteConfig.name} parent domain.
- Response bodies contain no \`accessToken\` or \`refreshToken\` field. Read \`expiresIn\` (seconds) from the response to schedule a refresh; do not assume a short lifetime.
- A browser holds **one ${siteConfig.name} session at a time**. Signing in or registering replaces the session presented in the request's refresh cookie, and the backend revokes that previous session.
- State-changing requests (POST, PUT, PATCH, DELETE) that carry the auth cookies must come from a first-party \`Origin\`. Otherwise the API answers \`403\` with \`auth.errors.csrf_rejected\`.

## Register a business

Creates a tenant on the free plan and its first owner account, then signs that browser in.

\`\`\`http
POST ${API_URL}/auth/register
Content-Type: application/json
Accept-Language: en | ar

{
  "businessName": "string",
  "contactPhone": "+201234567890",
  "secondaryContactPhone": "+201234567891",
  "email": "owner@example.com",
  "password": "string"
}
\`\`\`

| Field | Required | Rules |
|-------|----------|-------|
| \`businessName\` | Yes | 2 to 100 characters, must include a letter. Normalized server-side. |
| \`contactPhone\` | Yes | International format with country code, at most 50 characters |
| \`secondaryContactPhone\` | No | International format, at most 50 characters |
| \`email\` | Yes | Valid email, at most 255 characters. Used to sign in. |
| \`password\` | Yes | 8 to 128 characters |

The username is generated from the email. The browser request must use \`credentials: "include"\` so it can accept the \`Set-Cookie\` headers.

Response \`201\` (the auth cookies are set on this response):

\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "username": "string",
      "email": "owner@example.com",
      "sessionId": "string"
    },
    "tenant": { "id": "uuid", "name": "string" },
    "expiresIn": 14400
  }
}
\`\`\`

\`409\` means an account with that email already exists. Registration is rate limited per IP.

## Sign in

\`\`\`http
POST ${API_URL}/auth/login
Content-Type: application/json

{
  "username": "owner@example.com",
  "password": "string",
  "audience": "TENANT"
}
\`\`\`

- \`username\` accepts either the username or the email address.
- \`audience\` is optional and defaults to \`"TENANT"\` (the merchant portal).

Response \`200\` sets the auth cookies. The body has \`expiresIn\` and \`user\` (the account profile, including \`sessionId\`), and no tokens.

## Refresh the session

\`\`\`http
POST ${API_URL}/auth/refresh
Cookie: cv_refresh_token=<set by the API>
x-cashvio-refresh-id: <UUIDv7>
\`\`\`

- The refresh credential comes from the \`cv_refresh_token\` cookie. Send the request without a body.
- \`x-cashvio-refresh-id\` is optional but strongly recommended: generate one UUIDv7 per refresh operation and reuse it on every retry of that same operation.
- Run only one refresh at a time per browser. Without the header, a concurrent refresh that loses the race is treated as credential reuse and the whole session is revoked.
- Response \`200\` rotates both cookies. The body contains only \`expiresIn\`.
- \`503\` with \`auth.errors.refresh_retry\` means the rotation is still settling. Retry with the same \`x-cashvio-refresh-id\`.

## Current user

\`\`\`http
GET ${API_URL}/auth/me
Cookie: cv_access_token=<set by the API>
\`\`\`

Returns the signed-in user: profile, tenant, roles, permissions, and \`sessionId\` (the same value returned by sign in and register).

## Sign out

\`\`\`http
POST ${API_URL}/auth/logout
Cookie: cv_refresh_token=<set by the API>
\`\`\`

Revokes the current session and clears both auth cookies, then responds with \`{ "success": true }\`. Browser apps that registered the device for push notifications also send its Firebase installation ID as \`fid\` in the JSON body so the device stops receiving pushes.

## Errors

Errors use a standard envelope. Branch on \`error.code\`, never on the translated \`message\`:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "auth.errors.token_expired",
    "message": "Translated error message"
  }
}
\`\`\`

| Status | \`error.code\` | Meaning |
|--------|--------------|---------|
| 401 | \`auth.errors.token_missing\`, \`auth.errors.token_expired\`, \`auth.errors.token_invalid\` | Refresh once, then retry the request |
| 401 | \`auth.errors.session_revoked\`, \`auth.error_invalid_refresh_token\`, \`auth.error_expired_refresh_token\`, \`auth.errors.refresh_reused\` | The session is over. Sign in again. |
| 401 | \`auth.errors.account_disabled\`, \`tenants.error_inactive\` | The account or business is deactivated. Do not refresh. |
| 403 | \`auth.errors.csrf_rejected\` | Cookie-authenticated write from a non-first-party origin. Do not retry. |
| 429 | \`auth.errors.too_many_login_attempts\` | Too many failed sign-ins for this account. Wait for the \`Retry-After\` header. |
| 429 | (other) | Rate limited. Back off and retry. |
| 5xx | (any) | Retry with exponential backoff. |

## Documentation

- Docs home: ${SITE_URL}/docs
- Signing up: ${SITE_URL}/docs/getting-started/signing-up
- Sign in, sessions, and sign out: ${SITE_URL}/docs/getting-started/login-and-sessions
- LLM-optimized index (all doc URLs): ${SITE_URL}/llms.txt
- LLM-optimized full docs (inline content): ${SITE_URL}/llms-full.txt
- Arabic docs: ${SITE_URL}/ar/docs
- API catalog: ${SITE_URL}/.well-known/api-catalog
- OpenAPI spec: ${API_BASE_URL}/docs-json

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
