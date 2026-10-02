'use client';

import {
  PhoneInput,
  isPhoneProvided,
  preparePhoneNumberForSubmit,
} from '@/components/ui/phone-input';
import {
  authService,
  GoogleSignInOutcome,
  GoogleSignUpProfile,
  HttpError,
  RegisterRequest,
  useLocaleConfig,
} from '@/lib/http';
import {
  cn,
  DisplayNameUtils,
  DisplayNameValidationError,
} from '@/lib/utils';
import {
  trackFormStart,
  trackFormSubmit,
  trackFormError,
  trackRegistrationStart,
  getRegistrationSource,
  SIGN_UP_METHODS,
  type SignUpMethod,
} from '@/lib/analytics';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PortalLink } from '@/components/ui/portal-link';
import { env } from '@/config/env';
import {
  saveThemePreference,
  saveLanguagePreference,
  getThemePreference,
  isAuthenticated,
  redirectToPortalWithState,
} from '@/lib/utils/cross-app-sync';
import { readGoogleIdTokenEmail } from '@/lib/utils/google-id-token';
import { GoogleSignInButton } from './google-sign-in-button';
import { GoogleSignUpStep } from './google-sign-up-step';
import { RegistrationAlert, type RegistrationAlertTone } from './registration-alert';
import {
  getRegistrationErrorFeedback,
  RegistrationErrorAction,
} from './registration-error-feedback';

// ============================================================================
// Constants (matching backend DTO)
// ============================================================================

const VALIDATION = {
  CONTACT_PHONE_MAX: 50,
  EMAIL_MAX: 255,
  PASSWORD_MIN: 8,
  // Backend RegisterDto caps passwords at 128 — a higher client limit lets
  // 129+ char passwords pass locally and fail server-side with a raw error
  PASSWORD_MAX: 128,
} as const;

const BUSINESS_NAME_ERROR_KEYS: Record<
  DisplayNameValidationError,
  | 'errors.businessNameRequired'
  | 'errors.businessNameTooShort'
  | 'errors.businessNameTooLong'
  | 'errors.businessNameMustContainLetter'
  | 'errors.businessNameInvalidChars'
> = {
  [DisplayNameValidationError.REQUIRED]: 'errors.businessNameRequired',
  [DisplayNameValidationError.TOO_SHORT]: 'errors.businessNameTooShort',
  [DisplayNameValidationError.TOO_LONG]: 'errors.businessNameTooLong',
  [DisplayNameValidationError.MUST_CONTAIN_LETTER]:
    'errors.businessNameMustContainLetter',
  [DisplayNameValidationError.INVALID_CHARS]: 'errors.businessNameInvalidChars',
};

const FORM_NAME = 'registration_form';
const FORM_LOCATION = 'register_page';

/**
 * Plan intent passed from the pricing page as ?plan=<slug>.
 * Read lazily (not via useSearchParams) so the page can stay static.
 */
function getSelectedPlan(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get('plan') || undefined;
}

/**
 * Thank-you path after a new sign-up. Carries the plan for GA sign_up
 * attribution and `method=google` for Google sign-ups.
 */
function buildThankYouPath(method: SignUpMethod): string {
  const params = new URLSearchParams();
  if (method === SIGN_UP_METHODS.GOOGLE) {
    params.set('method', method);
  }
  const selectedPlan = getSelectedPlan();
  if (selectedPlan) {
    params.set('plan', selectedPlan);
  }
  const query = params.toString();
  return query ? `/thank-you?${query}` : '/thank-you';
}

// ============================================================================
// Types
// ============================================================================

interface FormData {
  businessName: string;
  contactPhone: string;
  email: string;
  password: string;
}

interface FormErrors {
  businessName?: string;
  contactPhone?: string;
  email?: string;
  password?: string;
  general?: string;
  /** Adds a "Sign in" link to the general error (account already exists). */
  isSignInSuggested?: boolean;
}

type ValidationResult =
  | { ok: true; businessName: string; contactPhone: string }
  | { ok: false };

/** Google account waiting for its business details (SIGNUP_REQUIRED). */
interface GoogleSignUpState {
  /** Sent again to sign-up; never logged or tracked. */
  idToken: string;
  profile: GoogleSignUpProfile;
}

/** Message under the Google button. */
interface GoogleNotice {
  message: string;
  tone: RegistrationAlertTone;
  isSignInSuggested: boolean;
}

/** Which call runs after the "already signed in" confirmation. */
type SignedInPendingAction =
  | { kind: 'register' }
  | { kind: 'googleSignIn'; idToken: string }
  | { kind: 'googleSignUp' };

