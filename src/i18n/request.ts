import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { routing, type Locale } from './routing';

/**
 * Get locale from cookies or Accept-Language header
 * Used as fallback when requestLocale is not available (e.g., for non-[locale] routes)
 */
async function getLocaleFromRequest(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();
    
    // 1. Try cv_language cookie first
    const cvLanguage = cookieStore.get("cv_language")?.value;
    if (cvLanguage && (cvLanguage === "en" || cvLanguage === "ar")) {
      return cvLanguage;
    }
    
    // 2. Try NEXT_LOCALE cookie
    const nextLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (nextLocale && (nextLocale === "en" || nextLocale === "ar")) {
      return nextLocale;
    }
    
    // 3. Parse Accept-Language header
    const acceptLanguage = headersList.get("accept-language");
    if (acceptLanguage && acceptLanguage.includes("ar")) {
      return "ar";
    }
  } catch {
    // If we can't access cookies/headers (e.g., during build), use default
  }
  
  return routing.defaultLocale;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Try to get locale from URL segment first, then fall back to cookies/headers
  const requested = await requestLocale;
  let locale: Locale;
  
  if (hasLocale(routing.locales, requested)) {
    locale = requested;
  } else {
    // For routes without [locale] segment (like /export/orders/...),
    // get locale from cookies or headers
    locale = await getLocaleFromRequest();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'UTC',
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'long',
        },
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'USD',
        },
      },
    },
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn('Missing translation:', error.message);
      } else {
        console.error('i18n error:', error);
      }
    },
    getMessageFallback({ namespace, key }) {
      return `${namespace}.${key}`;
    },
  };
});

