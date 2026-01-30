/**
 * Cross-App State Synchronization
 *
 * Utilities to share theme and language preferences between Next.js app and Portal
 * across different subdomains using cookies.
 *
 * IMPORTANT: Authentication tokens are now handled via HttpOnly cookies
 * set by the backend. This file only manages PREFERENCE cookies (theme, language)
 * which need to be accessible via JavaScript for cross-app synchronization.
 *
 * Cookie Architecture:
 * - Auth cookies (HttpOnly): Set by backend, not accessible via JS
 * - Preference cookies (JS-accessible): Managed here for cross-subdomain sync
 */

import { env } from '@/config/env';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Get cookie domain based on environment
 * - Production: '.cash-vio.com' (shared across subdomains)
 * - Localhost: undefined (browser handles automatically)
 */
const getCookieDomain = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const hostname = window.location.hostname;

  // Localhost development - don't set domain
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return undefined;
  }

  // Production - use configured domain
  return env.cookies.domain;
};

/**
 * Check if we're in a secure context (HTTPS)
 */
const isSecure = (): boolean => {
  if (typeof window === 'undefined') return env.isProd;
  return window.location.protocol === 'https:';
};

const getCookieConfig = () => ({
  domain: getCookieDomain(),
  maxAge: env.cookies.maxAge,
  path: env.cookies.path,
  sameSite: env.cookies.sameSite,
  secure: isSecure(),
});

const COOKIE_KEYS = {
  // Preference cookies - using 'cv_' prefix for Cashvio
  theme: 'cv_theme',
  language: 'cv_language',
  // next-intl uses this cookie for locale detection
  nextLocale: 'NEXT_LOCALE',
  // Auth status cookie - indicates user is logged in on portal
  authStatus: 'cv_auth_status',
} as const;

// ============================================================================
// COOKIE UTILITIES
// ============================================================================

/**
 * Set a cookie that can be shared across subdomains
 * Uses dynamic configuration that adapts to the environment
 */
export function setSharedCookie(
  name: string,
  value: string,
  customOptions?: {
    domain?: string;
    maxAge?: number;
    path?: string;
    sameSite?: 'lax' | 'strict' | 'none';
    secure?: boolean;
  }
): void {
  if (typeof document === 'undefined') return;

  const defaultConfig = getCookieConfig();
  const options = { ...defaultConfig, ...customOptions };

  const cookieParts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    options.path && `path=${options.path}`,
    options.domain && `domain=${options.domain}`,
    options.maxAge && `max-age=${options.maxAge}`,
    options.sameSite && `samesite=${options.sameSite}`,
    options.secure && 'secure',
  ].filter(Boolean);

  document.cookie = cookieParts.join('; ');
}

/**
 * Get a cookie value by name
 */
export function getSharedCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`)
  );

  return matches ? decodeURIComponent(matches[1]) : null;
}

/**
 * Remove a cookie
 */
export function removeSharedCookie(name: string): void {
  if (typeof document === 'undefined') return;

  const domain = getCookieDomain();
  const domainPart = domain ? `; domain=${domain}` : '';

  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0${domainPart}`;
}

// ============================================================================
// THEME SYNC
// ============================================================================

/**
 * Save theme preference to both localStorage and shared cookie
 */
export function saveThemePreference(theme: 'light' | 'dark'): void {
  // Save to localStorage (for same origin)
  localStorage.setItem('theme', theme);

  // Save to shared cookie (for cross-subdomain)
  setSharedCookie(COOKIE_KEYS.theme, theme);
}

/**
 * Get theme preference from cookie or localStorage
 */
export function getThemePreference(): 'light' | 'dark' | null {
  // Try cookie first (works across subdomains)
  const cookieTheme = getSharedCookie(COOKIE_KEYS.theme);
  if (cookieTheme === 'light' || cookieTheme === 'dark') {
    return cookieTheme;
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const localTheme = localStorage.getItem('theme');
    if (localTheme === 'light' || localTheme === 'dark') {
      return localTheme;
    }
  }

  return null;
}

// ============================================================================
// LANGUAGE SYNC
// ============================================================================

/**
 * Save language preference to shared cookie
 * Also syncs with NEXT_LOCALE cookie for next-intl SSR support
 */
export function saveLanguagePreference(language: string): void {
  // Save to shared cookie (for cross-subdomain)
  setSharedCookie(COOKIE_KEYS.language, language);
  
  // Also set NEXT_LOCALE cookie for next-intl middleware
  // This ensures SSR picks up the correct locale on reload
  setSharedCookie(COOKIE_KEYS.nextLocale, language);
}

/**
 * Get language preference from cookie
 */
export function getLanguagePreference(): string | null {
  return getSharedCookie(COOKIE_KEYS.language);
}

