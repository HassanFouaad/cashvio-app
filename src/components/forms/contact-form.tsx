"use client";

import {
  PhoneInput,
  isPhoneProvided,
  preparePhoneNumberForSubmit,
} from "@/components/ui/phone-input";
import {
  buildContactSource,
  ContactFormId,
  CONTACT_DEFAULT_RETRY_DELAY_MS,
  contactService,
  createContactIntent,
  hasSameContactDetails,
  HttpError,
  InquiryType,
  isContactReference,
  type ContactRequest,
  type ContactRequestIntent,
  useLocaleConfig,
} from "@/lib/http";
import { getAttribution } from "@/lib/analytics/attribution";
import { cn } from "@/lib/utils";
import {
  trackFormStart,
  trackFormSubmit,
  trackFormError,
  trackContactFormSubmit,
} from "@/lib/analytics";
import { useLocale, useTranslations } from "next-intl";
import * as React from "react";

// ============================================================================
// Constants (matching backend DTO)
// ============================================================================

const VALIDATION = {
  NAME_MAX: 255,
  EMAIL_MAX: 255,
  PHONE_MAX: 50,
  SUBJECT_MAX: 255,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
} as const;

// ============================================================================
// Types
// ============================================================================

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: InquiryType;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  general?: string;
}

// ============================================================================
// Component
// ============================================================================

