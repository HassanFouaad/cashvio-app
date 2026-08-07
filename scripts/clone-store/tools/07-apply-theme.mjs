/**
 * Pick a storefront theme from catalog industry/look and PATCH the store-front.
 * Always prefers industry mapping; applies scraped brand primary as customTokens.
 *
 *   node tools/07-apply-theme.mjs --run <id> [--theme EDITORIAL]
 */
import { api, loadSession, unwrap } from '../lib/api.mjs';
import { pickTheme, THEMES } from '../lib/theme-map.mjs';
import {
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
  writeJson,
} from '../lib/run-io.mjs';

async function main() {
  const { flags } = parseArgs();
  const runId = resolveRunId(flags);
  if (!runId) throw new Error('Pass --run <id>');
  ensureRunDir(runId);

  const tenantSession = readJson(runPath(runId, 'session.tenant.json'));
  if (!tenantSession?.accessToken) {
    throw new Error('Missing session.tenant.json');
  }
  loadSession(tenantSession);

  const tenant = readJson(runPath(runId, 'tenant.json'));
  const catalog = readJson(runPath(runId, 'catalog.json'), {});
  if (!tenant?.storeId) throw new Error('Missing tenant.json');

  const forcedKey = (flags.theme || process.env.CLONE_THEME || '').toUpperCase();
  if (forcedKey && !THEMES[forcedKey]) {
    throw new Error(`Unknown theme key: ${forcedKey}`);
  }

  const selection = pickTheme({
    industry: flags.industry || process.env.CLONE_INDUSTRY || catalog.industry,
    storeName: catalog.storeName || tenant.storeName,
    notes: catalog.notes,
    brandColors: catalog.brandColors,
    forcedKey: forcedKey || undefined,
  });

  const name = catalog.storeName || tenant.storeName;
  selection.patch.announcementTextEn =
    catalog.announcementEn || `Welcome to ${name}`;
  selection.patch.announcementTextAr =
    catalog.announcementAr || `أهلاً بك في ${name}`;
  selection.patch.footerTextEn =
    catalog.footerEn || `${name} · Powered by Cashvio`;
  selection.patch.footerTextAr =
    catalog.footerAr || `${name} · مدعوم من Cashvio`;

  console.log(`[07] applying theme ${selection.key} (${selection.reason})`);
  if (selection.brandPrimary) {
    console.log(`[07] brand primary ${selection.brandPrimary}`);
  }

  unwrap(
    await api(
      'PATCH',
      `/v1/tenant/stores/${tenant.storeId}/store-front`,
      selection.patch,
    ),
    'apply theme',
  );

  // Re-fetch so we always persist a real storeFrontId for hero uploads
  const storeFront = unwrap(
    await api('GET', `/v1/tenant/stores/${tenant.storeId}/store-front`),
    'get store-front',
  );

  writeJson(runPath(runId, 'theme.json'), {
    appliedAt: new Date().toISOString(),
    key: selection.key,
    reason: selection.reason,
    brandPrimary: selection.brandPrimary || null,
    patch: selection.patch,
    storeFrontId: storeFront?.id || null,
  });

  const credentials = readJson(runPath(runId, 'credentials.json'), {});
  credentials.theme = selection.key;
  credentials.themeReason = selection.reason;
  if (selection.brandPrimary) {
    credentials.brandPrimary = selection.brandPrimary;
  }
  writeJson(runPath(runId, 'credentials.json'), credentials);

  console.log('[07] storefront theme applied');
}

main().catch((err) => {
  console.error('[07] FAILED:', err.message || err);
  process.exit(1);
});
