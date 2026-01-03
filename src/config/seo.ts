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
  tagline: 'Modern POS & Inventory Management',
  shortDescription: 'The all-in-one solution for modern retail businesses',
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
    url: env.social.instagram || 'https://instagram.com/cashvio',
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
    'POS system',
    'point of sale',
    'inventory management',
    'retail management software',
    'business management',
    'cash register',
    'sales tracking',
    'stock management',
    'small business POS',
    'restaurant POS',
    'retail POS',
    'cloud POS',
    'multi-store management',
    'Cashvio',
  ],
  ar: [
    'نظام نقاط البيع',
    'نقاط البيع',
    'إدارة المخزون',
    'برنامج إدارة البيع بالتجزئة',
    'إدارة الأعمال',
    'ماكينة الكاشير',
    'تتبع المبيعات',
    'إدارة المخزن',
    'نقاط بيع للمتاجر الصغيرة',
    'نقاط بيع للمطاعم',
    'نقاط بيع للتجزئة',
    'نقاط بيع سحابي',
    'إدارة متاجر متعددة',
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
    applicationSubCategory: 'Point of Sale Software',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '99',
      offerCount: 3,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Point of Sale',
      'Inventory Management',
      'Customer Management',
      'Analytics & Reports',
      'Multi-store Support',
      'Cloud-based',
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
        offers: {
          '@type': 'Offer',
          price: plan.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      },
    })),
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
 * Get alternate language URLs for hreflang
 */
export function getAlternateUrls(path: string): Record<string, string> {
  return {
    en: `${urls.site}${path}`,
    ar: `${urls.site}/ar${path}`,
    'x-default': `${urls.site}${path}`,
  };
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

