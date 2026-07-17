'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';

const navItems = [
  {
    key: 'home',
    href: '/' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: 'features',
    href: '/features' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    key: 'docs',
    href: '/docs' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
] as const;

interface ChatwootSDK {
  toggle: (state?: 'open' | 'close') => void;
}

export function MobileFooterNav() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [isChatReady, setIsChatReady] = useState(false);

  useEffect(() => {
    const getChatwoot = (): ChatwootSDK | undefined =>
      (window as { $chatwoot?: ChatwootSDK }).$chatwoot;

    if (getChatwoot()) {
      setIsChatReady(true);
      return;
    }

    const handleReady = () => setIsChatReady(true);
    window.addEventListener('chatwoot:ready', handleReady);

    const intervalId = window.setInterval(() => {
      if (getChatwoot()) {
        setIsChatReady(true);
        window.clearInterval(intervalId);
      }
    }, 400);

    return () => {
      window.removeEventListener('chatwoot:ready', handleReady);
      window.clearInterval(intervalId);
    };
  }, []);

  const openChat = () => {
    const chatwoot = (window as { $chatwoot?: ChatwootSDK }).$chatwoot;
    chatwoot?.toggle('open');
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden" dir="ltr">
      <div className="flex items-center justify-around p-2 rounded-xl bg-background/90 backdrop-blur-lg border border-border">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{t(item.key)}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={openChat}
          disabled={!isChatReady}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] text-muted-foreground hover:text-foreground disabled:opacity-50"
          aria-label={t('openChat')}
          title={t('support')}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
          <span className="text-[10px] font-medium">{t('support')}</span>
        </button>
      </div>
    </nav>
  );
}
