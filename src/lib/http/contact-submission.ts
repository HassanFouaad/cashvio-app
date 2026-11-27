import type { Attribution } from '@/lib/analytics/attribution';
import { ContactFormId } from './enums/contact-form-id.enum';
import { InquiryType, type ContactAttributionRequest, type ContactRequest, type ContactRequestIntent, type ContactSourceRequest } from './types';

const NAME_LIMIT = 64;
const CAMPAIGN_LIMIT = 128;
const HOST_LIMIT = 253;
const PATH_LIMIT = 512;
const PATH_PATTERN = /^\/(?!\/)[^?#\r\n]*$/;
const HOST_PATTERN = /^[A-Za-z0-9.-]+$/;
const JSON_TEXT_PATTERN = /^(?:[^\uD800-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])*$/;

function hint(value: string | undefined, limit: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  if (value.includes('\u0000') || !JSON_TEXT_PATTERN.test(value)) return undefined;
  const sanitized = Array.from(value.replace(/[\r\n]/g, '').trim()).slice(0, limit).join('');
  return sanitized || undefined;
}

function pagePath(value: string | undefined): string | undefined {
  if (typeof value !== 'string' || value.includes('\u0000') || !PATH_PATTERN.test(value) || !JSON_TEXT_PATTERN.test(value)) return undefined;
  return Array.from(value).slice(0, PATH_LIMIT).join('');
}

/** Bounded acquisition hints only; no tenant, identity or cookie credentials. */
export function buildContactSource(formId: ContactFormId, attribution: Attribution | null, submissionPath: string): ContactSourceRequest {
  let firstTouch: ContactAttributionRequest | undefined;
  if (attribution) {
    const referrer = hint(attribution.referrer, HOST_LIMIT);
    const timestamp = typeof attribution.firstTouchAt === 'string' ? Date.parse(attribution.firstTouchAt) : NaN;
    firstTouch = {
      utmSource: hint(attribution.utmSource, NAME_LIMIT),
      utmMedium: hint(attribution.utmMedium, NAME_LIMIT),
      utmCampaign: hint(attribution.utmCampaign, CAMPAIGN_LIMIT),
      utmTerm: hint(attribution.utmTerm, CAMPAIGN_LIMIT),
      utmContent: hint(attribution.utmContent, CAMPAIGN_LIMIT),
      ref: hint(attribution.ref, NAME_LIMIT),
      referrer: referrer && HOST_PATTERN.test(referrer) ? referrer : undefined,
      landingPage: pagePath(attribution.landingPage),
      firstTouchAt: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined,
    };
  }
  return { formId, submissionPath: pagePath(submissionPath), firstTouch };
}

/** Keep an immutable accepted payload/key in memory through an uncertain response. */
export function createContactIntent(request: ContactRequest): ContactRequestIntent | null {
  try {
    const provider = globalThis.crypto;
    if (!provider) return null;
    let key: string;
    if (typeof provider.randomUUID === 'function') {
      key = provider.randomUUID();
    } else {
      const bytes = new Uint8Array(16);
      provider.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const text = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
      key = `${text.slice(0, 8)}-${text.slice(8, 12)}-${text.slice(12, 16)}-${text.slice(16, 20)}-${text.slice(20)}`;
    }
    return {
      key,
      request: {
        ...request,
        source: request.source ? {
          ...request.source,
          firstTouch: request.source.firstTouch ? { ...request.source.firstTouch } : undefined,
        } : undefined,
      },
    };
  } catch {
    return null;
  }
}

export function hasSameContactDetails(saved: ContactRequest, current: ContactRequest): boolean {
  return saved.name === current.name && saved.email === current.email &&
    (saved.phone ?? '') === (current.phone ?? '') && saved.subject === current.subject &&
    saved.message === current.message && (saved.type ?? InquiryType.GENERAL) === (current.type ?? InquiryType.GENERAL);
}

export function isContactReference(value: string): boolean {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
