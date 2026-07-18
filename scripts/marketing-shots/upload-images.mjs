/**
 * Attach local PNGs to CVX-* products via S3 presign.
 * Place files at scripts/marketing-shots/product-images/prod-CVX-001.png …
 *
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/upload-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

import { login, api, unwrap } from './lib/api.mjs';
import { PRODUCT_IMG_DIR, sleep } from './lib/config.mjs';

await login();

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
    bySku.set(v.sku, full);
  }
  await sleep(20);
}

let done = 0;
for (let i = 1; i <= 40; i++) {
  const sku = `CVX-${String(i).padStart(3, '0')}`;
  const product = bySku.get(sku);
  if (!product) {
    console.log('no product for', sku);
    continue;
  }
  if (product.images && product.images.length > 0) {
    console.log(sku, 'already has image, skip');
    done++;
    continue;
  }

  const file = path.join(PRODUCT_IMG_DIR, `prod-${sku}.png`);
  if (!fs.existsSync(file)) {
    console.log('missing file', file);
    continue;
  }
  const bytes = fs.readFileSync(file);

  const presRes = await api('POST', '/v1/files/presigned-upload-url', {
    fileName: `${sku}.png`,
    fileMimeType: 'image/png',
    fileType: 'image',
    fileModule: 'products',
  });
  if (!presRes.ok) {
    console.log(
      sku,
      'presign fail',
      presRes.status,
      JSON.stringify(presRes.body).slice(0, 200),
    );
    continue;
  }
  const { uploadUrl, fileKey } = presRes.body.data;

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: bytes,
  });
  if (!put.ok) {
    console.log(sku, 'S3 PUT fail', put.status);
    continue;
  }

  const attach = await api('POST', `/v1/tenant/products/${product.id}/images`, {
    imageUrl: fileKey,
    altText: product.name,
    isPrimary: true,
    sortOrder: 0,
  });
  if (!attach.ok) {
    console.log(
      sku,
      'attach fail',
      attach.status,
      JSON.stringify(attach.body).slice(0, 200),
    );
    continue;
  }

  done++;
  console.log(`  uploaded ${sku} -> ${product.name}`);
}
console.log('DONE images:', done);
