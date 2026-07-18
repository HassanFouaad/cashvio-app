/**
 * Restock variants that already have inventory rows (skips missing records).
 *   node --env-file=scripts/marketing-shots/.env.local scripts/marketing-shots/restock.mjs
 */
import { login, api, unwrap } from './lib/api.mjs';
import { STORE_ID } from './lib/config.mjs';

await login();
const inv = unwrap(await api('GET', `/v1/tenant/inventory?storeId=${STORE_ID}&page=1&limit=200`), 'inv');
const rows = Array.isArray(inv) ? inv : inv?.data || [];
console.log('inventory rows:', rows.length);
console.log('sample qty:', rows.slice(0,5).map(r => ({v:r.variantId||r.variant?.id, q:r.quantity??r.availableQuantity??r.onHand})));

const listed = unwrap(await api('GET', '/v1/tenant/products?page=1&limit=100'), 'prods');
const list = Array.isArray(listed) ? listed : listed?.data || [];
const invSet = new Set(rows.map(r => r.variantId || r.variant?.id).filter(Boolean));
let ok = 0, fail = 0;
let i = 0;
for (const p of list) {
  const full = unwrap(await api('GET', `/v1/tenant/products/${p.id}`), `p`);
  for (const v of full.variants || []) {
    if (!invSet.has(v.id)) { fail++; continue; }
    i++;
    const quantity = i % 8 === 0 ? 3 + (i % 3) : 90 + (i % 40);
    const res = await api('POST', '/v1/tenant/inventory/adjust-quantity/bulk', {
      storeId: STORE_ID,
      items: [{ variantId: v.id, quantity, reason: 'Post-seed restock for screenshots', unitCost: Number(v.basePurchasePrice || 50) }],
    });
    if (res.ok) ok++; else { fail++; if (fail < 3) console.log('fail', res.status, JSON.stringify(res.body).slice(0,200)); }
  }
}
console.log({ ok, fail, skippedNoInv: [...invSet].length ? 'filtered' : 'n/a', invSetSize: invSet.size });
