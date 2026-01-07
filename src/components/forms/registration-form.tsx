'use client';

import { PhoneInput, validatePhoneNumber } from '@/components/ui/phone-input';
import { authService, HttpError, RegisterRequest } from '@/lib/http';
import { cn } from '@/lib/utils';
import {
  trackFormStart,
  trackFormSubmit,
  trackFormError,
  trackRegistrationStart,
  trackRegistrationComplete,
} from '@/lib/analytics';
import { useLocale, useTranslations } from 'next-intl';
import * as React from 'react';

// ============================================================================
// Constants (matching backend DTO)
// ============================================================================

const VALIDATION = {
  BUSINESS_NAME_MAX: 255,
  CONTACT_PHONE_MAX: 50,
  FIRST_NAME_MAX: 255,
  LAST_NAME_MAX: 255,
  EMAIL_MAX: 255,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 255,
} as const;

// ============================================================================
// Types
// ============================================================================

interface FormData {
  businessName: string;
  contactPhone: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  businessName?: string;
  contactPhone?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// ============================================================================
// Component
// ============================================================================

export function RegistrationForm() {
  const t = useTranslations('register');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [formData, setFormData] = React.useState<FormData>({
    businessName: '',
    contactPhone: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [hasTrackedFormStart, setHasTrackedFormStart] = React.useState(false);

  // Track form start when user begins typing
  const handleFormInteraction = React.useCallback(() => {
    if (!hasTrackedFormStart) {
      trackFormStart('registration_form', 'register_page');
      trackRegistrationStart('direct');
      setHasTrackedFormStart(true);
    }
  }, [hasTrackedFormStart]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error and general error on change
    if (errors[name as keyof FormErrors] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
    // Track form interaction
    handleFormInteraction();
  };

  // Handle phone change
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contactPhone: value }));
    // Clear field error and general error on change
    if (errors.contactPhone || errors.general) {
      setErrors((prev) => ({ ...prev, contactPhone: undefined, general: undefined }));
    }
    // Track form interaction
    handleFormInteraction();
  };

  // Validate form - matching backend DTO validations
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Business name validation (required, max 255)
    if (!formData.businessName.trim()) {
      newErrors.businessName = t('errors.businessNameRequired');
    } else if (formData.businessName.length > VALIDATION.BUSINESS_NAME_MAX) {
      newErrors.businessName = t('errors.businessNameTooLong');
    }

    // Phone validation (required, valid format, max 50)
    if (!formData.contactPhone) {
      newErrors.contactPhone = t('errors.phoneRequired');
    } else {
      const phoneValidation = validatePhoneNumber(formData.contactPhone);
      if (!phoneValidation.isValid) {
        newErrors.contactPhone = t('errors.phoneInvalid');
      } else if (formData.contactPhone.length > VALIDATION.CONTACT_PHONE_MAX) {
        newErrors.contactPhone = t('errors.phoneTooLong');
      }
    }

