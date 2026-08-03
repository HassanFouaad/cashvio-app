'use client';

import { forwardRef, type MouseEvent } from 'react';
import { ButtonLink, type ButtonLinkProps } from '@/components/ui/button';
import { trackCTAClick } from './events';

export interface TrackedButtonLinkProps extends ButtonLinkProps {
  /** CTA name sent to GA (required to enable tracking) */
  trackName?: string;
  /** Page / surface location, e.g. "home_hero", "features/free-pos" */
  trackLocation?: string;
}

/**
 * ButtonLink that fires `cta_click` when trackName + trackLocation are set.
 * Safe no-op when tracking props are omitted.
 */
export const TrackedButtonLink = forwardRef<
  HTMLAnchorElement,
  TrackedButtonLinkProps
>(function TrackedButtonLink(
  { trackName, trackLocation, onClick, href, ...props },
  ref
) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (trackName && trackLocation) {
      trackCTAClick(
        trackName,
        trackLocation,
        typeof href === 'string' ? href : undefined
      );
    }
    onClick?.(event);
  };

  return (
    <ButtonLink ref={ref} href={href} onClick={handleClick} {...props} />
  );
});
