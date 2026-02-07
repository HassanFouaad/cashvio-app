'use client';

import { useState, useSyncExternalStore } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { env } from '@/config/env';
import { isAuthenticated, redirectToPortalWithState, getThemePreference, saveThemePreference } from '@/lib/utils/cross-app-sync';
import { trackThemeChange } from '@/lib/analytics';

// Subscribe-to-nothing — used only to distinguish server vs client render
const subscribe = () => () => {};

/**
 * Mobile bottom navigation bar with glassy design.
 * Shows on mobile only (hidden on lg+ screens).
 *
 * Items:
 * 1. Dashboard (if logged in) or Sign Up (if not)
 * 2. Docs
 * 3. Dark mode toggle
 */
export function MobileFooterNav() {
  // useSyncExternalStore avoids the "setState in effect" lint rule
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isLoggedIn = useSyncExternalStore(subscribe, () => isAuthenticated(), () => false);

  // isDark needs local state so the toggle can re-render immediately
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    const theme = newIsDark ? 'dark' : 'light';
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveThemePreference(theme);
    trackThemeChange(theme);
  };

  const handleDashboardClick = () => {
    const theme = getThemePreference() || 'light';
    redirectToPortalWithState(env.portal.url, '/', { theme, language: locale });
  };

  // Check active state
  const isDocsActive = pathname.startsWith('/docs') || pathname.startsWith(`/${locale}/docs`);

  if (!mounted) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden h-16" />
    );
  }

  return (
    <>
      {/* Spacer to prevent content being hidden behind the fixed nav */}
      <div className="h-16 lg:hidden" />

      <nav
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-white/[0.08] dark:border-white/[0.06] bg-white/70 dark:bg-[#1a1f2e]/75 backdrop-blur-xl backdrop-saturate-150 pb-[env(safe-area-inset-bottom)]"
        style={{ WebkitBackdropFilter: 'blur(20px) saturate(1.5)' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {/* 1. Dashboard or Sign Up */}
          {isLoggedIn ? (
            <button
              onClick={handleDashboardClick}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-all duration-200',
                'text-muted-foreground hover:text-primary',
                'active:scale-95',
              )}
              aria-label={t('goToDashboard')}
            >
              {/* Dashboard icon */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="4" rx="1" />
                <rect x="14" y="10" width="7" height="11" rx="1" />
                <rect x="3" y="13" width="7" height="8" rx="1" />
              </svg>
              <span className="text-[10px] font-medium leading-none">
                {t('goToDashboard')}
              </span>
            </button>
          ) : (
            <Link
              href="/register"
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-all duration-200',
                pathname === '/register' || pathname === `/${locale}/register`
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary',
                'active:scale-95',
              )}
              aria-label={t('getStarted')}
            >
              {/* User plus icon */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <span className="text-[10px] font-medium leading-none">
                {t('getStarted')}
              </span>
            </Link>
          )}

          {/* 2. Docs */}
          <Link
            href="/docs"
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-all duration-200',
              isDocsActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary',
              'active:scale-95',
            )}
            aria-label={t('docs') || 'Docs'}
          >
            {/* Book/docs icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
            </svg>
            <span className="text-[10px] font-medium leading-none">
              {t('docs') || 'Docs'}
            </span>
          </Link>

          {/* 3. Theme toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-all duration-200',
              'text-muted-foreground hover:text-primary',
              'active:scale-95',
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              // Sun icon (currently dark, click to go light)
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              // Moon icon (currently light, click to go dark)
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
            <span className="text-[10px] font-medium leading-none">
              {isDark ? t('lightMode') : t('darkMode')}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
