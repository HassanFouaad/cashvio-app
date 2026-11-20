'use client';

import { useSyncExternalStore } from 'react';

const noSubscription = (): (() => void) => () => undefined;
const serverSnapshot = (): null => null;
const hydratedSnapshot = (): boolean => true;
const themeSnapshot = (): boolean => document.documentElement.classList.contains('dark');

/** A browser-only read with an explicit SSR/hydration placeholder. */
export function useClientSnapshot<T>(getSnapshot: () => T): T | null {
  return useSyncExternalStore<T | null>(noSubscription, getSnapshot, serverSnapshot);
}

export function useHasHydrated(): boolean {
  return useClientSnapshot(hydratedSnapshot) === true;
}

export function subscribeToTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function useThemeSnapshot(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribeToTheme, themeSnapshot, serverSnapshot);
}
