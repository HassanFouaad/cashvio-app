/**
 * Environment Configuration
 *
 * All external URLs and environment-specific values should be managed here.
 * These values can be configured via environment variables.
 */

// Base URLs
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3002';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.cash-vio.com';

export const env = {
  /**
   * API Configuration
   */
  api: {
    baseUrl: API_BASE_URL,
    version: 'v1',
    get url() {
      return `${this.baseUrl}/${this.version}`;
    },
  },

  /**
   * Portal/Console Configuration (where users manage their business)
   */
  portal: {
    url: PORTAL_URL,
    loginPath: '/login',
    dashboardPath: '/dashboard',
    get loginUrl() {
      return `${this.url}${this.loginPath}`;
    },
    get dashboardUrl() {
      return `${this.url}${this.dashboardPath}`;
    },
  },

  /**
   * Marketing Site Configuration (Next.js app)
   */
  site: {
    url: SITE_URL,
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Cashvio',
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'Complete business management platform for online and in-store operations',
  },

  /**
   * Feature Flags
   */
  features: {
    enableRegistration:
      process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== 'false',
    enableContactForm: process.env.NEXT_PUBLIC_ENABLE_CONTACT_FORM !== 'false',
  },

  /**
   * Social Links
   */
  social: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || '',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  },

  /**
   * Contact Information
   */
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@cash-vio.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || '',
  },

  /**
   * Analytics & Tracking
   */
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  },

  /**
   * Cookie Configuration for Cross-Domain Sharing
   */
  cookies: {
    domain: COOKIE_DOMAIN,
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  },

  /**
   * Check if running in development
   */
  isDev: process.env.NODE_ENV === 'development',

  /**
   * Check if running in production
   */
  isProd: process.env.NODE_ENV === 'production',
} as const;

export type Env = typeof env;

