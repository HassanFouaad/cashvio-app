'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { contactService, ContactRequest, HttpError, InquiryType, useLocaleConfig } from '@/lib/http';
import {
  trackFormSubmit,
  trackFormError,
  trackGenerateLead,
} from '@/lib/analytics';
import { cn } from '@/lib/utils';

const EMAIL_MAX = 255;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Footer newsletter capture.
 *
 * Zero-backend v1: subscriptions are recorded through the existing contact
 * inquiry pipeline (GENERAL type with a recognizable subject), so the team
 * can collect a list today and migrate to a real ESP later.
 */
export function NewsletterForm() {
  const t = useTranslations('footer.newsletter');
  const locale = useLocale();
  const localeConfig = useLocaleConfig();

  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    const trimmed = email.trim();
    if (!trimmed || !EMAIL_PATTERN.test(trimmed) || trimmed.length > EMAIL_MAX) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const request: ContactRequest = {
        name: trimmed,
        email: trimmed,
        subject: 'Newsletter subscription',
        message: `Please add ${trimmed} to the newsletter list. (Submitted from the site footer.)`,
        type: InquiryType.GENERAL,
        locale,
      };

      await contactService.submit(request, localeConfig);
      trackFormSubmit('newsletter_form', 'footer');
      trackGenerateLead('newsletter', 'footer');
      setStatus('success');
      setEmail('');
    } catch (error) {
      trackFormError(
        'newsletter_form',
        'api_error',
        error instanceof HttpError ? error.message : undefined
      );
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="font-receipt text-xs text-primary" role="status">
        {t('success')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" aria-label={t('title')}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder={t('placeholder')}
          aria-label={t('placeholder')}
          autoComplete="email"
          className={cn(
            'flex-1 min-w-0 h-10 px-3 rounded-lg bg-background border text-sm text-foreground',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30',
            status === 'error' ? 'border-destructive/60' : 'border-border'
          )}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium',
            'hover:bg-primary-dark transition-colors duration-200 shrink-0',
            'focus:outline-none focus:ring-2 focus:ring-primary/30',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </div>
      {status === 'error' && (
        <p className="font-receipt text-xs text-destructive" role="alert">
          {t('error')}
        </p>
      )}
    </form>
  );
}
