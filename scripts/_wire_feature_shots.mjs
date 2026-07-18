import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src/app/[locale]/features');

/** @type {Array<{ file: string; base: string; mobile?: boolean; ns: string }>} */
const PAGES = [
  { file: 'order-management/page.tsx', base: '/assets/orders', ns: 'orderManagement' },
  { file: 'inventory-management/page.tsx', base: '/assets/inventory', ns: 'inventoryManagement' },
  { file: 'free-pos/page.tsx', base: '/assets/pos', mobile: true, ns: 'freePos' },
  { file: 'arabic-pos/page.tsx', base: '/assets/pos', mobile: true, ns: 'arabicPos' },
  { file: 'sales-analytics/page.tsx', base: '/assets/reports-profit', ns: 'salesAnalytics' },
  { file: 'customer-management/page.tsx', base: '/assets/customers', ns: 'customerManagement' },
  { file: 'coupons-and-discounts/page.tsx', base: '/assets/coupons', ns: 'couponsAndDiscounts' },
  { file: 'returns-and-refunds/page.tsx', base: '/assets/returns', ns: 'returnsAndRefunds' },
  { file: 'purchase-orders/page.tsx', base: '/assets/purchase-orders', ns: 'purchaseOrders' },
  { file: 'multi-store-management/page.tsx', base: '/assets/stores', ns: 'multiStoreManagement' },
  { file: 'team-management/page.tsx', base: '/assets/users', ns: 'teamManagement' },
  { file: 'omnichannel-retail/page.tsx', base: '/assets/orders', ns: 'omnichannelRetail' },
  { file: 'free-online-store/page.tsx', base: '/assets/products', ns: 'freeOnlineStore' },
  { file: 'page.tsx', base: '/assets/dashboard', ns: 'features' },
];

function ensureImport(src) {
  if (src.includes('FeatureScreenshot')) return src;
  if (src.includes("from '@/components/marketing'")) {
    return src.replace(
      /import \{\n([\s\S]*?)\} from '@\/components\/marketing';/,
      (m, body) => {
        if (body.includes('FeatureScreenshot')) return m;
        const trimmed = body.replace(/\s+$/, '');
        const needsComma = /,\s*$/.test(trimmed.trimEnd()) ? '' : ',';
        return `import {\n${trimmed}${needsComma}\n  FeatureScreenshot,\n} from '@/components/marketing';`;
      },
    );
  }
  // Fallback: add a dedicated import
  return src.replace(
    /(import .+?;\n)/,
    `$1import { FeatureScreenshot } from '@/components/marketing';\n`,
  );
}

function insertShot(src, base, mobile) {
  if (src.includes('<FeatureScreenshot')) return src;
  const shot = `
      <FeatureScreenshot
        base="${base}"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}${mobile ? '\n        variant="mobile"' : ''}
      />
`;
  // Insert after the first self-closing LedgerHero
  const re = /(<LedgerHero[\s\S]*?\/>)/;
  if (!re.test(src)) throw new Error('LedgerHero not found');
  return src.replace(re, `$1\n${shot}`);
}

for (const page of PAGES) {
  const full = path.join(ROOT, page.file);
  let src = fs.readFileSync(full, 'utf8');
  src = ensureImport(src);
  src = insertShot(src, page.base, !!page.mobile);
  fs.writeFileSync(full, src);
  console.log('wired', page.file, '→', page.base);
}
console.log('WIRE DONE');
