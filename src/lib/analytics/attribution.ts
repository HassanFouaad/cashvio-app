/**
 * First-Touch Acquisition Attribution
 *
 * Captures UTM parameters, referral codes, and the referrer on the visitor's
 * FIRST touch and stores them in a cross-subdomain cookie (`cv_attribution`).
 *
 * Why first-touch: the goal is to learn which growth loop (receipt CTA,
 * comparison page, free tool, ad campaign, agent code...) originally brought
 * a merchant in — later navigation must not overwrite that signal.
 *
 * The cookie is shared on the `.cash-vio.com` domain so the portal/backend
 * can read the same attribution later without any marketing-site changes.
 */

'use client';

import { getSharedCookie, setSharedCookie } from '@/lib/utils/cross-app-sync';

const ATTRIBUTION_COOKIE = 'cv_attribution';

/** 90 days — long enough to cover the typical SMB consideration window */
const ATTRIBUTION_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  /** Referral/agent code passed as ?ref= */
  ref?: string;
  /** Hostname of the external referrer, e.g. "google.com" */
  referrer?: string;
  /** Path of the first page seen on the site */
  landingPage?: string;
  /** ISO timestamp of the first touch */
  firstTouchAt?: string;
}

/** Known referrer hosts mapped to compact source names for analytics */
const REFERRER_SOURCES: Array<{ pattern: RegExp; source: string }> = [
  { pattern: /google\./i, source: 'google' },
  { pattern: /facebook\.com|fb\.com/i, source: 'facebook' },
  { pattern: /instagram\.com/i, source: 'instagram' },
  { pattern: /tiktok\.com/i, source: 'tiktok' },
  { pattern: /twitter\.com|x\.com|t\.co/i, source: 'twitter' },
  { pattern: /youtube\.com|youtu\.be/i, source: 'youtube' },
  { pattern: /linkedin\.com/i, source: 'linkedin' },
  { pattern: /whatsapp\.com|wa\.me/i, source: 'whatsapp' },
  { pattern: /bing\.com/i, source: 'bing' },
];

function safeParse(value: string): Attribution | null {
  try {
    const parsed = JSON.parse(value) as Attribution;
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Read the stored first-touch attribution, if any.
 */
export function getAttribution(): Attribution | null {
  const raw = getSharedCookie(ATTRIBUTION_COOKIE);
  if (!raw) return null;
  return safeParse(raw);
}

/**
 * Capture first-touch attribution from the current URL and referrer.
 * No-op when a first touch was already recorded (first-touch wins).
 *
 * Call once on app mount (see AttributionTracker).
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  if (getAttribution()) return;

  const params = new URLSearchParams(window.location.search);

  const attribution: Attribution = {
    landingPage: window.location.pathname,
    firstTouchAt: new Date().toISOString(),
  };

  const [utmSource, utmMedium, utmCampaign, utmTerm, utmContent] = UTM_PARAMS.map(
    (param) => params.get(param) || undefined
  );
  attribution.utmSource = utmSource;
  attribution.utmMedium = utmMedium;
  attribution.utmCampaign = utmCampaign;
  attribution.utmTerm = utmTerm;
  attribution.utmContent = utmContent;

  const ref = params.get('ref');
  if (ref) attribution.ref = ref;

  if (document.referrer) {
    try {
      const referrerHost = new URL(document.referrer).hostname;
      // Ignore internal navigation (same site)
      if (referrerHost && referrerHost !== window.location.hostname) {
        attribution.referrer = referrerHost;
      }
    } catch {
      // Malformed referrer — skip
    }
  }

  // Drop undefined values so the cookie stays compact
  const compact = Object.fromEntries(
    Object.entries(attribution).filter(([, value]) => value !== undefined)
  );

  setSharedCookie(ATTRIBUTION_COOKIE, JSON.stringify(compact), {
    maxAge: ATTRIBUTION_MAX_AGE_SECONDS,
  });
}

/**
 * Derive a compact registration source string for analytics events.
 * Priority: utm_source > ref code > known referrer > "direct".
 */
export function getRegistrationSource(): string {
  const attribution = getAttribution();
  if (!attribution) return 'direct';

  if (attribution.utmSource) return attribution.utmSource;
  if (attribution.ref) return `ref:${attribution.ref}`;

  if (attribution.referrer) {
    const known = REFERRER_SOURCES.find(({ pattern }) =>
      pattern.test(attribution.referrer as string)
    );
    return known ? known.source : attribution.referrer;
  }

  return 'direct';
}
