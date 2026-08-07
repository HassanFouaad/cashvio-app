/**
 * Delete BE onboarding sample products + sample category so the cloned
 * catalogue is the only catalog on the tenant.
 *
 * Matches TenantOnboardingService seeds:
 *   - products: Sample Product 1/2, منتج تجريبي ١/٢, SKU SAMPLE-*
 *   - category: Sample Category / القسم التجريبي
 *
 *   node tools/09-cleanup-samples.mjs --run <id>
 *
 * Run after tenant create (and after onboarding wait) and before seed.
 */
import { api, loadSession, listAll, unwrap } from '../lib/api.mjs';
import { sleep } from '../lib/config.mjs';
import {
  isSampleCategoryName,
  isSampleProductName,
  isSampleSku,
} from '../lib/sample-onboarding.mjs';
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
    throw new Error('Missing session.tenant.json — run 02-create-tenant first');
  }
  loadSession(tenantSession);

  console.log('[09] removing onboarding sample products / categories');

  const products = await listAll('/v1/tenant/products', 'products');
  const deletedProducts = [];
  const failedProducts = [];

  for (const p of products) {
    let isSample = isSampleProductName(p.name);
    let detail = null;

    if (!isSample) {
      try {
        detail = unwrap(
          await api('GET', `/v1/tenant/products/${p.id}`),
          `product ${p.id}`,
        );
        isSample = (detail.variants || []).some((v) => isSampleSku(v.sku));
        if (!isSample) isSample = isSampleProductName(detail.name);
      } catch (e) {
        failedProducts.push({ id: p.id, name: p.name, error: e.message });
        continue;
      }
    }

    if (!isSample) continue;

    try {
      unwrap(
        await api('DELETE', `/v1/tenant/products/${p.id}`),
        `delete product ${p.name}`,
      );
      deletedProducts.push({ id: p.id, name: p.name });
      console.log(`  - product ${p.name}`);
      await sleep(40);
    } catch (e) {
      failedProducts.push({ id: p.id, name: p.name, error: e.message });
      console.warn(`  ! product ${p.name}: ${e.message}`);
    }
  }

  const categories = await listAll('/v1/tenant/categories', 'categories');
  const deletedCategories = [];
  const failedCategories = [];

  for (const c of categories) {
    if (!isSampleCategoryName(c.name)) continue;
    try {
      unwrap(
        await api('DELETE', `/v1/tenant/categories/${c.id}`),
        `delete category ${c.name}`,
      );
      deletedCategories.push({ id: c.id, name: c.name });
      console.log(`  - category ${c.name}`);
      await sleep(40);
    } catch (e) {
      failedCategories.push({ id: c.id, name: c.name, error: e.message });
      console.warn(`  ! category ${c.name}: ${e.message}`);
    }
  }

  writeJson(runPath(runId, 'cleanup-samples.json'), {
    cleanedAt: new Date().toISOString(),
    deletedProducts,
    deletedCategories,
    failedProducts,
    failedCategories,
  });

  console.log(
    `[09] removed ${deletedProducts.length} sample product(s), ${deletedCategories.length} sample categor(ies)`,
  );
}

main().catch((err) => {
  console.error('[09] FAILED:', err.message || err);
  process.exit(1);
});
