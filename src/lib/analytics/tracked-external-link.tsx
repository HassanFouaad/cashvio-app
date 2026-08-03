'use client';

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from 'react';
import { trackOutboundLink, trackWhatsAppClick } from './events';

export interface TrackedExternalLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Surface location for analytics, e.g. "footer", "contact_page" */
  trackLocation: string;
  /** Special-case WhatsApp vs generic outbound */
  trackKind?: 'whatsapp' | 'outbound';
}

/**
 * External anchor that fires WhatsApp or outbound analytics on click.
 */
export const TrackedExternalLink = forwardRef<
  HTMLAnchorElement,
  TrackedExternalLinkProps
>(function TrackedExternalLink(
  {
    trackLocation,
    trackKind = 'outbound',
    onClick,
    href,
    children,
    ...props
  },
  ref
) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (trackKind === 'whatsapp') {
      trackWhatsAppClick(trackLocation);
    } else if (typeof href === 'string') {
      trackOutboundLink(
        href,
        typeof children === 'string' ? children : undefined
      );
    }
    onClick?.(event);
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
});
