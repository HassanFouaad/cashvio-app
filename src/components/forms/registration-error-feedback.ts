/**
 * Maps sign-up API errors (password register, Google sign-in, Google sign-up)
 * to what the registration form shows and does.
 *
 * Branches on the stable `error.code` (the backend i18n key) first, then on
 * the HTTP status for responses without a known code.
 */

import { AuthErrorCode, HttpError } from '@/lib/http';

/** What the form does after a failed call. */
export enum RegistrationErrorAction {
  /** Show the message only. */
  NONE = 'NONE',
  /** Show the message with a link to sign in on the portal. */
  SIGN_IN = 'SIGN_IN',
  /** Leave Google mode; show the email and password form with the Google email. */
  USE_PASSWORD = 'USE_PASSWORD',
  /** Drop the Google token so the merchant picks the Google account again. */
  RESTART_GOOGLE = 'RESTART_GOOGLE',
  /** Google sign-up is switched off: hide every Google surface. */
  HIDE_GOOGLE = 'HIDE_GOOGLE',
}

/** Where the message renders. */
export type RegistrationErrorField = 'businessName' | 'contactPhone' | 'general';

export interface RegistrationErrorFeedback {
  field: RegistrationErrorField;
  /** Key in the `register` namespace; null shows the API's translated message. */
  messageKey: string | null;
  action: RegistrationErrorAction;
  /** `error_type` for the form_error analytics event. */
  trackingType: string;
}

const USER_EXISTS_FEEDBACK: RegistrationErrorFeedback = {
  field: 'general',
  messageKey: 'errors.userExists',
  action: RegistrationErrorAction.SIGN_IN,
  trackingType: 'user_exists',
};

