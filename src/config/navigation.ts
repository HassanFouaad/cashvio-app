import { env } from './env';

export interface NavItem {
  key: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  key: string;
  items: NavItem[];
}

export const mainNavigation: NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'features', href: '/features' },
  { key: 'pricing', href: '/pricing' },
  { key: 'docs', href: '/docs' },
  { key: 'contact', href: '/contact' },
];

export const footerNavigation: FooterSection[] = [
  {
    key: 'product',
    items: [
      { key: 'features', href: '/features' },
      { key: 'pricing', href: '/pricing' },
      { key: 'docs', href: '/docs' },
      { key: 'changelog', href: '/docs' },
    ],
  },
  {
    key: 'company',
    items: [
      { key: 'about', href: '/about' },
      { key: 'contact', href: '/contact' },
      { key: 'careers', href: '/contact' },
    ],
  },
  {
    key: 'legal',
    items: [
      { key: 'privacy', href: '/privacy' },
      { key: 'terms', href: '/terms' },
    ],
  },
];

export const ctaLinks = {
  getStarted: '/register', // Internal registration page
  login: env.portal.loginUrl, // External portal login
  portal: env.portal.url, // Portal base URL
  dashboard: env.portal.dashboardUrl, // Portal dashboard
  demo: '/contact?type=demo',
} as const;

