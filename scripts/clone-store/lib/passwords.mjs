import crypto from 'node:crypto';

/**
 * Generate a password that satisfies Cashvio min length (8) and is easy to
 * copy into credentials.json. Avoids ambiguous characters.
 */
export function generateAdminPassword(length = 16) {
  const alphabet =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  // Guarantee at least one upper, lower, digit, special
  if (!/[A-Z]/.test(out)) out = `A${out.slice(1)}`;
  if (!/[a-z]/.test(out)) out = `${out.slice(0, -1)}a`;
  if (!/[0-9]/.test(out)) out = `${out.slice(0, -1)}7`;
  if (!/[!@#$%]/.test(out)) out = `${out.slice(0, -1)}!`;
  return out;
}

export function emailFromStoreName(storeName, domain = 'clone.cashvio.local') {
  const local = String(storeName)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .slice(0, 40) || 'store';
  const stamp = Date.now().toString(36).slice(-4);
  return `${local}.${stamp}@${domain}`;
}

export function usernameFromEmail(email) {
  return email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40);
}
