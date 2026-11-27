'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { trackThemeChange } from '@/lib/analytics';
import { saveThemePreference } from '@/lib/utils/cross-app-sync';
import { useThemeSnapshot } from '@/lib/utils/client-snapshot';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const isDark = useThemeSnapshot();
  const t = useTranslations('common');

  const toggleTheme = () => {
    const newIsDark = !isDark;

    const theme = newIsDark ? 'dark' : 'light';

    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to both localStorage and shared cookie
    saveThemePreference(theme);

    // Track theme change
    trackThemeChange(theme);
  };

  if (isDark === null) {
    return (
      <button
        className={cn(
          'touch-icon inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
          className
        )}
        aria-label={t('toggleTheme')}
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'touch-icon inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
        className
      )}
      aria-label={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
    >
      {isDark ? (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
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
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
