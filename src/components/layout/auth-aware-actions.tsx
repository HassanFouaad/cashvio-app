'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { PortalLink } from '@/components/ui/portal-link';
import { ctaLinks } from '@/config/navigation';
import { isAuthenticated } from '@/lib/utils/cross-app-sync';
import { TrackedButtonLink } from '@/lib/analytics';

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
        <PortalLink variant="primary" size="sm" path="/" trackLocation="header">
          {tCommon('goToDashboard')}
        </PortalLink>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="w-px h-6 bg-border mx-2" />
      <PortalLink variant="ghost" size="sm" path="/login" trackLocation="header">
        {tCommon('login')}
      </PortalLink>
      <TrackedButtonLink
        variant="primary"
        size="sm"
        href={ctaLinks.getStarted}
        trackName="get_started"
        trackLocation="header"
      >
        {tCommon('getStarted')}
      </TrackedButtonLink>
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
        <PortalLink
          variant="primary"
          size="md"
          path="/"
          className="justify-center"
          trackLocation="mobile_nav"
        >
          {tCommon('goToDashboard')}
        </PortalLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <PortalLink
        variant="outline"
        size="md"
        path="/login"
        className="justify-center"
        trackLocation="mobile_nav"
      >
        {tCommon('login')}
      </PortalLink>
      <TrackedButtonLink
        variant="primary"
        size="md"
        href={ctaLinks.getStarted}
        className="justify-center"
        trackName="get_started"
        trackLocation="mobile_nav"
      >
        {tCommon('getStarted')}
      </TrackedButtonLink>
    </div>
  );
}
