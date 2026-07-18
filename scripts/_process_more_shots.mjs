import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const RAW = path.join(process.env.TEMP, 'cashvio-shots', 'raw');
const OUT = path.resolve('public/assets');
const DESKTOP = [
  'inventory',
  'products',
  'coupons',
  'returns',
  'purchase-orders',
  'stores',
  'users',
  'reports-profit',
];
const MOBILE = ['mobile-inventory', 'mobile-orders'];
const VARIANTS = ['en-light', 'en-dark', 'ar-light', 'ar-dark'];

fs.mkdirSync(OUT, { recursive: true });

for (const key of DESKTOP) {
  for (const v of VARIANTS) {
    const src = path.join(RAW, `${key}-${v}.png`);
    if (!fs.existsSync(src)) {
      console.log('missing', src);
      continue;
    }
    const dst = path.join(OUT, `${key}-${v}.png`);
    await sharp(src).png({ compressionLevel: 9, effort: 10 }).toFile(dst);
    console.log('desktop', path.basename(dst));
  }
}

for (const key of MOBILE) {
  for (const v of VARIANTS) {
    const src = path.join(RAW, `${key}-${v}.png`);
    if (!fs.existsSync(src)) {
      console.log('missing', src);
      continue;
    }
    const dst = path.join(OUT, `${key}-${v}.png`);
    await sharp(src).png({ compressionLevel: 9, effort: 10 }).toFile(dst);
    console.log('mobile', path.basename(dst));
  }
}

console.log('PROCESS MORE DONE');
