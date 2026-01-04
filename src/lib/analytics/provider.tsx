/**
 * Analytics Provider Component
 *
 * Handles Google Analytics initialization using @next/third-parties.
 * This component should be placed in the root layout for automatic page tracking.
 */

import { GoogleAnalytics } from '@next/third-parties/google';
import { GA_CONFIG } from './config';

/**
 * Analytics Provider
 *
 * Renders Google Analytics script only when properly configured.
 * Automatically tracks page views on route changes.
 *
 * @example
 * ```tsx
 * // In your root layout.tsx
 * import { AnalyticsProvider } from '@/lib/analytics';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <AnalyticsProvider />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AnalyticsProvider() {
  // Only render if GA is properly configured
  if (!GA_CONFIG.isEnabled) {
    if (GA_CONFIG.debugMode) {
      console.log('[Analytics] Google Analytics is not configured. Set NEXT_PUBLIC_GA_ID environment variable.');
    }
    return null;
  }

  return (
    <GoogleAnalytics
      gaId={GA_CONFIG.measurementId}
      // Enable debug mode in development for console logging
      dataLayerName="dataLayer"
    />
  );
}

/**
 * Re-export for convenience
 */
export { GoogleAnalytics };

