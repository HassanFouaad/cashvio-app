'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  SCROLL_DEPTH_MILESTONES,
  TIME_ON_PAGE_THRESHOLDS_SECONDS,
  type ScrollDepthMilestone,
} from './constants';
import { trackScrollDepth, trackTimeOnPage } from './events';

/**
 * Passive scroll-depth and time-on-page milestones once per path.
 * Mounted in the locale layout; renders nothing.
 */
export function EngagementTracker() {
  const pathname = usePathname();
  const firedScrollRef = useRef<Set<ScrollDepthMilestone>>(new Set());
  const firedTimeRef = useRef<Set<number>>(new Set());
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    firedScrollRef.current = new Set();
    firedTimeRef.current = new Set();
    startedAtRef.current = Date.now();

    const handleScroll = () => {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;

      const percent = Math.round((window.scrollY / documentHeight) * 100);

      for (const milestone of SCROLL_DEPTH_MILESTONES) {
        if (
          percent >= milestone &&
          !firedScrollRef.current.has(milestone)
        ) {
          firedScrollRef.current.add(milestone);
          trackScrollDepth(milestone, pathname);
        }
      }
    };

    const handleTick = () => {
      const elapsedSeconds = Math.floor(
        (Date.now() - startedAtRef.current) / 1000
      );

      for (const threshold of TIME_ON_PAGE_THRESHOLDS_SECONDS) {
        if (
          elapsedSeconds >= threshold &&
          !firedTimeRef.current.has(threshold)
        ) {
          firedTimeRef.current.add(threshold);
          trackTimeOnPage(threshold, pathname);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const intervalId = window.setInterval(handleTick, 5000);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearInterval(intervalId);
    };
  }, [pathname]);

  return null;
}
