'use client';

import { useCallback, useSyncExternalStore } from 'react';

interface ChatwootSdk {
  toggle: (state?: 'open' | 'close') => void;
}

type ChatwootWindow = Window & { $chatwoot?: ChatwootSdk };
const serverReadySnapshot = (): boolean => false;

export function getChatwoot(): ChatwootSdk | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as ChatwootWindow).$chatwoot;
}

const readySnapshot = (): boolean => Boolean(getChatwoot());

export function subscribeToChatwoot(onChange: () => void, intervalMs: number): () => void {
  let interval: number | undefined;
  const handleReady = (): void => {
    if (!getChatwoot()) return;
    if (interval !== undefined) window.clearInterval(interval);
    onChange();
  };
  window.addEventListener('chatwoot:ready', handleReady);
  if (!getChatwoot()) {
    interval = window.setInterval(() => {
      if (getChatwoot()) handleReady();
    }, intervalMs);
  }
  return () => {
    window.removeEventListener('chatwoot:ready', handleReady);
    if (interval !== undefined) window.clearInterval(interval);
  };
}

export function useChatwootReady(intervalMs: number = 500): boolean {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => subscribeToChatwoot(onChange, intervalMs),
    [intervalMs],
  );
  return useSyncExternalStore(subscribe, readySnapshot, serverReadySnapshot);
}
