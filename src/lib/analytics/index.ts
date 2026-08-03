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
 *   trackSignUp,
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
  applyAttributionToGtag,
  captureAttribution,
  getAttribution,
  getRegistrationSource,
  toAttributionEventParams,
  type Attribution,
  type AttributionEventParams,
} from './attribution';
export { AttributionTracker } from './attribution-tracker';
export { EngagementTracker } from './engagement-tracker';
export { PricingViewTracker } from './pricing-view-tracker';
export { TrackedButtonLink } from './tracked-button-link';
export { TrackedExternalLink } from './tracked-external-link';

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

export {
  SCROLL_DEPTH_MILESTONES,
  TIME_ON_PAGE_THRESHOLDS_SECONDS,
  type ScrollDepthMilestone,
} from './constants';

// Event tracking utilities
export {
  // Core tracking
  trackEvent,
  withAttribution,

  // Form tracking
  trackFormStart,
  trackFormSubmit,
  trackFormError,

  // CTA tracking
  trackCTAClick,
  trackButtonClick,
  trackWhatsAppClick,
  trackPortalClick,

  // Navigation tracking
  trackOutboundLink,
  trackLocaleChange,
  trackThemeChange,

  // Conversion tracking
  trackRegistrationStart,
  trackSignUp,
  trackRegistrationComplete,
  trackGenerateLead,
  trackContactFormSubmit,
  trackDemoRequest,
  trackPricingView,
  trackPlanSelect,

  // Engagement tracking
  trackScrollDepth,
  trackTimeOnPage,
} from './events';
