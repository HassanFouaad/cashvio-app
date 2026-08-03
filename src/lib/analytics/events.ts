/**
 * Analytics Event Tracking Utilities
 *
 * Type-safe event tracking functions for Google Analytics.
 * Uses gtag.js for maximum flexibility and compatibility.
 */

'use client';

import {
  getRegistrationSource,
  toAttributionEventParams,
  type AttributionEventParams,
} from './attribution';
import {
  GA_CONFIG,
  GA_EVENT_CATEGORIES,
  GA_EVENT_NAMES,
  type GAEventCategory,
  type GAEventName,
} from './config';

/**
 * Base event parameters interface
 */
interface BaseEventParams {
  event_category?: GAEventCategory;
  event_label?: string;
  value?: number;
  non_interaction?: boolean;
}

/**
 * Extended event parameters for custom events
 */
interface CustomEventParams extends BaseEventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Check if gtag is available (client-side only)
 */
function isGtagAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag !== 'undefined' &&
    typeof window.gtag === 'function'
  );
}

/**
 * Merge first-touch attribution onto event params (conversions / leads).
 */
export function withAttribution(
  params?: CustomEventParams
): CustomEventParams & AttributionEventParams {
  return {
    ...toAttributionEventParams(),
    ...params,
  };
}

/**
 * Send a custom event to Google Analytics
 *
 * @param eventName - The name of the event (use GA_EVENT_NAMES for consistency)
 * @param params - Event parameters
 */
export function trackEvent(
  eventName: GAEventName | string,
  params?: CustomEventParams
): void {
  if (!GA_CONFIG.isEnabled || !isGtagAvailable()) {
    if (GA_CONFIG.debugMode) {
      console.log('[Analytics Debug] Event:', eventName, params);
    }
    return;
  }

  try {
    window.gtag?.('event', eventName, {
      ...params,
      debug_mode: GA_CONFIG.debugMode,
    });
  } catch (error) {
    console.error('[Analytics] Failed to track event:', error);
  }
}

// ============================================================================
// Form Tracking Events
// ============================================================================

/**
 * Track when a user starts filling out a form
 */
export function trackFormStart(
  formName: string,
  formLocation?: string
): void {
  trackEvent(GA_EVENT_NAMES.FORM_START, {
    event_category: GA_EVENT_CATEGORIES.FORM,
    event_label: formName,
    form_name: formName,
    form_location: formLocation,
  });
}

/**
 * Track successful form submission
 */
export function trackFormSubmit(
  formName: string,
  formLocation?: string
): void {
  trackEvent(GA_EVENT_NAMES.FORM_SUBMIT, {
    event_category: GA_EVENT_CATEGORIES.FORM,
    event_label: formName,
    form_name: formName,
    form_location: formLocation,
  });
}

/**
 * Track form submission errors
 */
export function trackFormError(
  formName: string,
  errorType: string,
  errorMessage?: string
): void {
  trackEvent(GA_EVENT_NAMES.FORM_ERROR, {
    event_category: GA_EVENT_CATEGORIES.ERROR,
    event_label: `${formName}: ${errorType}`,
    form_name: formName,
    error_type: errorType,
    error_message: errorMessage,
    non_interaction: true,
  });
}

// ============================================================================
// CTA Tracking Events
// ============================================================================

/**
 * Track CTA button clicks
 */
export function trackCTAClick(
  ctaName: string,
  ctaLocation: string,
  ctaDestination?: string
): void {
  trackEvent(GA_EVENT_NAMES.CTA_CLICK, {
    event_category: GA_EVENT_CATEGORIES.CTA,
    event_label: ctaName,
    cta_name: ctaName,
    cta_location: ctaLocation,
    cta_destination: ctaDestination,
  });
}

/**
 * Track general button clicks
 */
export function trackButtonClick(
  buttonName: string,
  buttonLocation: string
): void {
  trackEvent(GA_EVENT_NAMES.BUTTON_CLICK, {
    event_category: GA_EVENT_CATEGORIES.ENGAGEMENT,
    event_label: buttonName,
    button_name: buttonName,
    button_location: buttonLocation,
  });
}

/**
 * Track WhatsApp click-to-chat CTAs
 */
export function trackWhatsAppClick(location: string): void {
  trackEvent(GA_EVENT_NAMES.WHATSAPP_CLICK, {
    event_category: GA_EVENT_CATEGORIES.CTA,
    event_label: location,
    cta_location: location,
  });
}

/**
 * Track clicks that leave the marketing site for the merchant portal
 */
export function trackPortalClick(path: string, location: string): void {
  trackEvent(GA_EVENT_NAMES.PORTAL_CLICK, {
    event_category: GA_EVENT_CATEGORIES.NAVIGATION,
    event_label: path,
    portal_path: path,
    cta_location: location,
  });
}

// ============================================================================
// Navigation Tracking Events
// ============================================================================

/**
 * Track outbound link clicks
 */
export function trackOutboundLink(url: string, linkText?: string): void {
  trackEvent(GA_EVENT_NAMES.OUTBOUND_LINK, {
    event_category: GA_EVENT_CATEGORIES.NAVIGATION,
    event_label: linkText || url,
    outbound_url: url,
    link_text: linkText,
  });
}

