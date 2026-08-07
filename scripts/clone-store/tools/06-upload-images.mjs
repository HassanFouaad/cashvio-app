/**
 * Upload local product images (from 04) to S3 and attach to seeded products.
 * Same presign flow as scripts/marketing-shots/sync-images.mjs.
 *
 *   node tools/06-upload-images.mjs --run <id>
 */
import fs from 'node:fs';
import path from 'node:path';

import { api, loadSession, putBinary, unwrap } from '../lib/api.mjs';
import { sleep } from '../lib/config.mjs';
import {
  ensureRunDir,
  parseArgs,
  readJson,
  resolveRunId,
  runPath,
  writeJson,
} from '../lib/run-io.mjs';

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'image/jpeg';
}

async function presignAndUpload(filePath, fileName) {
  const bytes = fs.readFileSync(filePath);
  const mime = mimeFor(filePath);
  const pres = unwrap(
    await api('POST', '/v1/files/presigned-upload-url', {
      fileName,
      fileMimeType: mime,
      fileType: 'image',
      fileModule: 'products',
    }),
    'presign',
  );
  await putBinary(pres.uploadUrl, bytes, mime);
  return pres.fileKey;
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

  const seeded = readJson(runPath(runId, 'seeded-products.json'));
  if (!seeded?.products?.length) {
    throw new Error('Missing seeded-products.json — run 05-seed-catalog first');
  }

  const force = Boolean(flags.force);
  let attached = 0;
  let skipped = 0;
  let failed = 0;
  const results = [];

  for (const p of seeded.products) {
    if (!p.localImage) {
      skipped += 1;
      continue;
    }
    const abs = path.isAbsolute(p.localImage)
      ? p.localImage
      : runPath(runId, p.localImage);
    if (!fs.existsSync(abs)) {
      failed += 1;
      results.push({ sku: p.sku, error: `missing file ${abs}` });
      continue;
    }

    try {
      const detail = unwrap(
        await api('GET', `/v1/tenant/products/${p.productId}`),
        'product',
      );
      const hasPrimary = (detail.images || []).some((img) => img.isPrimary);
      if (hasPrimary && !force) {
        skipped += 1;
        continue;
      }

      const fileKey = await presignAndUpload(
        abs,
        path.basename(abs),
      );
      unwrap(
        await api('POST', `/v1/tenant/products/${p.productId}/images`, {
          imageUrl: fileKey,
          altText: p.name,
          isPrimary: true,
          sortOrder: 0,
        }),
        'attach image',
      );
      attached += 1;
      results.push({ sku: p.sku, fileKey });
      console.log(`  + image ${p.sku}`);
      await sleep(80);
    } catch (e) {
      failed += 1;
      results.push({ sku: p.sku, error: e.message });
      console.warn(`  ! ${p.sku}: ${e.message}`);
    }
  }

  writeJson(runPath(runId, 'images-uploaded.json'), {
    uploadedAt: new Date().toISOString(),
    attached,
    skipped,
    failed,
    results,
  });
  console.log(
    `[06] images attached=${attached} skipped=${skipped} failed=${failed}`,
  );
}

main().catch((err) => {
  console.error('[06] FAILED:', err.message || err);
  process.exit(1);
});
