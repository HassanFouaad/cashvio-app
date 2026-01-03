'use client';

import { PhoneInput } from '@/components/ui/phone-input';
import { env } from '@/config/env';
import { authService, HttpError, RegisterRequest } from '@/lib/http';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import * as React from 'react';

// ============================================================================
// Types
// ============================================================================

interface FormData {
  businessName: string;
  contactPhone: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

interface FormErrors {
  businessName?: string;
  contactPhone?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
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
    username: '',
    email: '',
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error and general error on change
    if (errors[name as keyof FormErrors] || errors.general) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  // Handle phone change
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contactPhone: value }));
    // Clear field error and general error on change
    if (errors.contactPhone || errors.general) {
      setErrors((prev) => ({ ...prev, contactPhone: undefined, general: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = t('errors.businessNameRequired');
    }

    if (!formData.contactPhone || formData.contactPhone.length < 8) {
      newErrors.contactPhone = t('errors.phoneRequired');
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('errors.firstNameRequired');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('errors.lastNameRequired');
    }

    if (!formData.username.trim()) {
      newErrors.username = t('errors.usernameRequired');
    } else if (formData.username.length < 3) {
      newErrors.username = t('errors.usernameMinLength');
    }

    // Email is required since credentials will be sent via email
    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
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
        username: formData.username.trim(),
        email: formData.email.trim(),
      };

      const response = await authService.register(registerData);

      // Success! Redirect to portal
      setIsSuccess(true);

      // Store tokens and redirect
      if (typeof window !== 'undefined') {
        // Could store in localStorage or cookie here if needed
        // For now, redirect to portal with token
        window.location.href = `${env.portal.dashboardUrl}?token=${response.accessToken}`;
      }
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.statusCode === 409) {
          setErrors({ general: t('errors.userExists') });
        } else {
          setErrors({ general: error.message || t('errors.registrationFailed') });
        }
      } else {
        setErrors({ general: t('errors.registrationFailed') });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg
            className="w-8 h-8 text-green-600"
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
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t('success.title')}
        </h3>
        <p className="text-muted-foreground">{t('success.message')}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('success.emailSent')}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('success.redirecting')}
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

        {/* Username */}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-foreground"
          >
            {t('fields.username')} <span className="text-destructive">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            className={cn(
              'w-full h-11 px-4 rounded-lg border bg-background text-foreground',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0',
              errors.username
                ? 'border-destructive focus:ring-destructive/30'
                : 'border-input focus:ring-ring/30'
            )}
            placeholder={t('placeholders.username')}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username}</p>
          )}
        </div>

        {/* Email (Required for credentials) */}
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
          <p className="text-xs text-muted-foreground">
            {t('emailNote')}
          </p>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

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
          'w-full h-12 px-6 rounded-lg font-semibold text-white',
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