// ============================================================================
// AUTH STATUS (Cross-App Login Detection)
// ============================================================================

/**
 * Check if user is authenticated on the portal
 * This reads the cv_auth_status cookie set by tenant-portal
 * Used to show "Go to Dashboard" instead of "Login/Register"
 */
export function isAuthenticated(): boolean {
  const status = getSharedCookie(COOKIE_KEYS.authStatus);
  return status === 'true';
}

// ============================================================================
// URL PARAMETER UTILITIES
// ============================================================================

/**
 * Add theme and language parameters to a URL
 */
export function addStateToUrl(
  url: string,
  options: {
    theme?: 'light' | 'dark';
    language?: string;
  }
): string {
  const urlObj = new URL(url);

  if (options.theme) {
    urlObj.searchParams.set('theme', options.theme);
  }

  if (options.language) {
    urlObj.searchParams.set('lang', options.language);
  }

  return urlObj.toString();
}

/**
 * Extract theme and language from URL parameters
 */
export function getStateFromUrl(url?: string): {
  theme: 'light' | 'dark' | null;
  language: string | null;
} {
  if (typeof window === 'undefined' && !url) {
    return { theme: null, language: null };
  }

  const urlObj = new URL(url || window.location.href);

  const theme = urlObj.searchParams.get('theme');
  const language = urlObj.searchParams.get('lang');

  return {
    theme: theme === 'light' || theme === 'dark' ? theme : null,
    language: language || null,
  };
}

// ============================================================================
// REDIRECT WITH STATE
// ============================================================================

/**
 * Redirect to portal with current theme and language
 */
export function redirectToPortalWithState(
  portalUrl: string,
  path: string = '/login',
  options?: {
    theme?: 'light' | 'dark';
    language?: string;
  }
): void {
  const currentTheme = options?.theme || getThemePreference() || 'light';
  const currentLanguage = options?.language || 'en';

  // Save to cookies before redirect
  saveThemePreference(currentTheme);
  saveLanguagePreference(currentLanguage);

  // Build URL with parameters
  const fullUrl = `${portalUrl}${path}`;
  const urlWithState = addStateToUrl(fullUrl, {
    theme: currentTheme,
    language: currentLanguage,
  });

  // Redirect
  window.location.href = urlWithState;
}

// ============================================================================
// AUTH TOKEN HANDLING
// ============================================================================

/**
 * NOTE: Auth token saving has been removed from this file.
 *
 * Authentication tokens are now stored in HttpOnly cookies by the backend.
 * When the user registers, the backend sets HttpOnly cookies automatically.
 * The browser sends these cookies with subsequent requests.
 *
 * This provides better security against XSS attacks since JavaScript
 * cannot access HttpOnly cookies.
 */

/**
 * Get portal URL from environment
 */
export function getPortalUrl(): string {
  return env.portal.url;
}

/**
 * Redirect to portal after successful registration
 *
 * Note: Auth tokens are now set as HttpOnly cookies by the backend
 * during the registration API call. We just need to redirect.
 */
export function redirectToPortalAfterRegistration(
  options?: {
    theme?: 'light' | 'dark';
    language?: string;
  }
): void {
  // Save theme and language preferences
  if (options?.theme) {
    saveThemePreference(options.theme);
  }
  if (options?.language) {
    saveLanguagePreference(options.language);
  }

  // Redirect to portal with preferences
  const portalUrl = getPortalUrl();
  const urlWithParams = addStateToUrl(portalUrl, {
    theme: options?.theme || getThemePreference() || 'light',
    language: options?.language || getLanguagePreference() || 'en',
  });

  // Add registration success flag
  const url = new URL(urlWithParams);
  url.searchParams.set('registered', 'true');

  // Redirect - browser will send HttpOnly cookies automatically
  window.location.href = url.toString();
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize theme and language from URL params or cookies
 * Call this on app mount in the portal
 */
export function initializeFromSharedState(): {
  theme: 'light' | 'dark';
  language: string;
} {
  // 1. Try URL parameters first
  const urlState = getStateFromUrl();

  // 2. Fallback to cookies
  const cookieTheme = getThemePreference();
  const cookieLanguage = getLanguagePreference();

  // 3. Determine final values
  const theme = urlState.theme || cookieTheme || 'light';
  const language = urlState.language || cookieLanguage || 'en';

  // 4. Save preferences (sync URL params to cookies)
  saveThemePreference(theme);
  saveLanguagePreference(language);

  // 5. Clean up URL parameters
  if (urlState.theme || urlState.language) {
    const url = new URL(window.location.href);
    url.searchParams.delete('theme');
    url.searchParams.delete('lang');
    window.history.replaceState({}, '', url.toString());
  }

  return { theme, language };
}

