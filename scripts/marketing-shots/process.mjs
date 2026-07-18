/**
 * Compress raw captures into public/assets (locale + theme variants).
 *
 *   node scripts/marketing-shots/process.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

import { ASSETS_DIR, RAW_DIR } from './lib/config.mjs';

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
  'mobile-pos',
  'management',
  'mobile-inventory',
  'mobile-orders',
];

/** Legacy home-page key: mobile POS used to live under `pos` */
const ALIASES = {
  // Keep `pos` as desktop; home mobile showcase uses `mobile-pos`
};

const VARIANTS = ['en-light', 'en-dark', 'ar-light', 'ar-dark'];

fs.mkdirSync(ASSETS_DIR, { recursive: true });

let done = 0;
let missing = 0;

for (const key of KEYS) {
  for (const v of VARIANTS) {
    const src = path.join(RAW_DIR, `${key}-${v}.png`);
    if (!fs.existsSync(src)) {
      console.log('missing', `${key}-${v}.png`);
      missing++;
      continue;
    }
    const dst = path.join(ASSETS_DIR, `${key}-${v}.png`);
    await sharp(src).png({ compressionLevel: 9, effort: 10 }).toFile(dst);
    done++;
    console.log('ok', path.basename(dst));
  }
}

for (const [alias, source] of Object.entries(ALIASES)) {
  for (const v of VARIANTS) {
    const src = path.join(ASSETS_DIR, `${source}-${v}.png`);
    const dst = path.join(ASSETS_DIR, `${alias}-${v}.png`);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, dst);
    console.log('alias', `${alias}-${v}.png`, '<-', `${source}-${v}.png`);
  }
}

const ogSrc = path.join(ASSETS_DIR, 'dashboard-en-dark.png');
if (fs.existsSync(ogSrc)) {
  await sharp(ogSrc)
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .png({ compressionLevel: 9 })
    .toFile(path.join(ASSETS_DIR, 'og-default.png'));
  console.log('og-default.png refreshed');
}

console.log(`PROCESS DONE: ${done} written, ${missing} missing`);
console.log('raw:', RAW_DIR);
console.log('out:', ASSETS_DIR);
