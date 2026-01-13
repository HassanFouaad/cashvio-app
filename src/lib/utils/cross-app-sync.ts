/**
 * Cross-App State Synchronization
 * 
 * Utilities to share theme and language preferences between Next.js app and Portal
 * across different subdomains using cookies and URL parameters.
 */

import { env } from '@/config/env';

// ============================================================================
// CONFIGURATION
// ============================================================================

const COOKIE_CONFIG = env.cookies;

const COOKIE_KEYS = {
  theme: 'app_theme',
  language: 'app_language',
  accessToken: 'app_access_token',
  refreshToken: 'app_refresh_token',
  expiresIn: 'app_expires_in',
} as const;

// ============================================================================
// COOKIE UTILITIES
// ============================================================================

/**
 * Set a cookie that can be shared across subdomains
 */
export function setSharedCookie(
  name: string,
  value: string,
  options: {
    domain?: string;
    maxAge?: number;
    path?: string;
    sameSite?: 'lax' | 'strict' | 'none';
    secure?: boolean;
  } = COOKIE_CONFIG
): void {
  if (typeof document === 'undefined') return;

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
export function removeSharedCookie(name: string, domain?: string): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0${
    domain ? `; domain=${domain}` : ''
  }`;
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
 */
export function saveLanguagePreference(language: string): void {
  // Save to shared cookie (for cross-subdomain)
  setSharedCookie(COOKIE_KEYS.language, language);
}

/**
 * Get language preference from cookie
 */
export function getLanguagePreference(): string | null {
  return getSharedCookie(COOKIE_KEYS.language);
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
// AUTH TOKEN SYNC (FOR REGISTRATION AUTO-LOGIN)
// ============================================================================

/**
 * Save authentication tokens to shared cookies for cross-subdomain auto-login
 * Used after registration to automatically log user into portal
 */
export function saveAuthTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void {
  // Save tokens with short expiry (5 minutes) - just for transfer
  const shortExpiryConfig = {
    ...COOKIE_CONFIG,
    maxAge: 300, // 5 minutes
  };

  setSharedCookie(COOKIE_KEYS.accessToken, accessToken, shortExpiryConfig);
  setSharedCookie(COOKIE_KEYS.refreshToken, refreshToken, shortExpiryConfig);
  setSharedCookie(COOKIE_KEYS.expiresIn, expiresIn.toString(), shortExpiryConfig);
}

/**
 * Get portal URL from environment
 */
export function getPortalUrl(): string {
  return env.portal.url;
}

/**
 * Redirect to portal after successful registration with auto-login
 */
export function redirectToPortalAfterRegistration(
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  },
  options?: {
    theme?: 'light' | 'dark';
    language?: string;
  }
): void {
  // 1. Save auth tokens to cookies
  saveAuthTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn);

  // 2. Save theme and language preferences
  if (options?.theme) {
    saveThemePreference(options.theme);
  }
  if (options?.language) {
    saveLanguagePreference(options.language);
  }

  // 3. Redirect to portal with registration flag
  const portalUrl = getPortalUrl();
  const urlWithParams = addStateToUrl(portalUrl, {
    theme: options?.theme || getThemePreference() || 'light',
    language: options?.language || getLanguagePreference() || 'en',
  });

  // Add registration success flag
  const url = new URL(urlWithParams);
  url.searchParams.set('registered', 'true');

  // Redirect
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

