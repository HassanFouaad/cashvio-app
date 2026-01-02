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
  { key: 'pricing', href: '/pricing' },
  { key: 'docs', href: '/docs' },
  { key: 'contact', href: '/contact' },
];

export const footerNavigation: FooterSection[] = [
  {
    key: 'product',
    items: [
      { key: 'features', href: '/pricing#features' },
      { key: 'pricing', href: '/pricing' },
      { key: 'docs', href: '/docs' },
      { key: 'changelog', href: '/docs/changelog' },
    ],
  },
  {
    key: 'company',
    items: [
      { key: 'about', href: '/about' },
      { key: 'contact', href: '/contact' },
      { key: 'careers', href: '/careers' },
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
  getStarted: 'https://portal.cashvio.com/register',
  login: 'https://portal.cashvio.com/login',
  demo: '/contact?type=demo',
} as const;

