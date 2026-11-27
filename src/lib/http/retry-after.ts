export const HTTP_RETRY_AFTER_MAX_MS = 5 * 60 * 1000;
export const CONTACT_DEFAULT_RETRY_DELAY_MS = 20 * 1000;

export function parseRetryAfter(value: string | null, nowMs: number = Date.now()): number | undefined {
  if (!value) return undefined;
  const text = value.trim();
  const delay = /^\d+$/.test(text) ? Number(text) * 1000 : Date.parse(text) - nowMs;
  if (!Number.isFinite(delay)) return undefined;
  return Math.min(HTTP_RETRY_AFTER_MAX_MS, Math.max(0, delay));
}
