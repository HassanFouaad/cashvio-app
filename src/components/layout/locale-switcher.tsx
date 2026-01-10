'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { type Locale, localeMetadata } from '@/i18n/routing';
import { cn } from '@/lib/utils/cn';
import { trackLocaleChange } from '@/lib/analytics';
import { saveLanguagePreference } from '@/lib/utils/cross-app-sync';

interface LocaleSwitcherProps {
  locale: Locale;
  className?: string;
}

export function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const targetLocale = locale === 'en' ? 'ar' : 'en';
  const targetMeta = localeMetadata[targetLocale];

  const handleSwitch = () => {
    // Save language preference to shared cookie
    saveLanguagePreference(targetLocale);
    
    // Track locale change
    trackLocaleChange(locale, targetLocale);
    
    // Use next-intl router to switch locale properly
    router.replace(pathname, { locale: targetLocale });
  };

  return (
    <button
      onClick={handleSwitch}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
        'text-muted-foreground hover:text-foreground hover:bg-muted',
        'transition-colors duration-200',
        className
      )}
      aria-label={`Switch to ${targetMeta.name}`}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
      <span>{targetMeta.nativeName}</span>
    </button>
  );
}
