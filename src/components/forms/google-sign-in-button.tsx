'use client';

/**
 * "Sign up with Google" button (Google Identity Services)
 *
 * Loads https://accounts.google.com/gsi/client with next/script
 * `lazyOnload`, so it never joins the initial bundle and only loads on pages
 * that render this component (the register page). A fixed-size placeholder
 * holds the button's space until Google renders it, so nothing shifts.
 *
 * Popup mode only: redirect mode would POST the credential from
 * accounts.google.com, which the API rejects as a foreign origin. The
 * credential is handed to `onCredential` and is never logged or tracked.
 */

import Script from 'next/script';
import { useLocale } from 'next-intl';
import * as React from 'react';

import { env } from '@/config/env';
import { cn } from '@/lib/utils/cn';
import type {
  GoogleAccountsId,
  GoogleButtonTheme,
  GoogleCredentialResponse,
} from '@/types/google-identity';

const GIS_SCRIPT_ID = 'google-identity-services';
const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/** Google renders standard buttons between 200 and 400 pixels wide. */
const GOOGLE_BUTTON_MIN_WIDTH = 200;
const GOOGLE_BUTTON_MAX_WIDTH = 400;

/**
 * GIS keeps one configuration per page, so initialize once per client ID and
 * route the credential to whichever button is mounted.
 */
let initializedClientId: string | null = null;
let activeCredentialHandler: ((idToken: string) => void) | null = null;

function handleGoogleCredential(response: GoogleCredentialResponse): void {
  if (response.credential) {
    activeCredentialHandler?.(response.credential);
  }
}

function ensureGoogleInitialized(identity: GoogleAccountsId, clientId: string): void {
  if (initializedClientId === clientId) return;

  identity.initialize({
    client_id: clientId,
    callback: handleGoogleCredential,
    ux_mode: 'popup',
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  initializedClientId = clientId;
}

/** Match the site theme: the root element carries `dark` in dark mode. */
function getGoogleButtonTheme(): GoogleButtonTheme {
  return document.documentElement.classList.contains('dark')
    ? 'filled_black'
    : 'outline';
}

function getGoogleButtonWidth(container: HTMLElement): number {
  return Math.min(
    GOOGLE_BUTTON_MAX_WIDTH,
    Math.max(GOOGLE_BUTTON_MIN_WIDTH, Math.floor(container.clientWidth))
  );
}

export interface GoogleSignInButtonProps {
  /** Receives the Google ID token after the account chooser. */
  onCredential: (idToken: string) => void;
  /** Called when the Google script cannot load; hide the Google UI. */
  onUnavailable: () => void;
  /** Blocks clicks while the form is busy. */
  isDisabled?: boolean;
  className?: string;
}

export function GoogleSignInButton({
  onCredential,
  onUnavailable,
  isDisabled = false,
  className,
}: GoogleSignInButtonProps) {
  const locale = useLocale();
  const googleLocale = locale === 'ar' ? 'ar' : 'en';
  const clientId = env.google.clientId;
  const frameRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLDivElement>(null);
  const placeholderRef = React.useRef<HTMLDivElement>(null);
  const [isScriptReady, setIsScriptReady] = React.useState(false);

  // Route Google's callback to the current handler
  React.useEffect(() => {
    activeCredentialHandler = onCredential;
    return () => {
      if (activeCredentialHandler === onCredential) {
        activeCredentialHandler = null;
      }
    };
  }, [onCredential]);

  // Render the button once the script is ready, and again on theme changes
  React.useEffect(() => {
    const identity = window.google?.accounts.id;
    const frame = frameRef.current;
    const button = buttonRef.current;
    if (!isScriptReady || !identity || !frame || !button || !clientId) return;

    ensureGoogleInitialized(identity, clientId);

    let renderedTheme: GoogleButtonTheme | null = null;
    const renderButton = (): void => {
      const theme = getGoogleButtonTheme();
      if (theme === renderedTheme) return;
      renderedTheme = theme;

      identity.renderButton(button, {
        type: 'standard',
        theme,
        size: 'large',
        text: 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        locale: googleLocale,
        width: getGoogleButtonWidth(frame),
      });
    };

    // Keep the placeholder until Google's button frame has a height, so the
    // slot never goes blank while the button loads
    const placeholderObserver = new ResizeObserver(() => {
      if (button.getBoundingClientRect().height > 0 && placeholderRef.current) {
        placeholderRef.current.hidden = true;
        placeholderObserver.disconnect();
      }
    });
    placeholderObserver.observe(button);

    renderButton();

    const themeObserver = new MutationObserver(renderButton);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      placeholderObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [isScriptReady, clientId, googleLocale]);

  if (!clientId) return null;

  return (
    <>
      {/* `hl` localizes the in-page button Google shows before its frame
          loads; the fixed id keeps a locale switch from loading GIS twice */}
      <Script
        id={GIS_SCRIPT_ID}
        src={`${GIS_SCRIPT_SRC}?hl=${googleLocale}`}
        strategy="lazyOnload"
        onReady={() => setIsScriptReady(true)}
        onError={onUnavailable}
      />
      <div
        ref={frameRef}
        className={cn(
          'relative mx-auto h-10 w-full max-w-100',
          isDisabled && 'pointer-events-none opacity-60',
          className
        )}
        aria-disabled={isDisabled || undefined}
      >
        <div
          ref={placeholderRef}
          aria-hidden="true"
          className="absolute inset-0 animate-pulse rounded border border-border bg-muted"
        />
        {/* Sized by Google's button; the frame above holds the 40px slot */}
        <div ref={buttonRef} className="relative flex justify-center" />
      </div>
    </>
  );
}
