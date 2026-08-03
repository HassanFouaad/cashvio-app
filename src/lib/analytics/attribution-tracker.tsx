'use client';

import { useEffect } from 'react';
import {
  applyAttributionToGtag,
  captureAttribution,
} from './attribution';

/**
 * Records first-touch acquisition attribution (UTM params, ?ref= codes,
 * referrer) into the shared `cv_attribution` cookie on mount, then pushes
 * campaign / user properties into gtag when available.
 *
 * Mounted once in the locale layout; renders nothing.
 */
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();

    // gtag may load slightly after hydration; retry briefly so Acquisition
    // context is set without blocking the main thread.
    applyAttributionToGtag();
    const retryTimers = [500, 1500, 3000].map((delay) =>
      window.setTimeout(() => {
        applyAttributionToGtag();
      }, delay)
    );

    return () => {
      retryTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return null;
}
