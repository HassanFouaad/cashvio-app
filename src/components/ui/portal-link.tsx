'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { env } from '@/config/env';
import { redirectToPortalWithState, getThemePreference } from '@/lib/utils/cross-app-sync';
import { useLocale } from 'next-intl';
import { buttonVariants } from './button';

export interface PortalLinkProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof buttonVariants> {
  /**
   * Path on the portal to redirect to (e.g., '/login', '/dashboard')
   */
  path?: string;
}

/**
 * Button component that redirects to the portal with theme and language preferences
 * 
 * Use this instead of regular links when redirecting to the portal to ensure
 * theme and language preferences are preserved across subdomains.
 */
export const PortalLink = forwardRef<HTMLButtonElement, PortalLinkProps>(
  ({ className, variant, size, path = '/login', children, ...props }, ref) => {
    const locale = useLocale();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      
      const theme = getThemePreference() || 'light';
      redirectToPortalWithState(env.portal.url, path, {
        theme,
        language: locale,
      });
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PortalLink.displayName = 'PortalLink';

