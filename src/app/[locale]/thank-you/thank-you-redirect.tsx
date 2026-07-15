'use client';

/**
 * Thank-you page conversion + auto-redirect
 *
 * Fires the Meta CompleteRegistration conversion event, then automatically
 * redirects the new user to the portal so they land in their console instead
 * of stalling on the thank-you detour. The visible page content stays as a
 * fallback for users with JS-blocked redirects.
 */

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { META_PIXEL_EVENTS, trackMetaEvent } from '@/lib/analytics';
import { addStateToUrl, getThemePreference } from '@/lib/utils/cross-app-sync';

/** Delay before redirecting, long enough for the pixel request to flush */
const REDIRECT_DELAY_MS = 2500;

interface ThankYouRedirectProps {
  portalUrl: string;
}

export function ThankYouRedirect({ portalUrl }: ThankYouRedirectProps) {
  const t = useTranslations('thankYou');
  const locale = useLocale();
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(REDIRECT_DELAY_MS / 1000),
  );

  useEffect(() => {
    trackMetaEvent(META_PIXEL_EVENTS.COMPLETE_REGISTRATION);

    const countdownInterval = setInterval(() => {
      setSecondsLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      // Carry the signup locale (and theme) explicitly in the URL so the
      // portal defaults to Arabic for /ar signups even if the shared cookie
      // is unavailable (e.g. different local dev domains).
      const portalUrlWithState = addStateToUrl(portalUrl, {
        language: locale,
        theme: getThemePreference() ?? undefined,
      });
      window.location.replace(portalUrlWithState);
    }, REDIRECT_DELAY_MS);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, [portalUrl, locale]);

  return (
    <div
      className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6"
      role="status"
      aria-live="polite"
    >
      <svg
        className="w-4 h-4 animate-spin text-primary"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span>{t('redirecting', { seconds: secondsLeft })}</span>
    </div>
  );
}
