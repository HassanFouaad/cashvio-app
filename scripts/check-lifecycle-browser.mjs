import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
assert.equal(Number(process.versions.node.split('.')[0]), 24, 'Use the component Node 24 runtime.');
assert(existsSync(join(root, '.next/BUILD_ID')), 'Build the application before browser acceptance.');
const screenshotDirectory = process.env.ARTIFACT_SCREENSHOT_DIR;
if (screenshotDirectory) assert(statSync(screenshotDirectory).isDirectory(), 'Use an existing screenshot directory.');

const port = await new Promise((resolvePort, reject) => {
  const listener = createServer();
  listener.once('error', reject);
  listener.listen(0, '127.0.0.1', () => {
    const selected = listener.address().port;
    listener.close(() => resolvePort(selected));
  });
});
const base = `http://localhost:${port}`;
// Keep the server/client hostname identical: locale rewrites must remain
// internal rather than proxying between localhost and 127.0.0.1 origins.
const server = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', 'localhost', '--port', String(port)], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_API_BASE_URL: 'http://127.0.0.1:9' },
});
let browser;
let blockedRequests = 0;
const hydrationErrors = [];
let startupOutput = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', (chunk) => { startupOutput = (startupOutput + chunk.toString()).slice(-4000); });
try {
  const deadline = Date.now() + 45000;
  let ready = false;
  let lastStatus = null;
  while (Date.now() < deadline && server.exitCode === null) {
    try {
      const response = await fetch(`${base}/`, { redirect: 'manual', signal: AbortSignal.timeout(2000) });
      lastStatus = response.status;
      if (response.status >= 200 && response.status < 400) { ready = true; break; }
    } catch { /* Wait for the owned production server, without external requests. */ }
    await new Promise((done) => setTimeout(done, 250));
  }
  assert(ready, `Owned production server did not become ready (exit ${server.exitCode}, HTTP ${lastStatus}).`);
  browser = await chromium.launch({ headless: true });
  const routes = JSON.parse(readFileSync(join(root, '.next/routes-manifest.json'), 'utf8'));
  assert(!routes.redirects.some((route) => ['/en', '/en/:path*'].includes(route.source)), 'Compiled config must not redirect internal English rewrites.');
  for (const path of ['/', '/ar', '/features/free-pos']) {
    const response = await fetch(`${base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 200, `Documented page ${path} must serve without a redirect loop`);
  }
  for (const [path, target, status] of [
    ['/en', '/', 301], ['/en/features/free-pos', '/features/free-pos', 301],
    ['/compare/foundation-fixture', '/', 308], ['/ar/compare/foundation-fixture', '/ar', 308],
  ]) {
    const response = await fetch(`${base}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, status, `Preserve the canonical redirect for ${path}`);
    assert.equal(new URL(response.headers.get('location'), base).pathname, target);
  }
  console.log('PASS locale routes: English/Arabic pages, direct /en canonicalization and comparison-route protections.');
  for (const locale of ['en', 'ar']) {
    const context = await browser.newContext({ viewport: { width: 1365, height: 900 }, colorScheme: 'light', serviceWorkers: 'block' });
    await context.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      if (url.port === String(port) && ['localhost', '127.0.0.1'].includes(url.hostname)) await route.continue();
      else { blockedRequests += 1; await route.abort(); }
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => hydrationErrors.push(error.message));
    page.on('console', (message) => { if (/hydration|didn't match|server rendered HTML|script tag while rendering/i.test(message.text())) hydrationErrors.push(message.text()); });
    await page.routeWebSocket('**/*', (socket) => socket.close());
    const labels = locale === 'en'
      ? { dark: 'Switch to dark mode', light: 'Switch to light mode', login: 'Login', dashboard: 'Go to Dashboard', open: 'Open menu', close: 'Close menu', chat: 'Open support chat' }
      : { dark: 'التبديل إلى الوضع الداكن', light: 'التبديل إلى الوضع الفاتح', login: 'تسجيل الدخول', dashboard: 'الذهاب للوحة التحكم', open: 'افتح القائمة', close: 'أغلق القائمة', chat: 'افتح محادثة الدعم' };
    const url = `${base}${locale === 'en' ? '/' : '/ar'}`;
    await context.addCookies([{ name: 'cv_theme', value: locale === 'en' ? 'dark' : 'light', url: base }]);
    await page.goto(url, { waitUntil: 'load' });
    await page.locator('header').getByRole('button', { name: labels.login, exact: true }).waitFor();
    await page.locator('header').getByRole('button', { name: new RegExp(`^(?:${labels.dark}|${labels.light})$`) }).waitFor();
    const initiallyDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    await page.locator('header').getByRole('button', { name: initiallyDark ? labels.light : labels.dark, exact: true }).click();
    await page.locator('header').getByRole('button', { name: initiallyDark ? labels.dark : labels.light, exact: true }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), !initiallyDark);
    assert.equal(await page.evaluate((theme) => document.cookie.includes(`cv_theme=${theme}`), initiallyDark ? 'light' : 'dark'), true);
    await context.addCookies([{ name: 'cv_auth_status', value: 'true', url: base }]);
    await page.reload({ waitUntil: 'load' });
    await page.locator('header').getByRole('button', { name: labels.dashboard, exact: true }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('header').getByRole('button', { name: labels.open, exact: true }).click();
    await page.getByRole('button', { name: labels.close, exact: true }).last().click();
    await page.locator('header').getByRole('button', { name: labels.open, exact: true }).waitFor();
    const chat = page.getByRole('button', { name: labels.chat, exact: true });
    assert.equal(await chat.isDisabled(), true);
    await page.evaluate(() => {
      window.__foundationChat = [];
      window.$chatwoot = { toggle: (state) => window.__foundationChat.push(state) };
      window.dispatchEvent(new Event('chatwoot:ready'));
    });
    await page.waitForFunction((label) => !Array.from(document.querySelectorAll('button')).find((button) => button.getAttribute('aria-label') === label)?.disabled, labels.chat);
    await chat.click();
    assert.deepEqual(await page.evaluate(() => window.__foundationChat), ['open']);
    if (screenshotDirectory) await page.screenshot({ path: join(screenshotDirectory, `cashvio-foundations-marketing-${locale}.png`), fullPage: false });
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction((label) => Array.from(document.querySelectorAll('button')).some((button) => button.getAttribute('aria-label') === label && button.disabled), labels.chat);
    const targetLocale = locale === 'en' ? 'ar' : 'en';
    const suffix = '?preview=locale#home-hero-title';
    const targetUrl = base + (targetLocale === 'ar' ? '/ar' : '/') + suffix;
    await page.goto(url + suffix, { waitUntil: 'load' });
    if (locale === 'ar') {
      await page.getByRole('button', { name: labels.open, exact: true }).click();
    } else {
      await page.setViewportSize({ width: 1365, height: 900 });
    }
    await Promise.all([
      page.waitForURL(targetUrl, { waitUntil: 'load' }),
      page.getByRole('button', { name: targetLocale === 'ar' ? 'العربية' : 'English', exact: true }).click(),
    ]);
    assert.equal(await page.locator('html').getAttribute('lang'), targetLocale);
    assert.equal(await page.locator('html').getAttribute('dir'), targetLocale === 'ar' ? 'rtl' : 'ltr');
    assert.equal(await page.locator('html').evaluate((html) => html.classList.contains('dark')), !initiallyDark);
    const preferences = await context.cookies(base);
    assert.equal(preferences.find((cookie) => cookie.name === 'cv_language')?.value, targetLocale);
    assert.equal(preferences.find((cookie) => cookie.name === 'cv_theme')?.value, initiallyDark ? 'light' : 'dark');
    await context.close();
    console.log(`PASS ${locale}: hydration, public auth hint, theme preference, language switching, mobile drawer and delayed Chatwoot stub readiness/toggle.`);
  }
  assert.deepEqual(hydrationErrors, [], 'Unexpected browser/hydration errors.');
  console.log(`Browser lifecycle PASS; ${blockedRequests} external-resource requests blocked. No live Chatwoot/auth provider or production data exercised.`);
} catch (error) {
  console.error(`${browser ? 'FAIL' : 'BLOCKED'} browser lifecycle: ${error.message}`);
  if (!browser) console.error(startupOutput.split(/\r?\n/).filter((line) => !/token|password|secret|api[_-]?key/i.test(line)).join('\n'));
  process.exitCode = browser ? 1 : 2;
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill();
}
