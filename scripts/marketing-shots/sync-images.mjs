/**
 * Fetch copyright-free Unsplash images and attach them to CVX products + seed categories.
 *
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/sync-images.mjs
 *   node --env-file=… scripts/marketing-shots/sync-images.mjs products
 *   node --env-file=… scripts/marketing-shots/sync-images.mjs categories
 *   node --env-file=… scripts/marketing-shots/sync-images.mjs --force   # replace existing
 */
import fs from 'node:fs';
import path from 'node:path';

import { login, api, unwrap } from './lib/api.mjs';
import {
  PRODUCT_IMG_DIR,
  CATEGORY_IMG_DIR,
  sleep,
} from './lib/config.mjs';
import {
  PRODUCT_IMAGE_SOURCES,
  PRODUCT_IMAGE_FALLBACKS,
  CATEGORY_IMAGE_SOURCES,
  CATEGORY_IMAGE_FALLBACKS,
  DEFAULT_PRODUCT_IMAGE,
} from './lib/image-sources.mjs';

const force = process.argv.includes('--force');
const modeArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
const mode = modeArg || 'all';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Safe local filename fragment for SKUs / Arabic category names */
function fileSlug(value) {
  const slug = String(value)
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return slug || 'item';
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: {
      // Unsplash serves better when a UA is present
      'User-Agent': 'CashvioMarketingShots/1.0 (demo seed; +https://cash-vio.com)',
      Accept: 'image/*',
    },
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`download HTTP ${res.status} for ${url}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`not an image (${contentType}) for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) {
    throw new Error(`image too small (${buf.length} bytes) for ${url}`);
  }
  fs.writeFileSync(destPath, buf);
  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : 'jpg';
  return { bytes: buf, mime: contentType.split(';')[0], ext, size: buf.length };
}

async function downloadWithFallback(primaryUrl, fallbackUrl, destBase) {
  const tryUrls = [primaryUrl, fallbackUrl].filter(Boolean);
  let lastErr;
  for (const url of tryUrls) {
    try {
      // Write to .tmp then rename once we know extension
      const tmp = `${destBase}.tmp`;
      const meta = await downloadImage(url, tmp);
      const finalPath = `${destBase}.${meta.ext}`;
      if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
      fs.renameSync(tmp, finalPath);
      // Clean other extensions for same base
      for (const e of ['jpg', 'jpeg', 'png', 'webp']) {
        const p = `${destBase}.${e}`;
        if (p !== finalPath && fs.existsSync(p)) fs.unlinkSync(p);
      }
      return { path: finalPath, ...meta };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function presignAndUpload(filePath, fileName, fileModule) {
  const bytes = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === '.png'
      ? 'image/png'
      : ext === '.webp'
        ? 'image/webp'
        : 'image/jpeg';

  const presRes = await api('POST', '/v1/files/presigned-upload-url', {
    fileName,
    fileMimeType: mime,
    fileType: 'image',
    fileModule,
  });
  if (!presRes.ok) {
    throw new Error(
      `presign fail ${presRes.status}: ${JSON.stringify(presRes.body).slice(0, 200)}`,
    );
  }
  const { uploadUrl, fileKey } = presRes.body.data;

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mime },
    body: bytes,
  });
  if (!put.ok) {
    throw new Error(`S3 PUT fail ${put.status}`);
  }
  return fileKey;
}

