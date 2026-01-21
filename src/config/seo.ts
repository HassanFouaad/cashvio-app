/**
 * Centralized SEO Configuration
 *
 * All SEO-related values, meta tags, Schema.org data, and static content
 * should be configured here for easy management.
 */

import { env } from './env';
import type { Locale } from '@/i18n/routing';

// ============================================================================
// BRAND & IDENTITY
// ============================================================================

export const brand = {
  name: 'Cashvio',
  tagline: 'Business Operations & Commerce Platform',
  shortDescription: 'Complete business management platform for selling online and in-store',
  founded: '2024',
  type: 'SaaS' as const,
} as const;

// ============================================================================
// URLS & DOMAINS
// ============================================================================

export const urls = {
  site: env.site.url,
  portal: env.portal.url,
  api: env.api.url,
  docs: `${env.site.url}/docs`,
  support: 'https://support.cash-vio.com',
  demo: `${env.site.url}/contact?type=demo`,
} as const;

// ============================================================================
// CONTACT INFORMATION
// ============================================================================

export const contact = {
  email: env.contact.email,
  phone: env.contact.phone,
  address: {
    street: env.contact.address || '123 Business District',
    city: 'Cairo',
    region: 'Cairo Governorate',
    postalCode: '11511',
    country: 'Egypt',
    countryCode: 'EG',
  },
  businessHours: {
    weekdays: '9:00 AM - 6:00 PM',
    weekends: '10:00 AM - 2:00 PM',
    timezone: 'Africa/Cairo',
  },
} as const;

// ============================================================================
// SOCIAL MEDIA
// ============================================================================

export const social = {
  twitter: {
    handle: '@cashvio',
    url: 'https://twitter.com/cashvio',
  },
  facebook: {
    url: env.social.facebook || 'https://facebook.com/cashvio',
  },
  linkedin: {
    url: env.social.linkedin || 'https://linkedin.com/company/cashvio',
  },
  instagram: {
    url: env.social.instagram || 'https://instagram.com/cashvioapp',
  },
  youtube: {
    url: 'https://youtube.com/@cashvio',
  },
} as const;

// ============================================================================
// SEO KEYWORDS (by locale)
// ============================================================================

export const keywords: Record<Locale, string[]> = {
  en: [
    'business management platform',
    'commerce platform',
    'sales management software',
    'inventory management',
    'order management system',
    'multi-channel selling',
    'online seller tools',
    'e-commerce management',
    'business operations software',
    'payment processing',
    'customer management',
    'analytics dashboard',
    'multi-store management',
    'product catalog',
    'Cashvio',
  ],
  ar: [
    'منصة إدارة الأعمال',
    'منصة التجارة الإلكترونية',
    'برنامج إدارة المبيعات',
    'إدارة المخزون',
    'نظام إدارة الطلبات',
    'البيع متعدد القنوات',
    'أدوات البائعين الإلكترونيين',
    'إدارة التجارة الإلكترونية',
    'برنامج العمليات التجارية',
    'معالجة المدفوعات',
    'إدارة العملاء',
    'لوحة التحليلات',
    'إدارة متاجر متعددة',
    'كتالوج المنتجات',
    'كاشفيو',
  ],
};

// ============================================================================
// META DEFAULTS
// ============================================================================

export const metaDefaults = {
  robots: 'index, follow',
  googlebot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  author: brand.name,
  publisher: brand.name,
  category: 'Business Software',
  classification: 'Software as a Service',
} as const;

// ============================================================================
// OPEN GRAPH DEFAULTS
// ============================================================================

export const openGraphDefaults = {
  type: 'website' as const,
  siteName: brand.name,
  images: [
    {
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
      alt: `${brand.name} - ${brand.tagline}`,
    },
  ],
};

// ============================================================================
// TWITTER CARD DEFAULTS
// ============================================================================

export const twitterDefaults = {
  card: 'summary_large_image' as const,
  site: social.twitter.handle,
  creator: social.twitter.handle,
  images: [`${urls.site}/assets/logo-light.png`],
};

// ============================================================================
// SCHEMA.ORG TEMPLATES
// ============================================================================

