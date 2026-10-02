'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import type { GoogleSignUpProfile } from '@/lib/http';

export interface GoogleSignUpStepProps {
  /** Google profile from sign-in (SIGNUP_REQUIRED), shown read-only. */
  profile: GoogleSignUpProfile;
  /** Back to the email and password form. */
  onUseDifferentMethod: () => void;
  isDisabled?: boolean;
}

/**
 * Header of the registration form's Google step: the heading, the Google
 * name and email (read-only), and a way back to the password form. The
 * business fields below it stay in the form itself.
 */
export const GoogleSignUpStep = React.forwardRef<HTMLHeadingElement, GoogleSignUpStepProps>(
  ({ profile, onUseDifferentMethod, isDisabled = false }, headingRef) => {
    const t = useTranslations('register');
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-semibold text-foreground focus:outline-none"
          >
            {t('google.finishTitle')}
          </h2>
          <p className="text-sm text-muted-foreground">{t('google.finishSubtitle')}</p>
        </div>

        {fullName && (
          <div className="space-y-2">
            <label htmlFor="googleName" className="block mono-label text-muted-foreground">
              {t('fields.name')}
            </label>
            <input
              id="googleName"
              type="text"
              value={fullName}
              readOnly
              className="paper-input text-muted-foreground"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="googleEmail" className="block mono-label text-muted-foreground">
            {t('fields.email')}
          </label>
          <input
            id="googleEmail"
            type="email"
            value={profile.email}
            readOnly
            className="paper-input text-muted-foreground"
          />
        </div>

        <button
          type="button"
          onClick={onUseDifferentMethod}
          disabled={isDisabled}
          className="text-sm font-medium text-primary hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {t('google.useDifferentMethod')}
        </button>
      </div>
    );
  }
);

GoogleSignUpStep.displayName = 'GoogleSignUpStep';