    // First name validation (required, max 255)
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.firstNameRequired');
    } else if (formData.firstName.length > VALIDATION.FIRST_NAME_MAX) {
      newErrors.firstName = t('errors.firstNameTooLong');
    }

    // Last name validation (required, max 255)
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.lastNameRequired');
    } else if (formData.lastName.length > VALIDATION.LAST_NAME_MAX) {
      newErrors.lastName = t('errors.lastNameTooLong');
    }

    // Email validation (required, valid format, max 255)
    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    } else if (formData.email.length > VALIDATION.EMAIL_MAX) {
      newErrors.email = t('errors.emailTooLong');
    }

    // Password validation (required, min 8, max 255)
    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < VALIDATION.PASSWORD_MIN) {
      newErrors.password = t('errors.passwordMinLength');
    } else if (formData.password.length > VALIDATION.PASSWORD_MAX) {
      newErrors.password = t('errors.passwordTooLong');
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const registerData: RegisterRequest = {
        businessName: formData.businessName.trim(),
        contactPhone: formData.contactPhone,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      await authService.register(registerData);

      // Success! Show success message
      setIsSuccess(true);
      // Track successful registration
      trackFormSubmit('registration_form', 'register_page');
      trackRegistrationComplete();
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.statusCode === 409) {
          setErrors({ general: t('errors.userExists') });
          trackFormError('registration_form', 'user_exists', 'User already exists');
        } else {
          setErrors({ general: error.message || t('errors.registrationFailed') });
          trackFormError('registration_form', 'api_error', error.message);
        }
      } else {
        setErrors({ general: t('errors.registrationFailed') });
        trackFormError('registration_form', 'unknown_error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/30 mb-6">
          <svg
            className="w-10 h-10 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-3">
          {t('success.title')}
        </h3>
        <p className="text-muted-foreground mb-2">{t('success.message')}</p>
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 mt-4">
          <svg
            className="w-5 h-5 inline-block mx-1 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          {t('success.emailSent')}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Business Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t('sections.business')}
        </h3>

        {/* Business Name */}
        <div className="space-y-2">
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-foreground"
          >
            {t('fields.businessName')} <span className="text-destructive">*</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            className={cn(
              'w-full h-11 px-4 rounded-lg border bg-background text-foreground',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
              errors.businessName
                ? 'border-destructive focus:ring-destructive/30'
                : 'border-input focus:ring-ring/30'
            )}
            placeholder={t('placeholders.businessName')}
          />
          {errors.businessName && (
            <p className="text-sm text-destructive">{errors.businessName}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label
            htmlFor="contactPhone"
            className="block text-sm font-medium text-foreground"
          >
            {t('fields.phone')} <span className="text-destructive">*</span>
          </label>
          <PhoneInput
            id="contactPhone"
            value={formData.contactPhone}
            onChange={handlePhoneChange}
            defaultCountry="EG"
            error={!!errors.contactPhone}
            placeholder={t('placeholders.phone')}
            dir="ltr"
          />
          {errors.contactPhone && (
            <p className="text-sm text-destructive">{errors.contactPhone}</p>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t('sections.personal')}
        </h3>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-foreground"
            >
              {t('fields.firstName')} <span className="text-destructive">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className={cn(
                'w-full h-11 px-4 rounded-lg border bg-background text-foreground',
                'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                errors.firstName
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-input focus:ring-ring/30'
              )}
              placeholder={t('placeholders.firstName')}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-foreground"
            >
              {t('fields.lastName')} <span className="text-destructive">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className={cn(
                'w-full h-11 px-4 rounded-lg border bg-background text-foreground',
                'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
                errors.lastName
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-input focus:ring-ring/30'
              )}
              placeholder={t('placeholders.lastName')}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            {t('fields.email')} <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            className={cn(
              'w-full h-11 px-4 rounded-lg border bg-background text-foreground',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
              errors.email
                ? 'border-destructive focus:ring-destructive/30'
                : 'border-input focus:ring-ring/30'
            )}
            placeholder={t('placeholders.email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            {t('fields.password')} <span className="text-destructive">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            className={cn(
              'w-full h-11 px-4 rounded-lg border bg-background text-foreground',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
              errors.password
                ? 'border-destructive focus:ring-destructive/30'
                : 'border-input focus:ring-ring/30'
            )}
            placeholder={t('placeholders.password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>
      </div>

      {/* Account Security */}
      

        {/* Password */}

      

      {/* General Error - Displayed right before submit button */}
      {errors.general && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errors.general}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={cn(
          'w-full h-12 px-6 rounded-lg font-semibold text-primary-foreground',
          'bg-primary hover:bg-primary/90 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary'
        )}
      >
        {isSubmitting ? (
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
            {t('submitting')}
          </span>
        ) : (
          t('submit')
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        {t('terms.prefix')}{' '}
        <a href="/terms" className="text-primary hover:underline">
          {t('terms.termsOfService')}
        </a>{' '}
        {t('terms.and')}{' '}
        <a href="/privacy" className="text-primary hover:underline">
          {t('terms.privacyPolicy')}
        </a>
      </p>
    </form>
  );
}
