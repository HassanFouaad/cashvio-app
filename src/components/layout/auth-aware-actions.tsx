'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ButtonLink } from '@/components/ui/button';
import { PortalLink } from '@/components/ui/portal-link';
import { ctaLinks } from '@/config/navigation';
import { isAuthenticated } from '@/lib/utils/cross-app-sync';

interface AuthAwareActionsProps {
  className?: string;
}

/**
 * Auth-aware action buttons for the header
 * Shows "Go to Dashboard" when user is logged in on portal
 * Shows "Login" and "Get Started" when not logged in
 */
export function AuthAwareActions({ className }: AuthAwareActionsProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tCommon = useTranslations('common');

  useEffect(() => {
    setMounted(true);
    // Check auth status from shared cookie
    setIsLoggedIn(isAuthenticated());
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={className}>
        <div className="w-px h-6 bg-border mx-2" />
        {/* Placeholder to prevent layout shift */}
        <div className="h-9 w-16 rounded-lg bg-muted animate-pulse" />
        <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className={className}>
        <div className="w-px h-6 bg-border mx-2" />
        <PortalLink variant="primary" size="sm" path="/">
          {tCommon('goToDashboard')}
        </PortalLink>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="w-px h-6 bg-border mx-2" />
      <PortalLink variant="ghost" size="sm" path="/login">
        {tCommon('login')}
      </PortalLink>
      <ButtonLink variant="primary" size="sm" href={ctaLinks.getStarted}>
        {tCommon('getStarted')}
      </ButtonLink>
    </div>
  );
}

/**
 * Auth-aware action buttons for the mobile nav
 * Same logic but different layout for mobile
 */
export function AuthAwareActionsMobile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tCommon = useTranslations('common');

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(isAuthenticated());
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 rounded-lg bg-muted animate-pulse" />
        <div className="h-10 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="grid grid-cols-1 gap-2">
        <PortalLink variant="primary" size="md" path="/" className="justify-center">
          {tCommon('goToDashboard')}
        </PortalLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <PortalLink variant="outline" size="md" path="/login" className="justify-center">
        {tCommon('login')}
      </PortalLink>
      <ButtonLink variant="primary" size="md" href={ctaLinks.getStarted} className="justify-center">
        {tCommon('getStarted')}
      </ButtonLink>
    </div>
  );
}
