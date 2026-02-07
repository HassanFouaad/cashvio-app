/**
 * Centralized SEO Configuration
 *
 * All SEO-related values, meta tags, Schema.org data, and static content
 * should be configured here for easy management.
 * 
 * SEO Best Practices for 2026:
 * - Complete Organization schema with brand signals
 * - SoftwareApplication with proper categorization
 * - WebSite schema with SearchAction
 * - Brand schema for entity recognition
 * - Service schema for SaaS description
 * - Proper interlinking between schemas using @id
 */

import { PublicPlan } from '@/lib/http';
import { env } from './env';
import type { Locale } from '@/i18n/routing';

// ============================================================================
// BRAND & IDENTITY (Enhanced for SEO 2026)
// ============================================================================

export const brand = {
  name: 'Cashvio',
  legalName: 'Cashvio Technologies',
  alternateName: ['كاشفيو', 'Cash-vio', 'Cashvio POS', 'Cashvio Commerce'],
  tagline: 'Business Operations & Commerce Platform',
  slogan: 'Sell Smarter, Grow Faster',
  shortDescription: 'Complete business management platform for selling online and in-store',
  longDescription: 'Cashvio is a comprehensive SaaS platform that helps businesses manage their entire operations including point-of-sale, inventory, orders, customers, and analytics across multiple stores and sales channels.',
  founded: '2024',
  type: 'SaaS' as const,
  industry: 'Business Software',
  naicsCode: '511210', // Software Publishers
  isicCode: '6201', // Computer programming activities
  expertise: [
    'Point of Sale Systems',
    'Inventory Management',
    'E-commerce Solutions',
    'Business Analytics',
    'Multi-channel Retail',
    'Customer Relationship Management',
    'Payment Processing',
  ],
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
  demo: `${env.site.url}/contact`,
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
    appId:"882610377639110"
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
// SEO KEYWORDS (by locale) - Optimized for 2026 search intent
// ============================================================================

export const keywords: Record<Locale, string[]> = {
  en: [
    // Primary brand keywords
    'Cashvio',
    'Cashvio POS',
    'Cashvio business management',
    // High-intent transactional keywords
    'business management platform',
    'POS system for retail',
    'free POS software',
    'inventory management software',
    'order management system',
    // Feature-specific keywords
    'multi-store management software',
    'sales analytics dashboard',
    'customer relationship management',
    'product catalog software',
    'payment processing solution',
    // Long-tail keywords
    'best POS system for small business',
    'free inventory tracking software',
    'multi-channel selling platform',
    'e-commerce management solution',
    'retail business software Egypt',
    'Arabic POS system',
    // Industry keywords
    'SaaS business platform',
    'cloud-based POS',
    'omnichannel retail software',
  ],
  ar: [
    // Primary brand keywords
    'كاشفيو',
    'كاشفيو نقاط البيع',
    'كاشفيو لإدارة الأعمال',
    // High-intent transactional keywords
    'منصة إدارة الأعمال',
    'نظام نقاط بيع للتجزئة',
    'برنامج نقاط بيع مجاني',
    'برنامج إدارة المخزون',
    'نظام إدارة الطلبات',
    // Feature-specific keywords
    'برنامج إدارة متاجر متعددة',
    'لوحة تحليلات المبيعات',
    'إدارة علاقات العملاء',
    'برنامج كتالوج المنتجات',
    'حلول معالجة المدفوعات',
    // Long-tail keywords
    'أفضل نظام نقاط بيع للشركات الصغيرة',
    'برنامج تتبع المخزون مجاني',
    'منصة البيع متعدد القنوات',
    'حل إدارة التجارة الإلكترونية',
    'برنامج أعمال التجزئة مصر',
    'نظام نقاط بيع بالعربية',
    // Industry keywords
    'منصة SaaS للأعمال',
    'نقاط بيع سحابية',
    'برنامج تجزئة متعدد القنوات',
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
  facebook:{
    appId: social.facebook.appId,
    url:social.facebook.url
  },
  // Note: OG images are auto-generated by opengraph-image.tsx (1200x630)
  // These fallback images are used when the dynamic generation is not available
  images: [
    {
      url: `${urls.site}/assets/og-default.png`,
      width: 1200,
      height: 630,
      alt: `${brand.name} - ${brand.tagline}`,
      type: 'image/png',
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
  // Note: Twitter images are auto-generated by twitter-image.tsx (1200x600)
  // These fallback images are used when dynamic generation is not available
  images: [
    {
      url: `${urls.site}/assets/og-default.png`,
      width: 1200,
      height: 630,
      alt: `${brand.name} - ${brand.tagline}`,
    },
  ],
};

// ============================================================================
// SCHEMA.ORG TEMPLATES
// ============================================================================

export const schemaTemplates = {
  /**
   * Organization schema - Enhanced for brand recognition (2026 SEO)
   * Use on homepage - This is the PRIMARY brand signal for Google
   */
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Corporation'],
    '@id': `${urls.site}/#organization`,
    name: brand.name,
    legalName: brand.legalName,
    alternateName: brand.alternateName,
    url: urls.site,
    logo: {
      '@type': 'ImageObject',
      '@id': `${urls.site}/#logo`,
      url: `${urls.site}/assets/logo-light.png`,
      contentUrl: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
      caption: `${brand.name} - ${brand.tagline}`,
    },
    image: [
      {
        '@type': 'ImageObject',
        url: `${urls.site}/assets/logo-light.png`,
        width: 512,
        height: 512,
      },
      {
        '@type': 'ImageObject',
        url: `${urls.site}/assets/logo-dark.png`,
        width: 512,
        height: 512,
      },
    ],
    description: brand.longDescription,
    slogan: brand.slogan,
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '30.0444',
      longitude: '31.2357',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Egypt',
      },
      {
        '@type': 'Country',
        name: 'Saudi Arabia',
      },
      {
        '@type': 'Country',
        name: 'United Arab Emirates',
      },
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: '25.0',
          longitude: '45.0',
        },
        geoRadius: '5000000',
        description: 'Middle East and North Africa Region',
      },
    ],
    sameAs: [
      social.twitter.url,
      social.facebook.url,
      social.linkedin.url,
      social.instagram.url,
      social.youtube.url,
    ],
    foundingDate: brand.founded,
    foundingLocation: {
      '@type': 'Place',
      name: 'Cairo, Egypt',
    },
    knowsAbout: brand.expertise,
    naics: brand.naicsCode,
    isicV4: brand.isicCode,
    brand: {
      '@type': 'Brand',
      '@id': `${urls.site}/#brand`,
      name: brand.name,
      slogan: brand.slogan,
      logo: `${urls.site}/assets/logo-light.png`,
      description: brand.shortDescription,
    },
    makesOffer: {
      '@id': `${urls.site}/#software`,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contact.phone,
        contactType: 'customer service',
        email: contact.email,
        availableLanguage: ['English', 'Arabic'],
        areaServed: ['EG', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: contact.email,
        url: `${urls.site}/contact`,
        availableLanguage: ['English', 'Arabic'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: contact.email,
        url: `${urls.site}/contact`,
        availableLanguage: ['English', 'Arabic'],
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${brand.name} Plans`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${brand.name} Starter`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${brand.name} Professional`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${brand.name} Enterprise`,
          },
        },
      ],
    },
  }),

  /**
   * Brand schema - Critical for Google Knowledge Panel
   */
  brand: () => ({
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${urls.site}/#brand`,
    name: brand.name,
    alternateName: brand.alternateName,
    slogan: brand.slogan,
    description: brand.shortDescription,
    logo: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    image: `${urls.site}/assets/logo-light.png`,
    url: urls.site,
    sameAs: [
      social.twitter.url,
      social.facebook.url,
      social.linkedin.url,
      social.instagram.url,
    ].filter(Boolean),
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
        name: 'Ahmed Sabry Abd El-Fatah',
      },
      reviewBody: 'Excellent business management platform that has transformed our retail operations.',
      datePublished: '2024-08-15',
    },
  }),

  /**
   * Website schema - Enhanced with search action for sitelinks searchbox
   * Critical for Google to show the search box in search results
   */
  website: (locale: Locale) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${urls.site}/#website`,
    name: brand.name,
    alternateName: brand.alternateName,
    url: urls.site,
    description: brand.longDescription,
    inLanguage: locale === 'ar' ? ['ar-EG', 'en-US'] : ['en-US', 'ar-EG'],
    publisher: {
      '@id': `${urls.site}/#organization`,
    },
    copyrightHolder: {
      '@id': `${urls.site}/#organization`,
    },
    copyrightYear: brand.founded,
    creator: {
      '@id': `${urls.site}/#organization`,
    },
    about: {
      '@id': `${urls.site}/#software`,
    },
    mainEntity: {
      '@id': `${urls.site}/#software`,
    },
    potentialAction: [
      {
        '@type': 'RegisterAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${urls.site}/register`,
        },
        name: 'Sign up for Cashvio',
      },
    ],
  }),

  /**
   * SoftwareApplication schema - Comprehensive for Google software recognition
   * This is critical for appearing in software-related searches
   */
  softwareApplication: () => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${urls.site}/#software`,
    name: brand.name,
    alternateName: brand.alternateName,
    description: brand.longDescription,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Point of Sale and Business Management Software',
    operatingSystem: 'Any (Web-based), iOS, Android',
    availableOnDevice: ['Desktop', 'Mobile', 'Tablet'],
    browserRequirements: 'Requires JavaScript. Works best with Chrome, Firefox, Safari, Edge.',
    softwareRequirements: 'Modern web browser with JavaScript enabled',
    memoryRequirements: '4 GB RAM recommended',
    storageRequirements: 'No local storage required (cloud-based)',
    permissions: 'Internet access required',
    releaseNotes: `${urls.site}/docs/changelog`,
    softwareHelp: {
      '@type': 'CreativeWork',
      name: `${brand.name} Documentation`,
      url: `${urls.site}/docs`,
    },
    installUrl: `${urls.site}/register`,
    downloadUrl: `${urls.site}/register`,
    url: urls.site,
    sameAs: [
      social.twitter.url,
      social.facebook.url,
      social.linkedin.url,
      social.instagram.url,
      social.youtube.url,
    ].filter(Boolean),
    image: [
      {
        '@type': 'ImageObject',
        url: `${urls.site}/assets/logo-light.png`,
        width: 512,
        height: 512,
        caption: `${brand.name} Logo`,
      },
      {
        '@type': 'ImageObject',
        url: `${urls.site}/assets/portal2.png`,
        width: 1200,
        height: 800,
        caption: `${brand.name} Dashboard Screenshot`,
      },
    ],
    screenshot: [
      {
        '@type': 'ImageObject',
        url: `${urls.site}/assets/portal2.png`,
        caption: 'Cashvio Dashboard - Analytics View',
      },
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '199',
      offerCount: 3,
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      eligibleRegion: [
        { '@type': 'Country', name: 'Egypt' },
        { '@type': 'Country', name: 'Saudi Arabia' },
        { '@type': 'Country', name: 'United Arab Emirates' },
      ],
      seller: {
        '@id': `${urls.site}/#organization`,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Ahmed Mohamed',
        },
        reviewBody: 'Excellent platform for managing our retail business across multiple locations.',
        datePublished: '2024-06-15',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Sarah Johnson',
        },
        reviewBody: 'The inventory management and analytics features have transformed how we operate.',
        datePublished: '2024-08-20',
      },
    ],
    featureList: [
      'Real-time Point of Sale (POS)',
      'Multi-location Inventory Management',
      'Automated Order Processing',
      'Customer Relationship Management (CRM)',
      'Business Analytics & Reporting',
      'Multi-Store Operations',
      'Payment Processing Integration',
      'E-commerce & Marketplace Integration',
      'Employee & Shift Management',
      'Purchase Order Management',
      'Returns & Refunds Processing',
      'Multi-language Support (Arabic & English)',
      'Mobile POS App',
      'Real-time Sync Across Devices',
    ],
    softwareVersion: '2.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: ['en', 'ar'],
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    provider: {
      '@id': `${urls.site}/#organization`,
    },
    author: {
      '@id': `${urls.site}/#organization`,
    },
    creator: {
      '@id': `${urls.site}/#organization`,
    },
    publisher: {
      '@id': `${urls.site}/#organization`,
    },
    brand: {
      '@id': `${urls.site}/#brand`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${urls.site}/#webpage`,
    },
  }),

  /**
   * Service schema - For SaaS service description
   * Helps Google understand this is a subscription service
   */
  service: () => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${urls.site}/#service`,
    serviceType: 'Software as a Service (SaaS)',
    name: `${brand.name} Business Management Platform`,
    alternateName: `${brand.name} SaaS`,
    description: brand.longDescription,
    provider: {
      '@id': `${urls.site}/#organization`,
    },
    brand: {
      '@id': `${urls.site}/#brand`,
    },
    areaServed: [
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Kuwait' },
      { '@type': 'Country', name: 'Qatar' },
      { '@type': 'Country', name: 'Bahrain' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: urls.site,
      serviceSmsNumber: contact.phone,
      availableLanguage: ['English', 'Arabic'],
    },
    termsOfService: `${urls.site}/terms`,
    category: 'Business Software',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cashvio Pricing Plans',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Starter Plan',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cashvio Starter',
                description: 'Perfect for small businesses getting started',
              },
              price: '0',
              priceCurrency: 'USD',
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Professional Plan',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cashvio Professional',
                description: 'For growing businesses with multiple needs',
              },
              price: '49',
              priceCurrency: 'USD',
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Enterprise Plan',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cashvio Enterprise',
                description: 'Full-featured solution for large operations',
              },
              price: '199',
              priceCurrency: 'USD',
            },
          ],
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
    },
  }),

  /**
   * HowTo schema - For getting started guide
   * Helps with featured snippets for "how to" searches
   */
  howTo: (locale: Locale) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${urls.site}/#howto`,
    name: locale === 'ar' ? 'كيفية البدء مع كاشفيو' : 'How to Get Started with Cashvio',
    description: locale === 'ar' 
      ? 'دليل سريع للبدء في استخدام منصة كاشفيو لإدارة أعمالك'
      : 'Quick guide to start using Cashvio platform for your business',
    image: `${urls.site}/assets/logo-light.png`,
    totalTime: 'PT5M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: locale === 'ar' ? 'إنشاء حساب' : 'Create Account',
        text: locale === 'ar' 
          ? 'سجل مجاناً باستخدام بريدك الإلكتروني ورقم الهاتف'
          : 'Sign up for free using your email and phone number',
        url: `${urls.site}/register`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: locale === 'ar' ? 'إضافة منتجاتك' : 'Add Your Products',
        text: locale === 'ar'
          ? 'أضف منتجاتك وحدد الأسعار والمخزون'
          : 'Add your products with prices and inventory levels',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: locale === 'ar' ? 'ابدأ البيع' : 'Start Selling',
        text: locale === 'ar'
          ? 'ابدأ في بيع منتجاتك عبر نقاط البيع أو المتجر الإلكتروني'
          : 'Start selling through POS or your online store',
      },
    ],
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
   * BreadcrumbList schema - with locale support
   * Note: @id is derived from the last item's URL (current page) for proper linking with WebPage schema
   */
  breadcrumb: (items: Array<{ name: string; nameAr?: string; url: string }>, locale: Locale = 'en') => {
    // Get the current page URL from the last breadcrumb item
    const currentPageUrl = items.length > 0 ? items[items.length - 1].url : urls.site;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${currentPageUrl}#breadcrumb`,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: locale === 'ar' && item.nameAr ? item.nameAr : item.name,
        item: item.url,
      })),
    };
  },

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
// LOCALIZED BREADCRUMB ITEMS
// ============================================================================