/**
 * Track locale/language changes
 */
export function trackLocaleChange(
  fromLocale: string,
  toLocale: string
): void {
  trackEvent(GA_EVENT_NAMES.LOCALE_CHANGE, {
    event_category: GA_EVENT_CATEGORIES.NAVIGATION,
    event_label: `${fromLocale} -> ${toLocale}`,
    from_locale: fromLocale,
    to_locale: toLocale,
  });
}

/**
 * Track theme changes
 */
export function trackThemeChange(theme: 'light' | 'dark'): void {
  trackEvent(GA_EVENT_NAMES.THEME_CHANGE, {
    event_category: GA_EVENT_CATEGORIES.ENGAGEMENT,
    event_label: theme,
    theme,
  });
}

// ============================================================================
// Conversion Tracking Events
// ============================================================================

/**
 * Track registration process start
 */
export function trackRegistrationStart(source?: string): void {
  trackEvent(
    GA_EVENT_NAMES.REGISTRATION_START,
    withAttribution({
      event_category: GA_EVENT_CATEGORIES.CONVERSION,
      event_label: source || getRegistrationSource(),
      registration_source: source || getRegistrationSource(),
    })
  );
}

/**
 * Track successful signup (GA4 recommended: sign_up).
 * Canonical fire point is the thank-you page to avoid double-counting.
 */
export function trackSignUp(planType?: string, source?: string): void {
  const registrationSource = source || getRegistrationSource();

  trackEvent(
    GA_EVENT_NAMES.SIGN_UP,
    withAttribution({
      event_category: GA_EVENT_CATEGORIES.CONVERSION,
      event_label: registrationSource,
      method: 'email',
      plan_type: planType,
      registration_source: registrationSource,
    })
  );
}

/**
 * @deprecated Prefer trackSignUp on the thank-you page (single conversion point).
 */
export function trackRegistrationComplete(
  planType?: string,
  source?: string
): void {
  trackSignUp(planType, source);
}

/**
 * Track a lead (GA4 recommended: generate_lead).
 */
export function trackGenerateLead(
  leadType: string,
  source?: string
): void {
  trackEvent(
    GA_EVENT_NAMES.GENERATE_LEAD,
    withAttribution({
      event_category: GA_EVENT_CATEGORIES.CONVERSION,
      event_label: leadType,
      lead_type: leadType,
      form_source: source,
    })
  );
}

/**
 * Track contact form submission (fires generate_lead + legacy alias)
 */
export function trackContactFormSubmit(
  inquiryType: string,
  source?: string
): void {
  trackGenerateLead(inquiryType, source);

  trackEvent(
    GA_EVENT_NAMES.CONTACT_FORM_SUBMIT,
    withAttribution({
      event_category: GA_EVENT_CATEGORIES.CONVERSION,
      event_label: inquiryType,
      inquiry_type: inquiryType,
      form_source: source,
    })
  );
}

/**
 * Track demo requests
 */
export function trackDemoRequest(source?: string): void {
  trackEvent(
    GA_EVENT_NAMES.DEMO_REQUEST,
    withAttribution({
      event_category: GA_EVENT_CATEGORIES.CONVERSION,
      event_label: source || 'direct',
      demo_source: source,
    })
  );
}

/**
 * Track pricing page views
 */
export function trackPricingView(locale?: string): void {
  trackEvent(GA_EVENT_NAMES.PRICING_VIEW, {
    event_category: GA_EVENT_CATEGORIES.ENGAGEMENT,
    event_label: locale || 'unknown',
    locale,
  });
}

/**
 * Track when a user selects a pricing plan
 */
export function trackPlanSelect(
  planName: string,
  planPrice?: number,
  planPeriod?: string
): void {
  trackEvent(
    GA_EVENT_NAMES.PLAN_SELECT,
    withAttribution({
      event_category: GA_EVENT_CATEGORIES.CONVERSION,
      event_label: planName,
      plan_name: planName,
      plan_price: planPrice,
      plan_period: planPeriod,
      value: planPrice,
    })
  );
}

// ============================================================================
// Engagement Tracking Events
// ============================================================================

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(
  percentage: 25 | 50 | 75 | 90 | 100,
  pagePath: string
): void {
  trackEvent(GA_EVENT_NAMES.SCROLL_DEPTH, {
    event_category: GA_EVENT_CATEGORIES.ENGAGEMENT,
    event_label: `${percentage}%`,
    scroll_percentage: percentage,
    page_path: pagePath,
    non_interaction: true,
  });
}

/**
 * Track time spent on page
 */
export function trackTimeOnPage(
  seconds: number,
  pagePath: string
): void {
  trackEvent(GA_EVENT_NAMES.TIME_ON_PAGE, {
    event_category: GA_EVENT_CATEGORIES.ENGAGEMENT,
    event_label: `${seconds}s`,
    time_seconds: seconds,
    page_path: pagePath,
    value: seconds,
    non_interaction: true,
  });
}

// ============================================================================
// Type Declaration for gtag
// ============================================================================

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set' | 'js',
      targetId: string | Date | Record<string, unknown>,
      config?: Record<string, unknown>
    ) => void;
  }
}
