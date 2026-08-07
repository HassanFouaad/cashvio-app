/**
 * Seed categories + products + stock from catalog.json into the new tenant.
 * Reuses the same API patterns as scripts/marketing-shots/seed.mjs.
 *
 *   node tools/05-seed-catalog.mjs --run <id>
 */
import { api, loadSession, unwrap, listAll } from '../lib/api.mjs';
import {
  DEFAULT_COST_RATIO,
  DEFAULT_STOCK_QTY,
  PRODUCT_NAME_MAX,
  sleep,
} from '../lib/config.mjs';
import {
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
  writeJson,
} from '../lib/run-io.mjs';

function skuPrefix(storeName) {
  const letters = String(storeName || 'CLN')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 3);
  return letters || 'CLN';
}

async function ensureCategories(names) {
  const existing = await listAll('/v1/tenant/categories', 'categories');
  const byName = new Map(existing.map((c) => [c.name, c.id]));
  const ids = {};
  for (const name of names) {
    if (byName.has(name)) {
      ids[name] = byName.get(name);
      continue;
    }
    const created = unwrap(
      await api('POST', '/v1/tenant/categories', { name: name.slice(0, 100) }),
      `category ${name}`,
    );
    ids[name] = created.id;
    byName.set(name, created.id);
    console.log('  + category', name);
    await sleep(40);
  }
  return ids;
}

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

  const tenant = readJson(runPath(runId, 'tenant.json'));
  if (!tenant?.storeId) throw new Error('Missing tenant.json storeId');

  const catalog = readJson(runPath(runId, 'catalog.json'));
  if (!catalog?.products?.length) {
    throw new Error('catalog.json empty — scrape/review products first');
  }

  const categoryNames = [
    ...new Set(
      (catalog.categories?.length
        ? catalog.categories
        : catalog.products.map((p) => p.category || 'General')
      ).filter(Boolean),
    ),
  ];
  console.log(`[05] seeding ${categoryNames.length} categories`);
  const catIds = await ensureCategories(categoryNames);

  // Existing SKUs for idempotency
  const existingProducts = await listAll('/v1/tenant/products', 'products');
  const bySku = new Map();
  for (const p of existingProducts) {
    const full = unwrap(
      await api('GET', `/v1/tenant/products/${p.id}`),
      `product ${p.id}`,
    );
    for (const v of full.variants || []) {
      bySku.set(v.sku, {
        productId: full.id,
        variantId: v.id,
        name: full.name,
      });
    }
    await sleep(20);
  }

  const prefix = skuPrefix(catalog.storeName || tenant.storeName);
  const seeded = [];
  const stockItems = [];

  for (let i = 0; i < catalog.products.length; i++) {
    const p = catalog.products[i];
    const sku =
      (p.sourceSku && String(p.sourceSku).slice(0, 40)) ||
      `${prefix}-${String(i + 1).padStart(3, '0')}`;
    const name = String(p.name).trim().slice(0, PRODUCT_NAME_MAX);
    const sell = Number(p.price);
    if (!name || !Number.isFinite(sell) || sell < 0) {
      console.warn(`  skip invalid product #${i + 1}`);
      continue;
    }
    const cost =
      p.cost != null && Number.isFinite(Number(p.cost))
        ? Number(p.cost)
        : Math.round(sell * DEFAULT_COST_RATIO * 100) / 100;
    const category = p.category || 'General';
    const categoryId = catIds[category] || catIds.General || Object.values(catIds)[0];

    if (bySku.has(sku)) {
      const existing = bySku.get(sku);
      seeded.push({
        ...existing,
        sku,
        name,
        sell,
        cost,
        localImage: p.localImage || null,
      });
      stockItems.push({
        variantId: existing.variantId,
        quantity: p.stock ?? DEFAULT_STOCK_QTY,
        reason: 'Clone-store seed restock',
        unitCost: cost,
      });
      continue;
    }

    const payload = {
      name,
      categoryId,
      status: 'active',
      inventoryTrackable: true,
      availableOnStoreFront: true,
      variants: [
        {
          sku,
          baseSellingPrice: sell,
          basePurchasePrice: cost,
        },
      ],
    };
    if (p.description) payload.description = p.description.slice(0, 5000);

    const created = unwrap(
      await api('POST', '/v1/tenant/products', payload),
      `product ${name}`,
    );
    const full = unwrap(
      await api('GET', `/v1/tenant/products/${created.id}`),
      'product detail',
    );
    const variantId = full.variants?.[0]?.id;
    if (!variantId) throw new Error(`No variant for product ${created.id}`);

    seeded.push({
      productId: created.id,
      variantId,
      sku,
      name,
      sell,
      cost,
      localImage: p.localImage || null,
    });
    stockItems.push({
      variantId,
      quantity: p.stock ?? DEFAULT_STOCK_QTY,
      reason: 'Clone-store seed restock',
      unitCost: cost,
    });
    console.log(`  + ${sku} ${name} @ ${sell}`);
    await sleep(50);
  }

  // Stock in chunks of 40
  for (let i = 0; i < stockItems.length; i += 40) {
    const chunk = stockItems.slice(i, i + 40);
    unwrap(
      await api('POST', '/v1/tenant/inventory/adjust-quantity/bulk', {
        storeId: tenant.storeId,
        items: chunk,
      }),
      'stock bulk',
    );
  }
  console.log(`[05] stocked ${stockItems.length} variants`);

  writeJson(runPath(runId, 'seeded-products.json'), {
    seededAt: new Date().toISOString(),
    count: seeded.length,
    products: seeded,
  });
  console.log(`[05] seeded ${seeded.length} products`);
}

main().catch((err) => {
  console.error('[05] FAILED:', err.message || err);
  process.exit(1);
});
