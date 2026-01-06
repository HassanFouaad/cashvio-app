import { env } from './env';

// Keywords as a mutable array for Next.js metadata compatibility
const keywords: string[] = [
  'POS',
  'point of sale',
  'inventory management',
  'business software',
  'retail management',
  'cashvio',
  'نقاط البيع',
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
    address: {
      street: env.contact.address || '123 Business Avenue',
      city: 'Cairo',
      country: 'Egypt',
    },
  },

  social: {
    twitter: env.social.twitter || '@cashvio',
    facebook: env.social.facebook || 'https://facebook.com/cashvio',
    linkedin: env.social.linkedin || 'https://linkedin.com/company/cashvio',
    instagram: env.social.instagram || 'https://instagram.com/cashvioapp',
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