export const schemaTemplates = {
  /**
   * Organization schema - Use on homepage
   */
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${urls.site}/#organization`,
    name: brand.name,
    url: urls.site,
    logo: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    description: brand.shortDescription,
    email: contact.email,
    telephone: contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.countryCode,
    },
    sameAs: [
      social.twitter.url,
      social.facebook.url,
      social.linkedin.url,
      social.instagram.url,
      social.youtube.url,
    ],
    foundingDate: brand.founded,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contact.phone,
      contactType: 'customer service',
      email: contact.email,
      availableLanguage: ['English', 'Arabic'],
    },
  }),

  /**
   * Website schema with search action
   */
  website: (locale: Locale) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${urls.site}/#website`,
    name: brand.name,
    url: urls.site,
    description: brand.shortDescription,
    inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
    publisher: {
      '@id': `${urls.site}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${urls.site}/docs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }),

  /**
   * SoftwareApplication schema - Use on homepage and features
   */
  softwareApplication: () => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${urls.site}/#software`,
    name: brand.name,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Business Management Software',
    operatingSystem: 'Web, iOS, Android',
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '99',
      offerCount: 3,
      availability: 'https://schema.org/InStock',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'EG',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'EG',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Verified Customer',
      },
      reviewBody: 'Comprehensive platform that handles everything from inventory to sales across multiple channels.',
    },
    featureList: [
      'Product Management',
      'Inventory Control',
      'Order Processing',
      'Customer Management',
      'Analytics & Reports',
      'Multi-Store Operations',
      'Payment Processing',
      'E-commerce Integration',
    ],
    screenshot: `${urls.site}/assets/logo-light.png`,
    softwareVersion: '2.0',
    author: {
      '@id': `${urls.site}/#organization`,
    },
  }),

  /**
   * WebPage schema - Use on all pages
   */
  webPage: (params: {
    locale: Locale;
    path: string;
    title: string;
    description: string;
    type?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': params.type || 'WebPage',
    '@id': `${urls.site}${params.path}#webpage`,
    url: `${urls.site}${params.path}`,
    name: params.title,
    description: params.description,
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    inLanguage: params.locale === 'ar' ? 'ar-EG' : 'en-US',
    isPartOf: {
      '@id': `${urls.site}/#website`,
    },
    breadcrumb: {
      '@id': `${urls.site}${params.path}#breadcrumb`,
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  }),

  /**
   * BreadcrumbList schema
   */
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  /**
   * FAQPage schema - Use on pricing/features pages
   */
  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),

  /**
   * ContactPage schema
   */
  contactPage: () => ({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    description: `Get in touch with ${brand.name}`,
    url: `${urls.site}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: brand.name,
      email: contact.email,
      telephone: contact.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: contact.address.street,
        addressLocality: contact.address.city,
        addressCountry: contact.address.countryCode,
      },
    },
  }),

  /**
   * Product/Pricing schema
   */
  pricingPage: (plans: Array<{ name: string; price: number; description: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${brand.name} Pricing Plans`,
    description: `Choose from our range of ${brand.name} plans`,
    itemListElement: plans.map((plan, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `${brand.name} ${plan.name}`,
        description: plan.description,
        image: {
          '@type': 'ImageObject',
          url: `${urls.site}/assets/logo-light.png`,
          width: 512,
          height: 512,
        },
        brand: {
          '@type': 'Brand',
          name: brand.name,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '500',
          bestRating: '5',
          worstRating: '1',
        },
        review: {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          author: {
            '@type': 'Person',
            name: 'Verified Customer',
          },
          reviewBody: `${plan.name} plan provides excellent value for managing business operations.`,
        },
        offers: {
          '@type': 'Offer',
          price: plan.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'USD',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'EG',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 0,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 0,
                unitCode: 'DAY',
              },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'EG',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 30,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
        },
      },
    })),
  }),

  /**
   * Article schema - Use on privacy, terms, and legal pages
   */
  article: (params: {
    locale: Locale;
    path: string;
    title: string;
    description: string;
    datePublished?: string;
    dateModified?: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${urls.site}${params.path}#article`,
    headline: params.title,
    description: params.description,
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    datePublished: params.datePublished || '2024-01-01',
    dateModified: params.dateModified || new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: brand.name,
      url: urls.site,
    },
    publisher: {
      '@type': 'Organization',
      name: brand.name,
      logo: {
        '@type': 'ImageObject',
        url: `${urls.site}/assets/logo-light.png`,
        width: 512,
        height: 512,
      },
    },
    inLanguage: params.locale === 'ar' ? 'ar-EG' : 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${urls.site}${params.path}`,
    },
  }),

  /**
   * CollectionPage schema - Use on docs and collection pages
   */
  collectionPage: (params: {
    locale: Locale;
    path: string;
    title: string;
    description: string;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${urls.site}${params.path}#collection`,
    url: `${urls.site}${params.path}`,
    name: params.title,
    description: params.description,
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    inLanguage: params.locale === 'ar' ? 'ar-EG' : 'en-US',
    isPartOf: {
      '@id': `${urls.site}/#website`,
    },
  }),
} as const;

