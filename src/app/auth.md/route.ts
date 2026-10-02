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
- **Sign in with Google** is a first-party, browser-only feature of ${siteConfig.name}'s own web apps, not an OAuth flow you can use. The browser gets a Google ID token from Google Identity Services and posts it to the API, which answers with the same HttpOnly session cookies. The token must be issued to ${siteConfig.name}'s own Google client and the request must come from a first-party origin, so agents cannot call these endpoints. ${siteConfig.name} is not an OAuth provider.
- Credentialed cross-origin requests are accepted only from ${siteConfig.name}'s own first-party web apps (the merchant portal, the admin portal, and this site). Other origins can call public endpoints without credentials.
- To act for a merchant, send the human to sign up at ${SITE_URL}/register or sign in at ${PORTAL_URL}/login and let them complete the task there.

The rest of this document describes the browser contract used by the first-party apps.

## Sessions and cookies

| Cookie | Readable by JavaScript | Purpose |
|--------|------------------------|---------|
| \`__Host-cv_access_token\` | No (HttpOnly) | Access credential sent with API requests |
| \`__Host-cv_refresh_token\` | No (HttpOnly) | Rotating refresh credential used by \`POST /v1/auth/refresh\` |

- Both cookies are **host-only** on the API host: \`Secure\`, \`Path=/\`, \`SameSite=Lax\`, and no \`Domain\` attribute (the \`__Host-\` prefix enforces this). They are never shared with other ${siteConfig.name} subdomains.
- Only local development uses the unprefixed names \`cv_access_token\` and \`cv_refresh_token\`.
- Response bodies contain no \`accessToken\` or \`refreshToken\` field. Read \`expiresIn\` (seconds) from the response to schedule a refresh; do not assume a short lifetime.
- A browser holds **one ${siteConfig.name} session at a time**. Signing in or registering replaces the session presented in the request's refresh cookie, and the backend revokes that previous session.
- If \`GET /v1/auth/me\` shows that the session belongs to the other portal, do not call \`/v1/auth/logout\`: that would end the other portal's session. Clear local state instead.
- Changing the password or confirming an email change revokes every session of that user, on every device. Change password also clears the auth cookies in its response.
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

\`409\` with \`auth.errors.user_already_exists\` means an account with that email already exists. Registration is rate limited per IP.

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

Accounts created with Google have no password until the owner sets one through forgot password. Until then, password sign-in for them fails with the same generic \`401\` \`auth.error_invalid_credentials\` as a wrong password.

## Google sign-in (first-party browsers only)

The merchant portal login page offers **Continue with Google**, and this site's sign-up page at ${SITE_URL}/register offers **Sign up with Google**. The four endpoints below exist only for those first-party pages:

- The browser gets a Google ID token (the Google Identity Services \`credential\`) from a **popup**. Redirect mode is not supported: its POST comes from accounts.google.com and is rejected.
- Requests use \`credentials: "include"\` and must come from a first-party \`Origin\`. Any other origin gets \`403\` with \`auth.errors.csrf_rejected\`.
- The ID token must be issued to one of ${siteConfig.name}'s Google client IDs. It stays valid for about an hour. The API never returns it and redacts it from logs.
- Only merchant portal users (owners and staff) can use Google. Admin portal accounts sign in with a password.
- When Google sign-in is switched off, every endpoint answers \`404\` with \`auth.errors.google_sign_in_unavailable\`. Hide the Google UI.

Flow:

1. \`POST /v1/auth/google/sign-in\` with the ID token.
2. \`SIGNED_IN\`: an account already uses this Google account (or its Gmail or Google Workspace address). The auth cookies are set.
3. \`SIGNUP_REQUIRED\`: there is no account yet, and no cookies are set. Collect the business details, then call \`POST /v1/auth/google/sign-up\` with the **same** ID token.
4. A signed-in user connects or disconnects Google with \`POST /v1/auth/google/link\` and \`POST /v1/auth/google/unlink\`. Both ask for the current password.

### Sign in with Google

\`\`\`http
POST ${API_URL}/auth/google/sign-in
Content-Type: application/json
Accept-Language: en | ar

{
  "idToken": "<Google ID token>"
}
\`\`\`

Response \`200\` when the account exists (the auth cookies are set on this response):

\`\`\`json
{
  "success": true,
  "data": {
    "outcome": "SIGNED_IN",
    "expiresIn": 14400,
    "user": { "id": "uuid", "username": "string", "email": "owner@gmail.com", "sessionId": "string" }
  }
}
\`\`\`

Response \`200\` when a sign-up is needed (no cookies):

\`\`\`json
{
  "success": true,
  "data": {
    "outcome": "SIGNUP_REQUIRED",
    "profile": { "email": "owner@gmail.com", "firstName": "string", "lastName": "string" }
  }
}
\`\`\`

- \`user\` is the same profile that password sign-in returns.
- Like password sign-in, a successful Google sign-in replaces the session presented in the refresh cookie.
- If no account uses this Google account but an account has the same email, Google is connected to it only when Google is authoritative for that address (Gmail, or a Google Workspace domain) and has verified it, and a security email is sent. If the email owner never proved that account's password (through a reset, a confirmed email change, or connecting this same Google address in account settings), the password is removed and every session of that user is revoked. For any other address the API answers \`409\` with \`auth.errors.google_link_requires_password\`: sign in with the password, then connect Google in account settings.
- An unknown Gmail or Google Workspace address gets \`SIGNUP_REQUIRED\`. An unknown address Google is not authoritative for gets \`403\` with \`auth.errors.google_sign_up_requires_password\`: register with email and password instead.

### Sign up with Google

\`\`\`http
POST ${API_URL}/auth/google/sign-up
Content-Type: application/json
Accept-Language: en | ar

{
  "idToken": "<the same Google ID token>",
  "businessName": "string",
  "contactPhone": "+201234567890",
  "secondaryContactPhone": "+201234567891"
}
\`\`\`

- \`businessName\`, \`contactPhone\` and \`secondaryContactPhone\` follow the register rules, with the same error codes.
- The email and the owner's name come from Google. No password is created; the owner can set one at any time through forgot password.
- Response \`201\` has the same body as register, and the auth cookies are set.
- \`409\` with \`auth.errors.user_already_exists\` or \`auth.errors.google_account_linked_elsewhere\` means the email or the Google account already belongs to an account: sign in instead.

### Connect and disconnect Google

These run in a signed-in session (the auth cookies) from account settings.

\`\`\`http
POST ${API_URL}/auth/google/link
Content-Type: application/json

{
  "idToken": "<Google ID token>",
  "currentPassword": "string"
}
\`\`\`

\`\`\`http
POST ${API_URL}/auth/google/unlink
Content-Type: application/json

{
  "currentPassword": "string"
}
\`\`\`

Both answer \`200\` with the user's sign-in methods. \`GET /v1/auth/me\` returns the same object as \`signInMethods\`:

\`\`\`json
{
  "hasPassword": true,
  "google": { "email": "owner@gmail.com", "linkedAt": "2026-10-02T10:15:00.000Z" }
}
\`\`\`

- \`google\` is \`null\` when no Google account is connected.
- Disconnecting needs a password on the account (\`400\` with \`auth.errors.password_required_to_disconnect_google\` otherwise). Other sessions stay signed in.
- Wrong current passwords count toward the same limit as change password.
- Connecting and disconnecting each send a security email.

## Refresh the session

\`\`\`http
POST ${API_URL}/auth/refresh
Cookie: __Host-cv_refresh_token=<set by the API>
x-cashvio-refresh-id: <UUIDv7>
\`\`\`

- The refresh credential comes from the \`__Host-cv_refresh_token\` cookie. Send the request without a body.
- \`x-cashvio-refresh-id\` is optional but strongly recommended: generate one UUIDv7 per refresh operation and reuse it on every retry of that same operation.
- Run only one refresh at a time per browser. Without the header, a concurrent refresh that loses the race is treated as credential reuse and the whole session is revoked.
- Response \`200\` rotates both cookies. The body contains only \`expiresIn\`.
- \`503\` with \`auth.errors.refresh_retry\` means the rotation is still settling. Retry with the same \`x-cashvio-refresh-id\`.

## Current user

\`\`\`http
GET ${API_URL}/auth/me
Cookie: __Host-cv_access_token=<set by the API>
\`\`\`

Returns the signed-in user: profile, tenant, roles, permissions, and \`sessionId\` (the same value returned by sign in and register).

## Sign out

\`\`\`http
POST ${API_URL}/auth/logout
Content-Type: application/json
Cookie: __Host-cv_refresh_token=<set by the API>

{
  "fid": "<Firebase installation ID>"
}
\`\`\`

- Revokes the current session and always clears both auth cookies. Response \`200\` is \`{ "success": true, "data": { "success": true } }\`.
- \`fid\` is optional. Apps that registered the device for push notifications send its Firebase installation ID so the device stops receiving pushes for that user. An unknown device is ignored and sign out still succeeds.

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
| 403 | \`auth.errors.tenant_portal_access_denied\`, \`auth.errors.system_portal_access_denied\`, \`auth.errors.tenant_principal_required\` | The account belongs to the other portal. Do not refresh or sign out. |
| 403 | \`auth.error_insufficient_permissions\` | The user's role lacks this permission. Re-read \`/v1/auth/me\`, since permissions may have changed. |
| 400 | \`auth.error_invalid_current_password\` | The current password is wrong (change password, change email). |
| 400 | \`auth.errors.password_not_set\` | The account has no password yet (it signs in with Google), so change password and change email are unavailable. Set a password through forgot password. |
| 400 | \`auth.errors.google_token_invalid\`, \`auth.errors.google_token_reused\` | The Google ID token is invalid, expired, or already used. Get a new one from Google and try again. |
| 403 | \`auth.errors.google_email_unverified\` | Google has not verified this email address. |
| 403 | \`auth.errors.google_sign_up_requires_password\` | Google is not authoritative for this address. Register with email and password, then connect Google in account settings. |
| 403 | \`auth.errors.google_sign_in_not_allowed\` | Admin portal accounts cannot use Google. |
| 404 | \`auth.errors.google_sign_in_unavailable\` | Google sign-in is switched off. Hide the Google UI. |
| 409 | \`auth.errors.user_already_exists\` | An account with this email already exists (register, Google sign-up). Sign in instead. |
| 409 | \`auth.errors.google_link_requires_password\` | An account with this email exists. Sign in with the password, then connect Google in account settings. |
| 409 | \`auth.errors.google_account_linked_elsewhere\`, \`auth.errors.google_account_mismatch\`, \`auth.errors.google_already_connected\` | The Google account is already connected elsewhere, or the account is connected to a different Google account. Sign in with the connected method. |
| 503 | \`auth.errors.google_verification_unavailable\` | Google's signing keys could not be fetched. Retry after a short delay. |
| 429 | \`auth.errors.too_many_login_attempts\` | Too many failed sign-ins for this account. Wait for the \`Retry-After\` header. |
| 429 | \`auth.errors.too_many_password_attempts\` | Too many wrong current passwords. Wait for the \`Retry-After\` header; the session stays signed in. |
| 429 | (other) | Rate limited. Back off and retry. |
| 503 | \`auth.errors.cache_unavailable\`, \`auth.errors.authorization_state_changed\` | Session state was briefly unavailable or changed mid-request. Retry once after a short random delay, then re-read \`/v1/auth/me\`. |
| 503 | \`auth.errors.refresh_retry\` | A concurrent refresh is rotating the credential. Retry the refresh with the same \`x-cashvio-refresh-id\`. |
| 5xx | (other) | Retry with exponential backoff. |

## Documentation

- Docs home: ${SITE_URL}/docs
- Signing up: ${SITE_URL}/docs/getting-started/signing-up
- Sign in, sessions, and sign out: ${SITE_URL}/docs/getting-started/login-and-sessions
- Account settings (password, email, and Google connection): ${SITE_URL}/docs/settings/account-settings
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
