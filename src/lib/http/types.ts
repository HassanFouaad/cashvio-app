/**
 * HTTP Module Types
 *
 * Type definitions for HTTP client and API responses.
 * Following SOLID principles with clear interfaces.
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}



/**
 * API Error response
 *
 * The backend wraps errors in a standard envelope with the translated
 * message nested under `error`. Top-level `message`/`statusCode` are kept
 * for non-envelope errors (e.g. proxies).
 */
export interface ApiError {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// ============================================================================
// Request Configuration
// ============================================================================

/**
 * HTTP Methods supported
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  locale?: string; // Locale for Accept-Language header
  /**
   * Cookie mode for the request. Defaults to 'omit': the marketing site calls
   * public endpoints and must not attach the portal's auth cookies. Only the
   * sign-up calls (register, Google sign-in and Google sign-up) opt into
   * 'include' so the browser accepts their Set-Cookie.
   */
  credentials?: RequestCredentials;
}

/**
 * Next.js specific fetch config
 */
export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

// ============================================================================
// Plan Types
// ============================================================================

export enum PlanPeriod {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

/**
 * Public plan data returned from API
 */
export interface PublicPlan {
  id: string;
  arName: string;
  enName: string;
  detailsAr: string[];
  detailsEn: string[];
  price: number;
  period: PlanPeriod;
  isFreemium: boolean;
  /** ISO 4217 code from the API. Prices render without a symbol when absent. */
  currency?: string;
}

// ============================================================================
// Auth Types
// ============================================================================

/**
 * Registration request payload
 * Password is provided by the user during registration
 */
export interface RegisterRequest {
  businessName: string;
  contactPhone: string;
  secondaryContactPhone?: string;
  email: string;
  password: string;
}

/**
 * Registration response body.
 *
 * Token-free: the access and refresh credentials arrive only as HttpOnly
 * cookies on the same response. `expiresIn` is the access lifetime in seconds.
 */
export interface RegisterResponse {
  expiresIn: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string | null;
    /** Session id of the new sign-in; matches `sessionId` from GET /auth/me. */
    sessionId: string;
  };
  tenant: {
    id: string;
    name: string;
  };
}

/**
 * Stable `error.code` values the sign-up form branches on. The code equals
 * the backend i18n key; the translated text arrives in `error.message`.
 */
export enum AuthErrorCode {
  USER_ALREADY_EXISTS = 'auth.errors.user_already_exists',
  ACCOUNT_DISABLED = 'auth.errors.account_disabled',
  TENANT_INACTIVE = 'tenants.error_inactive',
  BUSINESS_NAME_REQUIRED = 'auth.errors.business_name_required',
  BUSINESS_NAME_TOO_SHORT = 'auth.errors.business_name_too_short',
  BUSINESS_NAME_TOO_LONG = 'auth.errors.business_name_too_long',
  BUSINESS_NAME_MUST_CONTAIN_LETTER = 'auth.errors.business_name_must_contain_letter',
  BUSINESS_NAME_INVALID_CHARS = 'auth.errors.business_name_invalid_chars',
  CONTACT_PHONE_INVALID = 'auth.errors.contact_phone_invalid',
  GOOGLE_SIGN_UP_REQUIRES_PASSWORD = 'auth.errors.google_sign_up_requires_password',
  GOOGLE_ACCOUNT_LINKED_ELSEWHERE = 'auth.errors.google_account_linked_elsewhere',
  GOOGLE_LINK_REQUIRES_PASSWORD = 'auth.errors.google_link_requires_password',
  GOOGLE_ACCOUNT_MISMATCH = 'auth.errors.google_account_mismatch',
  GOOGLE_EMAIL_UNVERIFIED = 'auth.errors.google_email_unverified',
  GOOGLE_TOKEN_INVALID = 'auth.errors.google_token_invalid',
  GOOGLE_TOKEN_REUSED = 'auth.errors.google_token_reused',
  GOOGLE_SIGN_IN_UNAVAILABLE = 'auth.errors.google_sign_in_unavailable',
  GOOGLE_VERIFICATION_UNAVAILABLE = 'auth.errors.google_verification_unavailable',
}

// ============================================================================
// Google Sign-In Types
// ============================================================================

/**
 * Result of POST /auth/google/sign-in
 *
 * SIGNED_IN: an account already uses this Google account or email; the
 *   auth cookies are set on the response.
 * SIGNUP_REQUIRED: no account yet and no cookies; finish with
 *   POST /auth/google/sign-up and the same ID token.
 */
export enum GoogleSignInOutcome {
  SIGNED_IN = 'SIGNED_IN',
  SIGNUP_REQUIRED = 'SIGNUP_REQUIRED',
}

/**
 * Google sign-in request. `idToken` is the Google Identity Services
 * `credential`; never log it or send it to analytics.
 */
export interface GoogleSignInRequest {
  idToken: string;
}

/** Google profile offered on the sign-up step (shown read-only). */
export interface GoogleSignUpProfile {
  email: string;
  firstName: string;
  lastName: string;
}

/** Signed-in user returned with SIGNED_IN (the subset this site relies on). */
export interface GoogleSignedInUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string | null;
  sessionId?: string | null;
}

export interface GoogleSignedInResponse {
  outcome: GoogleSignInOutcome.SIGNED_IN;
  expiresIn: number;
  user: GoogleSignedInUser;
}

export interface GoogleSignUpRequiredResponse {
  outcome: GoogleSignInOutcome.SIGNUP_REQUIRED;
  profile: GoogleSignUpProfile;
}

export type GoogleSignInResponse =
  | GoogleSignedInResponse
  | GoogleSignUpRequiredResponse;

/**
 * Google sign-up request: the business details of registration plus the same
 * ID token that sign-in answered with SIGNUP_REQUIRED. There is no email or
 * password field: the email comes from Google and no password is created.
 */
export interface GoogleSignUpRequest {
  idToken: string;
  businessName: string;
  contactPhone: string;
  secondaryContactPhone?: string;
}

/** Google sign-up answers with the registration body (cookies are set). */
export type GoogleSignUpResponse = RegisterResponse;

// ============================================================================
// Contact Types
// ============================================================================

export enum InquiryType {
  GENERAL = 'GENERAL',
  DEMO = 'DEMO',
  SUPPORT = 'SUPPORT',
  SALES = 'SALES',
  PARTNERSHIP = 'PARTNERSHIP',
}

/**
 * Contact form submission request
 */
export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: InquiryType;
  locale?: string;
}

/**
 * Contact submission response
 */
export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: InquiryType;
  createdAt: string;
}

