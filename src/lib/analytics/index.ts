/**
 * Analytics Module
 *
 * Centralized exports for all analytics functionality.
 *
 * @example
 * ```tsx
 * // Import the provider for layout
 * import { AnalyticsProvider } from '@/lib/analytics';
 *
 * // Import event tracking functions
 * import {
 *   trackEvent,
 *   trackFormSubmit,
 *   trackCTAClick,
 *   trackRegistrationComplete,
 * } from '@/lib/analytics';
 *
 * // Import configuration and constants
 * import { GA_CONFIG, GA_EVENT_NAMES } from '@/lib/analytics';
 * ```
 */

// Provider component
export { AnalyticsProvider, GoogleAnalytics } from './provider';

// First-touch acquisition attribution
export {
  captureAttribution,
  getAttribution,
  getRegistrationSource,
  type Attribution,
} from './attribution';
export { AttributionTracker } from './attribution-tracker';

// Meta (Facebook) Pixel
export {
  META_PIXEL_EVENTS,
  MetaPixelProvider,
  trackMetaEvent,
  type MetaPixelEvent,
} from './meta-pixel';

// Configuration
export {
  GA_CONFIG,
  GA_EVENT_CATEGORIES,
  GA_EVENT_NAMES,
  type GAEventCategory,
  type GAEventName,
} from './config';

// Event tracking utilities
export {
  // Core tracking
  trackEvent,

  // Form tracking
  trackFormStart,
  trackFormSubmit,
  trackFormError,

  // CTA tracking
  trackCTAClick,
  trackButtonClick,

  // Navigation tracking
  trackOutboundLink,
  trackLocaleChange,
  trackThemeChange,

  // Conversion tracking
  trackRegistrationStart,
  trackRegistrationComplete,
  trackContactFormSubmit,
  trackDemoRequest,
  trackPricingView,
  trackPlanSelect,

  // Engagement tracking
  trackScrollDepth,
  trackTimeOnPage,
} from './events';

