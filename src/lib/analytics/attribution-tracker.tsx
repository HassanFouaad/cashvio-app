'use client';

import { useEffect } from 'react';
import { captureAttribution } from './attribution';

/**
 * Records first-touch acquisition attribution (UTM params, ?ref= codes,
 * referrer) into the shared `cv_attribution` cookie on mount.
 *
 * Mounted once in the locale layout; renders nothing.
 */
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
