'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

const FACEBOOK_SDK_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  ar: 'ar_AR',
};

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (element?: HTMLElement) => void;
      };
    };
    fbAsyncInit?: () => void;
  }
}

let facebookSdkPromise: Promise<void> | null = null;

function ensureFacebookRoot(): void {
  if (document.getElementById('fb-root')) {
    return;
  }

  const root = document.createElement('div');
  root.id = 'fb-root';
  document.body.insertBefore(root, document.body.firstChild);
}

function loadFacebookSdk(locale: Locale, appId: string): Promise<void> {
  if (window.FB) {
    return Promise.resolve();
  }

  if (!facebookSdkPromise) {
    facebookSdkPromise = new Promise((resolve) => {
      ensureFacebookRoot();

      const previousInit = window.fbAsyncInit;
      window.fbAsyncInit = () => {
        previousInit?.();
        resolve();
      };

      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = `https://connect.facebook.net/${FACEBOOK_SDK_LOCALE[locale]}/sdk.js#xfbml=1&version=v21.0&appId=${appId}`;
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);
      }
    });
  }

  return facebookSdkPromise;
}

/**
 * Official Facebook Like plugin. Logged-in visitors can like the page in place.
 * Facebook only renders this on public domains, not on localhost.
 */
export function FacebookLikeButton() {
  const locale = useLocale() as Locale;
  const t = useTranslations('footer');
  const containerRef = useRef<HTMLDivElement>(null);
  const parsedRef = useRef(false);

  const pageUrl = siteConfig.social.facebook;
  const appId = siteConfig.social.facebookAppId;

  useEffect(() => {
    if (!pageUrl || !appId) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || cancelled || parsedRef.current) {
          return;
        }

        observer.disconnect();

        void loadFacebookSdk(locale, appId).then(() => {
          if (cancelled || parsedRef.current) {
            return;
          }

          parsedRef.current = true;
          window.FB?.XFBML.parse(container);
        });
      },
      { rootMargin: '200px' },
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [appId, locale, pageUrl]);

  if (!pageUrl || !appId) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="flex min-h-7 items-center"
      aria-label={t('facebookLike')}
    >
      <div
        className="fb-like"
        data-href={pageUrl}
        data-width=""
        data-layout="button"
        data-action="like"
        data-size="small"
        data-share="false"
      />
    </div>
  );
}