export function ContactForm() {
  const t = useTranslations("contactForm");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const localeConfig = useLocaleConfig();

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: InquiryType.GENERAL,
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [inquiryReference, setInquiryReference] = React.useState<string | null>(
    null,
  );
  const [canRetrySaved, setCanRetrySaved] = React.useState(false);
  const [retryDelayMs, setRetryDelayMs] = React.useState(0);
  const pendingIntentRef = React.useRef<ContactRequestIntent | null>(null);
  const isSendingRef = React.useRef(false);
  const isRetryDelayedRef = React.useRef(false);
  const [hasTrackedFormStart, setHasTrackedFormStart] = React.useState(false);

  React.useEffect(() => {
    if (retryDelayMs <= 0) return;
    const timer = window.setTimeout(() => {
      isRetryDelayedRef.current = false;
      setRetryDelayMs(0);
    }, retryDelayMs);
    return () => window.clearTimeout(timer);
  }, [retryDelayMs]);

  // Track form start when user begins typing
  const handleFormInteraction = React.useCallback(() => {
    if (!hasTrackedFormStart) {
      trackFormStart("contact_form", "contact_page");
      setHasTrackedFormStart(true);
    }
  }, [hasTrackedFormStart]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Track form interaction
    handleFormInteraction();
  };

  // Handle phone change
  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    // Clear phone error on change
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
    // Track form interaction
    handleFormInteraction();
  };

  // Validate form - matching backend DTO validations
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation (required, max 255)
    if (!formData.name.trim()) {
      newErrors.name = t("errors.nameRequired");
    } else if (formData.name.length > VALIDATION.NAME_MAX) {
      newErrors.name = t("errors.nameTooLong");
    }

    // Email validation (required, valid format, max 255)
    if (!formData.email.trim()) {
      newErrors.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.emailInvalid");
    } else if (formData.email.length > VALIDATION.EMAIL_MAX) {
      newErrors.email = t("errors.emailTooLong");
    }

    // Phone validation (optional but if provided, must be valid, max 50) — trunk "0" stripped on submit
    if (isPhoneProvided(formData.phone)) {
      const { normalized: phone, validation: phoneValidation } =
        preparePhoneNumberForSubmit(formData.phone);

      if (!phoneValidation.isValid) {
        newErrors.phone = t("errors.phoneInvalid");
      } else if (phone.length > VALIDATION.PHONE_MAX) {
        newErrors.phone = t("errors.phoneTooLong");
      }
    }

    // Subject validation (required, max 255)
    if (!formData.subject.trim()) {
      newErrors.subject = t("errors.subjectRequired");
    } else if (formData.subject.length > VALIDATION.SUBJECT_MAX) {
      newErrors.subject = t("errors.subjectTooLong");
    }

    // Message validation (required, min 10, max 5000)
    if (!formData.message.trim()) {
      newErrors.message = t("errors.messageRequired");
    } else if (formData.message.trim().length < VALIDATION.MESSAGE_MIN) {
      newErrors.message = t("errors.messageMinLength");
    } else if (formData.message.length > VALIDATION.MESSAGE_MAX) {
      newErrors.message = t("errors.messageTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitIntent = async (intent: ContactRequestIntent): Promise<void> => {
    if (isSendingRef.current || isRetryDelayedRef.current) return;
    isSendingRef.current = true;
    setIsSubmitting(true);
    setErrors({});

    try {
      const received = await contactService.submit(
        intent.request,
        localeConfig,
        intent.key,
      );
      if (!received || !isContactReference(received.id)) {
        setErrors({ general: t("errors.referenceUnavailable") });
        trackFormError("contact_form", "missing_reference");
        return;
      }
      setInquiryReference(received.id);
      setCanRetrySaved(false);
      setIsSuccess(true);
      trackFormSubmit("contact_form", "contact_page");
      trackContactFormSubmit(
        intent.request.type ?? InquiryType.GENERAL,
        "contact_page",
      );
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.statusCode === 400 || error.statusCode === 422) {
          setErrors({ general: t("errors.invalidRequest") });
        } else if (error.statusCode === 429) {
          const delay = error.retryAfterMs ?? CONTACT_DEFAULT_RETRY_DELAY_MS;
          isRetryDelayedRef.current = delay > 0;
          setRetryDelayMs(delay);
          setErrors({ general: t("errors.rateLimited") });
        } else {
          setErrors({
            general: error.code ? error.message : t("errors.submitFailed"),
          });
        }
        trackFormError("contact_form", "api_error");
      } else {
        setErrors({ general: t("errors.submitFailed") });
        trackFormError("contact_form", "unknown_error");
      }
    } finally {
      isSendingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Capture source once; retries never rebuild attribution or change payload/key.
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (isSendingRef.current || isRetryDelayedRef.current || !validateForm())
      return;
    const { normalized: phone } = preparePhoneNumberForSubmit(formData.phone);
    const contactData: ContactRequest = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: phone || undefined,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      type: formData.type,
      locale,
    };
    const saved = pendingIntentRef.current;
    if (saved && !hasSameContactDetails(saved.request, contactData)) {
      setErrors({ general: t("errors.originalChanged") });
      return;
    }
    const intent =
      saved ??
      createContactIntent({
        ...contactData,
        source: buildContactSource(
          formData.type === InquiryType.DEMO
            ? ContactFormId.DEMO
            : ContactFormId.CONTACT,
          getAttribution(),
          window.location.pathname,
        ),
      });
    if (!intent) {
      setErrors({ general: t("errors.secureKeyUnavailable") });
      return;
    }
    pendingIntentRef.current = intent;
    setCanRetrySaved(true);
    await submitIntent(intent);
  };

  const retryOriginal = async (): Promise<void> => {
    const intent = pendingIntentRef.current;
    if (!intent || isSendingRef.current || isRetryDelayedRef.current) return;
    setFormData({
      name: intent.request.name,
      email: intent.request.email,
      phone: intent.request.phone ?? "",
      subject: intent.request.subject,
      message: intent.request.message,
      type: intent.request.type ?? InquiryType.GENERAL,
    });
    await submitIntent(intent);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      type: InquiryType.GENERAL,
    });
    setIsSuccess(false);
    setInquiryReference(null);
    pendingIntentRef.current = null;
    setCanRetrySaved(false);
    isRetryDelayedRef.current = false;
    setRetryDelayMs(0);
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6" dir={isRtl ? "rtl" : "ltr"}>
        <span className="stamp text-primary">{t("success.title")}</span>
        <p className="text-muted-foreground mb-6 mt-8 max-w-sm mx-auto">
          {t("success.message")}
        </p>
        {inquiryReference && (
          <p className="font-receipt text-sm break-all mb-6" role="status">
            {t("success.reference", { reference: inquiryReference })}
          </p>
        )}
        <button
          onClick={handleReset}
          className={cn(
            "inline-flex items-center gap-2 h-11 px-6 rounded-lg",
            "brand-action touch-control font-medium",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t("success.sendAnother")}
        </button>
        <div
          className="barcode w-28 mx-auto mt-8 text-foreground/50"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {t("title")}
        </h2>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="p-4 border border-dashed border-destructive/50 text-destructive text-sm flex items-start gap-3">
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
          <div className="space-y-2">
            <p>{errors.general}</p>
            {canRetrySaved && (
              <button
                type="button"
                disabled={isSubmitting || retryDelayMs > 0}
                onClick={() => {
                  void retryOriginal();
                }}
                className="underline underline-offset-4 disabled:opacity-50"
              >
                {t("retryOriginal")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Inquiry Type */}
      <div className="space-y-2">
        <label
          htmlFor="type"
          className="block mono-label text-muted-foreground"
        >
          {t("fields.type")}
        </label>
        <div className="relative">
          <select
            id="type"
            name="type"
            disabled={isSubmitting}
            value={formData.type}
            onChange={handleChange}
            className="paper-input appearance-none cursor-pointer pe-8"
          >
            {Object.values(InquiryType).map((type) => (
              <option key={type} value={type}>
                {t(`types.${type}`)}
              </option>
            ))}
          </select>
          <svg
            className="absolute end-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Name & Email — each writes on its own full line */}
      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block mono-label text-muted-foreground"
          >
            {t("fields.name")} <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            disabled={isSubmitting}
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={cn("paper-input", errors.name && "paper-input-error")}
            placeholder={t("placeholders.name")}
          />
          {errors.name && (
            <p className="font-receipt text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block mono-label text-muted-foreground"
          >
            {t("fields.email")} <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            disabled={isSubmitting}
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={cn("paper-input", errors.email && "paper-input-error")}
            placeholder={t("placeholders.email")}
          />
          {errors.email && (
            <p className="font-receipt text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Phone (Optional) */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block mono-label text-muted-foreground"
        >
          {t("fields.phone")}
        </label>
        <PhoneInput
          id="phone"
          disabled={isSubmitting}
          value={formData.phone}
          onChange={handlePhoneChange}
          defaultCountry="EG"
          error={!!errors.phone}
          placeholder={t("placeholders.phone")}
        />
        {errors.phone && (
          <p className="font-receipt text-xs text-destructive">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="block mono-label text-muted-foreground"
        >
          {t("fields.subject")} <span className="text-destructive">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          disabled={isSubmitting}
          type="text"
          value={formData.subject}
          onChange={handleChange}
          className={cn("paper-input", errors.subject && "paper-input-error")}
          placeholder={t("placeholders.subject")}
        />
        {errors.subject && (
          <p className="font-receipt text-xs text-destructive">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block mono-label text-muted-foreground"
        >
          {t("fields.message")} <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          disabled={isSubmitting}
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={cn("paper-input", errors.message && "paper-input-error")}
          placeholder={t("placeholders.message")}
        />
        {errors.message && (
          <p className="font-receipt text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || retryDelayMs > 0}
        className={cn(
          "w-full h-12 px-8 rounded-lg font-semibold",
          "brand-action touch-control",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            {t("submitting")}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
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
            {t("submit")}
          </span>
        )}
      </button>
    </form>
  );
}