// ============================================================================
// PAGE-SPECIFIC SEO CONFIG
// ============================================================================

export const pageSEO = {
  home: {
    priority: 1.0,
    changeFrequency: 'weekly' as const,
  },
  features: {
    priority: 0.9,
    changeFrequency: 'monthly' as const,
  },
  pricing: {
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  },
  contact: {
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  register: {
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  },
  docs: {
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  },
  privacy: {
    priority: 0.3,
    changeFrequency: 'yearly' as const,
  },
  terms: {
    priority: 0.3,
    changeFrequency: 'yearly' as const,
  },
} as const;

// ============================================================================
// TRUST SIGNALS & BENEFITS (Replaces fake stats)
// ============================================================================

export const benefits = {
  keys: ['security', 'support', 'uptime', 'global'] as const,
  icons: {
    security: 'shield',
    support: 'headphones',
    uptime: 'clock',
    global: 'globe',
  },
} as const;

// ============================================================================
// INTEGRATIONS & PARTNERS (Replaces fake testimonials)
// ============================================================================

export const integrations = {
  payment: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Stripe', 'PayPal'],
  pos: ['Square', 'Clover', 'Shopify POS'],
  accounting: ['QuickBooks', 'Xero', 'FreshBooks'],
  ecommerce: ['Shopify', 'WooCommerce', 'Magento'],
} as const;

// ============================================================================
// CERTIFICATIONS & COMPLIANCE
// ============================================================================

export const compliance = {
  badges: ['PCI DSS', 'GDPR', 'SOC 2', 'ISO 27001'],
  security: ['256-bit SSL', 'Two-Factor Auth', 'Data Encryption'],
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get canonical URL for a page
 */
export function getCanonicalUrl(path: string, locale: Locale): string {
  // English (default) has no locale prefix
  const localePath = locale === 'en' ? '' : `/${locale}`;
  return `${urls.site}${localePath}${path}`;
}

/**
 * Get alternate language URLs for hreflang tags
 * Includes x-default pointing to English (default language)
 * 
 * This helps search engines understand that:
 * - English is at the root (/)
 * - Arabic is at /ar/
 * - Default (for unmatched locales) should use English
 */
export function getAlternateUrls(path: string): Record<string, string> {
  return {
    'en': `${urls.site}${path}`,
    'ar': `${urls.site}/ar${path}`,
    'x-default': `${urls.site}${path}`, // Default to English
  };
}

/**
 * Get all alternate locales for Open Graph
 * Returns an array of locale codes for og:locale:alternate
 */
export function getAlternateLocales(currentLocale: Locale): string[] {
  const locales = ['en_US', 'ar_EG'];
  const currentOgLocale = currentLocale === 'ar' ? 'ar_EG' : 'en_US';
  return locales.filter(loc => loc !== currentOgLocale);
}

/**
 * Serialize schema to safe JSON string
 */
export function serializeSchema(schema: object): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

export type Benefits = typeof benefits;
export type PageSEO = typeof pageSEO;
export type SchemaTemplates = typeof schemaTemplates;

