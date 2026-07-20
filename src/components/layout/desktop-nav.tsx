'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { mainNavigation, type NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';

const topLevelLinkClasses =
  'px-3 py-2 mono-label text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-muted';

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('navigation');
  const children = item.children ?? [];
  const isWide = children.length > 6;

  const close = () => setOpen(false);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={close}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
      onBlur={(event) => {
        // Close when keyboard focus moves outside the trigger + panel
        if (!wrapperRef.current?.contains(event.relatedTarget as Node)) close();
      }}
    >
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={close}
          className={cn(topLevelLinkClasses, 'pe-1')}
        >
          {t(item.key)}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={t(item.key)}
          onClick={() => setOpen((value) => !value)}
          className="py-2 pe-2 ps-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ChevronDown
            className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      </div>

      {open && (
        <div className="absolute start-0 top-full z-50 pt-2">
          <ul
            className={cn(
              'rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-lg p-2',
              isWide ? 'grid grid-cols-2 gap-x-1 w-[32rem]' : 'w-64'
            )}
          >
            {children.map((child) => (
              <li key={child.key}>
                <Link
                  href={child.href}
                  onClick={close}
                  className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                >
                  {t(child.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function DesktopNav() {
  const t = useTranslations('navigation');

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {mainNavigation.map((item) =>
        item.children?.length ? (
          <NavDropdown key={item.key} item={item} />
        ) : (
          <Link key={item.key} href={item.href} className={topLevelLinkClasses}>
            {t(item.key)}
          </Link>
        )
      )}
    </nav>
  );
}
