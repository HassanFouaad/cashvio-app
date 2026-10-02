'use client';

import { PortalLink } from '@/components/ui/portal-link';
import { cn } from '@/lib/utils/cn';

export type RegistrationAlertTone = 'error' | 'info';

export interface RegistrationAlertProps {
  message: string;
  tone: RegistrationAlertTone;
  /** Label of a "sign in on the portal" link after the message, if any. */
  signInLabel?: string;
  /** Analytics location for the sign-in link. */
  trackLocation?: string;
}

/**
 * Inline message on the registration form: errors, and notices such as
 * "Google can't confirm this email". Optionally links to the portal login.
 */
export function RegistrationAlert({
  message,
  tone,
  signInLabel,
  trackLocation = 'register_alert',
}: RegistrationAlertProps) {
  const isError = tone === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'p-4 border border-dashed text-sm flex items-start gap-3',
        isError
          ? 'border-destructive/50 text-destructive'
          : 'border-primary/50 text-foreground'
      )}
    >
      <svg
        className={cn('w-5 h-5 flex-shrink-0 mt-0.5', !isError && 'text-primary')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={
            isError
              ? 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          }
        />
      </svg>
      <span>
        {message}
        {signInLabel && (
          <>
            {' '}
            <PortalLink
              type="button"
              variant="link"
              path="/login"
              trackLocation={trackLocation}
              className="h-auto p-0 font-medium align-baseline"
            >
              {signInLabel}
            </PortalLink>
          </>
        )}
      </span>
    </div>
  );
}
