import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** …/scripts/marketing-shots */
export const SHOTS_ROOT = path.resolve(__dirname, '..');

/** my-app repo root */
export const REPO_ROOT = path.resolve(SHOTS_ROOT, '../..');

/** Raw Playwright PNGs before sharp processing */
export const RAW_DIR = path.join(SHOTS_ROOT, 'raw');

/** Final marketing assets served by Next */
export const ASSETS_DIR = path.join(REPO_ROOT, 'public/assets');

/** Optional product image sources for upload-images.mjs / sync-images.mjs */
export const PRODUCT_IMG_DIR = path.join(SHOTS_ROOT, 'product-images');

/** Category image cache for sync-images.mjs */
export const CATEGORY_IMG_DIR = path.join(SHOTS_ROOT, 'category-images');

export const CONSOLE_URL =
  process.env.CASHVIO_CONSOLE_URL || 'https://console.cash-vio.com';

export const API_URL =
  process.env.CASHVIO_API_URL || `${CONSOLE_URL.replace(/\/$/, '')}/api`;

export function getCredentials() {
  const username = process.env.CASHVIO_USERNAME;
  const password = process.env.CASHVIO_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'Missing CASHVIO_USERNAME / CASHVIO_PASSWORD. Copy scripts/marketing-shots/.env.example → .env.local and fill in, or export the vars.',
    );
  }
  return {
    username,
    password,
    audience: process.env.CASHVIO_AUDIENCE || 'TENANT',
  };
}

/** Default demo store — override with CASHVIO_STORE_ID */
export const STORE_ID =
  process.env.CASHVIO_STORE_ID || '019b9665-7666-7497-a2af-add011a6330a';

/** Sales channels on the demo tenant (override only if channels differ) */
export const CHANNELS = {
  Portal: '019c0a0c-a8ab-74b6-bd91-5d68a0971fdf',
  Web: '019c0a0c-a8c6-75bd-b372-9a70f482a78b',
  Facebook: '019c0a0c-a8e3-770f-a23a-227bcbe493be',
  Instagram: '019c0a0c-a900-75f4-b724-d4438d3bd2ea',
  Telegram: '019c0a0c-a90d-74e8-ad05-b1df9435f96c',
  TikTok: '019c0a0c-a91b-71a4-a23c-4faf0f6386d0',
  WhatsApp: '019c0a0c-a920-7608-859e-9c42ae54c656',
};

export const LOCALES = ['en', 'ar'];
export const THEMES = ['light', 'dark'];

export const HIDE_CSS = `
  .woot-widget-holder, .woot--bubble-holder, #cw-widget-holder, .woot-widget-bubble { display: none !important; }
  * { scrollbar-width: none !important; }
  *::-webkit-scrollbar { display: none !important; }
`;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
