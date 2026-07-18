/**
 * Capture portal screenshots (desktop + mobile) into scripts/marketing-shots/raw.
 *
 * Usage:
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/capture.mjs
 *   node … capture.mjs desktop
 *   node … capture.mjs mobile
 *   node … capture.mjs pos          # desktop POS with cart items
 *   node … capture.mjs desktop orders
 */
import fs from 'node:fs';
import path from 'node:path';

import { chromium } from 'playwright';

import {
  CONSOLE_URL,
  getCredentials,
  HIDE_CSS,
  LOCALES,
  RAW_DIR,
  THEMES,
  sleep,
} from './lib/config.mjs';

fs.mkdirSync(RAW_DIR, { recursive: true });

const DESKTOP = [
  { key: 'dashboard', path: '/', period: 'month' },
  { key: 'orders', path: '/orders' },
  { key: 'analytics', path: '/reports/overview', period: 'month' },
  { key: 'customers', path: '/customers' },
  { key: 'inventory', path: '/inventory' },
  { key: 'products', path: '/catalogue/products' },
  { key: 'returns', path: '/returns' },
  { key: 'purchase-orders', path: '/purchase-orders' },
  { key: 'stores', path: '/stores' },
  { key: 'reports-profit', path: '/reports/profit', period: 'month' },
  { key: 'pos', path: '/pos-view/create-order', fillTicket: true },
];

const MOBILE = [
  { key: 'mobile-pos', path: '/pos-view/create-order' },
  { key: 'management', path: '/catalogue/products' },
  { key: 'mobile-inventory', path: '/inventory' },
  { key: 'mobile-orders', path: '/orders' },
];

async function makeContext(browser, { mobile }) {
  const creds = getCredentials();
  const ctx = await browser.newContext(
    mobile
      ? {
          viewport: { width: 402, height: 874 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        }
      : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  );
  const res = await ctx.request.post(`${CONSOLE_URL}/api/v1/auth/login`, {
    data: creds,
  });
  if (!res.ok()) throw new Error('login failed ' + res.status());
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem('sidebarOpen', 'true');
    } catch {
      /* private mode */
    }
  });
  return ctx;
}

async function applyPrefs(page, locale, theme) {
  await page.addInitScript(
    ({ locale, theme }) => {
      try {
        localStorage.setItem('theme', theme);
        localStorage.setItem('language', locale);
        localStorage.setItem('i18nextLng', locale);
        document.cookie = `cv_theme=${theme}; path=/`;
        document.cookie = `cv_language=${locale}; path=/`;
      } catch {
        /* private mode */
      }
    },
    { locale, theme },
  );
}

async function gotoScreen(page, screen, locale, theme) {
  const sep = screen.path.includes('?') ? '&' : '?';
  const url = `${CONSOLE_URL}${screen.path}${sep}theme=${theme}&lang=${locale}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
  await page.addStyleTag({ content: HIDE_CSS }).catch(() => {});
  await sleep(1600);
}

async function selectMonth(page) {
  for (const label of ['This Month', 'هذا الشهر', 'Month', 'شهر']) {
    const btn = page.getByRole('button', { name: label, exact: false });
    if (await btn.count().catch(() => 0)) {
      await btn.first().click().catch(() => {});
      await sleep(1200);
      return;
    }
  }
}

async function fillPosTicket(page) {
  const cards = page.locator('[class*="MuiCard"], button, [role="button"]').filter({
    hasText: /EGP|ج\.م/,
  });
  const count = await cards.count().catch(() => 0);
  for (let i = 0; i < Math.min(count, 4); i++) {
    await cards.nth(i).click({ timeout: 3000 }).catch(() => {});
    await sleep(400);
  }
  await sleep(800);
}

async function capture(page, screen, locale, theme) {
  await gotoScreen(page, screen, locale, theme);
  if (screen.period === 'month') await selectMonth(page);
  if (screen.fillTicket) await fillPosTicket(page);
  await sleep(900);
  const name = `${screen.key}-${locale}-${theme}.png`;
  await page.screenshot({ path: path.join(RAW_DIR, name), fullPage: false });
  console.log('  saved', name);
}

async function runDesktop(browser, filter) {
  const ctx = await makeContext(browser, { mobile: false });
  let screens = DESKTOP;
  if (filter) screens = screens.filter((s) => s.key === filter);
  for (const locale of LOCALES) {
    for (const theme of THEMES) {
      const page = await ctx.newPage();
      await applyPrefs(page, locale, theme);
      for (const screen of screens) {
        console.log(`[desktop] ${screen.key} ${locale}/${theme}`);
        await capture(page, screen, locale, theme);
      }
      await page.close();
    }
  }
  await ctx.close();
}

async function runMobile(browser, filter) {
  const ctx = await makeContext(browser, { mobile: true });
  let screens = MOBILE;
  if (filter) screens = screens.filter((s) => s.key === filter);
  for (const locale of LOCALES) {
    for (const theme of THEMES) {
      const page = await ctx.newPage();
      await applyPrefs(page, locale, theme);
      for (const screen of screens) {
        console.log(`[mobile] ${screen.key} ${locale}/${theme}`);
        await capture(page, screen, locale, theme);
      }
      await page.close();
    }
  }
  await ctx.close();
}

async function run() {
  const mode = process.argv[2] || 'all';
  const filter = process.argv[3];
  const browser = await chromium.launch();

  if (mode === 'pos') {
    await runDesktop(browser, 'pos');
  } else if (mode === 'desktop') {
    await runDesktop(browser, filter);
  } else if (mode === 'mobile') {
    await runMobile(browser, filter);
  } else if (mode === 'all') {
    await runDesktop(browser, filter);
    await runMobile(browser, filter);
  } else {
    // Treat first arg as a desktop screen key filter
    await runDesktop(browser, mode);
  }

  await browser.close();
  console.log('CAPTURE DONE →', RAW_DIR);
}

run().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
