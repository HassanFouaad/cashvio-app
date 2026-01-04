/**
 * Analytics Configuration
 *
 * Centralized configuration for Google Analytics and other tracking services.
 * All analytics-related settings should be managed here.
 */

import { env } from '@/config/env';

/**
 * Google Analytics configuration
 */
export const GA_CONFIG = {
  /**
   * Google Analytics Measurement ID (G-XXXXXXXXXX)
   * Set via NEXT_PUBLIC_GA_ID environment variable
   */
  measurementId: env.analytics.googleAnalyticsId,

  /**
   * Enable debug mode in development
   */
  debugMode: env.isDev,

  /**
   * Check if GA is properly configured
   */
  get isEnabled(): boolean {
    return Boolean(this.measurementId && this.measurementId.startsWith('G-'));
  },
} as const;

/**
 * Custom event categories for consistent tracking
 */
export const GA_EVENT_CATEGORIES = {
  FORM: 'form',
  CTA: 'cta',
  NAVIGATION: 'navigation',
  ENGAGEMENT: 'engagement',
  CONVERSION: 'conversion',
  ERROR: 'error',
} as const;

/**
 * Predefined event names for common actions
 */
export const GA_EVENT_NAMES = {
  // Form Events
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',

  // CTA Events
  CTA_CLICK: 'cta_click',
  BUTTON_CLICK: 'button_click',

  // Navigation Events
  PAGE_VIEW: 'page_view',
  OUTBOUND_LINK: 'outbound_link',
  LOCALE_CHANGE: 'locale_change',
  THEME_CHANGE: 'theme_change',

  // Conversion Events
  REGISTRATION_START: 'registration_start',
  REGISTRATION_COMPLETE: 'registration_complete',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  DEMO_REQUEST: 'demo_request',
  PRICING_VIEW: 'pricing_view',
  PLAN_SELECT: 'plan_select',

  // Engagement Events
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  VIDEO_PLAY: 'video_play',
} as const;

export type GAEventCategory =
  (typeof GA_EVENT_CATEGORIES)[keyof typeof GA_EVENT_CATEGORIES];
export type GAEventName = (typeof GA_EVENT_NAMES)[keyof typeof GA_EVENT_NAMES];

