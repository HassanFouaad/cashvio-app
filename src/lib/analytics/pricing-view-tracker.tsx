'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { trackPricingView } from './events';

/**
 * Fires pricing_view once when the pricing page mounts.
 */
export function PricingViewTracker() {
  const locale = useLocale();

  useEffect(() => {
    trackPricingView(locale);
  }, [locale]);

  return null;
}
