/**
 * Attach category images + storefront hero/header images.
 *
 * Priority:
 *   1) Scraped categoryDetails[].imageUrl / headerImages from catalog.json
 *   2) Curated Unsplash picks by category keyword + industry
 *      (same approach as scripts/marketing-shots)
 *
 *   node tools/08-sync-visuals.mjs --run <id>
 */
import fs from 'node:fs';
import path from 'node:path';

import { api, loadSession, listAll, putBinary, unwrap } from '../lib/api.mjs';
import { sleep } from '../lib/config.mjs';
import {
  downloadWithFallback,
  ensureDir,
  fileSlug,
  findLocalImage,
  mimeForPath,
} from '../lib/download-image.mjs';
import {
  DEFAULT_CATEGORY_IMAGE,
  pickCategoryImageUrl,
  pickHeroImageUrls,
} from '../lib/image-sources.mjs';
import {
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
  writeJson,
} from '../lib/run-io.mjs';

async function presignAndUpload(filePath, fileName, fileModule) {
  const bytes = fs.readFileSync(filePath);
  const mime = mimeForPath(filePath);
  const pres = unwrap(
    await api('POST', '/v1/files/presigned-upload-url', {
      fileName,
      fileMimeType: mime,
      fileType: 'image',
      fileModule,
    }),
    'presign',
  );
  await putBinary(pres.uploadUrl, bytes, mime);
  return pres.fileKey;
}

function scrapedCategoryImage(catalog, categoryName) {
  const details = catalog.categoryDetails || [];
  const hit = details.find(
    (c) =>
      String(c.name || '').toLowerCase() ===
      String(categoryName || '').toLowerCase(),
  );
  return hit?.imageUrl || null;
}

async function syncCategoryImages(runId, catalog, force) {
  const imgDir = runPath(runId, 'category-images');
  ensureDir(imgDir);

  const categories = await listAll('/v1/tenant/categories', 'categories');
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  const results = [];

  for (const category of categories) {
    const name = category.name;
    if (category.imageUrl && !force) {
      skipped += 1;
      results.push({ name, status: 'skipped-has-image' });
      continue;
    }

    const scraped = scrapedCategoryImage(catalog, name);
    const picked = pickCategoryImageUrl(name, catalog.industry);
    const primary = scraped || picked.url;
    const fallback = picked.url || DEFAULT_CATEGORY_IMAGE;
    const reason = scraped ? 'scraped' : picked.reason;

    const slug = fileSlug(name).slice(0, 48);
    const base = path.join(imgDir, `cat-${slug}`);
    let local = findLocalImage(imgDir, `cat-${slug}`);

    try {
      if (!local || force) {
        const meta = await downloadWithFallback(primary, fallback, base);
        local = meta.path;
      }
      const fileKey = await presignAndUpload(
        local,
        `category-${slug}${path.extname(local)}`,
        'categories',
      );
      unwrap(
        await api('PATCH', `/v1/tenant/categories/${category.id}`, {
          imageUrl: fileKey,
        }),
        `category image ${name}`,
      );
      uploaded += 1;
      results.push({ name, status: 'uploaded', reason, fileKey });
      console.log(`  + category ${name} (${reason})`);
      await sleep(60);
    } catch (e) {
      failed += 1;
      results.push({ name, status: 'failed', error: e.message });
      console.warn(`  ! category ${name}: ${e.message}`);
    }
  }

  return { uploaded, skipped, failed, results };
}

async function syncHeroImages(runId, catalog, tenant, theme, force) {
  const imgDir = runPath(runId, 'hero-images');
  ensureDir(imgDir);

  let storeFrontId = theme?.storeFrontId;
  if (!storeFrontId) {
    const sf = unwrap(
      await api('GET', `/v1/tenant/stores/${tenant.storeId}/store-front`),
      'get store-front',
    );
    storeFrontId = sf?.id;
  }
  if (!storeFrontId) {
    throw new Error('Could not resolve storeFrontId for hero images');
  }

  const existing = unwrap(
    await api('GET', `/v1/tenant/stores/${tenant.storeId}/store-front`),
    'store-front detail',
  );
  const existingHeroes = existing?.heroImages || [];
  if (existingHeroes.length > 0 && !force) {
    console.log(
      `  skip heroes — store already has ${existingHeroes.length} hero image(s)`,
    );
    return {
      storeFrontId,
      uploaded: 0,
      skipped: existingHeroes.length,
      failed: 0,
      results: [{ status: 'skipped-has-heroes' }],
    };
  }

  if (force && existingHeroes.length > 0) {
    for (const hero of existingHeroes) {
      try {
        unwrap(
          await api(
            'DELETE',
            `/v1/tenant/store-fronts/${storeFrontId}/hero-images/${hero.id}`,
          ),
          `delete hero ${hero.id}`,
        );
        console.log(`  - removed old hero ${hero.id}`);
        await sleep(40);
      } catch (e) {
        console.warn(`  ! could not delete hero ${hero.id}: ${e.message}`);
      }
    }
  }

  const { urls, reasons } = pickHeroImageUrls({
    headerImages: catalog.headerImages,
    industry: catalog.industry,
    themeKey: theme?.key,
    max: 3,
  });

  let uploaded = 0;
  let failed = 0;
  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const reason = reasons[i] || 'unknown';
    const base = path.join(imgDir, `hero-${String(i + 1).padStart(2, '0')}`);
    try {
      let local = findLocalImage(
        imgDir,
        `hero-${String(i + 1).padStart(2, '0')}`,
      );
      if (!local || force) {
        const meta = await downloadWithFallback(
          url,
          pickHeroImageUrls({ industry: catalog.industry, max: 1 }).urls[0],
          base,
        );
        local = meta.path;
      }
      const fileKey = await presignAndUpload(
        local,
        `hero-${i + 1}${path.extname(local)}`,
        'store-fronts/hero-images',
      );
      unwrap(
        await api('POST', `/v1/tenant/store-fronts/${storeFrontId}/hero-images`, {
          storeFrontId,
          imageUrl: fileKey,
          displayOrder: i,
        }),
        `hero ${i + 1}`,
      );
      uploaded += 1;
      results.push({ index: i, status: 'uploaded', reason, fileKey });
      console.log(`  + hero ${i + 1} (${reason})`);
      await sleep(80);
    } catch (e) {
      failed += 1;
      results.push({ index: i, status: 'failed', error: e.message });
      console.warn(`  ! hero ${i + 1}: ${e.message}`);
    }
  }

  return { storeFrontId, uploaded, skipped: 0, failed, results };
}

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
  const theme = readJson(runPath(runId, 'theme.json'), {});
  if (!tenant?.storeId) throw new Error('Missing tenant.json');

  const force = Boolean(flags.force);
  console.log('[08] syncing category images');
  const categories = await syncCategoryImages(runId, catalog, force);

  console.log('[08] syncing hero / header images');
  const heroes = await syncHeroImages(runId, catalog, tenant, theme, force);

  writeJson(runPath(runId, 'visuals.json'), {
    syncedAt: new Date().toISOString(),
    categories,
    heroes,
  });

  const credentials = readJson(runPath(runId, 'credentials.json'), {});
  credentials.visuals = {
    categoriesUploaded: categories.uploaded,
    heroesUploaded: heroes.uploaded,
  };
  writeJson(runPath(runId, 'credentials.json'), credentials);

  console.log(
    `[08] done — categories +${categories.uploaded}, heroes +${heroes.uploaded}`,
  );
}

main().catch((err) => {
  console.error('[08] FAILED:', err.message || err);
  process.exit(1);
});