const FEEDBACK_BY_CODE: Partial<Record<string, RegistrationErrorFeedback>> = {
  [AuthErrorCode.USER_ALREADY_EXISTS]: USER_EXISTS_FEEDBACK,
  [AuthErrorCode.GOOGLE_ACCOUNT_LINKED_ELSEWHERE]: {
    field: 'general',
    messageKey: 'google.errors.linkedElsewhere',
    action: RegistrationErrorAction.SIGN_IN,
    trackingType: 'google_linked_elsewhere',
  },
  [AuthErrorCode.GOOGLE_LINK_REQUIRES_PASSWORD]: {
    field: 'general',
    messageKey: 'google.errors.linkRequiresPassword',
    action: RegistrationErrorAction.SIGN_IN,
    trackingType: 'google_link_requires_password',
  },
  [AuthErrorCode.GOOGLE_ACCOUNT_MISMATCH]: {
    field: 'general',
    messageKey: 'google.errors.accountMismatch',
    action: RegistrationErrorAction.SIGN_IN,
    trackingType: 'google_account_mismatch',
  },
  [AuthErrorCode.GOOGLE_SIGN_UP_REQUIRES_PASSWORD]: {
    field: 'general',
    messageKey: 'google.errors.requiresPassword',
    action: RegistrationErrorAction.USE_PASSWORD,
    trackingType: 'google_requires_password',
  },
  [AuthErrorCode.GOOGLE_EMAIL_UNVERIFIED]: {
    field: 'general',
    messageKey: 'google.errors.emailUnverified',
    action: RegistrationErrorAction.RESTART_GOOGLE,
    trackingType: 'google_email_unverified',
  },
  [AuthErrorCode.GOOGLE_TOKEN_INVALID]: {
    field: 'general',
    messageKey: 'google.errors.tokenInvalid',
    action: RegistrationErrorAction.RESTART_GOOGLE,
    trackingType: 'google_token_invalid',
  },
  [AuthErrorCode.GOOGLE_TOKEN_REUSED]: {
    field: 'general',
    messageKey: 'google.errors.tokenInvalid',
    action: RegistrationErrorAction.RESTART_GOOGLE,
    trackingType: 'google_token_reused',
  },
  [AuthErrorCode.GOOGLE_SIGN_IN_UNAVAILABLE]: {
    field: 'general',
    messageKey: 'google.errors.unavailable',
    action: RegistrationErrorAction.HIDE_GOOGLE,
    trackingType: 'google_unavailable',
  },
  [AuthErrorCode.GOOGLE_VERIFICATION_UNAVAILABLE]: {
    field: 'general',
    messageKey: 'google.errors.verificationUnavailable',
    action: RegistrationErrorAction.NONE,
    trackingType: 'google_verification_unavailable',
  },
  [AuthErrorCode.ACCOUNT_DISABLED]: {
    field: 'general',
    messageKey: 'google.errors.accountDisabled',
    action: RegistrationErrorAction.NONE,
    trackingType: 'account_disabled',
  },
  [AuthErrorCode.TENANT_INACTIVE]: {
    field: 'general',
    messageKey: 'google.errors.businessInactive',
    action: RegistrationErrorAction.NONE,
    trackingType: 'tenant_inactive',
  },
  [AuthErrorCode.BUSINESS_NAME_REQUIRED]: {
    field: 'businessName',
    messageKey: 'errors.businessNameRequired',
    action: RegistrationErrorAction.NONE,
    trackingType: 'business_name_invalid',
  },
  [AuthErrorCode.BUSINESS_NAME_TOO_SHORT]: {
    field: 'businessName',
    messageKey: 'errors.businessNameTooShort',
    action: RegistrationErrorAction.NONE,
    trackingType: 'business_name_invalid',
  },
  [AuthErrorCode.BUSINESS_NAME_TOO_LONG]: {
    field: 'businessName',
    messageKey: 'errors.businessNameTooLong',
    action: RegistrationErrorAction.NONE,
    trackingType: 'business_name_invalid',
  },
  [AuthErrorCode.BUSINESS_NAME_MUST_CONTAIN_LETTER]: {
    field: 'businessName',
    messageKey: 'errors.businessNameMustContainLetter',
    action: RegistrationErrorAction.NONE,
    trackingType: 'business_name_invalid',
  },
  [AuthErrorCode.BUSINESS_NAME_INVALID_CHARS]: {
    field: 'businessName',
    messageKey: 'errors.businessNameInvalidChars',
    action: RegistrationErrorAction.NONE,
    trackingType: 'business_name_invalid',
  },
  [AuthErrorCode.CONTACT_PHONE_INVALID]: {
    field: 'contactPhone',
    messageKey: 'errors.phoneInvalid',
    action: RegistrationErrorAction.NONE,
    trackingType: 'contact_phone_invalid',
  },
};

const HTTP_STATUS = {
  NETWORK_ERROR: 0,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

/** Feedback for a failed sign-up call. */
export function getRegistrationErrorFeedback(
  error: HttpError
): RegistrationErrorFeedback {
  const byCode = error.code ? FEEDBACK_BY_CODE[error.code] : undefined;
  if (byCode) return byCode;

  // Any other conflict on these routes means the email is already registered
  // (older APIs answered register with code ERR_409)
  if (error.statusCode === HTTP_STATUS.CONFLICT) {
    return USER_EXISTS_FEEDBACK;
  }

  if (error.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return {
      field: 'general',
      messageKey: 'errors.tooManyAttempts',
      action: RegistrationErrorAction.NONE,
      trackingType: 'rate_limited',
    };
  }

  if (error.statusCode === HTTP_STATUS.NETWORK_ERROR) {
    return {
      field: 'general',
      messageKey: 'errors.networkError',
      action: RegistrationErrorAction.NONE,
      trackingType: 'network_error',
    };
  }

  // Client-side fallbacks carry an English message and no code
  if (!error.code && error.statusCode >= HTTP_STATUS.SERVER_ERROR) {
    return {
      field: 'general',
      messageKey: 'errors.registrationFailed',
      action: RegistrationErrorAction.NONE,
      trackingType: 'server_error',
    };
  }

  return {
    field: 'general',
    messageKey: null,
    action: RegistrationErrorAction.NONE,
    trackingType: 'api_error',
  };
}
