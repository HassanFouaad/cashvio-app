/**
 * Cookie + Bearer API client for clone-store.
 *
 * Auth notes (Cashvio BE):
 * - Login / refresh put tokens in Set-Cookie and STRIP them from JSON body.
 * - JWT extractor: cookie first, then Authorization: Bearer.
 * - System admin refreshToken → POST /v1/auth/refresh { refreshToken }
 *   then capture cv_access_token from Set-Cookie.
 */
import {
  API_URL,
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  sleep,
} from './config.mjs';

/** @type {{ cookie: string, accessToken: string | null, refreshToken: string | null }} */
let session = {
  cookie: '',
  accessToken: null,
  refreshToken: null,
};

export function getSession() {
  return { ...session };
}

export function loadSession(saved) {
  session = {
    cookie: saved?.cookie || '',
    accessToken: saved?.accessToken || null,
    refreshToken: saved?.refreshToken || null,
  };
}

export function exportSession() {
  return getSession();
}

function parseSetCookies(res) {
  const setCookies = res.headers.getSetCookie?.() || [];
  const jar = new Map();
  // Keep existing jar entries
  for (const part of session.cookie.split(';').map((s) => s.trim()).filter(Boolean)) {
    const eq = part.indexOf('=');
    if (eq > 0) jar.set(part.slice(0, eq), part.slice(eq + 1));
  }
  for (const raw of setCookies) {
    const pair = raw.split(';')[0];
    const eq = pair.indexOf('=');
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
  session.cookie = [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  if (jar.has(COOKIE_ACCESS)) session.accessToken = jar.get(COOKIE_ACCESS);
  if (jar.has(COOKIE_REFRESH)) session.refreshToken = jar.get(COOKIE_REFRESH);
}

function authHeaders(extra = {}) {
  const headers = {
    Accept: 'application/json',
    ...extra,
  };
  if (session.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }
  if (session.cookie) {
    headers.Cookie = session.cookie;
  }
  return headers;
}

/**
 * Exchange a system-admin refresh token for an access session.
 * Access token is only available via Set-Cookie (stripped from body).
 */
export async function refreshWithToken(refreshToken) {
  if (!refreshToken) throw new Error('refreshToken is required');
  session.refreshToken = refreshToken;
  const res = await fetch(`${API_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  parseSetCookies(res);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  if (!res.ok || json?.success === false) {
    throw new Error(
      `refresh failed HTTP ${res.status}: ${JSON.stringify(json?.error || json).slice(0, 400)}`,
    );
  }
  if (!session.accessToken) {
    throw new Error(
      'refresh succeeded but no cv_access_token cookie was returned. Check API_URL / network.',
    );
  }
  // Preserve the refresh token we were given (refresh endpoint only rotates access cookie)
  if (!session.refreshToken) session.refreshToken = refreshToken;
  return json.data;
}

export async function login({ username, password, audience = 'TENANT' }) {
  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password, audience }),
  });
  parseSetCookies(res);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  if (!res.ok || json?.success === false) {
    throw new Error(
      `login failed HTTP ${res.status}: ${JSON.stringify(json?.error || json).slice(0, 400)}`,
    );
  }
  if (!session.accessToken) {
    throw new Error('login succeeded but no access token cookie returned');
  }
  return json.data;
}

export async function api(method, path, payload, { retries = 1 } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(
      payload !== undefined ? { 'Content-Type': 'application/json' } : {},
    ),
    body: payload !== undefined ? JSON.stringify(payload) : undefined,
  });

  // Auto-refresh once on 401 when we still have a refresh token
  if (res.status === 401 && retries > 0 && session.refreshToken) {
    await refreshWithToken(session.refreshToken);
    return api(method, path, payload, { retries: retries - 1 });
  }

  parseSetCookies(res);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, ok: res.ok, body: json };
}

export function unwrap(res, label) {
  if (!res.ok || res.body?.success === false) {
    throw new Error(
      `${label} -> HTTP ${res.status}: ${JSON.stringify(res.body?.error || res.body).slice(0, 400)}`,
    );
  }
  return res.body?.data !== undefined ? res.body.data : res.body;
}

/** Paginate list endpoints that return { items } or bare arrays. */
export async function listAll(path, label) {
  const items = [];
  let page = 1;
  while (true) {
    const sep = path.includes('?') ? '&' : '?';
    const res = unwrap(
      await api('GET', `${path}${sep}page=${page}&limit=100`),
      label,
    );
    const rows = Array.isArray(res)
      ? res
      : res?.items || res?.data || [];
    items.push(...rows);
    if (rows.length < 100) break;
    page += 1;
    if (page > 50) break;
    await sleep(30);
  }
  return items;
}

export async function putBinary(uploadUrl, bytes, mime) {
  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mime },
    body: bytes,
  });
  if (!put.ok) {
    throw new Error(`S3 PUT fail ${put.status}`);
  }
}
