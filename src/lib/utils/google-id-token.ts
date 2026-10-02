/**
 * Read display-only claims from a Google ID token in the browser.
 *
 * The token is NOT verified here; the API does that. Use the result only to
 * prefill a form field the user can still edit, never for a decision.
 */

interface GoogleIdTokenPayload {
  email?: string;
}

/** Base64url payload segment to its UTF-8 JSON text. */
function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * The `email` claim of a Google ID token, or null when the token is not a
 * readable JWT or has no email.
 */
export function readGoogleIdTokenEmail(idToken: string): string | null {
  const payloadSegment = idToken.split('.')[1];
  if (!payloadSegment) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(payloadSegment)) as GoogleIdTokenPayload;
    return typeof payload.email === 'string' && payload.email.length > 0
      ? payload.email
      : null;
  } catch {
    return null;
  }
}
