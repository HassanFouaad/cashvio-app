'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { env } from '@/config/env';
import { redirectToPortalWithState, getThemePreference } from '@/lib/utils/cross-app-sync';
import { useLocale } from 'next-intl';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary shadow-sm hover:shadow-md',
        secondary:
          'bg-secondary text-secondary-foreground hover:opacity-90 focus-visible:ring-secondary shadow-sm',
        outline:
          'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary',
        ghost: 'text-foreground hover:bg-muted focus-visible:ring-primary',
        link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary p-0 h-auto',
        destructive:
          'bg-destructive text-destructive-foreground hover:opacity-90 focus-visible:ring-destructive shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

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

