/**
 * Hook to create RequestConfig with Accept-Language header
 *
 * This hook provides the current locale to be used in HTTP requests.
 */

'use client';

import { useLocale } from 'next-intl';
import { RequestConfig } from './types';

/**
 * Hook to get RequestConfig with Accept-Language header based on current locale
 *
 * @example
 * const config = useLocaleConfig();
 * await authService.register(data, config);
 */
export function useLocaleConfig(customConfig?: RequestConfig): RequestConfig {
  const locale = useLocale();

  return {
    ...customConfig,
    locale,
    headers: {
      ...customConfig?.headers,
    },
  };
}

