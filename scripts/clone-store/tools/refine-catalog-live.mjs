/**
 * Apply catalog refinements to an already-seeded tenant:
 * - merge orphan English categories (e.g. Gallery) into the main category
 * - re-apply announcement / footer copy from catalog.json
 *
 *   node tools/refine-catalog-live.mjs --run <id>
 */
import { api, loadSession, listAll, unwrap } from '../lib/api.mjs';
import { sleep } from '../lib/config.mjs';
import {
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
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
  const catalog = readJson(runPath(runId, 'catalog.json'));
  if (!tenant?.storeId || !catalog) {
    throw new Error('Missing tenant.json or catalog.json');
  }

  const keepNames = new Set(
    (catalog.categories || []).map((n) => String(n).trim()),
  );
  const categories = await listAll('/v1/tenant/categories', 'categories');
  const byName = new Map(categories.map((c) => [c.name, c]));

  const primaryName = [...keepNames][0] || categories[0]?.name;
  const primary = byName.get(primaryName);
  if (!primary) {
    throw new Error(`Primary category not found: ${primaryName}`);
  }

  // Move products out of categories we plan to drop
  const products = await listAll('/v1/tenant/products', 'products');
  for (const p of products) {
    const detail = unwrap(
      await api('GET', `/v1/tenant/products/${p.id}`),
      `product ${p.id}`,
    );
    const catName = detail.category?.name || detail.categoryName;
    if (catName && keepNames.has(catName)) continue;
    if (detail.categoryId === primary.id) continue;

    unwrap(
      await api('PATCH', `/v1/tenant/products/${p.id}`, {
        categoryId: primary.id,
      }),
      `move product ${detail.name}`,
    );
    console.log(`  ~ moved ${detail.name} → ${primary.name}`);
    await sleep(40);
  }

  for (const c of categories) {
    if (keepNames.has(c.name)) continue;
    try {
      unwrap(
        await api('DELETE', `/v1/tenant/categories/${c.id}`),
        `delete category ${c.name}`,
      );
      console.log(`  - category ${c.name}`);
      await sleep(40);
    } catch (e) {
      console.warn(`  ! category ${c.name}: ${e.message}`);
    }
  }

  const name = catalog.storeName || tenant.storeName;
  const patch = {
    announcementTextEn:
      catalog.announcementEn || `Welcome to ${name}`,
    announcementTextAr:
      catalog.announcementAr || `أهلاً بك في ${name}`,
    footerTextEn: catalog.footerEn || `${name} · Powered by Cashvio`,
    footerTextAr: catalog.footerAr || `${name} · مدعوم من Cashvio`,
  };

  unwrap(
    await api('PATCH', `/v1/tenant/stores/${tenant.storeId}/store-front`, patch),
    'update storefront copy',
  );
  console.log('[refine] storefront copy updated');
  console.log('[refine] catalog structure cleaned');
}

main().catch((err) => {
  console.error('[refine] FAILED:', err.message || err);
  process.exit(1);
});
