/**
 * Download product images from catalog.json into runs/<id>/images/.
 *
 *   node tools/04-download-images.mjs --run <id>
 */
import fs from 'node:fs';
import path from 'node:path';

import { sleep } from '../lib/config.mjs';
import {
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
  writeJson,
} from '../lib/run-io.mjs';

function fileSlug(value) {
  const slug = String(value)
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return slug || 'item';
}

async function downloadImage(url, destBase) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CashvioCloneStore/1.0 (+https://cash-vio.com)',
      Accept: 'image/*',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`not an image (${contentType})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`too small (${buf.length} bytes)`);
  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : contentType.includes('gif')
        ? 'gif'
        : 'jpg';
  const finalPath = `${destBase}.${ext}`;
  fs.writeFileSync(finalPath, buf);
  return {
    path: finalPath,
    mime: contentType.split(';')[0],
    ext,
    size: buf.length,
  };
}

async function main() {
  const { flags } = parseArgs();
  const runId = resolveRunId(flags);
  if (!runId) throw new Error('Pass --run <id>');
  ensureRunDir(runId);

  const catalog = readJson(runPath(runId, 'catalog.json'));
  if (!catalog?.products?.length) {
    throw new Error('catalog.json missing or empty — run 03-scrape-catalog first');
  }

  const imgDir = runPath(runId, 'images');
  const manifest = [];
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < catalog.products.length; i++) {
    const p = catalog.products[i];
    const index = String(i + 1).padStart(3, '0');
    const base = path.join(imgDir, `${index}-${fileSlug(p.name).slice(0, 40)}`);
    if (!p.imageUrl) {
      manifest.push({ index: i, name: p.name, localPath: null, error: 'no imageUrl' });
      continue;
    }
    try {
      const meta = await downloadImage(p.imageUrl, base);
      catalog.products[i].localImage = path.relative(runPath(runId), meta.path);
      manifest.push({
        index: i,
        name: p.name,
        localPath: catalog.products[i].localImage,
        mime: meta.mime,
        size: meta.size,
      });
      ok += 1;
      console.log(`  + ${index} ${p.name.slice(0, 40)}`);
    } catch (e) {
      fail += 1;
      catalog.products[i].localImage = null;
      manifest.push({
        index: i,
        name: p.name,
        localPath: null,
        error: e.message,
      });
      console.warn(`  ! ${index} ${e.message}`);
    }
    await sleep(80);
  }

  writeJson(runPath(runId, 'catalog.json'), catalog);
  writeJson(runPath(runId, 'images-manifest.json'), {
    downloadedAt: new Date().toISOString(),
    ok,
    fail,
    items: manifest,
  });
  console.log(`[04] images: ${ok} ok, ${fail} failed`);
}

main().catch((err) => {
  console.error('[04] FAILED:', err.message || err);
  process.exit(1);
});
