import { API_URL, getCredentials } from './config.mjs';

let cookie = '';

export async function login() {
  const creds = getCredentials();
  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  });
  if (!res.ok) throw new Error(`login failed ${res.status}`);
  const setCookies = res.headers.getSetCookie?.() || [];
  cookie = setCookies.map((c) => c.split(';')[0]).join('; ');
  const body = await res.json();
  return body.data;
}

export async function api(method, path, payload) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: cookie,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });
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
      `${label} -> HTTP ${res.status}: ${JSON.stringify(res.body?.error || res.body).slice(0, 300)}`,
    );
  }
  return res.body?.data !== undefined ? res.body.data : res.body;
}
