'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { TrackedExternalLink } from '@/lib/analytics';
import type { Locale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

const FACEBOOK_SDK_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  ar: 'ar_AR',
};

const FACEBOOK_ICON_PATH =
  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';

function isNonPublicHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.local') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.')
  );
}

function buildLikeIframeSrc(pageUrl: string, locale: Locale): string {
  const params = new URLSearchParams({
    href: pageUrl,
    width: '130',
    layout: 'button_count',
    action: 'like',
    size: 'small',
    share: 'false',
    height: '21',
    locale: FACEBOOK_SDK_LOCALE[locale],
  });

  return `https://www.facebook.com/plugins/like.php?${params.toString()}`;
}

function FacebookLikeFallback({ pageUrl, label }: { pageUrl: string; label: string }) {
  return (
    <TrackedExternalLink
      href={pageUrl}
      trackLocation="footer"
      trackKind="outbound"
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-muted/60 px-3 text-xs text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
      aria-label={label}
    >
      <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={FACEBOOK_ICON_PATH} />
      </svg>
      <span>{label}</span>
    </TrackedExternalLink>
  );
}

/**
 * Lazy-loaded Facebook Page Like button for the site footer.
 * Facebook's official embed does not render on localhost or other private hosts,
 * so we show a tracked link fallback during local development.
 */
export function FacebookLikeButton() {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState<boolean | null>(null);
  const [shouldLoadEmbed, setShouldLoadEmbed] = useState(false);

  const pageUrl = siteConfig.social.facebook;
  const label = t('facebookLike');

  useEffect(() => {
    if (!pageUrl) {
      return;
    }

    if (isNonPublicHost(window.location.hostname)) {
      setUseFallback(true);
      return;
    }

    setUseFallback(false);

    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadEmbed(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [pageUrl]);

  if (!pageUrl) {
    return null;
  }

  if (useFallback) {
    return <FacebookLikeFallback pageUrl={pageUrl} label={label} />;
  }

  return (
    <div ref={containerRef} className="flex min-h-9 items-center">
      {shouldLoadEmbed ? (
        <iframe
          title={label}
          src={buildLikeIframeSrc(pageUrl, locale)}
          width={130}
          height={21}
          className="overflow-hidden border-0"
          scrolling="no"
          allow="encrypted-media"
          aria-label={label}
        />
      ) : null}
    </div>
  );
}
