'use client';

import { useRouter, usePathname } from 'next/navigation';
import { type Locale, localeMetadata } from '@/i18n/routing';
import { cn } from '@/lib/utils/cn';

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
    // Replace the locale segment in the pathname
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'ar') {
      segments[1] = targetLocale;
    }
    const newPath = segments.join('/') || `/${targetLocale}`;
    router.push(newPath);
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
