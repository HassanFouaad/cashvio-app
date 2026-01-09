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
 */
export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
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
  email: string;
  password: string;
}

/**
 * Registration response
 */
export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string | null;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

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