function findLocalImage(dir, baseName) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const p = path.join(dir, `${baseName}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function loadProductsBySku() {
  const listed = unwrap(
    await api('GET', '/v1/tenant/products?page=1&limit=100'),
    'prods',
  );
  const products = Array.isArray(listed) ? listed : listed?.data || [];
  const bySku = new Map();
  for (const p of products) {
    const full = unwrap(
      await api('GET', `/v1/tenant/products/${p.id}`),
      `product ${p.id}`,
    );
    for (const v of full.variants || []) {
      if (v.sku) bySku.set(v.sku, full);
    }
    await sleep(15);
  }
  return bySku;
}

async function syncProducts() {
  ensureDir(PRODUCT_IMG_DIR);
  const bySku = await loadProductsBySku();
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  // Every product in the tenant: mapped Unsplash URL, or default apparel photo
  const seenProductIds = new Set();
  const targets = [];
  for (const [sku, product] of bySku) {
    if (seenProductIds.has(product.id)) continue;
    seenProductIds.add(product.id);
    targets.push({ sku, product });
  }
  targets.sort((a, b) => String(a.sku).localeCompare(String(b.sku)));

  for (const { sku, product } of targets) {
    const hasImage = product.images && product.images.length > 0;
    if (hasImage && !force) {
      skipped++;
      continue;
    }

    const slug = fileSlug(sku);
    const base = path.join(PRODUCT_IMG_DIR, `prod-${slug}`);
    let local = findLocalImage(PRODUCT_IMG_DIR, `prod-${slug}`);
    // Legacy filenames used raw SKU (prod-CVX-015.jpg)
    if (!local) local = findLocalImage(PRODUCT_IMG_DIR, `prod-${sku}`);
    if (!local) {
      try {
        const meta = await downloadWithFallback(
          PRODUCT_IMAGE_SOURCES[sku] || DEFAULT_PRODUCT_IMAGE,
          PRODUCT_IMAGE_FALLBACKS[sku] || DEFAULT_PRODUCT_IMAGE,
          base,
        );
        local = meta.path;
        console.log(`  downloaded ${sku} (${meta.size} bytes)`);
      } catch (e) {
        console.log(`  FAIL download ${sku}:`, e.message);
        failed++;
        continue;
      }
    }

    try {
      const safeName = `${slug}${path.extname(local)}`;
      const fileKey = await presignAndUpload(local, safeName, 'products');
      const attach = await api(
        'POST',
        `/v1/tenant/products/${product.id}/images`,
        {
          imageUrl: fileKey,
          altText: product.name,
          isPrimary: true,
          sortOrder: 0,
        },
      );
      if (!attach.ok) {
        console.log(
          `  FAIL attach ${sku}:`,
          attach.status,
          JSON.stringify(attach.body).slice(0, 180),
        );
        failed++;
        continue;
      }
      uploaded++;
      console.log(`  + ${sku} → ${product.name}`);
    } catch (e) {
      console.log(`  FAIL upload ${sku}:`, e.message);
      failed++;
    }
    await sleep(40);
  }

  console.log(
    `PRODUCTS done: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`,
  );
}

async function syncCategories() {
  ensureDir(CATEGORY_IMG_DIR);
  const listed = unwrap(
    await api('GET', '/v1/tenant/categories?page=1&limit=100'),
    'cats',
  );
  const list = Array.isArray(listed) ? listed : listed?.data || [];

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const category of list) {
    const name = category.name;
    const source =
      CATEGORY_IMAGE_SOURCES[name] ||
      // Clothes / Clothing / ملابس already mapped; anything else gets apparel rack
      DEFAULT_PRODUCT_IMAGE;
    const fallback = CATEGORY_IMAGE_FALLBACKS[name] || DEFAULT_PRODUCT_IMAGE;

    if (category.imageUrl && !force) {
      console.log(`  skip category ${name} — already has image`);
      skipped++;
      continue;
    }

    const slug = fileSlug(name);
    const base = path.join(CATEGORY_IMG_DIR, `cat-${slug}`);
    let local = findLocalImage(CATEGORY_IMG_DIR, `cat-${slug}`);
    if (!local) {
      try {
        const meta = await downloadWithFallback(source, fallback, base);
        local = meta.path;
        console.log(`  downloaded category ${name} (${meta.size} bytes)`);
      } catch (e) {
        console.log(`  FAIL download category ${name}:`, e.message);
        failed++;
        continue;
      }
    }

    try {
      const fileKey = await presignAndUpload(
        local,
        `category-${slug}${path.extname(local)}`,
        'categories',
      );
      const patch = await api('PATCH', `/v1/tenant/categories/${category.id}`, {
        imageUrl: fileKey,
      });
      if (!patch.ok) {
        console.log(
          `  FAIL patch category ${name}:`,
          patch.status,
          JSON.stringify(patch.body).slice(0, 180),
        );
        failed++;
        continue;
      }
      uploaded++;
      console.log(`  + category ${name}`);
    } catch (e) {
      console.log(`  FAIL upload category ${name}:`, e.message);
      failed++;
    }
    await sleep(40);
  }

  console.log(
    `CATEGORIES done: ${uploaded} uploaded, ${skipped} skipped, ${failed} failed`,
  );
}
async function main() {
  await login();
  console.log('logged in.\n');

  if (mode === 'products' || mode === 'all') {
    console.log('syncing product images...');
    await syncProducts();
  }
  if (mode === 'categories' || mode === 'all') {
    console.log('\nsyncing category images...');
    await syncCategories();
  }

  console.log('\nIMAGE SYNC DONE');
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