export const breadcrumbNames: Record<string, { en: string; ar: string }> = {
  home: { en: 'Home', ar: 'الرئيسية' },
  features: { en: 'Features', ar: 'المميزات' },
  pricing: { en: 'Pricing', ar: 'الأسعار' },
  contact: { en: 'Contact', ar: 'تواصل معنا' },
  register: { en: 'Register', ar: 'التسجيل' },
  docs: { en: 'Documentation', ar: 'التوثيق' },
  privacy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  terms: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
};

/**
 * Get localized breadcrumb name
 */
export function getBreadcrumbName(key: string, locale: Locale): string {
  const names = breadcrumbNames[key];
  return names ? names[locale] : key;
}

// ============================================================================
// ADDITIONAL SCHEMA FUNCTIONS (Outside schemaTemplates to avoid circular refs)
// ============================================================================

/**
 * Speakable Schema - Optimizes content for voice search and screen readers
 * Critical for Google Assistant, Alexa, and accessibility
 */
export function getSpeakableSchema(params: {
  locale: Locale;
  path: string;
  headline: string;
  summary: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${urls.site}${params.path}#speakable`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['article', 'h1', 'h2', '.hero-content', '.feature-description'],
    },
    headline: params.headline,
    description: params.summary,
    inLanguage: params.locale === 'ar' ? 'ar-EG' : 'en-US',
  };
}