/** Which call failed, to decide where its message renders. */
type SubmitStage = 'register' | 'googleSignIn' | 'googleSignUp';

// ============================================================================
// Component
// ============================================================================

export function RegistrationForm() {
  const t = useTranslations('register');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const localeConfig = useLocaleConfig();

  const [formData, setFormData] = React.useState<FormData>({
    businessName: '',
    contactPhone: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  // Google sign-in is running (or opening the portal after it)
  const [isCheckingGoogle, setIsCheckingGoogle] = React.useState(false);
  const [hasTrackedFormStart, setHasTrackedFormStart] = React.useState(false);
  const [pendingAction, setPendingAction] =
    React.useState<SignedInPendingAction | null>(null);
  const [googleSignUp, setGoogleSignUp] =
    React.useState<GoogleSignUpState | null>(null);
  const [googleNotice, setGoogleNotice] = React.useState<GoogleNotice | null>(null);
  const [isGoogleUnavailable, setIsGoogleUnavailable] = React.useState(false);

  const signedInNoticeRef = React.useRef<HTMLDivElement>(null);
  const googleHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const shouldFocusPasswordRef = React.useRef(false);
  // The merchant already agreed to replace the signed-in session for Google
  const hasConfirmedSessionReplaceRef = React.useRef(false);

  const isConfirmingSignedIn = pendingAction !== null;
  const isGoogleMode = googleSignUp !== null;
  const isGoogleAvailable = env.google.isEnabled && !isGoogleUnavailable;
  const isBusy = isSubmitting || isRedirecting;

  // Move focus to the notice so keyboard and screen reader users meet it
  React.useEffect(() => {
    if (isConfirmingSignedIn) {
      signedInNoticeRef.current?.focus();
    }
  }, [isConfirmingSignedIn]);

  // Announce the Google step by moving focus to its heading
  React.useEffect(() => {
    if (googleSignUp) {
      googleHeadingRef.current?.focus();
    }
  }, [googleSignUp]);

  // After Google sends the merchant to the password form, focus the password
  React.useEffect(() => {
    if (shouldFocusPasswordRef.current && passwordInputRef.current) {
      shouldFocusPasswordRef.current = false;
      passwordInputRef.current.focus();
    }
  });

  // Track form start when user begins typing
  const handleFormInteraction = React.useCallback(() => {
    if (!hasTrackedFormStart) {
      trackFormStart(FORM_NAME, FORM_LOCATION);
      trackRegistrationStart(getRegistrationSource());
      setHasTrackedFormStart(true);
    }
  }, [hasTrackedFormStart]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error and general error on change
    if (errors[name as keyof FormData] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
        general: undefined,
        isSignInSuggested: undefined,
      }));
    }
    // Track form interaction
    handleFormInteraction();
  };

  // Handle phone change
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contactPhone: value }));
    // Clear field error and general error on change
    if (errors.contactPhone || errors.general) {
      setErrors((prev) => ({
        ...prev,
        contactPhone: undefined,
        general: undefined,
        isSignInSuggested: undefined,
      }));
    }
    // Track form interaction
    handleFormInteraction();
  };

  // Validate form - matching backend display-name + RegisterDto rules.
  // Google sign-up checks the business details only: email and password
  // come from Google, and no password is created.
  const validateForm = (includeCredentials: boolean): ValidationResult => {
    const newErrors: FormErrors = {};

    const businessNameResult = DisplayNameUtils.parse(formData.businessName);
    if (!businessNameResult.ok) {
      newErrors.businessName = t(BUSINESS_NAME_ERROR_KEYS[businessNameResult.error]);
    }

    // Phone validation (required, valid format, max 50) — trunk "0" stripped on submit
    let contactPhone = '';

    if (!isPhoneProvided(formData.contactPhone)) {
      newErrors.contactPhone = t('errors.phoneRequired');
    } else {
      const preparedPhone = preparePhoneNumberForSubmit(formData.contactPhone);
      contactPhone = preparedPhone.normalized;

      if (!preparedPhone.validation.isValid) {
        newErrors.contactPhone = t('errors.phoneInvalid');
      } else if (contactPhone.length > VALIDATION.CONTACT_PHONE_MAX) {
        newErrors.contactPhone = t('errors.phoneTooLong');
      }
    }

    if (includeCredentials) {
      // Email validation (required, valid format, max 255)
      if (!formData.email.trim()) {
        newErrors.email = t('errors.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('errors.emailInvalid');
      } else if (formData.email.length > VALIDATION.EMAIL_MAX) {
        newErrors.email = t('errors.emailTooLong');
      }

      // Password validation (required, min 8, max 128)
      if (!formData.password) {
        newErrors.password = t('errors.passwordRequired');
      } else if (formData.password.length < VALIDATION.PASSWORD_MIN) {
        newErrors.password = t('errors.passwordMinLength');
      } else if (formData.password.length > VALIDATION.PASSWORD_MAX) {
        newErrors.password = t('errors.passwordTooLong');
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || !businessNameResult.ok) {
      return { ok: false };
    }

    return { ok: true, businessName: businessNameResult.value, contactPhone };
  };

  // Back to the email and password form
  const leaveGoogleMode = (): void => {
    setGoogleSignUp(null);
    hasConfirmedSessionReplaceRef.current = false;
  };

  // New sign-up succeeded: the API already set the auth cookies
  const completeSignUp = (method: SignUpMethod): void => {
    // Form submit only here; canonical sign_up fires on thank-you (avoids double-count)
    trackFormSubmit(FORM_NAME, FORM_LOCATION);

    // Save preferences for cross-app sync
    const theme = getThemePreference() || 'light';
    saveThemePreference(theme);
    saveLanguagePreference(locale);

    // Thank-you page fires GA sign_up + Meta CompleteRegistration
    setIsRedirecting(true);
    router.push(buildThankYouPath(method));
  };

  // Show an API error where it belongs and apply its follow-up
  const showApiError = (
    error: HttpError,
    stage: SubmitStage,
    idToken: string | null
  ): void => {
    const feedback = getRegistrationErrorFeedback(error);
    const message = feedback.messageKey
      ? t(feedback.messageKey)
      : error.message || t('errors.registrationFailed');
    const isSignInSuggested = feedback.action === RegistrationErrorAction.SIGN_IN;

    trackFormError(
      FORM_NAME,
      feedback.trackingType,
      error.code ?? String(error.statusCode)
    );

    switch (feedback.action) {
      case RegistrationErrorAction.USE_PASSWORD: {
        // Google can't vouch for this address: sign up with a password instead
        const googleEmail =
          googleSignUp?.profile.email ??
          (idToken ? readGoogleIdTokenEmail(idToken) : null);
        leaveGoogleMode();
        if (googleEmail) {
          setFormData((prev) => ({ ...prev, email: googleEmail }));
        }
        setErrors({});
        setGoogleNotice({ message, tone: 'info', isSignInSuggested: false });
        shouldFocusPasswordRef.current = true;
        return;
      }
      case RegistrationErrorAction.RESTART_GOOGLE:
        leaveGoogleMode();
        setErrors({});
        setGoogleNotice({ message, tone: 'error', isSignInSuggested: false });
        return;
      case RegistrationErrorAction.HIDE_GOOGLE:
        leaveGoogleMode();
        setIsGoogleUnavailable(true);
        setGoogleNotice(null);
        setErrors({ general: message });
        return;
      default:
        break;
    }

    // Google sign-in failures render under the Google button
    if (stage === 'googleSignIn') {
      setGoogleNotice({ message, tone: 'error', isSignInSuggested });
      return;
    }

    if (feedback.field === 'businessName') {
      setErrors({ businessName: message });
    } else if (feedback.field === 'contactPhone') {
      setErrors({ contactPhone: message });
    } else {
      setErrors({ general: message, isSignInSuggested });
    }
  };

  const showUnexpectedError = (stage: SubmitStage): void => {
    const message = t('errors.registrationFailed');
    trackFormError(FORM_NAME, 'unknown_error');
    if (stage === 'googleSignIn') {
      setGoogleNotice({ message, tone: 'error', isSignInSuggested: false });
    } else {
      setErrors({ general: message });
    }
  };

  // Register with already-validated values
  const submitRegistration = async (
    businessName: string,
    contactPhone: string
  ): Promise<void> => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const registerData: RegisterRequest = {
        // Persist the normalized value (same pipeline as the API)
        businessName,
        contactPhone,
        email: formData.email.trim(),
        password: formData.password,
      };

      await authService.register(registerData, localeConfig);
      completeSignUp(SIGN_UP_METHODS.EMAIL);
    } catch (error) {
      if (error instanceof HttpError) {
        showApiError(error, 'register', null);
      } else {
        console.error(error);
        showUnexpectedError('register');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exchange the Google credential: open the portal, or ask for business details
  const submitGoogleSignIn = async (idToken: string): Promise<void> => {
    setIsSubmitting(true);
    setIsCheckingGoogle(true);
    setErrors({});
    let isLeavingPage = false;

    try {
      const result = await authService.googleSignIn(idToken, localeConfig);

      if (result.outcome === GoogleSignInOutcome.SIGNED_IN) {
        // The account already existed, so this is a sign-in, not a sign-up:
        // no thank-you page and no sign_up conversion
        isLeavingPage = true;
        setIsRedirecting(true);
        redirectToPortalWithState(env.portal.url, '/', {
          theme: getThemePreference() || 'light',
          language: locale,
        });
        return;
      }

      if (result.outcome === GoogleSignInOutcome.SIGNUP_REQUIRED && result.profile) {
        setGoogleSignUp({ idToken, profile: result.profile });
        return;
      }

      showUnexpectedError('googleSignIn');
    } catch (error) {
      // No logging here: nothing from this call may echo the credential
      if (error instanceof HttpError) {
        showApiError(error, 'googleSignIn', idToken);
      } else {
        showUnexpectedError('googleSignIn');
      }
    } finally {
      setIsSubmitting(false);
      if (!isLeavingPage) {
        setIsCheckingGoogle(false);
      }
    }
  };

  // Create the business with the Google account (same token as sign-in)
  const submitGoogleSignUp = async (
    businessName: string,
    contactPhone: string
  ): Promise<void> => {
    if (!googleSignUp) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await authService.googleSignUp(
        { idToken: googleSignUp.idToken, businessName, contactPhone },
        localeConfig
      );
      completeSignUp(SIGN_UP_METHODS.GOOGLE);
    } catch (error) {
      if (error instanceof HttpError) {
        showApiError(error, 'googleSignUp', googleSignUp.idToken);
      } else {
        showUnexpectedError('googleSignUp');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google returned a credential from the account chooser
  const handleGoogleCredential = (idToken: string): void => {
    if (isBusy) return;

    handleFormInteraction();
    setGoogleNotice(null);
    setErrors({});

    // Signing in replaces the session this browser holds: ask first
    if (isAuthenticated()) {
      setPendingAction({ kind: 'googleSignIn', idToken });
      return;
    }

    void submitGoogleSignIn(idToken);
  };

  const handleGoogleUnavailable = (): void => {
    setIsGoogleUnavailable(true);
  };

  const handleUseDifferentMethod = (): void => {
    leaveGoogleMode();
    setPendingAction(null);
    setGoogleNotice(null);
    setErrors({});
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isBusy) return;

    const validation = validateForm(!isGoogleMode);
    if (!validation.ok) return;

    if (isGoogleMode) {
      if (isAuthenticated() && !hasConfirmedSessionReplaceRef.current) {
        setPendingAction({ kind: 'googleSignUp' });
        return;
      }
      await submitGoogleSignUp(validation.businessName, validation.contactPhone);
      return;
    }

    // Registering signs this browser in as the new owner, and the API revokes
    // the session it replaces. Ask first when the portal marked this browser
    // as signed in (cv_auth_status); the account itself is not readable here.
    if (isAuthenticated()) {
      setPendingAction({ kind: 'register' });
      return;
    }

    await submitRegistration(validation.businessName, validation.contactPhone);
  };

  // The merchant chose to replace the signed-in session
  const handleConfirmSignedIn = async (): Promise<void> => {
    const action = pendingAction;
    setPendingAction(null);
    if (!action || isBusy) return;

    if (action.kind === 'googleSignIn') {
      hasConfirmedSessionReplaceRef.current = true;
      await submitGoogleSignIn(action.idToken);
      return;
    }

    // Fields may have changed while the notice was open
    const validation = validateForm(action.kind === 'register');
    if (!validation.ok) return;

    if (action.kind === 'googleSignUp') {
      hasConfirmedSessionReplaceRef.current = true;
      await submitGoogleSignUp(validation.businessName, validation.contactPhone);
      return;
    }

    await submitRegistration(validation.businessName, validation.contactPhone);
  };

  const isGoogleSignInPending = pendingAction?.kind === 'googleSignIn';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {googleSignUp ? (
        /* Google step: business details for the chosen Google account */
        <GoogleSignUpStep
          ref={googleHeadingRef}
          profile={googleSignUp.profile}
          onUseDifferentMethod={handleUseDifferentMethod}
          isDisabled={isBusy}
        />
      ) : (
        isGoogleAvailable && (
          /* Google first, then the email and password form */
          <div className="space-y-4">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              onUnavailable={handleGoogleUnavailable}
              isDisabled={isBusy || isConfirmingSignedIn}
            />

            {googleNotice && (
              <RegistrationAlert
                message={googleNotice.message}
                tone={googleNotice.tone}
                signInLabel={googleNotice.isSignInSuggested ? t('signIn') : undefined}
                trackLocation="register_google_notice"
              />
            )}

            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              <span className="mono-label text-muted-foreground">{t('google.or')}</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>
        )
      )}

      {/* Business Name */}
      <div className="space-y-2">
        <label htmlFor="businessName" className="block mono-label text-muted-foreground">
          {t('fields.businessName')} <span className="text-destructive">*</span>
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={handleChange}
          autoComplete="organization"
          className={cn('paper-input', errors.businessName && 'paper-input-error')}
          placeholder={t('placeholders.businessName')}
        />
        {errors.businessName && (
          <p className="font-receipt text-xs text-destructive">{errors.businessName}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="contactPhone" className="block mono-label text-muted-foreground">
          {t('fields.phone')} <span className="text-destructive">*</span>
        </label>
        <PhoneInput
          id="contactPhone"
          value={formData.contactPhone}
          onChange={handlePhoneChange}
          defaultCountry="EG"
          error={!!errors.contactPhone}
          placeholder={t('placeholders.phone')}
        />
        {errors.contactPhone && (
          <p className="font-receipt text-xs text-destructive">{errors.contactPhone}</p>
        )}
      </div>

      {!isGoogleMode && (
        <>
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block mono-label text-muted-foreground">
              {t('fields.email')} <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className={cn('paper-input', errors.email && 'paper-input-error')}
              placeholder={t('placeholders.email')}
            />
            {errors.email && (
              <p className="font-receipt text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block mono-label text-muted-foreground">
              {t('fields.password')} <span className="text-destructive">*</span>
            </label>
            <input
              ref={passwordInputRef}
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={cn('paper-input', errors.password && 'paper-input-error')}
              placeholder={t('placeholders.password')}
            />
            {errors.password && (
              <p className="font-receipt text-xs text-destructive">{errors.password}</p>
            )}
          </div>
        </>
      )}

      {/* General Error - Displayed right before submit button */}
      {errors.general && (
        <RegistrationAlert
          message={errors.general}
          tone="error"
          signInLabel={errors.isSignInSuggested ? t('signIn') : undefined}
          trackLocation="register_error"
        />
      )}

      {/* Signed-in notice replaces the submit button until the merchant decides */}
      {isConfirmingSignedIn ? (
        <div
          ref={signedInNoticeRef}
          tabIndex={-1}
          role="alertdialog"
          aria-labelledby="signed-in-notice-title"
          aria-describedby="signed-in-notice-message"
          className="p-4 border border-dashed border-primary/50 space-y-4 focus:outline-none"
        >
          <div className="space-y-1">
            <p id="signed-in-notice-title" className="font-semibold text-foreground">
              {t('signedIn.title')}
            </p>
            <p id="signed-in-notice-message" className="text-sm text-muted-foreground">
              {isGoogleSignInPending ? t('signedIn.googleMessage') : t('signedIn.message')}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="sm:flex-1"
              onClick={() => void handleConfirmSignedIn()}
            >
              {isGoogleSignInPending ? t('signedIn.googleConfirm') : t('signedIn.confirm')}
            </Button>
            <PortalLink
              type="button"
              variant="outline"
              size="md"
              path="/"
              className="sm:flex-1"
              trackLocation="register_signed_in"
            >
              {tCommon('goToDashboard')}
            </PortalLink>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPendingAction(null)}
            >
              {t('signedIn.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        /* Submit Button */
        <button
          type="submit"
          disabled={isBusy}
          aria-busy={isBusy}
          className={cn(
            'w-full h-12 px-6 rounded-lg font-semibold text-primary-foreground',
            'bg-primary hover:bg-primary/90 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary'
          )}
        >
          {isBusy ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {isCheckingGoogle ? t('google.checking') : t('submitting')}
            </span>
          ) : (
            t('submit')
          )}
        </button>
      )}

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        {t('terms.prefix')}{' '}
        <Link href="/terms" className="text-primary hover:underline">
          {t('terms.termsOfService')}
        </Link>{' '}
        {t('terms.and')}{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          {t('terms.privacyPolicy')}
        </Link>
      </p>
    </form>
  );
}
