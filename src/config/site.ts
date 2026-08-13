import { env } from './env';

// Keywords as a mutable array for Next.js metadata compatibility
const keywords: string[] = [
  'free POS',
  'free cashier',
  'free online store',
  'كاشير مجاني',
  'متجر إلكتروني مجاني',
  'business platform',
  'commerce management',
  'inventory management',
  'sales management',
  'order management',
  'multi-channel selling',
  'cashvio',
  'منصة الأعمال',
  'إدارة التجارة',
  'إدارة المخزون',
];

export const siteConfig = {
  name: env.site.name,
  url: env.site.url,
  description: env.site.description,
  keywords,

  contact: {
    email: env.contact.email,
    phone: env.contact.phone,
    whatsapp: env.contact.whatsapp,
    address: {
      street: env.contact.address || '123 Business Avenue',
      city: 'Cairo',
      country: 'Egypt',
    },
  },

  social: {
    twitter: env.social.twitter,
    twitterUrl: env.social.twitter,
    facebook: env.social.facebook || 'https://www.facebook.com/cashvio',
    facebookAppId: env.social.facebookAppId,
    linkedin: env.social.linkedin || 'https://linkedin.com/company/cashvio',
    instagram: env.social.instagram || 'https://instagram.com/cashvioapp',
    youtube: env.social.youtube,
  },

  links: {
    portal: env.portal.url,
    portalLogin: env.portal.loginUrl,
    portalDashboard: env.portal.dashboardUrl,
    docs: '/docs',
    support: 'https://support.cash-vio.com',
  },

  api: {
    baseUrl: env.api.baseUrl,
    url: env.api.url,
  },

  features: {
    blog: false,
    newsletter: true,
    analytics: true,
    registration: env.features.enableRegistration,
    contactForm: env.features.enableContactForm,
  },
};

export type SiteConfig = typeof siteConfig;

