'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { getChatwoot, useChatwootReady } from '@/lib/utils/chatwoot';

interface ChatButtonProps {
  className?: string;
}

/**
 * Mobile navbar trigger for the Chatwoot support widget.
 *
 * On mobile we hide the default floating Chatwoot bubble (via CSS in
 * globals.css) and instead surface this icon in the navbar. Clicking it opens
 * the Chatwoot chat window. On desktop the floating bubble is kept, so this
 * button is only rendered on small screens by its parent.
 */
export function ChatButton({ className }: ChatButtonProps) {
  const t = useTranslations('navigation');
  const isReady = useChatwootReady();

  const openChat = () => {
    const chatwoot = getChatwoot();
    chatwoot?.toggle('open');
  };

  return (
    <button
      type="button"
      onClick={openChat}
      disabled={!isReady}
      className={cn(
        'p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 disabled:opacity-50',
        className
      )}
      aria-label={t('openChat')}
      title={t('support')}
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      </svg>
    </button>
  );
}
