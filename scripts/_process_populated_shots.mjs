import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const RAW = path.join(process.env.TEMP, 'cashvio-shots', 'raw');
const OUT = path.resolve('public/assets');
const KEYS = [
  'dashboard',
  'orders',
  'customers',
  'inventory',
  'products',
  'returns',
  'purchase-orders',
  'stores',
  'reports-profit',
  'analytics',
  'pos',
  'management',
  'mobile-inventory',
  'mobile-orders',
];
const VARIANTS = ['en-light', 'en-dark', 'ar-light', 'ar-dark'];

fs.mkdirSync(OUT, { recursive: true });

let done = 0;
let missing = 0;
for (const key of KEYS) {
  for (const v of VARIANTS) {
    const src = path.join(RAW, `${key}-${v}.png`);
    if (!fs.existsSync(src)) {
      console.log('missing', `${key}-${v}.png`);
      missing++;
      continue;
    }
    const dst = path.join(OUT, `${key}-${v}.png`);
    await sharp(src).png({ compressionLevel: 9, effort: 10 }).toFile(dst);
    done++;
    console.log('ok', path.basename(dst));
  }
}

// Remap gated screens to closest real screens so feature pages never show dashboard-as-coupons
const aliases = {
  coupons: 'reports-profit', // discount rate lives in profit analytics
  users: 'stores', // team module gated on starter; stores is closest populated ops screen
};
for (const [alias, source] of Object.entries(aliases)) {
  for (const v of VARIANTS) {
    const src = path.join(OUT, `${source}-${v}.png`);
    const dst = path.join(OUT, `${alias}-${v}.png`);
    if (!fs.existsSync(src)) {
      console.log('alias skip', alias, source);
      continue;
    }
    fs.copyFileSync(src, dst);
    console.log('alias', `${alias}-${v}.png`, '<-', `${source}-${v}.png`);
  }
}

// Refresh OG from dashboard dark
const ogSrc = path.join(OUT, 'dashboard-en-dark.png');
if (fs.existsSync(ogSrc)) {
  await sharp(ogSrc)
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'og-default.png'));
  console.log('og-default.png refreshed');
}

console.log(`PROCESS DONE: ${done} written, ${missing} missing`);