/**
 * Complete Graph schema - Links all entities together
 * USE THIS ON HOMEPAGE - It tells Google how everything connects
 */
export function getCompleteGraphSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      schemaTemplates.organization(),
      schemaTemplates.brand(),
      schemaTemplates.website(locale),
      schemaTemplates.softwareApplication(),
      schemaTemplates.service(),
    ],
  };
}

/**
 * ProductGroup schema - For pricing page
 * Enhanced with all required fields for Google Merchant Center and Product Snippets
 */
export function getProductGroupSchema(plans: PublicPlan[] = []) {
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    '@id': `${urls.site}/pricing#productgroup`,
    name: `${brand.name} Subscription Plans`,
    description: 'Choose the perfect plan for your business needs',
    url: `${urls.site}/pricing`,
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    brand: {
      '@type': 'Brand',
      '@id': `${urls.site}/#brand`,
      name: brand.name,
      logo: `${urls.site}/assets/logo-light.png`,
    },
    hasVariant: plans.map(plan => {
      const planSlug = plan.enName.toLowerCase().replace(/ /g, '-');
      return {
        '@type': 'Product',
        '@id': `${urls.site}/pricing#${planSlug}`,
        name: `${brand.name} ${plan.enName}`,
        description: plan.detailsEn?.join('. ') || `${brand.name} ${plan.enName} - Business management subscription plan`,
        url: `${urls.site}/pricing`,
        image: {
          '@type': 'ImageObject',
          url: `${urls.site}/assets/logo-light.png`,
          width: 512,
          height: 512,
        },
        brand: {
          '@type': 'Brand',
          name: brand.name,
          logo: `${urls.site}/assets/logo-light.png`,
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
          reviewBody: `${plan.enName} plan provides excellent value for business management.`,
          datePublished: '2024-06-15',
        },
        offers: {
          '@type': 'Offer',
          url: `${urls.site}/pricing`,
          price: plan.price,
          priceCurrency: 'EGP',
          availability: 'https://schema.org/InStock',
          priceValidUntil: priceValidUntil,
          seller: {
            '@type': 'Organization',
            name: brand.name,
            url: urls.site,
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'EGP',
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
      };
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * SiteNavigationElement schema - Helps Google understand site structure
 */
export function getSiteNavigationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    '@id': `${urls.site}/#navigation`,
    name: 'Main Navigation',
    hasPart: [
      {
        '@type': 'SiteNavigationElement',
        name: 'Features',
        url: `${urls.site}/features`,
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Pricing',
        url: `${urls.site}/pricing`,
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Documentation',
        url: `${urls.site}/docs`,
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Contact',
        url: `${urls.site}/contact`,
      },
    ],
  };
}

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
 * Note: Open Graph uses underscores (en_US), while HTML lang uses dashes (en-US)
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

