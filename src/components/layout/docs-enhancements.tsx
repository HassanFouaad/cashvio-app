'use client';

import { useEffect } from 'react';

/**
 * Client component that patches Fumadocs UI behavior:
 *
 * 1. Auto-closes the TOC (Table of Contents) popover dropdown
 *    when user clicks a heading link inside it.
 *
 * 2. Adds a visible text label ("More docs" / "المزيد من الشرح") to the
 *    mobile sidebar trigger button so it's not icon-only.
 */
export function DocsEnhancements({ locale }: { locale: string }) {
  useEffect(() => {
    // --- 1. TOC Popover: close on link click ---
    function handleTocLinkClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const anchor = target.closest('[data-toc-popover-content] a');
      if (!anchor) return;

      // Find the popover trigger and click it to close the popover
      const popover = anchor.closest('[data-toc-popover]');
      if (!popover) return;

      const trigger = popover.querySelector(
        '[data-toc-popover-trigger]',
      ) as HTMLElement | null;
      if (trigger) {
        // Small delay so the browser can process the hash navigation first
        requestAnimationFrame(() => {
          trigger.click();
        });
      }
    }

    document.addEventListener('click', handleTocLinkClick);

    // --- 2. Sidebar trigger: add text label ---
    const label = locale === 'ar' ? 'المزيد من الشرح' : 'More docs';

    function patchSidebarTrigger() {
      const nav = document.getElementById('nd-subnav');
      if (nav) {
        const btn = nav.querySelector(
          '[aria-label="Open Sidebar"]',
        ) as HTMLElement | null;
        if (btn && !btn.hasAttribute('data-label')) {
          btn.setAttribute('data-label', label);
        }
      }
    }

    // --- 3. Force sidebar drawer z-index above site header (z-50) ---
    function patchSidebarZIndex() {
      const sidebar = document.getElementById('nd-sidebar-mobile');
      if (sidebar) {
        sidebar.style.zIndex = '60';
        // Also fix the overlay (previous sibling)
        const overlay = sidebar.previousElementSibling as HTMLElement | null;
        if (overlay && getComputedStyle(overlay).position === 'fixed') {
          overlay.style.zIndex = '60';
        }
      }
    }

    patchSidebarTrigger();
    patchSidebarZIndex();

    // Observe in case elements are mounted later
    const observer = new MutationObserver(() => {
      patchSidebarTrigger();
      patchSidebarZIndex();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('click', handleTocLinkClick);
      observer.disconnect();
    };
  }, [locale]);

  return null;
}
