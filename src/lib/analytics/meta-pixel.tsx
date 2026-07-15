'use client';

/**
 * Meta (Facebook) Pixel integration
 *
 * Loads the fbq base snippet when NEXT_PUBLIC_FB_PIXEL_ID is configured and
 * exposes a typed helper for firing standard events (e.g. CompleteRegistration
 * on the thank-you page).
 */

import Script from 'next/script';
import { env } from '@/config/env';

/** Standard Meta pixel events used by the marketing site */
export const META_PIXEL_EVENTS = {
  COMPLETE_REGISTRATION: 'CompleteRegistration',
  LEAD: 'Lead',
  PAGE_VIEW: 'PageView',
} as const;

export type MetaPixelEvent =
  (typeof META_PIXEL_EVENTS)[keyof typeof META_PIXEL_EVENTS];

type FbqFunction = (
  command: 'init' | 'track' | 'trackCustom',
  eventNameOrPixelId: string,
  parameters?: Record<string, string | number>,
) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
  }
}

/**
 * Fire a standard Meta pixel event. Safe no-op when the pixel is not loaded.
 */
export function trackMetaEvent(
  event: MetaPixelEvent,
  parameters?: Record<string, string | number>,
): void {
  if (typeof window === 'undefined' || !window.fbq) {
    return;
  }
  window.fbq('track', event, parameters);
}

/**
 * Meta Pixel Provider
 *
 * Renders the fbq base code + initial PageView. Place once in the root layout.
 * Renders nothing when NEXT_PUBLIC_FB_PIXEL_ID is not set.
 */
export function MetaPixelProvider() {
  const pixelId = env.analytics.facebookPixelId;

  if (!pixelId) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
`,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
