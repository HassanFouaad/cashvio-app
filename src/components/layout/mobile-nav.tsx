'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { mainNavigation, type NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import { Logo } from './logo';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from './theme-toggle';
import { AuthAwareActionsMobile } from './auth-aware-actions';

interface MobileNavProps {
  locale: Locale;
}

interface MobileNavGroupProps {
  item: NavItem;
  onNavigate: () => void;
}

function MobileNavGroup({ item, onNavigate }: MobileNavGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations('navigation');
  const children = item.children ?? [];

  return (
    <div className="rounded-xl bg-muted/30 overflow-hidden">
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className="flex-1 px-4 py-3 text-foreground font-medium hover:bg-muted/60 transition-all duration-200"
        >
          {t(item.key)}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={t(item.key)}
          className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <svg
            className={cn('w-4 h-4 transition-transform duration-200', expanded && 'rotate-180')}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
      {expanded && (
        <ul className="pb-2">
          {children.map((child) => (
            <li key={child.key}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block ps-8 pe-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
              >
                {t(child.key)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MobileNav({ locale }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('navigation');

  useEffect(() => {
    setMounted(true);
  }, []);

  /*
    Off-canvas drawer rendered through a portal on <body>.

    Why a portal: the site <header> uses `backdrop-blur` (backdrop-filter),
    which establishes a containing block for fixed-positioned descendants.
    Rendering the drawer inside the header would therefore clamp it to the
    64px header box instead of the viewport. Portaling to <body> lets the
    `fixed inset-0` container fill the real viewport.

    Why the panel is `absolute` inside an `overflow-hidden` container: the
    closed panel is translated fully off-screen; clipping it here prevents it
    from adding horizontal page scroll, while keeping the slide animation.
  */
  const drawer = (
    <div
      className="fixed inset-0 z-[60] overflow-hidden lg:hidden"
      aria-hidden={false}
    >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300 opacity-100"
          onClick={() => setIsOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            'absolute top-0 bottom-0 w-full max-w-sm bg-background/95 backdrop-blur-xl border-border/30 shadow-2xl',
            'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
            locale === 'ar' ? 'left-0 border-r' : 'right-0 border-l',
            'translate-x-0'
          )}
        >
          <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <Logo size="sm" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links as card-style items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1.5">
              {mainNavigation.map((item) => (
                <li key={item.key}>
                  {item.children?.length ? (
                    <MobileNavGroup item={item} onNavigate={() => setIsOpen(false)} />
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-xl text-foreground font-medium bg-muted/30 hover:bg-muted/60 transition-all duration-200"
                    >
                      {t(item.key)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/30 space-y-4">
            <div className="flex items-center gap-2">
              <LocaleSwitcher locale={locale} className="flex-1 justify-center" />
              <ThemeToggle />
            </div>
            <AuthAwareActionsMobile />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        )}
      </button>

      {mounted && isOpen ? createPortal(drawer, document.body) : null}
    </div>
  );
}
