export const siteConfig = {
  name: 'Cashvio',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cashvio.com',
  description: 'Streamline your business operations with Cashvio - The all-in-one POS and inventory management solution',

  keywords: [
    'POS',
    'point of sale',
    'inventory management',
    'business software',
    'retail management',
    'cashvio',
    'نقاط البيع',
    'إدارة المخزون',
  ],

  contact: {
    email: 'support@cashvio.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Business Avenue',
      city: 'San Francisco, CA 94102',
      country: 'United States',
    },
  },

  social: {
    twitter: '@cashvio',
    facebook: 'https://facebook.com/cashvio',
    linkedin: 'https://linkedin.com/company/cashvio',
    instagram: 'https://instagram.com/cashvio',
  },

  links: {
    portal: 'https://portal.cashvio.com',
    docs: '/docs',
    support: 'https://support.cashvio.com',
  },

  features: {
    blog: false,
    newsletter: true,
    analytics: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;

