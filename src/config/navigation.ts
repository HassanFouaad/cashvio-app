import { env } from './env';

export interface NavItem {
  key: string;
  href: string;
  external?: boolean;
  /** Child pages shown in a dropdown (desktop) / collapsible group (mobile) */
  children?: NavItem[];
}

export interface FooterSection {
  key: string;
  items: NavItem[];
}

export const mainNavigation: NavItem[] = [
  { key: 'home', href: '/' },
  {
    key: 'features',
    href: '/features',
    children: [
      { key: 'freePos', href: '/features/free-pos' },
      { key: 'freeOnlineStore', href: '/features/free-online-store' },
      { key: 'arabicPos', href: '/features/arabic-pos' },
      { key: 'omnichannelRetail', href: '/features/omnichannel-retail' },
      { key: 'inventoryManagement', href: '/features/inventory-management' },
      { key: 'orderManagement', href: '/features/order-management' },
      { key: 'customerManagement', href: '/features/customer-management' },
      { key: 'salesAnalytics', href: '/features/sales-analytics' },
      { key: 'couponsAndDiscounts', href: '/features/coupons-and-discounts' },
      { key: 'purchaseOrders', href: '/features/purchase-orders' },
      { key: 'returnsAndRefunds', href: '/features/returns-and-refunds' },
      { key: 'multiStoreManagement', href: '/features/multi-store-management' },
      { key: 'teamManagement', href: '/features/team-management' },
    ],
  },
  {
    key: 'industries',
    href: '/industries',
    children: [
      { key: 'industryCafe', href: '/industries/cafe' },
      { key: 'industryClothing', href: '/industries/clothing' },
      { key: 'industryMinimarket', href: '/industries/minimarket' },
      { key: 'industryRestaurant', href: '/industries/restaurant' },
      { key: 'industrySupermarket', href: '/industries/supermarket' },
      { key: 'industryPharmacy', href: '/industries/pharmacy' },
      { key: 'industryBakery', href: '/industries/bakery' },
      { key: 'industryMobileShop', href: '/industries/mobile-shop' },
      { key: 'industryBeauty', href: '/industries/beauty' },
    ],
  },
  { key: 'pricing', href: '/pricing' },
  {
    key: 'tools',
    href: '/tools',
    children: [
      { key: 'barcodeGenerator', href: '/tools/barcode-generator' },
      { key: 'qrCodeGenerator', href: '/tools/qr-code-generator' },
      { key: 'marginCalculator', href: '/tools/profit-margin-calculator' },
      { key: 'vatCalculator', href: '/tools/vat-calculator' },
      { key: 'invoiceGenerator', href: '/tools/invoice-generator' },
    ],
  },
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
    ],
  },
  {
    key: 'solutions',
    items: [
      { key: 'freePos', href: '/features/free-pos' },
      { key: 'freePosEgypt', href: '/free-pos-egypt' },
      { key: 'freeOnlineStore', href: '/features/free-online-store' },
      { key: 'arabicPos', href: '/features/arabic-pos' },
      { key: 'omnichannelRetail', href: '/features/omnichannel-retail' },
      { key: 'inventoryManagement', href: '/features/inventory-management' },
      { key: 'couponsAndDiscounts', href: '/features/coupons-and-discounts' },
      { key: 'orderManagement', href: '/features/order-management' },
      { key: 'customerManagement', href: '/features/customer-management' },
      { key: 'salesAnalytics', href: '/features/sales-analytics' },
      { key: 'purchaseOrders', href: '/features/purchase-orders' },
      { key: 'returnsAndRefunds', href: '/features/returns-and-refunds' },
      { key: 'multiStoreManagement', href: '/features/multi-store-management' },
      { key: 'teamManagement', href: '/features/team-management' },
    ],
  },
  {
    key: 'industries',
    items: [
      { key: 'industries', href: '/industries' },
      { key: 'industryCafe', href: '/industries/cafe' },
      { key: 'industryClothing', href: '/industries/clothing' },
      { key: 'industryMinimarket', href: '/industries/minimarket' },
      { key: 'industryRestaurant', href: '/industries/restaurant' },
      { key: 'industrySupermarket', href: '/industries/supermarket' },
      { key: 'industryPharmacy', href: '/industries/pharmacy' },
      { key: 'industryBakery', href: '/industries/bakery' },
      { key: 'industryMobileShop', href: '/industries/mobile-shop' },
      { key: 'industryBeauty', href: '/industries/beauty' },
    ],
  },
  {
    key: 'resources',
    items: [
      { key: 'tools', href: '/tools' },
      { key: 'barcodeGenerator', href: '/tools/barcode-generator' },
      { key: 'qrCodeGenerator', href: '/tools/qr-code-generator' },
      { key: 'marginCalculator', href: '/tools/profit-margin-calculator' },
      { key: 'vatCalculator', href: '/tools/vat-calculator' },
      { key: 'invoiceGenerator', href: '/tools/invoice-generator' },
      { key: 'freePosEgypt', href: '/free-pos-egypt' },
      { key: 'changelog', href: '/docs/changelog' },
    ],
  },
  {
    key: 'company',
    items: [
      { key: 'about', href: '/contact' },
      { key: 'contact', href: '/contact' },
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
  // Demo requests go through the contact form (DEMO inquiry type) —
  // keep in sync with urls.demo in config/seo.ts
  demo: '/contact',
} as const;

